<!--
AGENTS.md template for /deep-plan. Distilled from the Hypotenuse plan (arcadeai-labs/hypotenuse), which itself
extended ToolExec's. Fill every <placeholder>; delete rules marked (optional) that don't apply; keep the numbering
contiguous after deleting, then grep the plans for "rule N" and fix the references. Claude Code reads AGENTS.md
directly — no CLAUDE.md symlink needed. Delete this comment.
-->

# AGENTS.md — <Project>

<Project> <one paragraph: what it does, for whom, and the one sentence that makes it different>.

<N> parts, one repository:

- **<part 1>** (`<workspace>/`) — <what it is, how it ships>;
- **<part 2>** (`<workspace>/`) — <…>;
- a shared contract (`<protocol workspace>/`) — <only if two parts talk over a wire>.

**This file is the working summary: the rules, the conventions, and enough architecture to find your way.** The map
is [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md). The reasoning behind each decision lives with the plan that
builds it, in [`docs/plans/`](./docs/plans/README.md). Every doc there ends in a **Learnings from the build** section,
and that is where to read before changing something load-bearing, and where to write when you learn something new.

> **Status:** planned, not built. Every phase in [`docs/plans/`](./docs/plans/README.md) is a plan; no code exists yet.
> <Which plumbing is ported from which existing project, with links.>

## Non-negotiable rules

1. **Tests required.** Every code addition ships with tests. Tests drive the **real thing** — a booted server over
   HTTP against an isolated test database, a real protocol peer — with no mocks of our own code. Third parties are
   faithful fakes that speak their real wire protocol (<fake for service X>, booted in process; <fake for Y>).
2. **Document every export.** Every method and exported function has a JSDoc (or language-equivalent) description.
3. **(optional) CRUD includes a paginated `list`.** Every CRUD set includes a `list` with `page` + `limit`, answering a
   `pagination: { page, limit, total, pages }` envelope beside the named collection.
4. **<Framework> bugs go upstream.** If you hit a bug in **<framework> itself**, do **not** work around it. File an
   issue at <upstream issues URL> with a minimal repro, then stop and surface it. Known ones are recorded in the
   learnings of the plan that hit them.
5. **(optional) <Test fake> gaps go upstream too.** <Fake> is our <service>. When it lacks a behavior the real one
   has, file it at <fake issues URL> and drive the behavior through its test-control routes meanwhile. Never fake
   <service> behavior inside our code to make a test pass. The open list is in
   [`docs/<SERVICE>_COVERAGE.md`](./docs/<SERVICE>_COVERAGE.md#known-<fake>-gaps).
6. **(optional) Every data-changing action is audited.** Any action that writes extends `AuditedAction` and routes
   **every** write through the transaction that also writes the audit row. A new secret-bearing param joins
   `SENSITIVE_KEYS` in the same commit. The unaudited writers are a closed list, argued in
   [`<phase doc>`](./docs/plans/<phase doc>): reads, sweeps, login/logout, machine ingress, and machine-to-machine
   calls. The audited thing is always **the decision a person made**.
7. **(optional) <Third-party> credentials never leave <the server>.** No action returns <a token or secret>, and no
   serializer has a field one fits in. <Less-trusted component> reaches <third party> only through <a closed list of
   scoped actions>, which re-derive their scope from <the owning row> on every call. The list is asserted by name.
8. **(optional) Machine actions and human actions are disjoint.** <Machine>-token actions live in a closed name list
   (`<prefix>:*`) — do **not** filter by prefix alone. A `beforeAct` hook refuses every other action to a machine
   token and refuses machine actions to a human session. If a machine needs something a human action does,
   **duplicate it** under the machine prefix.
9. **(optional) Human MCP ≈ HTTP.** Almost every action with a web route is also an MCP tool for human OAuth
   clients; one policy function decides, and a test asserts every action's live flag equals it. **Never MCP:**
   login/signup, webhook ingress, browser hops, machine actions, unauthenticated introspection, clocks.
10. **Every <third-party> interaction is in the coverage matrix.** A new webhook, call, event, or payload shape gets
    a row in [`docs/<SERVICE>_COVERAGE.md`](./docs/<SERVICE>_COVERAGE.md) in the same commit, naming the module that
    handles it and the test that proves it. A test parses the matrix and asserts every row's test file exists and
    mentions the row's id. *(Use this whenever the brief says "100% of API X".)*
11. **Never name a plan phase outside `docs/plans/`.** No comment, docstring, test name, config note, or user doc says
    "Phase 9" or "this phase". Say what a column, hook, or placeholder is *for* — "read by the routing clock, which
    does not exist yet" — because that stays true after the schedule is forgotten. A test scans source and user docs.
12. **User-facing docs ship with the feature.** Any change a user can see or do updates the user docs under
    `<path>` in the **same commit**. A new config key also updates [`docs/CONFIG.md`](./docs/CONFIG.md) and the
    schema's description; a wire change updates [`docs/<PROTOCOL>.md`](./docs/<PROTOCOL>.md) and bumps the protocol
    version when it is not additive.
13. **(optional) The CLI tracks the HTTP surface.** A new action with a web route is a candidate for a
    `<cli> <noun> <verb>` command. In the same commit, wrap it or decide it is out of scope. A change to the CLI that
    should reach users **bumps its `version`**; merging to `main` releases it.
14. **The plans are kept current, and only half of each one is.** Everything above a phase doc's
    `## Learnings from the build` heading is the **plan** — a historical record of what was going to be built. Leave
    it alone even when it is wrong. The learnings section is the opposite — it describes what is true *now* — and so
    does every doc that is not one of those plan sections: this file, the [plans index](./docs/plans/README.md),
    [`ARCHITECTURE.md`](./docs/ARCHITECTURE.md), <every live reference doc>. A change that makes any of those wrong
    fixes them **in the same commit**. A docs test resolves every relative link and anchor in `AGENTS.md`,
    `README.md`, and `docs/**`, and asserts every plan doc still carries the `## Learnings from the build` heading.
15. **A pull request is not the artifact.** A PR, issue, or comment is for a human who already has the diff. Keep it
    as short as it can be while still conveying the meaning. Load-bearing argument belongs in a code comment or a
    learnings section, not in the PR body. <The same goes for what an agent writes into <third party>.>
16. **(optional) Paint with tokens, in every theme.** Components use semantic tokens only — no color literals, no
    literal font sizes — and every surface is checked in each theme. The look changes by changing an input to the
    token generator, never a generated file. [`docs/DESIGN.md`](./docs/DESIGN.md) is the spec.

## Local development

**Use the system's <database> and <cache> — never Docker for development.** Docker builds deployment images only.

```bash
<one-time machine setup>
<one-time checkout setup: create databases, copy .env.example files>
<install>
```

<How dev and test config coexist (e.g. `${VAR}_${NODE_ENV}` before `${VAR}`). How to run several checkouts at once.
How to reach the real third party in development (tunnels, test apps) — tests never do.>

## Stack

| Layer | Choice |
|---|---|
| Runtime / language | <…> |
| Framework | <…, with the version floor and why> |
| Database / cache / queue | <…> |
| <Third party> | <API, auth mode, fake used in tests> |
| Validation / lint | <…> |
| Frontend | <…> |
| CLI / distribution | <…> |
| Deploy | <…> |

## <Framework> conventions

<One class/function per file? Routing verbs? Response shape (always a named object, never a bare array)? Error
types and which validation error maps to which status? Where pure logic and serializers live? How secrets are
marked? Where side effects go (after commit)? Background jobs are task-only, never a web route?>

- **Machine ingress answers fast and works later.** Verify, record, answer, enqueue — never call out inline.
- **Everything written to <third party> goes through an outbox** with a client-generated idempotency key.

## Schema conventions

<Primary keys; every timestamp is timezone-aware; third-party ids stored as text under a unique index so a replayed
event is an upsert, not a duplicate.>

## Tenancy and access

<The tenant. The permission levels as a table: level / means / middleware. Who may do what. The principals that can
reach the API (browser session, CLI token, machine token) and the one place that resolves exactly one per request.>

## Architecture rules while writing code

The map is [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md). What follows is the part that is a **rule**:

- **The database is the source of truth; push messages are content-free pings.** A missed ping costs latency, never
  correctness; a reconnect re-reads.
- **<Each state machine ends in exactly one funnel>** (`<finishX>`), so "a finished X holds nothing" stays true.
- <Every invariant a reviewer must not break, one line each, with the reason.>

## Testing

- <How each workspace's tests run, the seeded fixture cast, and the third-party fake harness.>
- **Control time by writing columns or advancing the fake's clock, never by waiting.**
- **Assert the property, not the symptom** — byte-identical refusal bodies, whole-set comparisons, exact event
  sequences.
- **Docs are tested:** links, anchors, the Learnings heading, <the coverage matrix>.

## Commands

```bash
<install, dev, lint, test, build, the one-off tools — each with a comment>
```

## Where the detail lives

| Topic | Doc |
|---|---|
| The system on one page | [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) |
| <Each live reference doc> | <link> |
| Build order and every plan | [`docs/plans/README.md`](./docs/plans/README.md) |
