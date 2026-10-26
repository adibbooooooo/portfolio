/**
 * Upserts knowledge/chunks.json into Supabase with optional Gemini embeddings.
 *
 * Required env:
 *   SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *
 * Optional:
 *   GEMINI_API_KEY — if set, writes 768-dim embeddings for vector search
 *   GEMINI_EMBED_MODEL — default gemini-embedding-001 (see ai.google.dev/gemini-api/docs/embeddings)
 */
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const chunks = JSON.parse(readFileSync(join(root, 'knowledge/chunks.json'), 'utf8'))

const supabaseUrl = process.env.SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const geminiKey = process.env.GEMINI_API_KEY
const embedModel = process.env.GEMINI_EMBED_MODEL || 'gemini-embedding-001'
const embedDims = 768

if (!supabaseUrl || !serviceKey) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
    process.exit(1)
}

const headers = {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
    'Content-Type': 'application/json',
    Prefer: 'resolution=merge-duplicates',
}

async function embed(text) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${embedModel}:embedContent?key=${geminiKey}`
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: `models/${embedModel}`,
            content: { parts: [{ text: text.slice(0, 8000) }] },
            taskType: 'RETRIEVAL_DOCUMENT',
            outputDimensionality: embedDims,
        }),
    })
    if (!res.ok) throw new Error(`Embed failed: ${res.status} ${await res.text()}`)
    const json = await res.json()
    const values = json.embedding?.values
    if (!values?.length) throw new Error('No embedding values')
    return values
}

let ok = 0
for (const chunk of chunks) {
    const row = {
        id: chunk.id,
        topic: chunk.topic,
        content: chunk.content,
        updated_at: new Date().toISOString(),
    }
    if (geminiKey) {
        try {
            row.embedding = await embed(chunk.content)
        } catch (e) {
            console.warn(`Embed skip ${chunk.id}:`, e.message)
        }
    }
    const res = await fetch(
        `${supabaseUrl}/rest/v1/portfolio_knowledge_chunks?on_conflict=id`,
        {
            method: 'POST',
            headers: { ...headers, Prefer: 'resolution=merge-duplicates' },
            body: JSON.stringify(row),
        },
    )
    if (!res.ok) {
        console.error(chunk.id, await res.text())
        process.exitCode = 1
    } else {
        ok++
        if (ok % 10 === 0) console.log(`Upserted ${ok}/${chunks.length}`)
    }
}
console.log(`Done. Upserted ${ok} chunks.${geminiKey ? '' : ' (text-only; set GEMINI_API_KEY for vectors)'}`)
