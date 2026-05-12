---
name: worktree-setup
description: Scaffold .claude/worktree_start.sh and .claude/worktree_end.sh in the current repo so it's ready to use /worktree-start and /worktree-end. Run this once per repo. Add .claude/worktree_id to .gitignore.
disable-model-invocation: true
allowed-tools: Bash(git *), Bash(mkdir *), Bash(chmod *), Bash(test *), Bash(grep *), Read, Write, Edit
---

# Worktree Setup

Prepare the current repository to support the `/worktree-start`, `/worktree-end`, and `/worktree-prune` skills by creating the lifecycle scripts and gitignore entry.

## Steps

1. Verify you are at the repo root: `git rev-parse --show-toplevel`. `cd` there if needed.
2. Verify this is the main checkout, not a worktree: `git rev-parse --git-dir` and `git rev-parse --git-common-dir` should be equal. If they differ, abort and tell the user to run setup from the main checkout.
3. Create `.claude/` directory if missing: `mkdir -p .claude`.
4. Create `.claude/worktree_start.sh` **only if it doesn't already exist** (do not overwrite):

   ```bash
   #!/usr/bin/env bash
   # Runs after a new worktree is created by /worktree-start.
   # WORKTREE_ID is exported as an env var and also in .claude/worktree_id.
   # Use it to derive unique ports, DB names, etc. for this worktree.
   #
   # Examples:
   #   PORT=$((3000 + WORKTREE_ID))
   #   DB_NAME="myapp_wt${WORKTREE_ID}"
   #   createdb "$DB_NAME"
   #   bun install
   #   bun run db:migrate
   set -euo pipefail
   echo "worktree_start: WORKTREE_ID=$WORKTREE_ID (no project setup configured yet)"
   ```

5. Create `.claude/worktree_end.sh` **only if it doesn't already exist**:

   ```bash
   #!/usr/bin/env bash
   # Runs before a worktree is destroyed by /worktree-end or /worktree-prune.
   # Tear down anything worktree_start.sh created. Must be idempotent —
   # /worktree-prune may invoke this for partially-set-up worktrees.
   #
   # Examples:
   #   DB_NAME="myapp_wt${WORKTREE_ID}"
   #   dropdb --if-exists "$DB_NAME"
   set -euo pipefail
   echo "worktree_end: WORKTREE_ID=$WORKTREE_ID (no project teardown configured yet)"
   ```

6. `chmod +x .claude/worktree_start.sh .claude/worktree_end.sh`.
7. Ensure `.claude/worktree_id` is gitignored. Check `.gitignore`:
   - If it doesn't have a line matching `.claude/worktree_id` (or `.claude/`), append `.claude/worktree_id` to `.gitignore`.
   - If `.gitignore` doesn't exist, create one with that single line.
8. Report what was created vs. what already existed. If both scripts already existed, tell the user the repo is already set up.

## Notes

- Do not commit the scripts on the user's behalf — they will tailor them to the project first.
- The scripts run with `cwd` = the worktree root and `WORKTREE_ID` exported.
