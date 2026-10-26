import { peopleWordMessages } from '@/data/peopleWords'
import type { KnowledgeChunk } from '@/lib/knowledge/types'

export function buildPeopleWordsChunks(): KnowledgeChunk[] {
    const out: KnowledgeChunk[] = []

    out.push({
        id: 'people-words-overview',
        topic: 'profile',
        content: [
            "People's Word on my portfolio is feedback from clients and teammates (home page section).",
            'Use these quotes as social proof when discussing fit, leadership, reliability, or founding-engineer style roles.',
            'Do not invent quotes; only paraphrase or shorten what is listed here.',
        ].join(' '),
    })

    const founding = peopleWordMessages.filter((m) => m.foundingEngineerHighlight)
    if (founding.length > 0) {
        const lines = founding.map(
            (m) => `${m.name} (${m.role}${m.project ? `, ${m.project}` : ''}): "${m.text}"`,
        )
        out.push({
            id: 'people-words-founding-engineer',
            topic: 'profile',
            content: [
                "Social proof for founding-engineer, first-hire, and SMB roles (People's Word):",
                ...lines,
            ].join('\n'),
        })
    }

    for (const m of peopleWordMessages) {
        out.push({
            id: `people-word-${m.id}`,
            topic: 'profile',
            content: `People's Word from ${m.name} (${m.role}, ${m.ts})${m.project ? `, project: ${m.project}` : ''}: "${m.text}"`,
        })
    }

    return out
}
