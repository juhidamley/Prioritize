// Client for the Prioritize serverless endpoints (api/queues.ts, api/tasks.ts).
//
// Queues and tasks live in Neon now, and a Neon connection string can't ship to
// a browser, so the client no longer talks to the database at all — it calls
// these endpoints, which hold the credentials server-side.
//
// Supabase is still the identity provider, so each request carries the current
// Supabase access token; api/_lib/auth.ts verifies it and derives the user id
// that the endpoints' ownership checks run against.

import { supabase } from '../../utils/supabase/client';

export class ApiError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new ApiError('Not authenticated', 401);

  const res = await fetch(path, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.access_token}`,
      ...init.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(body?.error || `Request failed (${res.status})`, res.status);
  }
  return res.json();
}

// Shape returned by the endpoints: snake_case straight from Postgres. The store
// maps these into the camelCase Queue/Task types the components consume.
export interface ApiTask {
  id: string;
  title: string;
  description: string | null;
  color: string | null;
  sort_order: number;
  queue_id: string;
  sub_queue_id: string | null;
  created_at: string;
}

export interface ApiQueue {
  id: string;
  name: string;
  color: string;
  palette: string[];
  parent_task_id: string | null;
  created_at: string;
  owner_id: string;
  tasks: ApiTask[];
}

export const api = {
  /** Every queue the user can see, each with its tasks already attached. */
  listQueues: () => request<{ queues: ApiQueue[] }>('/api/queues'),

  createQueue: (body: { name: string; color: string; palette: string[]; parentTaskId?: string }) =>
    request<{ queue: ApiQueue }>('/api/queues', { method: 'POST', body: JSON.stringify(body) }),

  updateQueue: (body: { id: string; name?: string; color?: string; palette?: string[] }) =>
    request<{ queue: ApiQueue }>('/api/queues', { method: 'PATCH', body: JSON.stringify(body) }),

  deleteQueue: (id: string) =>
    request<{ ok: true }>(`/api/queues?id=${encodeURIComponent(id)}`, { method: 'DELETE' }),

  createTask: (body: {
    queueId: string; title: string; description?: string; color?: string; sortOrder: number;
  }) => request<{ task: ApiTask }>('/api/tasks', { method: 'POST', body: JSON.stringify(body) }),

  updateTask: (body: {
    id: string; title?: string; description?: string | null;
    color?: string; sortOrder?: number; subQueueId?: string;
  }) => request<{ task: ApiTask }>('/api/tasks', { method: 'PATCH', body: JSON.stringify(body) }),

  deleteTask: (id: string) =>
    request<{ ok: true }>(`/api/tasks?id=${encodeURIComponent(id)}`, { method: 'DELETE' }),
};
