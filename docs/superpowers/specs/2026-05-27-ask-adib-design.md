# Ask Adib — Design Spec

**Date:** 2026-05-27  
**Status:** Implemented

## Goal

Public portfolio visitors can ask questions about Adib Omar (work, skills, experience, projects, personality) via a grounded chat widget, with cost control and abuse protection.

## Architecture (updated)

- **Frontend:** Vue 3 → `POST /api/ask.php` (same origin)
- **PHP (cPanel/MAMP):** orchestration; secrets in `api/config.local.php` (not in the browser)
- **Ollama Cloud:** gate / moderator (`ollama_gate_model`, default `gemma3:4b`)
- **Gemini:** embeddings + grounded answer
- **Supabase:** `portfolio_*` tables — rate limits + RAG only

## Request pipeline

1. CORS + honeypot + length rules (PHP)
2. Rate limit via Supabase table
3. **Ollama Cloud** relevance gate (JSON allow/deny)
4. Gemini embed → vector search → FTS fallback
5. **Gemini Flash** answer from top 6 chunks

## Security

- `GEMINI_API_KEY` and service role only on Supabase secrets / local ingest env  
- RLS enabled on portfolio tables; no public policies (service role in edge function only)  
- Anon key in frontend for JWT to edge function only  

## Ops

```bash
npm run build:knowledge
GEMINI_API_KEY=... SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npm run ingest:knowledge
```

Set `GEMINI_API_KEY` in Supabase Dashboard → Edge Functions → Secrets.

## Future

- Dedicated Supabase project when free-tier slot available  
- SSE streaming answers  
- Ollama fallback for generation
