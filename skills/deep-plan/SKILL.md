---
name: deep-plan
description: Plan a large, multi-part project as a reviewable set of docs before any code — parallel deep research of every source, scoping questions asked while research runs, an architecture doc and naming canon first, then parallel writers producing phase plans in the user's existing plan format, live reference docs (protocol, config, coverage matrix, design, deploy), a mechanical consistency pass, and a docs-only draft PR.
argument-hint: "[what to build, plus links: docs to cover, repos to copy from, a repo whose plan format to mirror]"
disable-model-invocation: false
allowed-tools: Read, Write, Edit, Glob, Grep, Agent, AskUserQuestion, WebFetch, WebSearch, Bash(git *), Bash(gh *), Bash(bun *), Bash(ls *), Bash(mkdir *), Bash(cat *), Bash(find *), Bash(rg *), Bash(wc *), Bash(sed -n *), Bash(head *)
---

# /deep-plan — Research-first, phase-by-phase planning

Turn a big ask ("build a daemon + hosted service + CLI that does X, cover 100% of API Y, distribute like repo Z") into a
**docs-only PR** that a person can review and an agent can build from, one phase at a time. The output is a set of
documents, not code:

```
AGENTS.md                      rules + conventions (the repo's working summary; no CLAUDE.md symlink needed)
README.md                      what it is, install, quickstart — marked "planned, not built"
docs/ARCHITECTURE.md           the system on one page: topology diagram, trust/credential table, state machines,
                               tables, channels, clocks, mapping tables, "where the detail lives"
docs/<REFERENCE>.md            live references the build will need — e.g. a wire PROTOCOL, the CONFIG file,
                               a <API>_COVERAGE matrix, DESIGN, DEPLOY — one per real contract
docs/plans/README.md           index: what is ported from where, build-order table, dependency diagram,
                               status, "decisions so far"
docs/plans/phase-NN-<kebab>.md one per phase, in the user's plan format (default skeleton below)
```

`$ARGUMENTS` is the brief. Links in it are **sources to read exhaustively**, not suggestions.

## Step 1 — Inventory the sources (main thread)

Sort every link and named thing in the brief into buckets, because each bucket gets a different research prompt:

| Bucket | Example | What research must return |
|---|---|---|
| **Spec to cover** | an API's docs pages, "100% coverage" | every field, enum, event, mutation, timing rule, best practice — quoted exactly, with source URL |
| **Repo to copy from** | "same distribution as repo X", "use repo Y as template" | layout, configs, key files with paths + snippets, and a **copy-verbatim vs drop** list |
| **Framework / library** | a web framework, a protocol SDK | how the needed capabilities actually work, current version, breaking changes, gotchas |
| **Test double** | a fake server for tests | how to run it in-process, what it implements, **gaps vs the real thing** |
| **Plan-format template** | a repo with `docs/plans/` | the doc skeleton, index format, and the rules that govern plans |

If no plan-format template was given, ask for one in Step 3 (or use the default skeleton below).
If a needed repo is not in the session, attach it (read access) rather than guessing.

## Step 2 — Research fan-out (parallel, background)

Launch **one `Explore` agent per bucket cluster, all in a single message** (typically 3–4). Each prompt says:

- **Read exhaustively and quote.** Exact field/enum/method names, numbers (timeouts, limits, TTLs), and the URL for
  every section. "This report is the spec we will implement against."
- **Mark disagreements.** Docs vs schema vs SDK — label schema-only items, conflicting field paths, deprecated names.
- **Say what failed to load**, and try alternates (raw HTML via curl, a `.md` suffix, the GitHub API, a shallow clone
  into the scratchpad).
- **Recency.** Latest versions, renamed packages, APIs removed in a release from last week.
- **For repos to copy:** file paths + snippets, and an explicit "copy nearly verbatim / drop" list.
- **For test doubles:** how tests seed data and trigger events, and every gap that matters to us.

Do not wait idle — go straight to Step 3 while they run.

## Step 3 — Ask the forks in the road (while research runs)

Use `AskUserQuestion` for the 3–4 decisions that change the **architecture**, not details: identity model, auth
model, scope of the first build, routing/ownership rules, look-and-feel direction. Recommended option first, with a
`preview` where a picture helps (ASCII mockups for UI direction).

**Read free-text answers carefully** — "Other" answers often redirect the whole plan ("use repo X as the template
for all of this"). When one does: attach that repo, launch a dedicated Explore agent on it, and treat its conventions
(rules file, plan format, test harness) as binding.

Keep asking as new forks appear, including mid-way through writing (look and feel, naming). A late answer that
deserves its own phase gets one — see Step 7.

## Step 4 — Decide, and write it down

With research and answers in hand, write the plan-mode plan file: the deliverable doc list, the phase list, **decisions
made with the user**, and **defaults chosen by you, flagged as revisitable** (e.g. "credentials never leave the
server", "config is TOML", "pin SDK v2"). Every default should come with the alternative that was rejected and why.
Get approval (ExitPlanMode) before writing the docs.

## Step 5 — Canon first: architecture doc + naming canon

Before any phase doc is written, the main thread writes:

1. **`docs/ARCHITECTURE.md`** — the one-page diagram, the trust boundary / credential table (where every secret lives,
   who mints it, scope, how it is revoked), every state machine, every table with one line each, channels, clocks /
   background jobs, the key mapping tables (e.g. protocol A → API B), and a "where the detail lives" table linking each
   topic to its phase file.
2. **A naming canon** in the scratchpad (`CANON.md`): every table, action/route, channel, status enum, CLI command,
   config key, file path, env var, and **every phase file name**. Writers must use these names exactly.

This is what keeps parallel writers consistent.

## Step 6 — Parallel phase writers

Split the phases into groups of ~4 consecutive phases, each paired with one live reference doc that its phases own
(e.g. phases 1–4 + DEPLOY, 5–8 + PROTOCOL, 9–12 + CONFIG, 13–16 + COVERAGE). Launch **one `fork` agent per group, in a
single message** — forks inherit the research and the conversation. Each prompt states:

- the exact files it owns ("write ONLY these; do not commit; do not touch other files");
- read the canon and ARCHITECTURE.md first; use canon names exactly; cross-link phases relatively;
- which template docs to read for format and which upstream docs it is porting;
- per-phase content notes (the decisions, the facts from research that must appear, the tests to name);
- a size target (phase docs are substantial — roughly 10–30 KB, concrete file paths, schema tables, action tables,
  test file names, verification commands);
- "reply with a 3-line summary **and list every name you added beyond the canon**".

While they run, the main thread writes `AGENTS.md`, the root `README.md`, and `docs/plans/README.md`.

## Step 7 — Fold in mid-stream decisions

When the user raises something new mid-way (often: "should we talk look and feel?"), ask with previews, then decide
whether it is a section or a **phase**. A new early phase means renumbering everything after it. Do it mechanically,
after the writers finish:

```bash
bun ~/.claude/skills/deep-plan/renumber-phases.ts . --from 3 --exclude "UpstreamName|upstreamname|\bits\s" \
  --skip docs/plans/phase-03-new-thing.md,docs/NEW_REFERENCE.md            # dry run: read every "excluded" line
bun ~/.claude/skills/deep-plan/renumber-phases.ts . --from 3 ... --apply
```

`--exclude` protects references to *another* project's phase numbers (the template's). Read the dry-run's excluded
lines — any that are actually ours get fixed by hand. Then fix what has no "phase" word: bare ranges like `(5–8)`,
the dependency diagram, the index table, and the "ported from" columns. Update the phases that the new decision
changes (e.g. a ported theme becomes "uses the design system").

## Step 8 — Consistency pass

```bash
bun ~/.claude/skills/deep-plan/check-docs.ts .      # every relative link + anchor resolves; every phase has its sections
```

Then, by grep and by reading:

- **Writer additions.** Fold every "beyond the canon" name into ARCHITECTURE.md or accept it where it lives; make sure
  two writers did not invent two names for one thing (e.g. two Lua script names, two helper names).
- **Rule numbers.** Writers cite "rule N" from memory or from the template's numbering. Grep `rule [0-9]+` and check
  each against the final `AGENTS.md`.
- **Conflicting decisions.** A writer may have changed a decision with good reason (e.g. "the npm package must be a
  bundle, not source") — adopt it everywhere (AGENTS.md stack table, README, decisions list) or revert it.
- **Self-defeating tests.** A planned test that would fail on the docs themselves (e.g. "no file outside docs/plans
  says 'Phase N'" while live docs link to plans) — narrow its scope in the plan.
- **Risks the user can remove.** When a plan says "this depends on framework internals; stop if missing", look for a
  design that owns the capability instead, and offer it.

## Step 9 — Ship as a docs-only draft PR

Commit (signature per `docs/SIGNATURE.md`), push, open a **draft** PR with a short body: what the thing is, the doc
list, "no code yet; Phase 1 halts for review". If the repository is empty and has no base branch, create one
**without rewriting history**: an orphan empty `main` pushed as a new branch, then
`git merge --allow-unrelated-histories main` into the feature branch and a normal push. Never force-push to make a
base.

## Step 10 — Report

To the user, briefly: what was written, the decisions made together, **the defaults you chose that they may want to
revisit**, and the risks the build will hit first. Point at Phase 1 as the review gate.

---

## Default plan format (use the user's own if they have one)

Every phase doc:

```markdown
# Phase N — Title

> **Goal:** one paragraph: what is true when this phase is done.

> **Status: planned, not built.** One or two sentences of context (is it a port? what does it unblock?).

Why this phase exists and what shaped it — the argument, not a summary.

## Scope

**In:** concrete deliverables.

**Out:** what is deliberately not here, each with the phase that does it.

## Design

Subsections, tables, state machines, security properties *and the test that proves each*, rejected alternatives.

## Steps

### 1. Title — `path/to/file.ts`, `path/to/other.ts`

What to build or copy (cite the source file when porting).

## Verification

Commands to run, then manual checks, each phrased as an observable outcome.

## Definition of done

- [ ] Checkbox per deliverable.

## Learnings from the build

_Nothing yet — this phase has not been built._
```

The index (`docs/plans/README.md`): one paragraph on what the thing is; a "where the plumbing comes from" table; a
**build-order table** (`| [N](./phase-NN-….md) | Title | Deliverable |`); a dependency diagram with the reasoning
behind the order; status; and **decisions so far**.

## Rules worth putting in the project's `AGENTS.md`

- Tests drive the real thing (a booted server, a real protocol peer, a faithful fake of the third party) — no mocks of
  our own code.
- **Plans are history; learnings are live.** Everything above `## Learnings from the build` is never edited after it
  ships; learnings and every non-plan doc must stay true and are fixed in the same commit as the change.
- **Never name a phase outside `docs/plans/`** — code, tests, and user docs say what a thing is *for*.
- **Upstream bugs go upstream** — framework and test-double gaps are filed with a repro, never worked around locally.
- **A coverage matrix for any "100% of API X" goal** — one row per feature, naming the handler and the test, enforced
  by a test that parses the matrix.
- User-facing docs ship in the same commit as the feature; the CLI tracks the HTTP surface.
- The docs are tested: links, anchors, required headings.

## Notes & guardrails

- **Docs only.** No scaffolding, no code — the PR is the plan. Every phase ends in a reviewable state, and Phase 1
  halts for review.
- **Never invent research.** Every external fact in a plan traces to a source the research agents read; if a page
  failed to load, the plan says so.
- **Background agents report later — keep working.** Ask questions, write the canon, or write `AGENTS.md` while they
  run; never predict their results.
- **One clone at a time** per repo through a proxied environment; research agents prefer read-only fetches.
- **Keep the user's voice and preferences** for the PR and the final report (bullets, tables, concise).
