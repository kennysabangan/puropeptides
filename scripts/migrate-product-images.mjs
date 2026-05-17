#!/usr/bin/env node
// Migrate hardcoded product images from public/images/products/ into the
// Supabase Storage `product-images` bucket and update the products table.
//
// Prereqs:
//   1. Bucket "product-images" exists in Supabase (Storage → New bucket → public)
//   2. Migration 005_storage_product_images.sql has been applied
//
// Usage (from your local machine):
//   SUPABASE_URL=https://tvlrreyhbgaxauyxuqrw.supabase.co \
//   SUPABASE_SERVICE_ROLE_KEY=eyJ... \
//   node scripts/migrate-product-images.mjs
//
// Optional flags:
//   --dry-run        list what would happen, no uploads or DB writes
//   --slugs=a,b,c    only process these slugs (default: all directories)
//
// Idempotent: re-runs upsert files and overwrite image_url/gallery_urls.

import { createClient } from '@supabase/supabase-js'
import { readFile, readdir, stat } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PRODUCTS_DIR = join(__dirname, '..', 'public', 'images', 'products')

const URL_ = process.env.SUPABASE_URL
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const DRY = process.argv.includes('--dry-run')
const SLUG_FILTER = (process.argv.find((a) => a.startsWith('--slugs=')) || '')
  .replace('--slugs=', '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

if (!URL_) die('Missing SUPABASE_URL env var')
if (!KEY && !DRY) die('Missing SUPABASE_SERVICE_ROLE_KEY env var')

const supabase = KEY
  ? createClient(URL_, KEY, { auth: { persistSession: false } })
  : null

const dirs = (await readdir(PRODUCTS_DIR, { withFileTypes: true }))
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .filter((name) => SLUG_FILTER.length === 0 || SLUG_FILTER.includes(name))

console.log(`Found ${dirs.length} product directories\n`)

let ok = 0
let skip = 0
let fail = 0

for (const slug of dirs.sort()) {
  process.stdout.write(`• ${slug}: `)
  try {
    const result = await processProduct(slug)
    if (result === 'skip') { skip++; console.log('skipped (no product row)') }
    else { ok++; console.log('done') }
  } catch (err) {
    fail++
    console.log(`FAILED — ${err.message}`)
  }
}

console.log(`\n${ok} updated, ${skip} skipped, ${fail} failed`)
process.exit(fail > 0 ? 1 : 0)

async function processProduct(slug) {
  const dir = join(PRODUCTS_DIR, slug)
  const files = await readdir(dir)

  const vialName = files.find((f) => f.endsWith('-vial.png')) || null
  const galleryNames = files
    .filter((f) => /^\d{2}\.png$/.test(f))
    .sort()

  if (!vialName && galleryNames.length === 0) {
    console.log('(no images)')
    return 'skip'
  }

  // Look up product
  let product = null
  if (supabase) {
    const { data, error } = await supabase
      .from('products')
      .select('id, slug, image_url, gallery_urls')
      .eq('slug', slug)
      .maybeSingle()
    if (error) throw error
    if (!data) return 'skip'
    product = data
  }

  let primaryUrl = null
  const galleryUrls = []

  if (vialName) {
    primaryUrl = await uploadOne(dir, slug, vialName)
  }
  for (const name of galleryNames) {
    const url = await uploadOne(dir, slug, name)
    galleryUrls.push(url)
  }

  // If there's no vial, promote the first gallery image to primary
  if (!primaryUrl && galleryUrls.length > 0) {
    primaryUrl = galleryUrls.shift()
  }

  if (DRY) {
    console.log(`\n    primary: ${primaryUrl}`)
    galleryUrls.forEach((u) => console.log(`    gallery: ${u}`))
    return 'dry'
  }

  const { error: updateErr } = await supabase
    .from('products')
    .update({
      image_url: primaryUrl,
      gallery_urls: galleryUrls,
      updated_at: new Date().toISOString(),
    })
    .eq('id', product.id)
  if (updateErr) throw updateErr

  return 'ok'
}

async function uploadOne(dir, slug, filename) {
  const filePath = join(dir, filename)
  const buf = await readFile(filePath)
  const objectPath = `${slug}/${filename}`

  if (DRY) {
    const s = await stat(filePath)
    return `[dry] would upload ${objectPath} (${s.size} bytes)`
  }

  const { error: upErr } = await supabase
    .storage
    .from('product-images')
    .upload(objectPath, buf, {
      upsert: true,
      contentType: 'image/png',
      cacheControl: '3600',
    })
  if (upErr) throw upErr

  const { data } = supabase.storage.from('product-images').getPublicUrl(objectPath)
  return data.publicUrl
}

function die(msg) {
  console.error(msg)
  process.exit(1)
}
