/** Crystal-style profile summaries: questions with short answers; detail in `my.handbook`. */

export type SummaryItem = {
    id: string
    question: string
    summary: string
    /** Phrases to highlight with `.mark` (must appear in order in `summary`) */
    highlights?: string[]
    /** `crystal-N` or `istp-0` handbook element id */
    handbookId?: string
}

export type SummaryCategory = {
    id: string
    label: string
    items: SummaryItem[]
}

export const profileMeta = {
    archetype: 'Relentless Catalyst',
    tagline:
        'I make clear decisions, cut through confusion, and turn ideas into results. I move quickly, keep a high bar, and stay focused on what actually ships.',
    taglineHighlights: [
        'clear decisions',
        'cut through confusion',
        'turn ideas into results',
        'high bar',
        'what actually ships',
    ],
    typeLine: 'ISTP-T · Virtuoso · Operator',
} as const

export const summaryCategories: SummaryCategory[] = [
    {
        id: 'hiring',
        label: 'Working with me',
        items: [
            {
                id: 'team',
                question: 'How do I fit on a team?',
                summary:
                    'I work best with capable teammates who own their work and follow through. I help unblock others, push for clear decisions, and keep us focused on results. When direction is unclear, I step up to get the team moving.',
                highlights: ['capable teammates', 'clear decisions', 'focused on results', 'step up'],
                handbookId: 'crystal-3',
            },
            {
                id: 'impact',
                question: 'How do I drive impact?',
                summary:
                    'I deliver even when requirements are still taking shape, keep quality high, and flag risks early. I turn ideas into shipped work by deciding with the information we have and keeping people accountable without micromanaging.',
                highlights: ['quality high', 'shipped work', 'accountable'],
                handbookId: 'crystal-3',
            },
            {
                id: 'execution',
                question: 'How do I execute and stay productive?',
                summary:
                    'I move fast, adjust when the facts change, and do my best work with room to choose how I get there. I like hands-on learning, closing decisions quickly, and direct feedback tied to real outcomes.',
                highlights: ['move fast', 'hands-on learning', 'real outcomes'],
                handbookId: 'crystal-4',
            },
            {
                id: 'product',
                question: 'How do I contribute to product and company growth?',
                summary:
                    'I care about plans that become real product. I focus on solid design, steady delivery, and habits the team can keep. I connect ideas to execution so growth builds steadily over time.',
                highlights: ['real product', 'solid design', 'steady delivery', 'ideas to execution'],
                handbookId: 'crystal-7',
            },
            {
                id: 'collaboration',
                question: 'What is collaboration like with me?',
                summary:
                    'I am direct and organized. I lead with the answer, appreciate preparation, and give honest feedback. I welcome pushback on ideas and value teammates who share context so we stay aligned.',
                highlights: ['direct and organized', 'lead with the answer', 'honest feedback', 'stay aligned'],
                handbookId: 'crystal-6',
            },
        ],
    },
    {
        id: 'style',
        label: 'Style & communication',
        items: [
            {
                id: 'overview',
                question: 'Who am I at work, in one read?',
                summary:
                    'I make clear decisions, stay calm under pressure, and follow through. What reads as boldness is usually clarity on priorities and execution. I turn ideas into measurable results, not talk.',
                highlights: ['clear decisions', 'calm under pressure', 'measurable results'],
                handbookId: 'crystal-1',
            },
            {
                id: 'communication',
                question: 'How should you communicate with me?',
                summary:
                    'Get to the point, lead with the answer, and bring facts when you can. I give direct feedback and appreciate the same. Friendly conversation is welcome, and I respect your time when we stay on what matters.',
                highlights: ['Get to the point', 'lead with the answer', 'direct feedback', 'what matters'],
                handbookId: 'crystal-3',
            },
            {
                id: 'strengths',
                question: 'What am I strongest at?',
                summary:
                    'Creative problem-solving under pressure, leading when things are unclear, confident calls before we have every detail, and steady accountability. I do my best work where vision and execution meet.',
                highlights: [
                    'Creative problem-solving',
                    'things are unclear',
                    'steady accountability',
                    'vision and execution',
                ],
                handbookId: 'crystal-3',
            },
            {
                id: 'blindspots',
                question: 'What helps us work well together?',
                summary:
                    'Share context early, agree on priorities, and give each other straight feedback. I stay attentive to what matters to the team and adjust my pace when someone needs more time to weigh in.',
                highlights: ['Share context early', 'straight feedback', 'what matters to the team'],
                handbookId: 'crystal-3',
            },
        ],
    },
    {
        id: 'inner',
        label: 'Drive & people',
        items: [
            {
                id: 'decisions',
                question: 'How do I make decisions?',
                summary:
                    'I prefer to decide and move. I test ideas, run small experiments when useful, and choose a path before we have perfect data. I focus on results, risk, and a clear route to delivery.',
                highlights: ['decide and move', 'small experiments', 'clear route to delivery'],
                handbookId: 'crystal-4',
            },
            {
                id: 'motivation',
                question: 'What motivates me?',
                summary:
                    'Achievement, independence, mastery, and hard problems worth solving. I stay engaged when impact is visible, standards are real, and the work rewards people who show up and deliver.',
                highlights: ['independence', 'hard problems', 'show up and deliver'],
                handbookId: 'crystal-4',
            },
            {
                id: 'stress',
                question: 'How do I handle stress and recovery?',
                summary:
                    'I stay steady when stakes are high. Tension shows up when work stalls, meetings replace progress, or I cannot move things forward. I recharge by solving the problem, shipping something useful, or changing approach.',
                highlights: ['stay steady', 'stakes are high', 'shipping something useful'],
                handbookId: 'crystal-5',
            },
            {
                id: 'relationships',
                question: 'How do I show up in work relationships?',
                summary:
                    'I build strong trust with people who are clear, skilled, and committed. I communicate with speed and honesty, and I value teammates who tell me what they need so we stay aligned.',
                highlights: ['strong trust', 'speed and honesty', 'stay aligned'],
                handbookId: 'crystal-6',
            },
        ],
    },
    {
        id: 'career',
        label: 'Career & growth',
        items: [
            {
                id: 'environment',
                question: 'What work environment fits me?',
                summary:
                    'Clear goals, capable colleagues, and room to build. I do well where results matter, good debate is welcome, and builders can focus on shipping meaningful work.',
                highlights: ['Clear goals', 'capable colleagues', 'shipping meaningful work'],
                handbookId: 'crystal-7',
            },
            {
                id: 'paths',
                question: 'Where do I tend to excel?',
                summary:
                    'Technical leadership, product engineering, and roles that blend planning with delivery. I excel where someone needs to clarify fuzzy problems and carry hard projects through to launch.',
                highlights: ['Technical leadership', 'planning with delivery', 'through to launch'],
                handbookId: 'crystal-7',
            },
            {
                id: 'growth',
                question: 'What am I working on over time?',
                summary:
                    'I keep improving how I set context, bring people along before big calls, and invite input early. The goal stays the same: strong results with smoother teamwork over time.',
                highlights: ['set context', 'invite input early', 'strong results', 'smoother teamwork'],
                handbookId: 'crystal-8',
            },
            {
                id: 'frameworks',
                question: 'What do the assessments say?',
                summary:
                    'DISC D Captain, ISTP-T Virtuoso, Enneagram 8w7, with high emotional stability and conscientiousness. The profiles point to direct, results-focused work and independent problem solving. Download the full reports from the sidebar for detail.',
                highlights: ['results-focused work', 'independent problem solving'],
                handbookId: 'crystal-2',
            },
        ],
    },
]

/** CLI header `type` slug per category */
export const summaryCategoryCliType: Record<string, string> = {
    hiring: 'working-with-me',
    style: 'style',
    inner: 'drive-and-people',
    career: 'career',
}

export const allSummaryItems = summaryCategories.flatMap((c) => c.items)
