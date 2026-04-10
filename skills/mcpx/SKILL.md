---
name: mcpx
description: Discover and use MCP tools via the mcpx CLI
trigger: when the user wants to interact with external services, APIs, or MCP tools
---

# mcpx — MCP Tool Discovery and Execution

You have access to external tools via `mcpx`, a globally-installed CLI ("curl for MCP"). Use it to search for, inspect, and execute MCP tools from any configured server.

## Quick start

1. `mcpx search "<what you want to do>"` — find tools
2. `mcpx info <server> <tool>` — inspect the schema
3. `mcpx exec <server> <tool> '<json args>'` — execute

## Rules

- Always search before executing — don't assume tool names exist
- Always inspect the schema before executing — validate you have the right arguments
- Use `-v` for verbose debugging if an exec fails unexpectedly

## Full documentation

For the complete command reference, examples, and advanced usage (tasks, auth, elicitation), fetch the canonical skill doc:

```
WebFetch https://raw.githubusercontent.com/evantahler/mcpx/main/.claude/skills/mcpx.md
```
