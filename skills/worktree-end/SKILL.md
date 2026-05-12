---
name: worktree-end
description: Tear down the current worktree — run .claude/worktree_end.sh, exit the worktree (removing it), then refresh the main repo with git fetch (and git pull if on main).
disable-model-invocation: false
allowed-tools: Bash(git *), Bash(cat *), Bash(echo *), Bash(test *), Bash(.claude/worktree_end.sh *), Bash(./.claude/worktree_end.sh *), Read, ExitWorktree
---

# Worktree End

Clean up the current worktree's per-worktree resources, exit the worktree, and refresh the main repo.

## Steps

### 1. Confirm we are in a worktree

- `pwd` must contain `.claude/worktrees/`. If not, abort — `/worktree-end` is only valid from inside a worktree session opened by `/worktree-start` (or `EnterWorktree`).

### 2. Note uncommitted work

Run `git status --porcelain` and `git log --oneline @{u}..HEAD 2>/dev/null`. If there are uncommitted changes or unpushed commits, surface them in the report so the user knows what's about to be discarded. Default behavior: preserve uncommitted work by aborting if any exists — tell the user to commit/push or re-run with explicit discard intent. (If the user has already said "discard", proceed.)

### 3. Run the project's end script

If `.claude/worktree_end.sh` exists:

```bash
WORKTREE_ID=$(cat .claude/worktree_id 2>/dev/null || echo "") ./.claude/worktree_end.sh
```

Treat a non-zero exit as a warning, not a fatal error — continue with teardown (but include it in the final report).

### 4. Exit the worktree

Call the `ExitWorktree` tool:
- `action: "remove"`
- `discard_changes: true` only if the user has confirmed (step 2). Otherwise let the tool refuse, surface the conflict, and stop.

After this returns, the session's cwd is back in the main checkout.

### 5. Refresh the main repo

```bash
git fetch --all --prune
```

Then check the current branch:

```bash
BRANCH=$(git branch --show-current)
```

If `BRANCH` is the repo's default branch (typically `main` or `master` — check via `git symbolic-ref refs/remotes/origin/HEAD` and strip the `refs/remotes/origin/` prefix), run `git pull --ff-only`. If on any other branch, just report fetch results; do not switch or pull.

### 6. Report

ASCII-table style:
- Removed worktree path
- WORKTREE_ID that was freed
- `worktree_end.sh` exit status
- Fetch result (new refs, deleted refs)
- Pull result (if applicable)
