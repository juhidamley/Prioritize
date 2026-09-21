-- Remove queues belonging to deleted Supabase users.
--
-- Supabase had queues.owner_id REFERENCES auth.users(id) ON DELETE CASCADE, so
-- deleting a user reaped their data automatically. auth.users now lives in a
-- different database, so that FK is gone and the cleanup must be manual.
--
-- Nothing here runs on its own. Fill in the ids of users you have deleted from
-- Supabase Auth, review the SELECT, then run the DELETE.

-- 1. Preview what would be removed.
SELECT id, name, owner_id, created_at
FROM queues
WHERE owner_id = ANY(ARRAY[
  -- '00000000-0000-0000-0000-000000000000'::uuid,
]::uuid[]);

-- 2. Delete. Tasks and queue_members rows follow via ON DELETE CASCADE.
-- DELETE FROM queues
-- WHERE owner_id = ANY(ARRAY[
--   '00000000-0000-0000-0000-000000000000'::uuid,
-- ]::uuid[]);

-- Also clear membership/share rows pointing at deleted users.
-- DELETE FROM queue_members WHERE user_id = ANY(ARRAY[...]::uuid[]);
-- DELETE FROM queue_shares  WHERE user_id = ANY(ARRAY[...]::uuid[]);
