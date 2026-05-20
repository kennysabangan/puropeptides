#!/usr/bin/env node
// Apply Supabase migrations via the Management API.
//
// Usage (from your local machine, not the Claude Code container):
//   SUPABASE_PROJECT_REF=tvlrreyhbgaxauyxuqrw \
//   SUPABASE_ACCESS_TOKEN=sbp_xxx \
//   node scripts/apply-supabase-migrations.mjs
//
// Or pass --dry-run to print the SQL without executing.

import { readFile, readdir } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const MIGRATIONS_DIR = join(__dirname, '..', 'supabase', 'migrations')

const PROJECT_REF = process.env.SUPABASE_PROJECT_REF
const TOKEN = process.env.SUPABASE_ACCESS_TOKEN
const DRY = process.argv.includes('--dry-run')

if (!PROJECT_REF) die('Missing SUPABASE_PROJECT_REF env var')
if (!TOKEN && !DRY) die('Missing SUPABASE_ACCESS_TOKEN env var (personal access token, sbp_…)')

const files = (await readdir(MIGRATIONS_DIR)).filter((f) => f.endsWith('.sql')).sort()
if (files.length === 0) die(`No .sql files in ${MIGRATIONS_DIR}`)

console.log(`Found ${files.length} migration(s):`)
for (const f of files) console.log(`  - ${f}`)
console.log()

for (const file of files) {
  const sql = await readFile(join(MIGRATIONS_DIR, file), 'utf8')
  console.log(`→ ${file} (${sql.length} chars)`)
  if (DRY) {
    console.log(sql.slice(0, 200) + (sql.length > 200 ? '…' : ''))
    continue
  }
  try {
    const result = await runQuery(sql)
    console.log(`  ✓ applied`)
    if (Array.isArray(result) && result.length > 0) {
      console.log(`    returned ${result.length} row(s)`)
    }
  } catch (err) {
    console.error(`  ✗ failed: ${err.message}`)
    process.exit(1)
  }
}

console.log('\nDone.')

async function runQuery(sql) {
  const res = await fetch(
    `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify({ query: sql }),
    },
  )
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`HTTP ${res.status}: ${body}`)
  }
  return res.json()
}

function die(msg) {
  console.error(msg)
  process.exit(1)
}
