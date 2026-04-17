# CLAUDE.md

This is Evan Tahler's global Claude Code configuration. It applies to all projects and repositories. Project-specific instructions live in each project's own `CLAUDE.md`.

## Tools

- **mcpx** is always available in the terminal. When asked to interact with external services (Linear, Slack, GitHub, Google, etc.), use `mcpx search` to find the right tool and `mcpx exec` to call it. See the `/mcpx` skill for the full workflow. Never ask the user about API keys, CLIs, or alternative access methods — try mcpx first. Prefer mcpx over any MCP servers loaded directly into Claude.

## Always Loaded

These files are included in every conversation:

- @PREFERENCES.md — Output formatting preferences (lists over prose, ASCII tables, terminal colors)

## Reference Files

Read these when relevant to the task at hand:

- `WHOAMI.md` — Background on Evan: contact, career history, open-source projects, and areas of expertise
- `WRITING_STYLE.md` — Writing style guide for replicating Evan's voice
- `CODING_STYLE.md` — Coding conventions and engineering philosophy

## Global Settings

- `settings.local.json` — Claude Code permission allow-list (granular Bash command permissions for git operations, etc.)

## Setup

To install on a new machine (clones the repo and merges with any existing `~/.claude` data):

```bash
curl -fsSL https://raw.githubusercontent.com/evantahler/dot-claude/main/setup.sh | bash
```
