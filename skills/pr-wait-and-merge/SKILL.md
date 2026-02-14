---
name: pr-wait-and-merge
description: Create a PR (if needed), wait for CI checks to pass, then merge it.
allowed-tools: Bash(gh *), Bash(git *)
---

# PR Wait and Merge

1. **Check for existing PR**: Run `gh pr view --json url,number,state 2>&1` to see if a PR already exists for the current branch.

2. **Create PR if needed**: If no PR exists, create one:

   ```bash
   gh pr create --title "PR title" --body "$(cat <<'EOF'
   ## Summary
   <description based on commits>

   🤖 Generated with [Claude Code](https://claude.com/claude-code)
   EOF
   )"
   ```

   To write the title and body, run `git log --oneline main..HEAD` to understand what commits are included.

3. **Wait for CI checks**: Poll the PR check status. Use `--watch` to wait for all checks to complete:

   ```bash
   gh pr checks --watch --fail-fast
   ```

   If `--watch` is not available, poll manually with `gh pr checks` every 30 seconds until all checks have finished.

4. **Evaluate results**:
   - If **any check failed**: Report which checks failed and exit. Do NOT merge.
   - If **all checks passed**: Proceed to merge.

5. **Merge the PR**:

   ```bash
   gh pr merge --squash --delete-branch
   ```

6. **Report the result**: Print the PR URL and whether it was merged successfully.
