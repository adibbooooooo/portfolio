import {
    virtuosoFigures,
    virtuosoLaneDisclaimer,
} from '@/data/personalityVirtuosoLane'
import type { KnowledgeChunk } from '@/lib/knowledge/types'

/** Why Adib is a strong match for SMB / founding-engineer style roles (first person). */
export const foundingEngineerFitChunk: KnowledgeChunk = {
    id: 'profile-founding-engineer-fit',
    topic: 'personality',
    content: [
        'I am built for small-to-medium companies, founding-engineer roles, and being an early technical hire (employee #1–5), not big-company ticket queues.',
        'At Fortifi I was the sole developer continuing the product after the founders: de-facto CTO and the person who turned ideas into shipped software. I scaled us from a three-person founding team into engineering, design, and marketing, led five engineers, and owned Laravel/Vue apps, Telegram Mini Apps, Web3 platforms, Stripe, NFT/SBT automation, and legacy fixes end to end.',
        'That is the same muscle as a first hire or founding engineer: unclear specs, tight timelines, you are the stack, the architecture, and the delivery.',
        'I work best when I own outcomes, decide fast, and ship without waiting for a committee. ISTP-T Virtuoso / operator-builder: hands-on, calm when production breaks, direct communication, high bar on what actually goes live.',
        'I left Infomina on purpose: I want SMB and founding-team environments where one strong engineer moves the company, not layers of process.',
        'For more on how I work, see my personality page (Virtuoso lane + summaries) or book a call.',
    ].join(' '),
}

export function buildVirtuosoOverviewChunk(): KnowledgeChunk {
    const names = virtuosoFigures.map((f) => `${f.name} (${f.lane})`).join('; ')
    return {
        id: 'virtuoso-lane-overview',
        topic: 'personality',
        content: [
            'On my personality page I use a "Virtuoso lane" of figures often grouped with ISTP / Virtuoso in community charts (fiction and public figures).',
            `Figures: ${names}.`,
            virtuosoLaneDisclaimer,
            'Each figure has a short note on why the comparison resonates with how I work. Ask about a specific name if curious.',
        ].join(' '),
    }
}

export function buildVirtuosoFigureChunks(): KnowledgeChunk[] {
    return virtuosoFigures.map((f) => ({
        id: `virtuoso-${f.id}`,
        topic: 'personality' as const,
        content: [
            `Virtuoso figure: ${f.name} (${f.lane}).`,
            f.note,
            `Why charts type them ISTP / Virtuoso: ${f.whyTyped}`,
            `Why this resonates with how I work: ${f.whyLikeMe}`,
            virtuosoLaneDisclaimer,
        ].join(' '),
    }))
}
