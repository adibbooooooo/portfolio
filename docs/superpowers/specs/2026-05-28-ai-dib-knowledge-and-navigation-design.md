# AI-dib Knowledge, RAG & Navigation — Design Spec

**Date:** 2026-05-28  
**Status:** Approved for planning (awaiting implementation plan)  
**Supersedes / extends:** `2026-05-27-ask-adib-design.md`

## Goals

1. **Accurate answers** about Adib’s work, especially experience (“What did you do at Fortifi?”) in **first person**, direct tone, with **paragraph breaks** when long.
2. **Separate content types:** shipped **projects**, **case studies** (problem-solving stories), and **skill demos** (not conflated in nav or RAG).
3. **Sustainable API usage:** reduce Gemini calls per visitor; Ollama for small talk; optional billing on Google AI Studio.
4. **Maintainable knowledge:** you edit structured source files → `build:knowledge` → `ingest:knowledge`; no hand-editing Supabase rows.

---

## Decisions (locked)

| Topic | Decision |
|--------|----------|
| Voice | **First person** (“At Fortifi, I was…”) as AI-dib |
| Experience depth | **Narrative paragraphs** per role (interview-style), not one-line summaries |
| New RAG topic | **`cases`** — real problem-solving write-ups |
| Skill demos | **Not in RAG**; stay under **Demos** tab only |
| Navigation | **`work.showcase`** at `/work` with tabs **Projects \| Cases \| Demos** (`/demo` redirects) |
| AI routing | **Hybrid:** Ollama gate + small talk; **Gemini** for grounded factual answers |
| Retrieval | **FTS first**; Gemini **embed on query only if FTS is weak**; Gemini **embed at ingest** for vectors |
| Answer model | `gemini-2.5-flash-lite` (configurable); ingest embed `gemini-embedding-001` @ 768 dims |

---

## Google AI billing — how much to add?

You do **not** need a large upfront “top-up” for a personal portfolio.

### How billing works

- [Google AI Studio](https://aistudio.google.com/) → link a **Cloud Billing account** → project moves to **Tier 1** (higher RPM/RPD).
- Billing is **pay-as-you-go** after free quotas; there is no required minimum deposit like a prepaid wallet.
- Set a **budget alert** in Google Cloud Console (e.g. **$10/month**) and an optional **hard cap** if you want peace of mind.

### Expected cost (portfolio traffic)

Assumptions: ~**200–800 chat messages/month**, hybrid routing, ~**1 Gemini generate** per factual message, embed on query only ~30% of the time, **24 asks/hour** site rate limit per visitor.

| Item | Frequency | Rough cost |
|------|-----------|------------|
| Answer (`gemini-2.5-flash-lite`) | per factual reply | fractions of a cent |
| Query embed (`gemini-embedding-001`) | optional, not every message | very low |
| Ingest embed | when you run `ingest:knowledge` (~150 chunks) | **< $0.05** per full re-ingest |
| Ollama Cloud gate + small talk | per message | per Ollama pricing (separate) |

**Practical recommendation**

| Action | Amount |
|--------|--------|
| Enable billing | **$0** upfront |
| Budget alert | **$10/month** (email if exceeded) |
| Expected spend | **$1–5/month** typical; **$10/month** is a safe ceiling for a busy month |
| Re-ingest | Run only when you change knowledge files (not on every deploy) |

**Not unlimited:** “Gemini 3 Flash **Live**” unlimited rows in AI Studio refer to the **Live API**, not `generateContent` used by `ask.php`. Always check **RPM / RPD** for the exact model ID in config.

---

## End-to-end: what is stored in RAG

RAG storage = rows in Supabase `portfolio_knowledge_chunks`:

- `id` — stable key (e.g. `exp-fortifi`)
- `topic` — category for filtering and future UI
- `content` — plain text passed to the model (and embedded at ingest)
- `embedding` — 768-dim vector (`gemini-embedding-001`), optional if ingest runs without `GEMINI_API_KEY` (FTS-only fallback)

### Topics (schema change)

Extend `KnowledgeChunk.topic`:

```ts
'profile' | 'experience' | 'projects' | 'cases' | 'personality' | 'contact'
```

---

### 1. `profile` — who you are (short)

**Purpose:** Identity, positioning, hiring Q&A that isn’t tied to one employer.

| Chunk id | Source | What’s stored |
|----------|--------|----------------|
| `profile-core` | `profileMeta` + site bio | Name, title, location, archetype, tagline, languages, years of experience |
| `ai-dib-meta` | new copy | What AI-dib is allowed to do; contact pointers |
| `summary-*` | `personalitySummary.ts` → all `summaryCategories` items | One chunk per Q&A: “How do I fit on a team?”, “How should you communicate with me?”, etc. (~15 chunks) |

**Not stored here:** Long PDF text; duplicate experience bullets.

---

### 2. `experience` — what you did at each job (core upgrade)

**Purpose:** Answer “What did you do at Fortifi / ABSS / …?” with straight, full explanations.

**Source file (new):** `src/lib/knowledge/experienceNarratives.ts`  
**Written by:** You (Adib), using `ExperiencePage.vue` bullets as a draft outline.

**One chunk per role** (preferred) or **two chunks** if a role exceeds ~1,800 characters:

| Chunk id | Company | Period (in text) |
|----------|---------|------------------|
| `exp-infomina` | Infomina Bhd | Feb 2026 — May 2026 |
| `exp-fortifi` | Fortifi Sdn Bhd | May 2024 — Oct 2025 |
| `exp-etctech` | Etctech Global | Aug 2023 — Mar 2024 |
| `exp-abss` | ABSS | Aug 2022 — Jul 2023 |
| `exp-bestweb-lead` | BestWeb (Lead) | Dec 2021 — Jul 2022 |
| `exp-bestweb-dev` | BestWeb (Dev) | Feb 2020 — Aug 2021 |
| `exp-zeno` | Zeno Group | Sep — Nov 2021 |
| `exp-education` | Education / internship | optional single chunk |

**Content shape (example Fortifi — you will replace with final copy):**

```text
At Fortifi Sdn Bhd (May 2024 — Oct 2025, Kuala Lumpur), I acted as de-facto CTO and was the primary engineer driving product delivery.

I scaled the team from three founders into engineering, design, and marketing. I led five engineers, set coding standards, PR reviews, and deployment practices.

On the product side, I shipped Laravel + Vue applications, a Telegram Mini App (auth, payments, real-time flows), Web3 livestream and social platforms, NFT/SBT automation, Duffel flight booking inside Telegram, and Stripe payments. I also re-engineered legacy systems for stability and uptime.

Stack highlights: Laravel, Vue.js, MySQL, AWS, Web3, Telegram Mini Apps, Stripe.
```

**Rules**

- First person, facts only from your approved narrative (no model invention).
- Use blank lines between paragraphs when > ~3 sentences.
- Include **role title**, **dates**, **location** once at the top.
- **Deprecate** `experienceSummaries.ts` one-liners once narratives exist.

**Optional later:** auto-generate draft narratives from `ExperiencePage` `bullets` + `outcomes` in a script; you always edit before ingest.

---

### 3. `projects` — shipped products you want recruiters to see

**Purpose:** “What projects stand out?”, “Tell me about PR Creator”, live URLs.

**Source:** `src/data/featuredWork.ts` with a new flag:

```ts
rag?: boolean  // default false; you set true for indexable projects
```

**Initial recommendation (you confirm in implementation):**

| Project | `rag` | Notes |
|---------|-------|--------|
| Pull Request Creator | yes | Flagship |
| Habo GenCards | yes | |
| Wedding (haboforever) | optional | personal but shows craft |
| $HABO / gym | optional | include only if you want them in recruiter answers |

**Per chunk:** title, subtitle, pitch, URL, your role in one sentence if not in pitch.

**Not in RAG:** WorkPage demo cards (Laravel explorer, Konva, etc.).

---

### 4. `cases` — problem-solving stories (new)

**Purpose:** “How did you solve X?” — not a product landing page, not a UI demo.

**Source file (new):** `src/lib/knowledge/caseStudies.ts`

| Chunk id | URL | Status |
|----------|-----|--------|
| `case-nft` | case-nft.adibomar.com | **v1 — you provide narrative** |
| `case-*` | future | add when ready |

**Suggested fields per case:**

- **Title** — e.g. “NFT platform reliability / mint pipeline”
- **Problem** — what was broken or needed
- **What I did** — your actions (first person)
- **Outcome** — measurable or clear result
- **Stack** — keywords for retrieval
- **Link** — case study URL

**Not stored:** Full case study page HTML; only your curated text.

---

### 5. `personality` — ISTP / Crystal (trimmed)

**Purpose:** Team fit, communication style, strengths, work environment.

**Sources**

| Include | Exclude / trim |
|---------|----------------|
| `summary-*` chunks under `profile` (already) | Entire handbook dumped verbatim |
| **Optional:** 5–10 handbook sections you pick by id | 60+ page PDF chunks that drown retrieval |

**Recommendation:** Keep personality Q&A in `profile` summaries; add **at most** ~8 handbook excerpts (e.g. work style, feedback, ISTP strengths) as separate `personality` chunks with clear titles. Remove bulk `parseCrystalHandbook()` / `parseIstpHandbook()` full splits from default build unless you opt in.

---

### 6. `contact` — hire me

**Single chunk:** email, phone, LinkedIn, Cal.com, “open for collaboration”.

---

## What is NOT in RAG

| Content | Where it lives |
|---------|----------------|
| Skill demos (WorkPage) | **Demos** tab only |
| Raw PDFs | Personality page downloads only |
| Chat history | Browser session only (last 10 turns sent to API, not stored in DB) |
| Visitor data | Only rate-limit bucket key in `portfolio_ask_rate_limits` |

---

## Request pipeline (target)

```
POST /api/ask.php
  → honeypot, length, rate limit (Supabase)
  → if pure small talk → Ollama chat (persona, no RAG) → return
  → if clearly off-topic → refusal
  → else:
      → Supabase FTS (search_portfolio_knowledge)
      → if weak results → Gemini embed query → vector match
      → build context from top 6 chunks
      → Gemini generate (flash-lite) with persona + history
```

**Ollama** also keeps the **gate** for ambiguous messages (with portfolio override heuristics).

**Gemini calls per factual message (target):** 1 generate + 0–1 embed (not 2 every time).

---

## Navigation (Option A)

| Before | After |
|--------|--------|
| Tab `skill.demo` → `/demo` | Tab **`work.showcase`** → **`/work`** |
| `/demo` | Redirects to `/work?section=demos` (preserves `?tool=` deep links) |
| Projects only on home | **Projects** tab — shipped + personal sites |
| — | **Cases** tab — `case-nft.adibomar.com` (placeholder copy until full case write-up) |
| Demos mixed in | **Demos** tab — interactive skill demos only |

Home `featuredWork` can stay; work area becomes the canonical browse experience.

---

## Build & ingest workflow

```bash
# 1. Edit source files (narratives, cases, featuredWork rag flags)
# 2. Build chunk JSON
npm run build:knowledge

# 3. Upload to Supabase (embeddings at ingest only)
GEMINI_API_KEY=... SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npm run ingest:knowledge
```

**When to re-ingest:** After changing any knowledge source file. **Not** required for PHP/UI-only deploys.

**Chunk count estimate:** ~40–80 chunks (down from ~106 if large PDF splits removed).

---

## Success criteria

1. “What did you do at Fortifi?” returns a **multi-sentence first-person** answer grounded in `exp-fortifi` narrative.
2. “Would I fit a small team?” uses **profile** summaries, not generic filler.
3. Small talk (“Hi”, “Thanks”) uses **Ollama** without Gemini embed/generate.
4. Under normal traffic, **no embedding RPM warnings** on free/tier-1 dashboard.
5. Demos are discoverable on site but **never cited** as employment projects unless you add them to `projects`/`cases`.

---

## Implementation phases (for planning doc)

1. **Knowledge schema + files** — `experienceNarratives`, `caseStudies`, `cases` topic, trim personality ingest.
2. **Ask API** — FTS-first retrieval, Ollama small-talk path, flash-lite default.
3. **Navigation** — tabbed work page (Projects / Cases / Demos).
4. **Content** — you fill Fortifi narrative + NFT case copy; re-ingest.

---

## Open content tasks (owner: Adib)

Before ingest, draft in repo:

- [ ] `experienceNarratives.ts` — all roles (Fortifi priority)
- [ ] `caseStudies.ts` — NFT case
- [ ] `featuredWork.ts` — set `rag: true` on 2–3 projects
- [ ] Confirm which personality handbook excerpts (if any) beyond summaries

---

## References

- Chunk builder: `src/lib/knowledge/buildChunks.ts`
- Current thin experience: `src/lib/knowledge/experienceSummaries.ts`
- Full role data (UI only today): `src/pages/ExperiencePage.vue`
- Prior pipeline: `docs/superpowers/specs/2026-05-27-ask-adib-design.md`
