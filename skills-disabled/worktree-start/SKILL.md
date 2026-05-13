---
name: worktree-start
description: Move the current Claude session into a new git worktree under .claude/worktrees/, carrying any uncommitted work with it. Allocates a unique numeric WORKTREE_ID for port/DB isolation and runs .claude/worktree_start.sh. Optional argument is the worktree name.
disable-model-invocation: false
allowed-tools: Bash(git *), Bash(cat *), Bash(echo *), Bash(mkdir *), Bash(test *), Bash(chmod *), Bash(.claude/worktree_start.sh *), Bash(./.claude/worktree_start.sh *), Read, Write, EnterWorktree
---

# Worktree Start

Move the current session into a fresh git worktree, transferring any uncommitted work, then bootstrap the worktree with a unique `WORKTREE_ID` and the project's `worktree_start.sh`.

The user may provide an optional worktree name as the argument. If not provided, let `EnterWorktree` auto-generate one.

## Steps

### 1. Preflight

- Confirm `git rev-parse --show-toplevel` succeeds (we are in a git repo).
- Confirm we are NOT already in a worktree under `.claude/worktrees/`. If the current path contains `.claude/worktrees/`, abort and tell the user to `/worktree-end` first.
- Confirm `.claude/worktree_start.sh` exists. If not, tell the user to run `/worktree-setup` first and stop.

### 2. Stash uncommitted work (if any)

Run `git status --porcelain`. If output is non-empty:

```bash
STASH_MSG="claude-worktree-transfer-$(date +%s)"
git stash push --include-untracked --message "$STASH_MSG"
```

Remember `STASH_MSG`. Note: tracked-but-ignored files are NOT carried over by stash; warn the user if you see ignored files that matter (e.g. `.env`).

### 3. Enter the new worktree

Call the `EnterWorktree` tool with the user-supplied `name` (or omit `name` to auto-generate). This switches the session's cwd to the new worktree. The new worktree shares the same `git common-dir` as the main repo, so the stash is reachable.

### 4. Restore uncommitted work in the new worktree

If you stashed in step 2:

```bash
git stash list | grep -F "$STASH_MSG"
```

If found, locate the stash ref (e.g. `stash@{0}`) by message match and pop it:

```bash
STASH_REF=$(git stash list | grep -F "$STASH_MSG" | head -1 | cut -d: -f1)
git stash pop "$STASH_REF"
```

If `pop` reports conflicts, leave the stash applied with conflicts and report them to the user — do NOT auto-resolve.

### 5. Allocate WORKTREE_ID

Atomically increment a counter in the main repo's `.git` common dir:

```bash
GIT_COMMON_DIR=$(git rev-parse --git-common-dir)
# Resolve to absolute path if relative
case "$GIT_COMMON_DIR" in /*) ;; *) GIT_COMMON_DIR="$(pwd)/$GIT_COMMON_DIR" ;; esac
COUNTER_FILE="$GIT_COMMON_DIR/claude-worktree-counter"
WORKTREE_ID=$(($(cat "$COUNTER_FILE" 2>/dev/null || echo 0) + 1))
echo "$WORKTREE_ID" > "$COUNTER_FILE"
mkdir -p .claude
echo "$WORKTREE_ID" > .claude/worktree_id
```

### 6. Run the project's start script

```bash
WORKTREE_ID=$(cat .claude/worktree_id) ./.claude/worktree_start.sh
```

If it exits non-zero, report the failure but do NOT auto-rollback — the user may want to fix and re-run manually.

### 7. Report

Report to the user (use an ASCII table or bullets):
- Worktree path: `pwd`
- Branch: `git branch --show-current`
- `WORKTREE_ID`
- Stash transfer status (none / popped / conflicts)
- `worktree_start.sh` exit status
