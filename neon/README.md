# Prioritize: Supabase → Neon

Queues and tasks moved from Supabase Postgres to Neon. **Supabase is still
required** — it remains the identity provider (`supabase.auth`) and the
Realtime transport. Only the data left.

## What changed

| Concern | Before | After |
|---|---|---|
| Queue/task storage | Supabase Postgres | Neon |
| Data access | `supabase.from(...)` in the browser | `/api/queues`, `/api/tasks` |
| Row security | RLS via `auth.uid()` | Owner checks in `api/*.ts` |
| Auth | Supabase Auth | Supabase Auth (unchanged) |
| Live sync | `postgres_changes` | Supabase Realtime **Broadcast** |
| Guest mode | localStorage | localStorage (unchanged) |

Two changes deserve emphasis:

**Row security moved out of the database.** RLS was expressed with `auth.uid()`,
which exists only inside Supabase. Every connection to Neon uses one role, so
row-level rules there would apply uniformly and protect nothing. The equivalent
guards now live in `api/queues.ts` and `api/tasks.ts`, which resolve the caller
from their Supabase token and check `owner_id` before any read or write. The
consequence: **`DATABASE_URL` must never reach the browser.** Unlike the
Supabase anon key, it is unrestricted. It is deliberately not `VITE_`-prefixed
so Vite cannot inline it.

**Realtime changed mechanism.** `postgres_changes` fires on writes to Supabase
tables, which no longer receive any — such a listener would be permanently
silent. The channel is now Broadcast: a client that writes to Neon pings
`prioritize:<user-id>`, and other subscribers refetch. The payload is empty by
design; it carries no data, only "go look again".

## Files

- `schema.sql` — tables, constraints, indexes. Idempotent.
- `data.sql` — 12 queues, 51 tasks exported from Supabase. Idempotent.
- `orphan-sweep.sql` — see "User deletion" below.
- `../scripts/migrate-to-neon.mjs` — applies both, then prints row counts.

## Running the migration

```sh
DATABASE_URL='postgresql://…@ep-….neon.tech/neondb?sslmode=require' \
  node scripts/migrate-to-neon.mjs
```

Expected output: `queues 12, tasks 51`.

## Environment variables

Set on the Vercel project (Production + Preview), server-side only:

- `DATABASE_URL` — Neon connection string. **Secret.**
- `SUPABASE_URL` — defaults to the existing project if unset.
- `SUPABASE_ANON_KEY` — needed by `api/_lib/auth.ts` to verify access tokens.

## Known gap: user deletion

In Supabase, `queues.owner_id` was `REFERENCES auth.users(id) ON DELETE
CASCADE`, so deleting a user removed their rows. That FK cannot exist across two
databases, so **deleting a Supabase user now leaves their queues in Neon**. No
one can read them (the owner id no longer authenticates), but they persist.
`orphan-sweep.sql` cleans them up given a list of deleted user ids; run it if you
ever delete users.

## Rollback

The Supabase tables were not dropped — the export was a copy, not a move. To
revert, restore `src/app/store.ts` from git and the app talks to Supabase again.
Any rows written to Neon after the cutover would need to be brought back by hand.
