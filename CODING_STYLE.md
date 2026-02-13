# Evan Tahler — Coding Style & Engineering Philosophy

> Derived from Evan's work on Actionhero (including the modern Bun rewrite at bun.actionherojs.com), node-resque, Grouparoo, and years of building production Node.js/TypeScript systems. This guide captures how Evan thinks about writing software — not just which tools he uses, but *why*.

---

## 1. Write as Little Code as Possible

This is the overarching philosophy. Every other principle serves it.

Prefer reusing existing code, utilities, and patterns over writing new ones. Make small, focused changes — don't refactor the world to add a feature. If the codebase already has a pattern for something, follow it. If a framework provides a mechanism, use it instead of rolling your own.

DRY through targeted type utilities (e.g., `ActionParams<A>`, `ActionResponse<A>`) rather than deep abstraction hierarchies. Derive types from a single source of truth instead of maintaining duplicate declarations.

**One construct, many transports.** In Actionhero, a single Action class simultaneously serves as an HTTP endpoint, WebSocket handler, CLI command, background task, and MCP tool. No separate implementations, no adapter layers — one piece of code, everywhere. This is the ideal to aim for: write it once and let the framework carry it to every context.

Don't build for hypothetical future requirements. Solve the problem in front of you. Three similar lines of code are better than a premature abstraction. You can always refactor later when the pattern is clear — and usually it turns out you don't need to.

---

## 2. Actions Are the Universal Controller

Actions are the primary unit of work — protocol-agnostic by design. You write your controller once and it works everywhere.

### Structure

Routes live on the action itself, not in a separate routing file:

```typescript
web = { route: "/user/:id", method: HTTP_METHOD.GET }
```

Validate inputs with Zod schemas directly on the action. The framework handles 422 errors, OpenAPI generation, CLI `--help` output, and WebSocket validation from that one schema — no duplication.

### Error Handling

Throw `TypedError` instances mapped to HTTP status codes. Never return error strings or construct ad-hoc error responses. Let the framework's built-in error handling do the formatting.

### Middleware

Use `runBefore` and `runAfter` for cross-cutting concerns. Auth throws in `runBefore` to halt execution entirely — the action code never runs if auth fails. Response enrichment and logging happen in `runAfter`.

### Registration

Barrel-file re-exports from `actions/.index.ts` handle registration and give the frontend type access to action inputs/outputs.

---

## 3. Background Jobs Are First-Class Citizens

Tasks are not bolted on — they're a core framework feature using node-resque backed by Redis.

Any action becomes a background job by adding `task = { queue: "default" }`. Same code, no separate implementation. Three execution modes cover most needs: immediate (enqueue), delayed, and periodic (`frequency` in ms).

For parallel distributed work, use the fan-out pattern: `api.actions.fanOut()` spawns child jobs, `api.actions.fanOutStatus()` tracks completion. This is how you scale batch operations without building your own orchestration layer.

**In production:** run worker processes separately from API servers. They share the same codebase but scale independently. Failed jobs are preserved with full error context — let errors bubble to the framework's built-in handling rather than over-catching.

---

## 4. Good DevOps — 12-Factor Apps

### Configuration

Config via environment variables with `loadFromEnvIfSet()` helper. It auto-detects `NODE_ENV` suffixes (e.g., `DATABASE_URL_TEST` is used when `NODE_ENV=test`). Config is static at boot — no dynamic config reloading.

### Processes

Stateless processes. All shared state lives in Redis and Postgres, never in memory.

Run `bun` (or `node`) directly — not via `npm start`, PM2, or supervisord. Package managers and process managers swallow signals, which means your graceful shutdown code never runs. In Dockerfiles, use array syntax: `CMD ["bun", "start"]`, not string format.

### Graceful Shutdown

Handle SIGINT/SIGTERM with a hard-stop fallback timer (default 30s via `PROCESS_SHUTDOWN_TIMEOUT`). Never try to catch SIGKILL — you can't, and attempting to is a sign you're fighting the OS instead of working with it.

Health checks should drive load balancer behavior: return false during shutdown *before* stopping connections, so the load balancer drains traffic to other instances first.

### Deployment

Frontend (Next.js) and backend (Actionhero) deploy and scale independently. Auto-migrations on startup by default (`DATABASE_AUTO_MIGRATE=true`), with a manual option available for environments that need it.

---

## 5. ORMs and Type Safety Are Worth It

Use ORMs (Drizzle in modern Actionhero) for data access. The structure, type safety, and migration support justify the overhead. Migration-based schema management, auto-applied on boot, keeps the database in sync without manual intervention.

Share TypeScript types across frontend and backend — zero runtime overhead, but it gives you extra confidence in the test suite. Use the type system as a testing layer: derive types from source-of-truth definitions (`ActionParams<A>`, `ActionResponse<A>`) rather than maintaining duplicate type declarations that inevitably drift.

The module augmentation pattern is the right way to extend framework types. Initializers extend the `API` interface so that `api.db`, `api.redis`, etc. are fully typed without casting.

---

## 6. Test Against the Real Thing

Make real HTTP requests against a running server. Don't mock the server — if you're mocking the thing you're trying to test, you're not testing anything.

### Setup

Boot the complete app (DB, Redis, all initializers) in `beforeAll`, tear down in `afterAll`. Use native `fetch` for HTTP tests — no special testing libraries needed. Bun's built-in test runner handles the rest.

### Database

Separate test database via `DATABASE_URL_TEST`. A `clearDatabase()` utility truncates all tables with `RESTART IDENTITY CASCADE` and refuses to run in production (it checks `NODE_ENV`).

### Execution

Tests run non-concurrently to prevent port conflicts. Test side effects through return values — the framework's task runners return results directly for verification.

Don't skip integration tests because they're harder to write. The confidence they provide is worth the setup cost.

---

## 7. Security at the Boundary, Not in Prompts

Validate inputs at the system boundary with Zod schemas — the framework enforces this before your action code runs. Inside the boundary, trust your own code.

For AI/LLM tooling: "Prompting tells the model what you want, not what it's allowed to do." Security comes from purpose-built database roles, limited surface area, pinned connections, and input validation — not from asking the model nicely.

Tools should evolve from exploratory (read-only discovery) to operational (prepared statements, parameterized queries). Redact secrets in logs automatically via the `secret()` wrapper. Middleware-based auth throws in `runBefore` to halt execution entirely — the action never runs if the request isn't authorized.

---

## Preferred Stack & Tooling

| Layer | Choice | Why |
| --- | --- | --- |
| **Runtime** | Bun | Native TypeScript, built-in test runner, fast startup |
| **Validation** | Zod | Single source of truth for validation, docs, CLI, and types |
| **Database** | Drizzle ORM + PostgreSQL | Type-safe queries, auto-migrations |
| **Background Jobs** | node-resque + Redis | Battle-tested, same-codebase task execution |
| **Frontend** | Next.js | Separate app, independent deployment |
| **Configuration** | Environment variables | Per-environment overrides via `loadFromEnvIfSet()` |
| **Logging** | STDOUT/STDERR | Optional colors, no complex logging frameworks |
| **Process Management** | Direct runtime invocation | Never PM2, never supervisord |

---

## LLM Instructions

When writing code for Evan:

**DO:**

- Prefer the smallest change that solves the problem
- Reuse existing utilities and patterns in the codebase
- Use Zod for input validation
- Let errors propagate to framework error handlers
- Test with real HTTP against a running server
- Configure via environment variables
- Derive types from source-of-truth definitions
- Follow existing patterns — if the codebase does it one way, do it that way

**DON'T:**

- Create new abstractions for one-time operations
- Add features beyond what was asked
- Mock the server in tests
- Use process managers inside containers
- Build for hypothetical future requirements
- Over-catch errors — let them bubble
- Add logging frameworks, just use STDOUT
- Create separate routing files — routes belong on the action
