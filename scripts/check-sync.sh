#!/bin/bash
# Check if ~/.claude settings have been synced recently.
# Used as a SessionStart hook — stdout is injected into Claude's context.

SYNC_FILE="$HOME/.claude/last-synced-at"
MAX_AGE_SECONDS=86400 # 24 hours


if [ ! -f "$SYNC_FILE" ]; then
  echo "Your ~/.claude settings have never been synced. Run /sync-claude-global-settings now before doing anything else."
  exit 0
fi

LAST_SYNC=$(cat "$SYNC_FILE" | tr -d '[:space:]')
LAST_SYNC_EPOCH=$(date -j -f "%Y-%m-%dT%H:%M:%SZ" "$LAST_SYNC" +%s 2>/dev/null)

if [ -z "$LAST_SYNC_EPOCH" ]; then
  echo "Your ~/.claude settings sync timestamp is unreadable. Run /sync-claude-global-settings now before doing anything else."
  exit 0
fi

NOW_EPOCH=$(date +%s)
AGE=$(( NOW_EPOCH - LAST_SYNC_EPOCH ))

if [ "$AGE" -gt "$MAX_AGE_SECONDS" ]; then
  HOURS_AGO=$(( AGE / 3600 ))
  echo "Your ~/.claude settings were last synced ${HOURS_AGO} hours ago (over 24h). Run /sync-claude-global-settings now before doing anything else."
  exit 0
fi

# Recently synced — no message needed
exit 0
