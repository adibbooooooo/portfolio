/** Crystal-style preview content for `my.info` — full detail on `/personality`. */

export type PersonalityTraitPill = {
    label: string
    /** Pre-filled Google search, e.g. "benefit of having a confident person" */
    searchQuery: string
}

export const personalityTraitPills: PersonalityTraitPill[] = [
    { label: 'Assertive', searchQuery: 'benefit of having an assertive person' },
    { label: 'Confident', searchQuery: 'benefit of having a confident person' },
    { label: 'Hard-working', searchQuery: 'benefit of having a hard working person' },
]

export function traitPillGoogleUrl(pill: PersonalityTraitPill) {
    return `https://www.google.com/search?q=${encodeURIComponent(pill.searchQuery)}`
}

export const personalityQuickSummary = {
    archetypeLabel: 'Personality archetype',
    archetype: 'Relentless Catalyst',
} as const

export type PersonalityAssessmentRow = {
    id: string
    label: string
    value: string
    href: string
    /** Tailwind text + icon bg accents */
    accent: 'rose' | 'sky' | 'violet' | 'amber' | 'blue' | 'red'
    icon: string
}

export const personalityAssessmentRows: PersonalityAssessmentRow[] = [
    {
        id: 'disc',
        label: 'DISC',
        value: 'D · Captain',
        href: 'https://ai.crystalknows.com/p/user_1778731390636_k2w2nv?shared=disc',
        accent: 'rose',
        icon: 'pi pi-chart-pie',
    },
    {
        id: 'big-five',
        label: 'Big Five',
        value: '↑ Emotional Stability · ↓ Openness · ↑ Conscientiousness · ↓ Agreeableness',
        href: 'https://ai.crystalknows.com/p/user_1778731390636_k2w2nv?shared=big-five',
        accent: 'sky',
        icon: 'pi pi-chart-bar',
    },
    {
        id: 'enneagram',
        label: 'Enneagram',
        value: 'Type 8w7 · The Challenger',
        href: 'https://ai.crystalknows.com/p/user_1778731390636_k2w2nv?shared=enneagram',
        accent: 'violet',
        icon: 'pi pi-share-alt',
    },
    {
        id: '16p',
        label: '16 Personalities',
        value: 'ISTP · Virtuoso',
        href: 'https://ai.crystalknows.com/p/user_1778731390636_k2w2nv?shared=mbti',
        accent: 'amber',
        icon: 'pi pi-th-large',
    },
    {
        id: 'strengths',
        label: 'Strengths',
        value: 'Creativity · Leadership · Honesty',
        href: 'https://ai.crystalknows.com/p/user_1778731390636_k2w2nv?shared=strengths',
        accent: 'blue',
        icon: 'pi pi-star',
    },
    {
        id: 'values',
        label: 'Core Values',
        value: 'Achievement · Impact · Leadership',
        href: 'https://ai.crystalknows.com/p/user_1778731390636_k2w2nv?shared=values',
        accent: 'red',
        icon: 'pi pi-bullseye',
    },
]

/** Deep dive signals: supplementary assessments (MBTI is in the profile hero). */
export const personalityDeepAssessmentRows = personalityAssessmentRows.filter((row) => row.id !== '16p')
