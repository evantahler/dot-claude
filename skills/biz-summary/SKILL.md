---
name: biz-summary
description: Aggregate recent activity across all connected MCP and mcpx services into a prioritized business summary (HIGH/MEDIUM/LOW) for the configured time window. Optionally deliver via Slack or email.
argument-hint: "[time-range] [notify:none|slack|email]"
disable-model-invocation: false
allowed-tools: Bash(mcpx *), Bash(date *), Read, mcp__*
---

# Biz Summary

Build a prioritized, scannable digest of activity across every connected service so Evan can start the day with a single glance at what needs attention.

## Arguments

Parse `$ARGUMENTS` into two optional fields. Order does not matter, either can be omitted.

- **time-range** — free-form. Examples: `2d` (default), `24h`, `1w`, `since 2026-04-14`.
- **notify** — one of `none` (default), `slack`, `email`. Anything else: ask the user which they meant before continuing.

## Steps

1. **Parse arguments.**

   - Default time range: last 2 days. Default notify: `none`.
   - Compute `SINCE` and `UNTIL` as ISO-8601 UTC using `date -u`:

     ```bash
     UNTIL=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
     SINCE=$(date -u -d "2 days ago" +"%Y-%m-%dT%H:%M:%SZ")
     ```

   - Keep both values for later filtering and the digest header.

2. **Load identity.** Read `~/.claude/WHOAMI.md` to capture Evan's name, emails (personal + work), GitHub handle, and role. Use these as the "me" filter when querying services — so a report flags items where Evan is the author, assignee, reviewer, @mentioned, DM recipient, or meeting attendee.

3. **Discover services — both channels, then identify each one.**

   - **Native MCP**: scan the currently-loaded tool list for names prefixed `mcp__<server>__<tool>` (e.g., `mcp__github__list_issues`). Group tools by `<server>` prefix. If a needed tool's schema is deferred, load it via `ToolSearch` (`"select:<tool_name>"` or keyword search) before invoking.
   - **mcpx**: `mcpx search ""` (or `mcpx list` if supported) to enumerate configured servers and their tools.
   - **Identify the service behind each server** — the server name alone isn't always enough, so use this cascade:
     1. The server key itself (e.g., `github`, `linear`, `slack`, `gmail`) — usually definitive.
     2. If ambiguous (internal name like `acme`, `work`, `tools`), read a tool's description — native MCP via the schema returned by `ToolSearch`, mcpx via `mcpx info <server> <tool>`. The description typically names the real service.
     3. Tool-name shape as a tiebreaker: `list_issues`/`create_issue` → issue tracker; `send_message`/`post_message` → chat; `send_email`/`list_messages` → mail; `list_events` → calendar.
     4. Normalize to a lowercase service label (e.g. `github`, `linear`, `slack`, `gmail`, `gcal`, `notion`).
   - **De-duplicate by normalized label.** If the same service surfaces on both channels, **prefer native MCP** — skip the mcpx copy. Fall back to mcpx only for services with no native coverage.
   - Do **not** hardcode service names. The skill must adapt as servers are added or removed.

4. **Plan a read-only activity query per service.** For each server, pick the tool that best covers "what happened to me or my work in this window". Examples by shape (not a fixed list):

   | Service shape | Target capability |
   |---|---|
   | Issue tracker (Linear, Jira, GitHub issues) | issues assigned/mentioned/updated |
   | Code host (GitHub, GitLab) | PRs authored/assigned/review-requested, CI status, recent commits |
   | Chat (Slack, Discord) | DMs, @mentions, threads with replies |
   | Mail (Gmail) | unread, starred, to/from inbox since `SINCE` |
   | Calendar (Google Calendar) | events from `SINCE` through next 24h |
   | Notifications (GitHub Notifications) | unread items |
   | Docs (Notion, Drive) | recently edited pages shared with Evan |

   - Native MCP: load schema via `ToolSearch` if needed, then call directly.
   - mcpx: `mcpx info <server> <tool>` first, then `mcpx exec <server> <tool> '<json>'`.
   - Prefer tools that accept a time-window argument. If not, filter client-side using `SINCE`/`UNTIL`.

5. **Execute in parallel.** Fire all discovery calls in a single assistant message — mix native `mcp__*` tool calls and `Bash(mcpx exec ...)` calls freely. Pass identity filters (email, GitHub handle) and the time window with every call. Skip services that have no relevant read/activity tool rather than forcing a fit.

6. **Classify each item** into one of three buckets. Err toward MEDIUM when ambiguous; keep HIGH scarce so it stays meaningful.

   - **HIGH** — direct @mentions, DMs to Evan, PR review requests where Evan is the reviewer, assigned issues flagged urgent/blocker or with deadlines ≤ 48h, failing CI on Evan's PRs, customer escalations, calendar conflicts or meetings in the next 2h, incidents.
   - **MEDIUM** — PRs/issues Evan is participating in (commented, authored, requested changes), newly-assigned items without urgency, team-channel threads where Evan was tagged transitively, upcoming meetings today, doc edits on pages Evan owns.
   - **LOW** — FYI notifications, subscribed-channel noise, automated messages, newsletters, bot traffic, routine CI green signals.

7. **Render the digest.** Follow `~/.claude/PREFERENCES.md` — bulleted lists, ASCII tables, ANSI color for emphasis. Structure:

   - **Header**: `SINCE → UNTIL` window, count of services queried (native vs. mcpx), total item count.
   - **🔴 HIGH**, **🟡 MEDIUM**, **🟢 LOW** sections — each a compact ASCII table with columns: `Service | Title | Link | Age`.
   - **By-service roll-up**: one line per service showing item count per bucket, so gaps (`Linear: 0`) are visible.
   - **Suggested actions**: 3–5 concrete next steps Evan could take today (e.g., "Reply to @alice in #platform", "Review PR #482"). Link each action to the item(s) it resolves.

8. **Deliver** based on `notify`:

   - `none` — print the digest to chat and stop.
   - `slack` — prefer a native `mcp__slack__*` send-message tool if one is loaded; otherwise `mcpx search "send slack message"` → `mcpx info` → `mcpx exec`. Resolve Evan's Slack user id via a `users.lookupByEmail`-style tool seeded from WHOAMI emails, then send the rendered digest as a DM to self. Print the digest to chat too, and report the returned `ts` / message id.
   - `email` — prefer a native `mcp__*` email/gmail send tool if loaded; otherwise find one via `mcpx search "send email"`. Send to `evan@evantahler.com` with subject `Biz summary <SINCE> → <UNTIL>` and the rendered markdown as the body. Print the digest to chat and report the message id.

9. **Report gaps.** End the chat output with three short sections:

   - **Services queried** — table of normalized service label, channel used (`native` vs `mcpx`), tool invoked, item count.
   - **Native MCP gaps** — servers / capabilities expected but not found (e.g., "no `mcp__linear__*` tools loaded").
   - **mcpx gaps** — servers that errored, had no activity tool, or returned auth failures.

   Including the channel column makes the dedup decision auditable and tells Evan where to expand coverage next.

## Notes

- Always keep calls read-only. Do not post, close, merge, or delete anything in any service.
- If a service returns a huge payload, summarize aggressively — top 5 items per service is plenty for the digest.
- If `notify=slack` or `notify=email` and the delivery step fails, still print the digest to chat and surface the delivery error in the gaps section.
