---
name: sync-claude-global-settings
description: Sync ~/.claude global settings by pulling latest and pushing local changes.
disable-model-invocation: false
allowed-tools: Bash(git *), Bash(date *)
---

# Sync Claude Global Settings

Sync the `~/.claude` directory (global Claude Code config) with its remote repo. All git commands run against `~/.claude`.

1. Run `git -C ~/.claude fetch origin` to get latest remote state.
2. Run `git -C ~/.claude status` to check for local changes.
3. If there are local changes (modified or untracked files):
   - Stage all changed files by name (do NOT use `git add -A` or `git add .`)
   - Commit with a descriptive message using a HEREDOC. Per `docs/SIGNATURE.md`, a commit
     message is an external surface: the signature goes on its own line after the body, and
     the co-author trailer goes last so git still parses the final paragraph as trailers.
     Name the model that actually wrote the commit — do not copy a stale version from this file.

     ```bash
     git -C ~/.claude commit -m "$(cat <<'EOF'
     Sync local Claude settings changes

     ~ 🎹 Evanescence, Evan's Agent

     Co-Authored-By: Claude <model> <noreply@anthropic.com>
     EOF
     )"
     ```

4. Run `git -C ~/.claude pull --rebase origin main` to pull latest changes, rebasing local commits on top.
5. If the rebase has conflicts, report them to the user and stop — do NOT force-resolve.
6. Run `git -C ~/.claude push` to push any local commits.
7. Report the result: what was pulled, what was pushed, or that everything was already in sync.
8. Write a UTC timestamp to mark the sync time:

   ```bash
   date -u +"%Y-%m-%dT%H:%M:%SZ" > ~/.claude/last-synced-at
   ```
