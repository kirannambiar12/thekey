# NOTES.md

## Setup (quick start)

```bash
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

In another terminal:

```bash
npm test
```

## Design decisions

### Single Next.js app

Everything runs in one project — App Router pages plus Route Handlers. No separate API server or monorepo. SQLite avoids local Postgres setup.

### Layering

- **Repositories** — Drizzle queries only
- **Services** — save/unsave rules, enrollment checks, post hydration
- **Route handlers** — Zod validation, stub auth, HTTP mapping
- **Hooks** — React Query with query key factories and mutation invalidation

### Saved posts schema

`saved_posts` has a unique index on `(user_id, post_id)`. Un-saving sets `deleted_at` (soft delete). Re-saving updates the same row instead of inserting a duplicate. This preserves history and makes idempotency straightforward.

### Auth

Auth reads `x-user-id` and `x-role` from request headers. The UI includes a user switcher for demo purposes. No JWT, sessions, or login flow.

Authorization rules:

- `401` — missing or invalid headers
- `403` — student accessing a course they are not enrolled in, or another user's saved list
- `404` — post or course not found

Moderators can access posts in any course. Students are limited to enrolled courses.

### Hydrated flags without N+1

Feed and saved list batch-load save counts (`GROUP BY post_id`) and the current user's active saves (`IN` query) in two queries, then merge in the service layer.

### i18n

User-facing strings live in `messages/en.json` and `messages/es.json`. A small `LocaleProvider` handles lookup and pluralization (`one` / `other`). A production app might adopt URL-based locale routing (`/en/forum`, `/es/forum`).

### Testing

Service tests run against a real SQLite test database (`data/test.db`) rather than mocking repositories. API tests invoke route handlers directly with `Request` objects. This keeps tests close to real behavior with minimal test harness code.

## Trade-offs

| Choice | Why |
|--------|-----|
| SQLite over Postgres | Zero infra for reviewers; Drizzle makes swapping straightforward |
| Stub auth headers | Assignment scope — real identity is out of scope |
| Custom i18n | Lightweight JSON catalogs; sufficient for two locales and pluralization |
| No optimistic UI updates | Simpler cache invalidation after mutations; acceptable for this slice |
| Desktop-first UI | Minimal Tailwind layout; no component library |
| Serial test runs | Avoids SQLite contention on a shared test file |

## Deliberately out of scope

- Real login / identity
- Moderator post removal UI
- File uploads, email, payments
- Deployment and Docker
- Redis / caching
- Concurrency controls beyond SQLite defaults

## What I'd do next

1. **Locale routing** — URL prefixes (`/en/forum`, `/es/forum`) with Next.js middleware.
2. **Optimistic bookmark toggle** — update React Query cache on mutate, roll back on error.
3. **Postgres migration** — change `DATABASE_PATH` to a connection string; schema is already Drizzle-native.
4. **Concurrency** — wrap save/unsave in a transaction with `SELECT` on the unique row to handle simultaneous toggles cleanly.
5. **Moderator tools** — delete post endpoint and admin affordances in the feed.
6. **E2E tests** — Playwright for the bookmark flow through the UI.
7. **Combined feed** — optional view across all enrolled courses without picking one at a time.

## Auth in API requests (curl example)

```bash
curl -X POST http://localhost:3000/api/posts/post-3/save \
  -H "x-user-id: user-alice" \
  -H "x-role: student"
```

## Environment

| Variable        | Default           | Purpose              |
|-----------------|-------------------|----------------------|
| `DATABASE_PATH` | `./data/forum.db` | SQLite database file |

Tests set `DATABASE_PATH=./data/test.db` automatically via `tests/setup.ts`.
