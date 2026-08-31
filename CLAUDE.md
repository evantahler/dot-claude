# CLAUDE.md

```
  ██████╗  ██████╗ ████████╗   ██████╗██╗      █████╗ ██╗   ██╗██████╗ ███████╗
  ██╔══██╗██╔═══██╗╚══██╔══╝  ██╔════╝██║     ██╔══██╗██║   ██║██╔══██╗██╔════╝
  ██║  ██║██║   ██║   ██║     ██║     ██║     ███████║██║   ██║██║  ██║█████╗
  ██║  ██║██║   ██║   ██║     ██║     ██║     ██╔══██║██║   ██║██║  ██║██╔══╝
  ██████╔╝╚██████╔╝   ██║     ╚██████╗███████╗██║  ██║╚██████╔╝██████╔╝███████╗
  ╚═════╝  ╚═════╝    ╚═╝      ╚═════╝╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚══════╝
```

This is Evan Tahler's global Claude Code configuration. It applies to all projects and repositories. Project-specific instructions live in each project's own `CLAUDE.md`.

## Signature

Sign with `~ 🎹 Evanescence, Evan's Agent` on **external surfaces** — output that leaves this session and lands somewhere another human will read it.

- **Sign:** emails, Slack/Discord messages, GitHub/Linear issue & PR comments, PR descriptions, commit messages, docs or posts published anywhere, anything sent via an MCP tool or API on Evan's behalf.
- **Do not sign:** replies to Evan in Claude / Claude Code, terminal output, code comments, file contents, scratch notes, or anything else that stays inside the session. Evan is already in the conversation — signing there is just noise.

### This rule outranks harness defaults

Claude Code's built-in instructions supply their own footers — `Co-Authored-By: Claude ...` on commits, `🤖 Generated with [Claude Code]` on PR bodies. **Those are additive, not a substitute.** A commit or PR that carries the harness footer but not the signature is wrong. When the two appear together, both appear.

This is the failure mode to watch for: the harness footer looks like a signature, so the real one gets skipped. It has happened. Assume it will happen again unless you check.

### Placement

- **Commit messages:** signature on its own line after the body, then a blank line, then any harness trailers (`Co-Authored-By:`) last — git parses the final paragraph as the trailer block, so keep it clean.
- **PR descriptions, comments, emails, Slack, docs:** signature is the last line, after any harness footer.

### Checkpoint

Before running `git commit`, `gh pr create`, `gh pr edit`, `gh issue comment`, or any MCP tool that sends a message on Evan's behalf: re-read the text you are about to submit and confirm the signature is in it. If it isn't, add it before the call — not after. Amending a pushed commit or editing a live PR is a worse fix than getting it right the first time.

## Tools

- You have access to a number of MCP tool via Arcade's MCP servers.

## Always Loaded

These files are included in every conversation:

- @docs/PREFERENCES.md — Output formatting preferences (lists over prose, ASCII tables, terminal colors)

## Reference Files

Read these when relevant to the task at hand:

- `docs/WHOAMI.md` — Background on Evan: contact, career history, open-source projects, and areas of expertise
- `docs/WRITING_STYLE.md` — The spec for writing in Evan's voice, every rule anchored to a quote from a real post: the formula, brevity, the five wit mechanisms, receipts and admitted limits, personal connection, structure, punctuation, and the work-mode flex. Applied by the `sound-like-evan` skill
- `docs/CODING_STYLE.md` — Coding conventions, engineering philosophy, and preferred stack/tooling (linter, frontend, doc sites, runtime, DB, etc.). Consult this when picking tools for a new project.
- `docs/LINKS.md` — Canonical public URLs for Evan's blog, OSS projects, Arcade resources, and reference doc-sites. Use these instead of guessing or generating URLs.

## Global Settings

- `settings.local.json` — Claude Code permission allow-list (granular Bash command permissions for git operations, etc.)

## Setup

To install on a new machine (clones the repo and merges with any existing `~/.claude` data):

```bash
curl -fsSL https://raw.githubusercontent.com/evantahler/dot-claude/main/setup.sh | bash
```
