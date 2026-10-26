import crystalRaw from '@/data/personality/crystal-handbook.txt?raw'
import istpRaw from '@/data/personality/istp-weapons-specialist.txt?raw'

export type TextChunk = { id: string; title: string; body: string }

export type HandbookTocItem = { id: string; label: string }
export type HandbookTocGroup = { label: string; items: HandbookTocItem[] }

const CRYSTAL_TOC_LABELS = [
    'Personality',
    'Assessments',
    'Natural style',
    'Decisions',
    'Energy & stress',
    'Relationships',
    'Career',
    'Personal growth',
] as const

export function buildHandbookToc(
    crystal: TextChunk[] = parseCrystalHandbook(),
    istp: TextChunk[] = parseIstpHandbook()
): HandbookTocGroup[] {
    return [
        {
            label: 'Crystal handbook',
            items: crystal.map((ch, idx) => ({
                id: ch.id,
                label: CRYSTAL_TOC_LABELS[idx] ?? `Chapter ${idx + 1}`,
            })),
        },
        {
            label: 'ISTP guide',
            items: istp.map((ch, idx) => ({
                id: ch.id,
                label: istp.length > 1 ? `Part ${idx + 1}` : 'Full export',
            })),
        },
    ]
}

const CRYSTAL_CHAPTER_LABELS = [
    'Ch.01 — Personality',
    'Ch.02 — Assessments',
    'Ch.03 — Natural style',
    'Ch.04 — Decisions',
    'Ch.05 — Energy & stress',
    'Ch.06 — Relationships',
    'Ch.07 — Career',
    'Ch.08 — Personal growth',
] as const

/** Split Crystal export on CHAPTER markers; first chunk is front matter (discarded for accordions). */
export function parseCrystalHandbook(raw: string = crystalRaw): TextChunk[] {
    const parts = raw.split(/\fCHAPTER\s*\d+\s*\n+/i).slice(1)
    return parts.map((body, idx) => ({
        id: `crystal-${idx + 1}`,
        title: `Crystal handbook — ${CRYSTAL_CHAPTER_LABELS[idx] ?? `Chapter ${idx + 1}`}`,
        body: body.trim(),
    }))
}

const PAGES_PER_ISTP_CHUNK = 9

/** Group ISTP text by form-feed “pages” into a manageable number of accordions. */
export function parseIstpHandbook(raw: string = istpRaw): TextChunk[] {
    const pages = raw.split(/\f/).map((p) => p.trim()).filter(Boolean)
    const out: TextChunk[] = []
    for (let i = 0; i < pages.length; i += PAGES_PER_ISTP_CHUNK) {
        const slice = pages.slice(i, i + PAGES_PER_ISTP_CHUNK)
        const start = i + 1
        const end = Math.min(i + PAGES_PER_ISTP_CHUNK, pages.length)
        out.push({
            id: `istp-${i}`,
            title: `ISTP cognitive guide — source pages ${start}–${end}`,
            body: slice.join('\n\n—\n\n'),
        })
    }
    return out
}
