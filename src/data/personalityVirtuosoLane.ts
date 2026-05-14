/**
 * “Virtuoso lane” — names often grouped with ISTP / Virtuoso in community typing.
 * Mix of fiction and public-life figures (spec choice C). Not verified psychology.
 */

export type VirtuosoFigure = {
    id: string
    initials: string
    name: string
    /** fiction = character / work; public = real person (still speculative typing) */
    lane: 'fiction' | 'public'
    note: string
}

export const virtuosoFigures: VirtuosoFigure[] = [
    {
        id: 'batman',
        initials: 'BW',
        name: 'Bruce Wayne / Batman',
        lane: 'fiction',
        note: 'Tactical gearhead, prefers evidence and motion over speeches.',
    },
    {
        id: 'arya',
        initials: 'AS',
        name: 'Arya Stark',
        lane: 'fiction',
        note: 'Self-directed skill stack; learns by doing under pressure.',
    },
    {
        id: 'snake',
        initials: 'SS',
        name: 'Solid Snake',
        lane: 'fiction',
        note: 'Stoic operator; improvises with tools on hand.',
    },
    {
        id: 'katniss',
        initials: 'KE',
        name: 'Katniss Everdeen',
        lane: 'fiction',
        note: 'Pragmatic survival instinct; minimal words, maximal execution.',
    },
    {
        id: 'eastwood',
        initials: 'CE',
        name: 'Clint Eastwood',
        lane: 'public',
        note: 'On-screen persona: sparse dialogue, competence-first presence.',
    },
    {
        id: 'musashi',
        initials: 'MM',
        name: 'Miyamoto Musashi',
        lane: 'public',
        note: 'Duel history aside: solo discipline, adaptation, craft obsession.',
    },
    {
        id: 'mcqueen',
        initials: 'SM',
        name: 'Steve McQueen',
        lane: 'public',
        note: 'Cool-headed risk taker; physical intelligence reads “hands-on”.',
    },
    {
        id: 'earhart',
        initials: 'AE',
        name: 'Amelia Earhart',
        lane: 'public',
        note: 'Systems + machinery comfort; independent path over convention.',
    },
]

export const virtuosoLaneDisclaimer =
    'Community MBTI charts are entertainment, not science. These names are often grouped with ISTP / Virtuoso online — not claims about real psychology, not endorsed by 16Personalities, and not verified for any living person.'
