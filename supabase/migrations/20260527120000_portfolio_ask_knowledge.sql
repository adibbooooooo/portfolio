-- Portfolio "Ask Adib" (see docs/superpowers/specs/2026-05-27-ask-adib-design.md)
CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA extensions;

CREATE TABLE IF NOT EXISTS public.portfolio_knowledge_chunks (
  id text PRIMARY KEY,
  topic text NOT NULL,
  content text NOT NULL,
  embedding extensions.vector(768),
  fts tsvector GENERATED ALWAYS AS (to_tsvector('english', coalesce(content, ''))) STORED,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS portfolio_knowledge_chunks_fts_idx
  ON public.portfolio_knowledge_chunks USING gin (fts);

CREATE INDEX IF NOT EXISTS portfolio_knowledge_chunks_embedding_idx
  ON public.portfolio_knowledge_chunks
  USING hnsw (embedding extensions.vector_cosine_ops);

CREATE TABLE IF NOT EXISTS public.portfolio_ask_rate_limits (
  bucket_key text PRIMARY KEY,
  window_start timestamptz NOT NULL,
  request_count integer NOT NULL DEFAULT 0
);

ALTER TABLE public.portfolio_knowledge_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_ask_rate_limits ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.match_portfolio_knowledge(
  query_embedding extensions.vector(768),
  match_count integer DEFAULT 6
)
RETURNS TABLE (
  id text,
  topic text,
  content text,
  similarity double precision
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, extensions
AS $$
  SELECT
    c.id,
    c.topic,
    c.content,
    1 - (c.embedding OPERATOR(extensions.<=>) query_embedding) AS similarity
  FROM public.portfolio_knowledge_chunks c
  WHERE c.embedding IS NOT NULL
  ORDER BY c.embedding OPERATOR(extensions.<=>) query_embedding
  LIMIT match_count;
$$;

CREATE OR REPLACE FUNCTION public.search_portfolio_knowledge(
  search_query text,
  match_count integer DEFAULT 6
)
RETURNS TABLE (
  id text,
  topic text,
  content text,
  rank double precision
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    c.id,
    c.topic,
    c.content,
    ts_rank(c.fts, websearch_to_tsquery('english', search_query)) AS rank
  FROM public.portfolio_knowledge_chunks c
  WHERE c.fts @@ websearch_to_tsquery('english', search_query)
  ORDER BY rank DESC
  LIMIT match_count;
$$;

REVOKE ALL ON FUNCTION public.match_portfolio_knowledge(extensions.vector, integer) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.search_portfolio_knowledge(text, integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.match_portfolio_knowledge(extensions.vector, integer) TO service_role;
GRANT EXECUTE ON FUNCTION public.search_portfolio_knowledge(text, integer) TO service_role;
