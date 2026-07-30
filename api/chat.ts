// Serverless function (Vercel) backing the "AI Juhi" chat assistant.
// Streams a grounded, guard-railed Claude response as plain text.
//
// - Grounding + guardrails live in the system prompt (../src/content/ai-knowledge).
// - Model defaults to Claude Haiku (cheap/fast); override with CHAT_MODEL env var.
// - If ANTHROPIC_API_KEY is unset, returns a friendly canned reply so the UI
//   never errors before Juhi wires up her key.
// - Best-effort per-instance rate limit + input caps bound cost/abuse. For hard
//   guarantees add a shared store (e.g. Upstash/Vercel KV) — see TODO below.

import Anthropic from '@anthropic-ai/sdk';
// NOTE: keep this a RELATIVE import, not the '@/…' alias. This file is bundled
// by @vercel/node (not Vite), which does not resolve tsconfig `paths` aliases —
// an alias here fails at runtime with FUNCTION_INVOCATION_FAILED.
import { AI_JUHI_SYSTEM } from '../src/content/ai-knowledge';

const MODEL = process.env.CHAT_MODEL || 'claude-haiku-4-5';
const MAX_MESSAGES = 16; // cap conversation length sent to the model
const MAX_CHARS = 1500; // cap per-message length
const MAX_TOKENS = 1024; // short chat answers

const NO_KEY_REPLY =
  "Hi! I'm AI Juhi — but my brain isn't plugged in on this deployment yet (no API key configured). " +
  'In the meantime: Juhi is a CS student at Claremont McKenna who builds ML research systems (Electoral Equilibrium) ' +
  'and developer tools (LectureTeX). See the projects at https://juhi.studio/projects or the résumé at https://juhi.studio/resume.';

// TODO(juhi): this in-memory limiter only covers a single warm instance.
// For robust protection add a shared KV store keyed by IP.
const hits = new Map<string, number[]>();
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const arr = (hits.get(ip) || []).filter((t) => now - t < windowMs);
  arr.push(now);
  hits.set(ip, arr);
  return arr.length > 25;
}

type Msg = { role: 'user' | 'assistant'; content: string };

function sanitize(raw: unknown): Msg[] {
  if (!Array.isArray(raw)) return [];
  const out: Msg[] = [];
  for (const m of raw.slice(-MAX_MESSAGES)) {
    const role = m?.role === 'assistant' ? 'assistant' : 'user';
    const content = typeof m?.content === 'string' ? m.content.slice(0, MAX_CHARS) : '';
    if (content.trim()) out.push({ role, content });
  }
  // The Messages API requires the first message to be from the user.
  while (out.length && out[0].role !== 'user') out.shift();
  return out;
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.end('Method not allowed');
    return;
  }

  const ip = String(req.headers['x-forwarded-for'] || 'local').split(',')[0].trim();
  if (rateLimited(ip)) {
    res.statusCode = 429;
    res.end("You've sent a lot of messages in a short time — give it a minute and try again.");
    return;
  }

  const messages = sanitize(req.body?.messages);
  if (!messages.length) {
    res.statusCode = 400;
    res.end('No message provided.');
    return;
  }

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');

  // Graceful fallback when no key is configured.
  if (!process.env.ANTHROPIC_API_KEY) {
    res.end(NO_KEY_REPLY);
    return;
  }

  try {
    const client = new Anthropic();
    const stream = client.messages.stream({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: AI_JUHI_SYSTEM,
      messages,
    });

    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        res.write(event.delta.text);
      }
    }

    const final = await stream.finalMessage();
    if (final.stop_reason === 'refusal') {
      res.write("\n\nI can't help with that one — happy to talk about Juhi's projects, research, or skills instead.");
    }
    res.end();
  } catch (err) {
    console.error('[api/chat] error', err);
    if (!res.headersSent) res.statusCode = 500;
    res.end("\n\nSomething went wrong on my end. Try again, or reach Juhi at jdamley28@cmc.edu.");
  }
}
