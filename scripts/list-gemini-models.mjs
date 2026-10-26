/**
 * List Gemini models available to your API key (ListModels API).
 *
 *   GEMINI_API_KEY=... npm run list:gemini-models
 *   npm run list:gemini-models -- --json
 *
 * Loads GEMINI_API_KEY from .env in project root when set there.
 */
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const asJson = process.argv.includes('--json')

function loadDotEnv() {
  const path = join(root, '.env')
  if (!existsSync(path)) return
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const trimmed = line.trim()
    if (trimmed === '' || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq <= 0) continue
    const key = trimmed.slice(0, eq).trim()
    let val = trimmed.slice(eq + 1).trim()
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1)
    }
    if (process.env[key] === undefined) process.env[key] = val
  }
}

function modelId(name) {
  const n = String(name ?? '')
  return n.startsWith('models/') ? n.slice(7) : n
}

function isLiveOnly(id) {
  const m = id.toLowerCase()
  return m.startsWith('gemini-live-') || m.includes('flash-live')
}

function supports(model, method) {
  const methods = model.supportedGenerationMethods
  return Array.isArray(methods) && methods.includes(method)
}

loadDotEnv()

const apiKey = process.env.GEMINI_API_KEY?.trim()
if (!apiKey) {
  console.error('Missing GEMINI_API_KEY. Add it to .env or run:')
  console.error('  GEMINI_API_KEY=your_key npm run list:gemini-models')
  console.error('Or: php api/list-gemini-models.php (uses api/config.local.php)')
  process.exit(1)
}

const all = []
let pageToken = null

do {
  const url = new URL('https://generativelanguage.googleapis.com/v1beta/models')
  url.searchParams.set('key', apiKey)
  url.searchParams.set('pageSize', '100')
  if (pageToken) url.searchParams.set('pageToken', pageToken)

  const res = await fetch(url)
  const data = await res.json()
  if (!res.ok) {
    console.error(data?.error?.message ?? data?.message ?? res.statusText)
    process.exit(1)
  }

  if (Array.isArray(data.models)) all.push(...data.models)
  pageToken = data.nextPageToken || null
} while (pageToken)

const forChat = []
const forEmbed = []
const liveOnly = []

for (const model of all) {
  const id = modelId(model.name)
  if (!id) continue

  const row = {
    id,
    displayName: model.displayName ?? '',
    inputTokenLimit: model.inputTokenLimit ?? 0,
    outputTokenLimit: model.outputTokenLimit ?? 0,
  }

  if (supports(model, 'generateContent')) forChat.push(row)
  if (supports(model, 'embedContent')) forEmbed.push(row)
  if (!supports(model, 'generateContent') && isLiveOnly(id)) liveOnly.push(row)
}

forChat.sort((a, b) => a.id.localeCompare(b.id))
forEmbed.sort((a, b) => a.id.localeCompare(b.id))

const suggestedChat = forChat
  .map((r) => r.id)
  .filter((id) => /flash-lite/i.test(id) && !/preview|exp|image|tts|audio|live/i.test(id))
  .slice(0, 4)

if (asJson) {
  console.log(
    JSON.stringify(
      {
        generateContent: forChat,
        embedContent: forEmbed,
        liveOnlySkippedForChat: liveOnly,
        suggestedGeminiAnswerModels: suggestedChat,
      },
      null,
      2,
    ),
  )
  process.exit(0)
}

console.log(`Gemini models for this API key (${all.length} total)`)
console.log('='.repeat(72))
console.log(`\nUse for AI-dib chat (generateContent) — ${forChat.length} models:\n`)
for (const row of forChat) {
  const label = row.displayName ? ` — ${row.displayName}` : ''
  console.log(`  ${row.id}${label}`)
}

console.log(`\nUse for RAG embeddings (embedContent) — ${forEmbed.length} models:\n`)
for (const row of forEmbed) {
  const label = row.displayName ? ` — ${row.displayName}` : ''
  console.log(`  ${row.id}${label}`)
}

if (liveOnly.length) {
  console.log(`\nLive / streaming only (NOT for ask.php) — ${liveOnly.length} models:\n`)
  for (const row of liveOnly) console.log(`  ${row.id}`)
}

console.log('\nSuggested gemini_answer_models (copy into config.local.php):\n')
console.log("    'gemini_answer_models' => [")
for (const id of suggestedChat) console.log(`        '${id}',`)
if (!suggestedChat.length) {
  console.log("        'gemini-2.5-flash-lite', // pick ids from the generateContent list above")
}
console.log('    ],\n')
console.log('Tip: php api/list-gemini-models.php (uses api/config.local.php)')
