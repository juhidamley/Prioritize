// Request authentication for the Prioritize endpoints.
//
// Supabase stayed on as the identity provider after the data moved to Neon, so
// the browser still holds a Supabase session. It sends that session's access
// token as `Authorization: Bearer <token>`; we hand the token to Supabase Auth,
// which validates the signature and expiry and returns the user.
//
// This is the hinge of the whole security model. Supabase RLS used to enforce
// ownership inside the database via auth.uid(); Neon has no equivalent, so the
// user id resolved here is what every ownership check in api/*.ts compares
// against. A caller who supplies no token, or a bad one, gets nothing.

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://qxsyjqquhruqgiwrkppb.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || '';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

/**
 * Resolve the Supabase user id for a request, or null if unauthenticated.
 * Never throws — callers treat null as 401.
 */
export async function getUserId(req: any): Promise<string | null> {
  const header = String(req.headers?.authorization || '');
  const token = header.startsWith('Bearer ') ? header.slice(7).trim() : '';
  if (!token) return null;

  try {
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data?.user) return null;
    return data.user.id;
  } catch (err) {
    console.error('[api/_lib/auth] token verification failed', err);
    return null;
  }
}

/** Write a JSON response with the given status. */
export function json(res: any, status: number, body: unknown) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}
