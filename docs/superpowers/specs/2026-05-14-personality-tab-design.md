# Personality tab — design spec

**Date:** 2026-05-14  
**Status:** Approved for implementation planning  
**Scope:** Add a site-level tab before Work Experience, plus a dedicated Personality page with two in-page modes (Approach 2).

## Goals

1. **Stakeholder lens:** Help visitors quickly answer how Adib fits a team, drives impact and productivity, contributes to product or company growth, and what collaboration feels like.
2. **Evidence lens:** Provide nearly full content from the Crystal Personality Handbook and the ISTP cognitive guide (long-form), without turning the first screen into a wall of text.
3. **Consistency:** Match existing portfolio patterns (`EditorScaffold`, typography, Skill Demos segmented tabs).

## Navigation and routing

| Layer | Label (UI) | Path / behavior |
|-------|----------------|-----------------|
| Site top tab (desktop + mobile sheet) | `my.personality` | `/personality` |
| Tab order | `my.info` → `skill.demo` → **`my.personality`** → `work.experience` | Router `meta.order` updated accordingly |

## In-page structure (Approach 2)

Single route `/personality` with **segmented in-page tabs** (same visual pattern as `WorkPage.vue` demo category tabs: bordered pill group, emerald active state).

| Panel | Tab label (code-style) | Purpose |
|-------|-------------------------|---------|
| A | `my.fit` | Comprehensive stakeholder content: team fit, impact, productivity, growth, working style. Curated copy derived primarily from Crystal; ISTP only where it adds cognition without duplicating short MBTI blurbs. |
| B | `my.handbook` | Detailed export: Crystal chapters in handbook order, then ISTP cognitive material. **Collapsible sections** (accordion or `<details>`) per chapter / major part so the panel stays navigable. |

**URL sync (recommended):** Query string `?view=fit` and `?view=handbook` (or equivalent) synced with the active in-page tab for shareable links and predictable back/forward. Default when missing: `fit`.

## Content mapping (`my.fit`)

Structured subsections (headings + short paragraphs / bullets), aligned to hiring questions:

- **Team fit:** work style, collaboration preference, role on teams; thrive vs struggle environments (Crystal career + natural style).
- **Impact and results:** strengths at best, behavior, values (Crystal).
- **Productivity:** decision process, energy charged/drained (Crystal).
- **Growth:** career-fit themes as “what I optimize for” (execution, product, technical leadership) — narrative, not a job-title checklist (Crystal career).
- **Working with me:** communication, feedback and meetings, blind spots (Crystal — honest counterbalance).

## Content mapping (`my.handbook`)

- **Crystal:** Sections follow handbook order: summary, accuracy/traits, assessments (per framework), natural style, decisions, energy and stress, relationships, career, personal growth. Sub-collapsibles where a chapter is large (e.g. per assessment).
- **ISTP PDF:** One major block or nested collapsibles; full cognitive narrative; avoid repeating the short 16Personalities ISTP snippet if it already appears under assessments.

## Visual and UX notes

- **Hero:** Page title + one-line thesis (Crystal-informed, original wording).
- **Accessibility:** `role="tablist"` / `tab` / `tabpanel`, `aria-selected`, keyboard operable controls; logical heading hierarchy (`h1` once).
- **Mobile:** Segmented control wraps or goes full width under the hero; both panels scroll within `EditorScaffold` as on other pages.
- **Attribution:** Footer note in `my.handbook` (or page footer): content synthesized from personal Crystal handbook and ISTP cognitive material; frameworks credited to their respective sources.

## Implementation shape (for planning — not executed in this doc)

- New `PersonalityPage.vue` (or equivalent) using `EditorScaffold`.
- Content in a dedicated module (e.g. `personalityContent.ts`) split into `fitSections` and `handbookChapters` to avoid an oversized SFC.
- Router + `MainLayout.vue`: register route, desktop tabs, mobile sheet, tab indicator `registerTab` map keys.

## Out of scope

- Peer review uploads or live Crystal API integration.
- PDF download hosting unless added later as a separate task.

## Testing (acceptance)

- `/personality` loads; `my.personality` appears before `work.experience` in desktop and mobile nav.
- In-page tabs switch panels; URL query (if implemented) stays in sync.
- Keyboard navigation on tabs and collapsibles; no duplicate `h1`.
