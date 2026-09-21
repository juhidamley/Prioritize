// /api/tasks — Prioritize task collection, backed by Neon.
//
// Replaces the browser's direct `supabase.from('tasks')` calls. Stands in for
// the RLS policy "Users can manage tasks in their queues" (ALL, gated on the
// parent queue's owner_id), which is why every branch resolves the task's
// queue and checks ownership before touching a row.

import { sql, dbConfigured } from './_lib/db';
import { getUserId, json } from './_lib/auth';

const MAX_TITLE = 500;
const MAX_DESCRIPTION = 5000;

function str(v: unknown, max: number): string | null {
  if (typeof v !== 'string') return null;
  const s = v.trim();
  return s ? s.slice(0, max) : null;
}

/** The user owns the queue this task lives in. */
async function ownsTask(taskId: string, userId: string): Promise<boolean> {
  const rows = await sql`
    SELECT 1 FROM tasks t
    JOIN queues q ON q.id = t.queue_id
    WHERE t.id = ${taskId} AND q.owner_id = ${userId}
  `;
  return rows.length > 0;
}

export default async function handler(req: any, res: any) {
  if (!dbConfigured()) return json(res, 500, { error: 'Database not configured' });

  const userId = await getUserId(req);
  if (!userId) return json(res, 401, { error: 'Not authenticated' });

  try {
    switch (req.method) {
      // ---- Create ----
      case 'POST': {
        const queueId = str(req.body?.queueId, 64);
        const title = str(req.body?.title, MAX_TITLE);
        if (!queueId || !title) return json(res, 400, { error: 'queueId and title are required' });

        const owns = await sql`SELECT 1 FROM queues WHERE id = ${queueId} AND owner_id = ${userId}`;
        if (!owns.length) return json(res, 404, { error: 'Queue not found' });

        const description = str(req.body?.description, MAX_DESCRIPTION);
        const color = str(req.body?.color, 32);
        const sortOrder = Number.isFinite(req.body?.sortOrder) ? Number(req.body.sortOrder) : 0;

        const [task] = await sql`
          INSERT INTO tasks (queue_id, title, description, color, sort_order)
          VALUES (${queueId}, ${title}, ${description}, ${color}, ${sortOrder})
          RETURNING id, title, description, color, sort_order, queue_id, sub_queue_id, created_at
        `;
        return json(res, 201, { task });
      }

      // ---- Update: title/description/color, plus sort_order (reorder) and
      //      sub_queue_id (createSubQueue). Omitted fields keep their value. ----
      case 'PATCH': {
        const id = str(req.body?.id ?? req.query?.id, 64);
        if (!id) return json(res, 400, { error: 'id is required' });
        if (!(await ownsTask(id, userId))) return json(res, 404, { error: 'Task not found' });

        const title = str(req.body?.title, MAX_TITLE);
        const color = str(req.body?.color, 32);
        const subQueueId = str(req.body?.subQueueId, 64);
        const sortOrder = Number.isFinite(req.body?.sortOrder) ? Number(req.body.sortOrder) : null;

        // description is the one nullable field a caller may want to clear, so
        // an explicit null is honoured while `undefined` leaves it untouched.
        const description =
          req.body?.description === null ? '' : str(req.body?.description, MAX_DESCRIPTION);
        const clearDescription = req.body?.description === null;

        const [task] = await sql`
          UPDATE tasks SET
            title        = COALESCE(${title}, title),
            color        = COALESCE(${color}, color),
            sub_queue_id = COALESCE(${subQueueId}, sub_queue_id),
            sort_order   = COALESCE(${sortOrder}::real, sort_order),
            description  = CASE WHEN ${clearDescription} THEN NULL
                                ELSE COALESCE(${description}, description) END
          WHERE id = ${id}
          RETURNING id, title, description, color, sort_order, queue_id, sub_queue_id, created_at
        `;
        return json(res, 200, { task });
      }

      // ---- Delete ----
      case 'DELETE': {
        const id = str(req.query?.id ?? req.body?.id, 64);
        if (!id) return json(res, 400, { error: 'id is required' });
        if (!(await ownsTask(id, userId))) return json(res, 404, { error: 'Task not found' });

        await sql`DELETE FROM tasks WHERE id = ${id}`;
        return json(res, 200, { ok: true });
      }

      default:
        res.setHeader('Allow', 'POST, PATCH, DELETE');
        return json(res, 405, { error: 'Method not allowed' });
    }
  } catch (err) {
    console.error('[api/tasks] error', err);
    return json(res, 500, { error: 'Request failed' });
  }
}
