# CLAUDE.md

This is Evan Tahler's global Claude Code configuration. It applies to all projects and repositories. Project-specific instructions live in each project's own `CLAUDE.md`.

## Reference Files

The following files in this directory provide detailed context. Read them when relevant to the task at hand:

- `WHOAMI.md` — Background on Evan: contact, career history, open-source projects, and areas of expertise. Read this when you need context about who you're working with.
- `WRITING_STYLE.md` — Writing style guide for replicating Evan's voice. Read this before generating any written content (blog posts, docs, READMEs, etc.).
- `CODING_STYLE.md` — Coding conventions and engineering philosophy. Read this before writing or reviewing code.

## Global Settings

- `settings.local.json` — Claude Code permission allow-list (granular Bash command permissions for git operations, etc.)

## Setup

To install on a new machine (clones the repo and merges with any existing `~/.claude` data):

```bash
curl -fsSL https://raw.githubusercontent.com/evantahler/dot-claude/main/setup.sh | bash
```

## Commands

- `bun lint` — Check all markdown files for lint errors
- `bun format` — Auto-fix markdown lint errors
