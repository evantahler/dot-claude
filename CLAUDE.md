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
- `docs/WRITING_STYLE.md` — Writing guide in three parts: (I) the meaning-first drafting/revision method (Orwell, Pinker, Ogilvy, Vonnegut, King + writer's own rules), (II) the anti-AI-tell layer (pre-draft constraints + post-draft audit + AI-tell watchlist appendix), (III) the voice spec for replicating Evan's style
- `docs/CODING_STYLE.md` — Coding conventions, engineering philosophy, and preferred stack/tooling (linter, frontend, doc sites, runtime, DB, etc.). Consult this when picking tools for a new project.
- `docs/LINKS.md` — Canonical public URLs for Evan's blog, OSS projects, Arcade resources, and reference doc-sites. Use these instead of guessing or generating URLs.

## Global Settings

- `settings.local.json` — Claude Code permission allow-list (granular Bash command permissions for git operations, etc.)

## Setup

To install on a new machine (clones the repo and merges with any existing `~/.claude` data):

```bash
curl -fsSL https://raw.githubusercontent.com/evantahler/dot-claude/main/setup.sh | bash
```
