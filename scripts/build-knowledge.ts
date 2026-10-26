/**
 * Builds knowledge/chunks.json from portfolio source data.
 * Run: npm run build:knowledge
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildKnowledgeChunks } from '../src/lib/knowledge/buildChunks.ts'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'knowledge')
const outFile = join(outDir, 'chunks.json')

const chunks = buildKnowledgeChunks()
mkdirSync(outDir, { recursive: true })
writeFileSync(outFile, JSON.stringify(chunks, null, 2), 'utf8')
console.log(`Wrote ${chunks.length} chunks to ${outFile}`)
