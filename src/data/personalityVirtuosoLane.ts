/**
 * “Virtuoso lane” — names often grouped with ISTP / Virtuoso in community typing.
 * Mix of fiction and public-life figures (spec choice C). Not verified psychology.
 */

export type VirtuosoFigure = {
    id: string
    initials: string
    name: string
    /** Optional local image under `public/`; falls back to generated avatar */
    avatarSrc?: string
    /** fiction = character / work; public = real person (still speculative typing) */
    lane: 'fiction' | 'public'
    /** Short tooltip line */
    note: string
    /** Why community charts often label them ISTP / Virtuoso */
    whyTyped: string
    /** Why the comparison resonates with how I work */
    whyLikeMe: string
}

export const virtuosoFigures: VirtuosoFigure[] = [
    {
        id: 'batman',
        initials: 'BW',
        name: 'Bruce Wayne / Batman',
        avatarSrc: '/avatar/virtuoso/batman.png',
        lane: 'fiction',
        note: 'Tactical gearhead, prefers evidence and motion over speeches.',
        whyTyped:
            'Fan charts tag Batman as ISTP for improvising with gear, reading a scene fast, and acting without a committee.',
        whyLikeMe:
            'I lead with facts, build tools that work under pressure, and would rather ship a fix than narrate the plan.',
    },
    {
        id: 'arya',
        initials: 'AS',
        name: 'Arya Stark',
        avatarSrc: '/avatar/virtuoso/arya.png',
        lane: 'fiction',
        note: 'Self-directed skill stack; learns by doing under pressure.',
        whyTyped:
            'Arya is often typed ISTP for hands-on training, solo focus, and adapting in the moment instead of following scripts.',
        whyLikeMe:
            'I stack skills by doing, own my learning path, and get sharper when the situation is messy or high stakes.',
    },
    {
        id: 'snake',
        initials: 'SS',
        name: 'Solid Snake',
        avatarSrc: '/avatar/virtuoso/snake.png',
        lane: 'fiction',
        note: 'Stoic operator; improvises with tools on hand.',
        whyTyped:
            'Snake lands in the Virtuoso lane for calm under fire, minimal talk, and solving problems with what is already in the room.',
        whyLikeMe:
            'I stay level when things break, communicate in short clear bursts, and improvise with the stack we have today.',
    },
    {
        id: 'katniss',
        initials: 'KE',
        name: 'Katniss Everdeen',
        avatarSrc: '/avatar/virtuoso/katniss.png',
        lane: 'fiction',
        note: 'Pragmatic survival instinct; minimal words, maximal execution.',
        whyTyped:
            'Katniss is commonly typed ISTP for practical survival choices, physical competence, and saying little while doing a lot.',
        whyLikeMe:
            'I cut to what will actually move the outcome, keep execution tight, and let results speak louder than status updates.',
    },
    {
        id: 'eastwood',
        initials: 'CE',
        name: 'Clint Eastwood',
        avatarSrc: '/avatar/virtuoso/eastwood.png',
        lane: 'public',
        note: 'On-screen persona: sparse dialogue, competence-first presence.',
        whyTyped:
            'Eastwood’s screen roles are often mapped to ISTP for economy of words, steady presence, and competence before charisma.',
        whyLikeMe:
            'I am direct in reviews, respect people’s time, and prefer showing mastery through delivery—not long preambles.',
    },
    {
        id: 'musashi',
        initials: 'MM',
        name: 'Miyamoto Musashi',
        avatarSrc: '/avatar/virtuoso/musashi.png',
        lane: 'public',
        note: 'Duel history aside: solo discipline, adaptation, craft obsession.',
        whyTyped:
            'Musashi appears on Virtuoso lists for solitary practice, adapting tactics mid-fight, and obsessing over craft mastery.',
        whyLikeMe:
            'I iterate alone until the craft is solid, adjust when reality disagrees with the plan, and care about skill depth.',
    },
    {
        id: 'mcqueen',
        initials: 'SM',
        name: 'Steve McQueen',
        avatarSrc: '/avatar/virtuoso/mcqueen.png',
        lane: 'public',
        note: 'Cool-headed risk taker; physical intelligence reads hands-on.',
        whyTyped:
            'McQueen is typed ISTP in pop charts for cool-headed risk, physical intelligence, and doing over discussing.',
        whyLikeMe:
            'I am comfortable with calculated risk, learn fastest by touching the system, and keep my head when pace spikes.',
    },
    {
        id: 'earhart',
        initials: 'AE',
        name: 'Amelia Earhart',
        avatarSrc: '/avatar/virtuoso/earhart.png',
        lane: 'public',
        note: 'Systems and machinery comfort; independent path over convention.',
        whyTyped:
            'Earhart is grouped with ISTP for comfort with machinery, independent decisions, and choosing the unconventional path.',
        whyLikeMe:
            'I like understanding how systems work end to end, choose pragmatic paths, and do not need permission to start.',
    },
]

export const virtuosoLaneDisclaimer =
    'Community MBTI charts are entertainment, not science. These names are often grouped with ISTP / Virtuoso online. Not claims about real psychology and not verified for any living person.'

export function getVirtuosoFigureById(id: string) {
    return virtuosoFigures.find((f) => f.id === id)
}
