---
name: worktree-prune
description: Clean up abandoned worktrees under .claude/worktrees/. For each, run .claude/worktree_end.sh (if present) to release per-worktree resources, then remove the worktree. Finishes with git worktree prune.
disable-model-invocation: true
allowed-tools: Bash(git *), Bash(cat *), Bash(echo *), Bash(ls *), Bash(test *), Bash(*/.claude/worktree_end.sh *), Read
---

# Worktree Prune

Reclaim disk and free per-worktree resources from abandoned worktrees.

This is invoked from the main repo checkout, not from inside a worktree.

## Steps

### 1. Preflight

- Confirm we are at the main repo (not inside a worktree): `pwd` must NOT contain `.claude/worktrees/`. If it does, tell the user to `/worktree-end` first.
- `git rev-parse --show-toplevel` must succeed.

### 2. Enumerate candidates

Run `git worktree list --porcelain` and parse worktree paths. Keep only those whose path contains `/.claude/worktrees/`. The main checkout itself is never a candidate.

### 3. Classify each candidate

For each candidate worktree, check:

```bash
cd "$WT_PATH"
git status --porcelain     # any uncommitted work?
git log --oneline @{u}..HEAD 2>/dev/null   # any unpushed commits?
```

Classify as:
- **safe**: clean working tree AND (branch is merged into `origin/<default>` OR upstream branch no longer exists)
- **dirty**: has uncommitted changes or unpushed commits
- **missing**: directory does not exist on disk (orphaned git metadata)

### 4. Present the plan

Show the user an ASCII table of candidates with their classification, WORKTREE_ID (from `.claude/worktree_id` if readable), and branch name. Indicate which will be pruned (`safe` and `missing`) and which will be skipped (`dirty`). Do NOT proceed if every candidate is `dirty`; just report.

### 5. Prune

For each `safe` worktree, in its directory:

```bash
WORKTREE_ID=$(cat .claude/worktree_id 2>/dev/null || echo "") ./.claude/worktree_end.sh || true
```

Then from the main repo:

```bash
git worktree remove "$WT_PATH"
# If remove refuses (e.g. locked), retry with --force only for `missing` paths
```

For `missing` worktrees, skip the end-script step and just run `git worktree remove --force "$WT_PATH"` (the directory is already gone; this clears the metadata).

After all removals:

```bash
git worktree prune -v
```

### 6. Report

ASCII table of:
- worktree path
- branch
- WORKTREE_ID
- classification (safe / dirty / missing)
- action taken (pruned / skipped / metadata-cleared)
- end-script exit status (where applicable)
