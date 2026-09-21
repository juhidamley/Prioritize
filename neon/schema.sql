-- Prioritize: Neon schema
-- Ported from Supabase project qxsyjqquhruqgiwrkppb ("Priority Queue").
--
-- Two deliberate differences from the Supabase original:
--
-- 1. No foreign keys to auth.users. Supabase Auth stays the identity provider,
--    so auth.users lives in a different database entirely. owner_id / user_id /
--    invited_by hold Supabase user UUIDs but cannot be FK-constrained here.
--    The ON DELETE CASCADE from auth.users is therefore gone: deleting a
--    Supabase user no longer reaps their rows. See neon/orphan-sweep.sql.
--
-- 2. No RLS policies. RLS depended on auth.uid(), which only exists inside
--    Supabase. Every connection to Neon uses the same role, so row-level rules
--    would apply uniformly and protect nothing. Ownership is enforced in the
--    API layer instead (api/_lib/auth.ts + the owner checks in api/*.ts).
--    Nothing but those serverless functions may hold the connection string.

CREATE TABLE IF NOT EXISTS queues (
  id             text PRIMARY KEY DEFAULT (gen_random_uuid())::text,
  created_at     timestamptz NOT NULL DEFAULT timezone('utc', now()),
  name           text NOT NULL,
  color          text NOT NULL,
  palette        text[] NOT NULL DEFAULT '{}',
  parent_task_id text,
  owner_id       uuid NOT NULL
);

CREATE TABLE IF NOT EXISTS tasks (
  id           text PRIMARY KEY DEFAULT (gen_random_uuid())::text,
  created_at   timestamptz NOT NULL DEFAULT timezone('utc', now()),
  title        text NOT NULL,
  description  text,
  color        text,
  sort_order   real NOT NULL,
  queue_id     text NOT NULL REFERENCES queues(id) ON DELETE CASCADE,
  sub_queue_id text REFERENCES queues(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS queue_members (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  queue_id         text NOT NULL REFERENCES queues(id) ON DELETE CASCADE,
  invited_by       uuid NOT NULL,
  user_id          uuid,
  email            text NOT NULL,
  role             text NOT NULL DEFAULT 'editor' CHECK (role = 'editor'),
  status           text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active')),
  created_at       timestamptz NOT NULL DEFAULT now(),
  invited_by_email text,
  UNIQUE (queue_id, email)
);

-- Legacy, superseded by queue_members. Empty in the Supabase source; carried
-- over so the port is faithful. Note queue_id is uuid here while queues.id is
-- text -- it never had a working FK. Safe to drop once you confirm it's dead.
CREATE TABLE IF NOT EXISTS queue_shares (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  queue_id     uuid NOT NULL,
  user_id      uuid NOT NULL,
  access_level text NOT NULL CHECK (access_level IN ('read', 'edit')),
  created_at   timestamptz NOT NULL DEFAULT timezone('utc', now()),
  UNIQUE (queue_id, user_id)
);

-- Supporting indexes. fetchQueues() filters tasks by queue and orders by
-- sort_order; the owner lookup runs on every authenticated request.
CREATE INDEX IF NOT EXISTS tasks_queue_id_sort_order_idx ON tasks (queue_id, sort_order);
CREATE INDEX IF NOT EXISTS queues_owner_id_idx           ON queues (owner_id);
CREATE INDEX IF NOT EXISTS queues_parent_task_id_idx     ON queues (parent_task_id);
CREATE INDEX IF NOT EXISTS queue_members_user_id_idx     ON queue_members (user_id);
