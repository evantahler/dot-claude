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
