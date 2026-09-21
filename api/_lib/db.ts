// Neon connection for the Prioritize serverless endpoints.
//
// Prioritize's queues/tasks moved off Supabase Postgres to Neon. Supabase is
// still the identity provider (see ./auth.ts), but it no longer stores data.
//
// DATABASE_URL is a secret and must never reach the browser: unlike the
// Supabase anon key, it grants unrestricted access to every row. That is why
// every read and write goes through api/*.ts rather than a client-side driver.
// Note the name has no VITE_ prefix, so Vite cannot inline it into the bundle.

import { neon } from '@neondatabase/serverless';

// NOTE: keep imports here RELATIVE, not '@/…' — this file is bundled by
// @vercel/node, which does not resolve tsconfig `paths` aliases. Same caveat
// as the one documented at the top of api/chat.ts.

if (!process.env.DATABASE_URL) {
  // Fail loudly at cold start rather than returning confusing 500s per request.
  console.error('[api/_lib/db] DATABASE_URL is not set — Neon queries will fail.');
}

/**
 * Tagged-template SQL client. Interpolations are sent as bound parameters,
 * never string-concatenated, so `sql`select … where id = ${id}`` is injection-safe.
 */
export const sql = neon(process.env.DATABASE_URL || '');

/** True when the Neon connection string is configured. */
export function dbConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}
