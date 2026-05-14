---
name: review
description: Multi-agent code review of branch changes, uncommitted work, or a specified scope. Spawns paired Opus+Sonnet specialists for simplicity, testability, security, and docs; corroborates findings via an inline judge; reports by severity.
argument-hint: "[scope description, e.g. 'this PR' or 'the new auth model']"
disable-model-invocation: false
allowed-tools: Bash(git *), Bash(gh *), Bash(mcpx *), Bash(date *), Bash(mkdir *), Bash(ls *), Bash(cat *), Bash(find *), Bash(rg *), Bash(wc *), Read, Write, Glob, Grep, Agent, AskUserQuestion
---

# /review — Thorough multi-agent code review

Run a deep code review using a context-loader agent followed by paired Opus + Sonnet specialists for **Simplicity/DRY**, **Testability**, **Security**, and **Docs**. Findings are corroborated by an inline judge and surfaced by severity. `$ARGUMENTS` is treated as an **intent hint only** — it never overrides automatic scope detection.

## Step 1 — Detect scope (main thread)

1. Determine candidate scopes:
   - **Branch diff** — `git rev-parse --abbrev-ref HEAD` is NOT main/master AND `git log <default>..HEAD` is non-empty. Use `git remote show origin | sed -n '/HEAD branch/s/.*: //p'` or fall back to `main`/`master` to find the default branch.
   - **Uncommitted** — `git status --porcelain` shows staged, unstaged, or untracked changes.
2. Decide which scope to use:
   - If **neither** candidate exists → stop and report "nothing to review."
   - If **exactly one** candidate exists → use it.
   - If **both** exist → use `AskUserQuestion` to ask which (options: "Branch vs default", "Uncommitted only", "Both — union diff"). Do NOT guess.
3. `$ARGUMENTS` is a free-text *intent hint* (e.g. "the new model", "this PR"). It does NOT change scope. Pass it through verbatim to Step 2 so the context loader can weight what to emphasize.

## Step 2 — Spawn context loader (single Opus sub-agent)

Create a bundle directory: `BUNDLE=$(mktemp -d /tmp/review-bundle.XXXXXX)`. Then launch ONE `Agent` with `subagent_type=general-purpose` and `model=opus`, passing this prompt verbatim (substituting `{BUNDLE}`, `{SCOPE}`, and `{INTENT_HINT}`):

```
You are the context-gathering lead for a code review. Your job is to produce a
COMPLETE, self-contained context bundle that downstream reviewers will rely on.
You do NOT review code yourself — you only collect, summarize, and link.

# Inputs
- BUNDLE = {BUNDLE}   (write all artifacts under this directory)
- SCOPE  = {SCOPE}    (one of: branch | uncommitted | union | pr:<ref>)
- INTENT_HINT = {INTENT_HINT}   (free-text from the user; may be empty)

# Gather (parallel where possible)
1. The diff:
   - branch     → `git diff <default>...HEAD`
   - uncommitted→ `git diff HEAD` + `git ls-files --others --exclude-standard`
                  (and `cat` each untracked file)
   - union      → both, concatenated with a clear separator
   - pr:<ref>   → `gh pr diff <ref>`
   Save raw output to $BUNDLE/diff.patch. NEVER truncate.
2. Changed file list with +/- counts → $BUNDLE/files.txt
3. Commit messages on the branch (`git log <default>..HEAD --format=fuller`)
   → $BUNDLE/commits.txt
4. If a PR exists for the current branch (`gh pr view --json title,body,labels,
   reviewRequests,comments` — non-zero exit is fine, just skip): save the JSON
   to $BUNDLE/pr.json and the body to $BUNDLE/pr_body.md.
5. For EVERY issue/ticket URL or reference you find in the PR body, commits, or
   INTENT_HINT, pull its content:
   - github.com/.../issues/N or "#N" with a repo context →
       `gh issue view N --json title,body,comments,labels`
   - linear.app/... or "ENG-123" style →
       `mcpx search "linear get issue"` → `mcpx info` → `mcpx exec`
   - notion.so/..., atlassian.net/browse/... → same mcpx pattern
   Save each to $BUNDLE/refs/<slug>.md. If a fetch fails, write a stub noting
   the URL and the error so reviewers know it was attempted.
6. All CLAUDE.md and AGENTS.md files at repo root AND in every changed
   directory (walk up from each changed file). Copy to $BUNDLE/conventions/.
7. For each changed file: `git log -p -n 3 -- <file>` → $BUNDLE/history/<file>.log
   (recent history gives reviewers blame-style context).
8. List (don't dump) project config that defines conventions: README.md,
   package.json scripts, Makefile targets, .editorconfig, lint configs.
   Save the list with one-line "this file defines X" notes to
   $BUNDLE/conventions/INDEX.md.

# Synthesize → $BUNDLE/SUMMARY.md
- **Scope** — type, base ref, file count, total +/- lines.
- **Intent** — 3–5 sentences. Synthesize from PR body + linked tickets +
  INTENT_HINT. Quote the source for each claim (e.g. "[PR body]", "[ENG-412]").
  If sources disagree, surface that.
- **Surface area** — bulleted list of subsystems / modules touched.
- **Conventions in play** — anything from CLAUDE.md/AGENTS.md that reviewers
  MUST honor. Quote the rule.
- **Open questions** — things the diff *implies* but you couldn't verify.
- **Bundle index** — paths to every file you wrote, one-line descriptions.

# Return value
Reply with ONLY the absolute path to $BUNDLE. No other prose.
```

When the agent returns, verify `$BUNDLE/SUMMARY.md` and `$BUNDLE/diff.patch` exist before continuing.

## Step 3 — Spawn 8 specialist reviewers in parallel

Launch **all 8 agents in a single message** (one `Agent` block per agent — independent work, must run concurrently). Four specialties × two models each:

| Specialty | Models |
|---|---|
| simplicity | opus, sonnet |
| testability | opus, sonnet |
| security | opus, sonnet |
| docs | opus, sonnet |

Each agent uses `subagent_type=general-purpose`, with the appropriate `model:` parameter. The prompt is the **common shell** below with the per-specialty insert (`{FOCUS}` and `{ANTI_SCOPE}`) and identifiers (`{SPECIALTY}`, `{MODEL}`, `{BUNDLE}`) substituted.

**Specialists are strictly read-only.** They do NOT write files. Each agent returns its JSON report in its reply text. As each one returns, the **main thread** writes its reply verbatim to `$BUNDLE/findings/{specialty}-{model}.json` so the judge can read all eight off disk in Step 4. If a reply is not valid JSON, save it as `findings/{specialty}-{model}.malformed.txt` and note it for the judge.

### Common shell

```
You are a {SPECIALTY} reviewer. Read the context bundle at {BUNDLE}, especially
SUMMARY.md, diff.patch, refs/*, and conventions/*. Then review ONLY the changes
in diff.patch — not pre-existing code, unless directly relevant to a changed line.

# You are READ-ONLY
- DO NOT use Write, Edit, or NotebookEdit. DO NOT create or modify any files.
- DO NOT run shell commands that write or modify (no `>`, `>>`, `tee`, `sed -i`,
  `git commit`, `git add`, etc.). `Read`, `Grep`, `Glob`, and read-only `Bash`
  (`cat`, `ls`, `git log`, `git diff`, `git show`, `rg`) are fine.
- You MAY use MCP / mcpx tools to fetch additional read-only context if a
  finding hinges on it — e.g., pulling a Linear ticket referenced in the diff
  that the context loader missed. Prefer mcpx ("mcpx search ..." → "mcpx exec
  ...") over hardcoded server names.
- Your ONLY output is the JSON in your reply (see "Output" below).

# Rules of engagement
- Cite evidence: every finding must reference file:line that appears in diff.patch.
- Stay in your lane. Other reviewers cover the other domains; trust them.
- No nitpicks. If a linter or formatter would catch it, do NOT report it.
- State the premise before the concern. If you cannot state the premise from
  the diff alone (without speculating about unseen code), do NOT file the finding.
- If you find nothing real in your domain, say so explicitly. A short, honest
  report beats a padded one — there's a corroboration pass next.
- Cap your output: at most 15 findings, suggestion field ≤ 500 chars each.
  If you'd otherwise exceed 15, keep the highest-severity ones and note the
  cutoff in `summary`.

# Severity rubric
- HIGH   — bug, vulnerability, data loss, breaks a documented contract, or
           materially blocks the stated intent in SUMMARY.md.
- MEDIUM — meaningful smell, real maintenance cost, or a gap that will bite
           within a few sprints. Not a blocker.
- LOW    — minor improvement, worth mentioning but cheap to defer.

# Focus
{FOCUS}

# Out of scope for you
{ANTI_SCOPE}

# Output
Reply with STRICT JSON ONLY — no prose, no markdown fences, no commentary.
Schema:
{
  "specialty": "{SPECIALTY}",
  "model": "{MODEL}",
  "summary": "<2-3 sentence overall read on this dimension>",
  "findings": [
    {
      "id": "<short-kebab-slug>",
      "severity": "high|medium|low",
      "title": "<≤80 char>",
      "file": "<path>",
      "lines": "<L>-<L> or single L",
      "premise": "<what the code does, from the diff>",
      "concern": "<why it's wrong>",
      "suggestion": "<concrete fix, ≤500 chars>",
      "confidence": 0-100
    }
  ]
}
```

### Per-specialty inserts

**simplicity**
- FOCUS: Can this be fewer lines without losing intent? Are there premature abstractions (helpers, classes, configs) for code that runs once? Is logic duplicated with other parts of the repo? Use `Grep` to confirm duplication before filing. Naming clarity. Dead branches or unreachable code. Boolean parameters that should be enums. Over-broad try/excepts.
- ANTI_SCOPE: Don't flag security, performance, missing tests, or documentation gaps. Don't suggest abstractions for code that runs exactly once. Don't rename things just because *you* would have named them differently — only flag names that are actively misleading.

**testability**
- FOCUS: Is the new behavior covered by tests at all? Are existing tests assertion-rich (real expectations) or just smoke tests? Over-mocking of things we own (mocks should mostly stand in for IO/external systems, not internal modules). Missing edge cases implied by SUMMARY.md "intent" or "open questions". AAA structure. Flakiness risks (sleeps, wall-clock time, randomness, ordering assumptions). Tests that would pass even if the production code were deleted.
- ANTI_SCOPE: Don't review production code style. Don't demand tests for trivial getters/setters or generated code. Don't speculate about coverage percentages — only flag specific behavior with no specific test.

**security**
- FOCUS: OWASP top 10 in app code. Secrets/keys in the diff (entropy, common patterns). Injection — SQL, shell, template, prompt. Authz checks on new endpoints and any route changes. PII handling and logging. CSRF/CORS on new web routes. SSRF on new outbound calls. Crypto misuse (homegrown, ECB, weak hashes for passwords). Infra/IaC changes — IAM grants, public buckets, open security groups, container privileges. New dependencies — flag any unfamiliar package, and check for known-CVE patterns.
- ANTI_SCOPE: Don't flag style, performance, or readability. Don't speculate without a concrete attack path — "could be unsafe" without "an attacker could do X by Y" is noise.

**docs**
- FOCUS: Are READMEs in affected directories updated? Project docs, runbooks, onboarding pages that reference the changed behavior. CLAUDE.md / AGENTS.md updates when conventions or workflows shifted. New public APIs without docstrings. Changelog / release notes entry if the project has one. Stale references to renamed things (use `Grep` to verify). Migration notes for breaking changes.
- ANTI_SCOPE: Don't review prose style, grammar, or word choice. Don't demand docs for internal-only helpers or test files. Don't ask for new doc files if existing docs are the right home — point to the existing file.

## Step 4 — Corroboration judge (single Opus sub-agent)

After all 8 specialists return, launch ONE `Agent` (`model=opus`) with this prompt:

```
You are the corroboration judge for a code review. You have 8 specialist JSON
reports at {BUNDLE}/findings/*.json (4 specialties × {opus, sonnet}) plus the
full diff at {BUNDLE}/diff.patch and SUMMARY.md.

# Matching
For each pair of same-specialty reports (e.g. security-opus + security-sonnet),
match findings that describe the SAME underlying issue: same file, overlapping
line range, and semantically equivalent premise/concern. Match on meaning, not
on title text.

# Classification
- CONFIRMED       — both Opus and Sonnet of the same specialty flagged it.
                    Merge: take the more concrete suggestion, average the
                    confidence, union the line range.
- VERIFIED-SINGLE — only one model flagged it, but you re-read diff.patch at
                    the cited lines (use `Read`) and the premise is verifiably
                    true from the code alone. Note "verified by judge" in the
                    finding.
- DROPPED         — only one model flagged it AND on re-read the premise is
                    wrong, speculative, or unverifiable from the diff. Record
                    a one-line reason.
- NEEDS-HUMAN     — only one model flagged it, the premise is plausible but
                    you genuinely cannot verify from the diff (e.g. depends on
                    unseen code). Keep, flagged for human review.

# Cross-specialty dupes
If two specialties (e.g. security + simplicity) flagged the same lines, keep
the finding under the MORE SEVERE specialty and add a one-line cross-reference
under the other.

# Output — write to {BUNDLE}/REPORT.md
Structure:
1. Header: scope, file count, +/- lines, one-paragraph intent from SUMMARY.md.
2. Three ASCII tables (HIGH / MEDIUM / LOW), columns:
     Specialty | File:Line | Title | Status
   where Status ∈ {confirmed, verified, needs-human}.
3. Per-finding detail blocks ordered HIGH → MEDIUM → LOW, each showing
   premise, concern, suggestion, status, confidence, and which models flagged.
4. **Dropped** section — one line per dropped finding with reason, so the
   filter is auditable.
5. **Verdict** — one of: "Ready" / "Needs attention" / "Needs work", with a
   one-sentence justification grounded in the highest-severity findings.

Reply with ONLY the absolute path to REPORT.md.
```

## Step 5 — Present to the user (main thread)

1. Read `$BUNDLE/REPORT.md`.
2. Print it inline to chat, following `~/.claude/docs/PREFERENCES.md`:
   - ANSI color: HIGH = red bold, MEDIUM = yellow bold, LOW = green.
   - Use the ASCII tables verbatim.
   - Keep the detail blocks compact (collapse suggestions to 2–3 lines for chat; full text stays in the report file).
3. End with:
   - The **Verdict** line.
   - The bundle path (`$BUNDLE`) so the user can dig into individual findings, the raw specialist JSON, or the gathered refs.

## Notes & guardrails

- **Read-only.** This skill never edits code, commits, pushes, or comments on PRs. If the user wants fixes, they invoke a follow-up flow.
- **Honor `~/.claude/docs/PREFERENCES.md`** in all chat output: bulleted lists, ASCII tables, ANSI colors, terse.
- **Bundle persistence.** Do NOT delete `$BUNDLE` at the end — leave it so the user can inspect. Mention the path in the final message.
- **Failure handling.** If a specialist returns malformed JSON, the main thread saves the reply as `findings/{specialty}-{model}.malformed.txt`. The judge treats any specialty with a malformed or missing report as having only one valid model: that partner's findings become VERIFIED-SINGLE candidates rather than auto-CONFIRMED. Note the failure in the **Dropped** section.
- **Empty diffs.** If `diff.patch` is empty after Step 2, stop and tell the user — don't spend agent budget on nothing.
- **Large diffs.** If the diff exceeds ~5000 changed lines, warn the user before spawning specialists; offer to narrow scope (e.g. by directory) via `AskUserQuestion`.
