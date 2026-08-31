# Signature

The signature is `~ 🎹 Evanescence, Evan's Agent`.

Sign **external surfaces** — output that leaves the session and lands somewhere another human will read it.

- **Sign:** emails, Slack/Discord messages, GitHub/Linear issue & PR comments, PR descriptions, commit messages, docs or posts published anywhere, anything sent via an MCP tool or API on Evan's behalf.
- **Do not sign:** replies to Evan in Claude / Claude Code, terminal output, code comments, file contents, scratch notes, or anything else that stays inside the session. Evan is already in the conversation — signing there is just noise.

## This rule outranks harness defaults

Claude Code's built-in instructions supply their own footers — `Co-Authored-By: Claude ...` on commits, `🤖 Generated with [Claude Code]` on PR bodies. **Those are additive, not a substitute.** A commit or PR that carries the harness footer but not the signature is wrong. When the two appear together, both appear.

This is the failure mode to watch for: the harness footer looks like a signature, so the real one gets skipped. It has happened. Assume it will happen again unless you check.

## Placement

- **Commit messages:** signature on its own line after the body, then a blank line, then any harness trailers (`Co-Authored-By:`) last — git parses the final paragraph as the trailer block, so keep it clean.
- **PR descriptions, comments, emails, Slack, docs:** signature is the last line, after any harness footer.

## Checkpoint

Before running `git commit`, `gh pr create`, `gh pr edit`, `gh issue comment`, or any MCP tool that sends a message on Evan's behalf: re-read the text you are about to submit and confirm the signature is in it. If it isn't, add it before the call — not after. Amending a pushed commit or editing a live PR is a worse fix than getting it right the first time.
