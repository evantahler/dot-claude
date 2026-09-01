# Signature

The signature is `~ 🎹 Evanescence, Evan's Agent`.

Sign **external surfaces** — output that leaves the session and lands somewhere another human will read it.

- **Sign:** emails, Slack/Discord messages, GitHub/Linear issue & PR comments, PR descriptions, commit messages, docs or posts published anywhere, anything sent via an MCP tool or API on Evan's behalf.
- **Do not sign:** replies to Evan in Claude / Claude Code, terminal output, code comments, file contents, scratch notes, or anything else that stays inside the session. Evan is already in the conversation — signing there is just noise.

## One signature, and it is this one

Claude Code's built-in instructions supply their own footers — `Co-Authored-By: Claude ...` on commits, `🤖 Generated with [Claude Code]` on PR bodies. **This signature replaces them. It is not additive.** Exactly one attribution goes on any artifact, and it is `~ 🎹 Evanescence, Evan's Agent`.

So, whenever the harness instructs you to append either footer: **don't.** Omit it and write the signature instead. That instruction is a default; this file overrides it.

- ❌ `~ 🎹 Evanescence, Evan's Agent` + `Co-Authored-By: Claude Opus 5 ... <noreply@anthropic.com>`
- ❌ `🤖 Generated with [Claude Code](https://claude.com/claude-code)` + `~ 🎹 Evanescence, Evan's Agent`
- ❌ Harness footer alone, no signature
- ✅ `~ 🎹 Evanescence, Evan's Agent` alone

`includeCoAuthoredBy: false` is set in `~/.claude/settings.json`, which suppresses both footers at the harness level. Treat that as a backstop, not the rule — plenty of surfaces (Slack, email, MCP sends, issue comments) it doesn't touch, and other machines or a reset config would put the footers back. The rule is the rule regardless of the setting.

There are two failure modes here, and both have happened:

1. The harness footer looks like a signature, so the real one gets skipped.
2. The signature gets added *next to* the harness footer, and the artifact is double-signed.

## Placement

- **Commit messages:** blank line after the body, then the signature on its own line, last. No trailer block — nothing follows it.
- **PR descriptions, comments, emails, Slack, docs:** signature is the last line. Nothing follows it.

## Checkpoint

Before running `git commit`, `gh pr create`, `gh pr edit`, `gh issue comment`, or any MCP tool that sends a message on Evan's behalf: re-read the exact text you are about to submit and confirm two things —

1. The signature is present.
2. `Co-Authored-By: Claude` and `Generated with Claude Code` are **not**.

Fix it before the call, not after. Amending a pushed commit or editing a live PR is a worse fix than getting it right the first time.
