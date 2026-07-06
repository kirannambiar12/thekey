# Community Forum — Saved Posts

A small full-stack slice of a course discussion forum with bookmark (Saved Posts) support. Built with Next.js 15, SQLite, Drizzle ORM, and React Query.

## Features

- Paginated forum feed per course (newest first)
- Save / unsave posts with idempotent API behavior
- Soft-deleted saves with reactivation (history preserved)
- `hasSaved` and `savesCount` on every post in feed and saved list
- Paginated saved posts view with empty state
- Stubbed auth via `x-user-id` and `x-role` request headers
- English and Spanish UI with pluralized save counts
- Unit and API tests via Vitest

## Requirements

- Node.js 20+
- npm

## Installation

```bash
npm install
```

## Database migration

Create the SQLite database and apply migrations:

```bash
npm run db:migrate
```

To generate a new migration after schema changes:

```bash
npm run db:generate
```

## Seeding

Load demo data (users, courses, enrollments, posts, saved posts):

```bash
npm run db:seed
```

This runs migrations if needed, then resets and seeds `data/forum.db`.

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The app redirects to `/forum`.

Use the header controls to switch demo users and locale. Auth is stubbed — no login required.

### Demo users

| User   | Role      | Enrolled courses        |
|--------|-----------|-------------------------|
| Alice  | student   | Intro to TypeScript     |
| Bob    | student   | Both courses            |
| Carol  | student   | Web Security            |
| Morgan | moderator | All courses (via role)  |

## Testing

```bash
npm test
```

Tests use an isolated database at `data/test.db`. Watch mode:

```bash
npm run test:watch
```

## Production build

```bash
npm run build
npm start
```

## API overview

All endpoints require headers:

```
x-user-id: user-alice
x-role: student
```

| Method   | Path                              | Description                    |
|----------|-----------------------------------|--------------------------------|
| `GET`    | `/api/courses`                    | Courses visible to the user    |
| `GET`    | `/api/courses/:courseId/posts`    | Paginated feed                 |
| `GET`    | `/api/posts/:postId`              | Single post                    |
| `POST`   | `/api/posts/:postId/save`         | Save post                      |
| `DELETE` | `/api/posts/:postId/save`         | Unsave post                    |
| `GET`    | `/api/saved-posts`                | Paginated saved posts          |

Query params: `page` (default 1), `limit` (default 20, max 100).

## Project structure

```
app/
  api/                  # Route handlers (auth, validation, I/O)
  forum/                # Forum feed page
  saved/                # Saved posts page
components/             # UI components and providers
drizzle/                # SQL migrations
hooks/                  # React Query hooks
lib/
  api/                  # Typed API client and query keys
  auth/                 # Stub auth helpers and context
  db/                   # Drizzle schema, connection, seed
  i18n/                 # Locale context and message helpers
  validators/           # Zod schemas
messages/               # en.json, es.json
repositories/           # Database access only
services/               # Business logic
tests/                  # Vitest unit and API tests
```

## Architecture

```
UI → React Query hooks → API client → Route handlers → Services → Repositories → SQLite
```

Business rules live in `services/`. Repositories perform database operations only. Route handlers validate input, authenticate, and delegate to services.
