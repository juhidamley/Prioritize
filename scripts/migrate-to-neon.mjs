#!/usr/bin/env node
// Apply the Prioritize schema and data to a Neon database.
//
//   DATABASE_URL='postgresql://…' node scripts/migrate-to-neon.mjs [--schema-only]
//
// Both SQL files are idempotent (CREATE TABLE IF NOT EXISTS / ON CONFLICT DO
// NOTHING), so re-running is safe and will not duplicate rows. Finishes by
// printing row counts to compare against the Supabase source: 12 queues,
// 51 tasks.

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Client } from '@neondatabase/serverless';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const url = process.env.DATABASE_URL;
const schemaOnly = process.argv.includes('--schema-only');

if (!url) {
  console.error('DATABASE_URL is not set. Pass your Neon connection string, e.g.\n' +
    "  DATABASE_URL='postgresql://user:pass@ep-xxx.us-west-2.aws.neon.tech/neondb?sslmode=require' \\\n" +
    '    node scripts/migrate-to-neon.mjs');
  process.exit(1);
}

// The websocket Client (not the http `neon()` helper) because these files are
// multi-statement and wrapped in a transaction.
const client = new Client(url);

const step = async (label, file) => {
  process.stdout.write(`  ${label} … `);
  await client.query(readFileSync(join(root, 'neon', file), 'utf8'));
  console.log('done');
};

try {
  await client.connect();
  console.log('Connected to Neon.');

  await step('schema', 'schema.sql');
  if (!schemaOnly) await step('data  ', 'data.sql');

  const { rows } = await client.query(`
    SELECT 'queues' AS table, count(*)::int AS rows FROM queues
    UNION ALL SELECT 'tasks', count(*)::int FROM tasks
    UNION ALL SELECT 'queue_members', count(*)::int FROM queue_members
    UNION ALL SELECT 'queue_shares', count(*)::int FROM queue_shares
    ORDER BY 1
  `);
  console.log('\nRow counts:');
  for (const r of rows) console.log(`  ${r.table.padEnd(14)} ${r.rows}`);
  console.log('\nExpected after a full migration: queues 12, tasks 51.');
} catch (err) {
  console.error('\nMigration failed:', err.message);
  process.exitCode = 1;
} finally {
  await client.end().catch(() => {});
}
