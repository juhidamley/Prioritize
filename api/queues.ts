// /api/queues — Prioritize queue collection, backed by Neon.
//
// Replaces the browser's direct `supabase.from('queues')` calls. The Supabase
// RLS policies this stands in for were:
//
//   queues: "Users can manage their own queues"        ALL    owner_id = auth.uid()
//           "owners_and_members_view_queues"           SELECT owner_id = auth.uid()
//                                                             OR active queue_members row
//   tasks:  "Users can manage tasks in their queues"   ALL    queue owned by auth.uid()
//
// Reads therefore span owned + actively-shared queues; every write is
// owner-only. Neon cannot enforce this itself (one role, no auth.uid()), so it
// is enforced here — see the ownsQueue() guard on each mutating branch.

import { sql, dbConfigured } from './_lib/db';
import { getUserId, json } from './_lib/auth';

const MAX_NAME = 200;
const MAX_PALETTE = 12;

function str(v: unknown, max: number): string | null {
  if (typeof v !== 'string') return null;
  const s = v.trim();
  return s ? s.slice(0, max) : null;
}

/** Owner-only gate for mutations, mirroring the ALL policy on queues. */
async function ownsQueue(queueId: string, userId: string): Promise<boolean> {
  const rows = await sql`SELECT 1 FROM queues WHERE id = ${queueId} AND owner_id = ${userId}`;
  return rows.length > 0;
}

export default async function handler(req: any, res: any) {
  if (!dbConfigured()) return json(res, 500, { error: 'Database not configured' });

  const userId = await getUserId(req);
  if (!userId) return json(res, 401, { error: 'Not authenticated' });

  try {
    switch (req.method) {
      // ---- Read: every queue the user can see, with its tasks attached ----
      case 'GET': {
        // Assembled server-side so the client makes one request instead of the
        // two-query + join-in-JS dance fetchQueues() used to do.
        const queues = await sql`
          SELECT id, name, color, palette, parent_task_id, created_at, owner_id
          FROM queues
          WHERE owner_id = ${userId}
             OR EXISTS (
                  SELECT 1 FROM queue_members m
                  WHERE m.queue_id = queues.id
                    AND m.user_id = ${userId}
                    AND m.status = 'active'
                )
          ORDER BY created_at
        `;
        if (!queues.length) return json(res, 200, { queues: [] });

        const ids = queues.map((q: any) => q.id);
        const tasks = await sql`
          SELECT id, title, description, color, sort_order, queue_id, sub_queue_id, created_at
          FROM tasks
          WHERE queue_id = ANY(${ids})
          ORDER BY sort_order
        `;

        const byQueue = new Map<string, any[]>(ids.map((id: string) => [id, []]));
        for (const t of tasks as any[]) byQueue.get(t.queue_id)!.push(t);

        return json(res, 200, {
          queues: (queues as any[]).map((q) => ({ ...q, tasks: byQueue.get(q.id) })),
        });
      }

      // ---- Create ----
      case 'POST': {
        const name = str(req.body?.name, MAX_NAME);
        const color = str(req.body?.color, 32);
        if (!name || !color) return json(res, 400, { error: 'name and color are required' });

        const palette = Array.isArray(req.body?.palette)
          ? req.body.palette.filter((c: unknown) => typeof c === 'string').slice(0, MAX_PALETTE)
          : [];
        const parentTaskId = str(req.body?.parentTaskId, 64);

        const [queue] = await sql`
          INSERT INTO queues (name, color, palette, parent_task_id, owner_id)
          VALUES (${name}, ${color}, ${palette}, ${parentTaskId}, ${userId})
          RETURNING id, name, color, palette, parent_task_id, created_at, owner_id
        `;
        return json(res, 201, { queue: { ...queue, tasks: [] } });
      }

      // ---- Update: name / color / palette, matching updateQueue() ----
      case 'PATCH': {
        const id = str(req.body?.id ?? req.query?.id, 64);
        if (!id) return json(res, 400, { error: 'id is required' });
        if (!(await ownsQueue(id, userId))) return json(res, 404, { error: 'Queue not found' });

        // COALESCE keeps omitted fields at their current value, so a partial
        // update can't blank out columns the caller never mentioned.
        const name = str(req.body?.name, MAX_NAME);
        const color = str(req.body?.color, 32);
        const palette = Array.isArray(req.body?.palette)
          ? req.body.palette.filter((c: unknown) => typeof c === 'string').slice(0, MAX_PALETTE)
          : null;

        const [queue] = await sql`
          UPDATE queues SET
            name    = COALESCE(${name}, name),
            color   = COALESCE(${color}, color),
            palette = COALESCE(${palette}::text[], palette)
          WHERE id = ${id}
          RETURNING id, name, color, palette, parent_task_id, created_at, owner_id
        `;
        return json(res, 200, { queue });
      }

      // ---- Delete: tasks and member rows go with it via ON DELETE CASCADE ----
      case 'DELETE': {
        const id = str(req.query?.id ?? req.body?.id, 64);
        if (!id) return json(res, 400, { error: 'id is required' });
        if (!(await ownsQueue(id, userId))) return json(res, 404, { error: 'Queue not found' });

        await sql`DELETE FROM queues WHERE id = ${id}`;
        return json(res, 200, { ok: true });
      }

      default:
        res.setHeader('Allow', 'GET, POST, PATCH, DELETE');
        return json(res, 405, { error: 'Method not allowed' });
    }
  } catch (err) {
    console.error('[api/queues] error', err);
    return json(res, 500, { error: 'Request failed' });
  }
}
