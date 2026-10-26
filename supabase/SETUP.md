# Ask Adib — backend setup

## Architecture (hybrid)

| Step | Provider | Where the key lives |
|------|----------|---------------------|
| Rate limit + RAG DB | Supabase | `api/config.local.php` → `supabase_service_role_key` |
| **Gate / moderator** | **Ollama Cloud** | `api/config.local.php` → `ollama_api_key` |
| Embeddings + answer | Gemini | `api/config.local.php` → `gemini_api_key` |

The browser only calls **`/api/ask.php`** on your domain. No AI keys in Vue or `VITE_*` env (unlike pr-creator’s BYOK flow).

## Server config (required)

```bash
cp api/config.example.php api/config.local.php
# Edit api/config.local.php on the server (never commit it)
```

| Key | Get it from |
|-----|-------------|
| `ollama_api_key` | [ollama.com/settings/keys](https://ollama.com/settings/keys) |
| `gemini_api_key` | [Google AI Studio](https://aistudio.google.com/apikey) |
| `supabase_service_role_key` | Supabase Dashboard → Settings → API |

Deploy `dist/api/` with your build (`npm run build` copies `api/*` into `dist/api/`).

## Local development

1. `cp api/config.example.php api/config.local.php` and fill keys  
2. `npm run build` (so `dist/api/ask.php` exists)  
3. Point MAMP at `dist/` (or symlink), e.g. `http://localhost:8888/portfolio/dist/`  
4. `npm run dev` — Vite proxies `/api` → `VITE_DEV_API_PROXY` (default `http://127.0.0.1:8888/portfolio/dist`)

Test:

```bash
curl -s -X POST http://localhost:8888/portfolio/dist/api/ask.php \
  -H 'Content-Type: application/json' \
  -d '{"question":"What is your experience with Laravel?","sessionId":"test"}'
```

## Knowledge index

```bash
npm run build:knowledge
GEMINI_API_KEY=... SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npm run ingest:knowledge
```

## Legacy: Supabase Edge Function

`portfolio-ask` edge function is optional if you use PHP. The app now defaults to `/api/ask.php`.
