export type ExecutiveVector = {
    id: string
    index: string
    label: string
    headline: string
    body: string
    proof: string[]
    deepTarget: string
    /** Shown in hover “ghost peek” strip */
    peek: string
}

export const executiveHero = {
    eyebrow: 'Senior Brand Designer × Software Engineer',
    headline: 'Premium brands, shipped in code.',
    subhead:
        'I close the gap between brand strategy and production UI—fast, measurable, and built so your whole team can move with it.',
} as const

export const executiveVectors: ExecutiveVector[] = [
    {
        id: 'hybrid',
        index: '01',
        label: 'The Hybrid Fit',
        headline: 'One owner from brand intent to production UI.',
        body: 'I sit at the seam where positioning becomes interface. You get a senior brand mind that also ships: design systems, high-fidelity UI, and production-grade frontends without a handoff cliff. “On brand” and “in prod” are the same artifact—not two debates.',
        proof: ['Brand strategy', 'Design systems', 'Vue / React UIs', 'Design-to-code parity'],
        deepTarget: 'deep-case-studies',
        peek: 'Case study → Brand identity + system architecture…',
    },
    {
        id: 'impact',
        index: '02',
        label: 'Collective Impact',
        headline: 'I raise the floor for everyone who touches the product.',
        body: 'I build shared language—tokens, component APIs, and code designers can reason about. Engineers ship faster because specs are executable; designers iterate safely because the system enforces constraints. Less rework, fewer “final_final” files.',
        proof: ['Design systems', 'Documented components', 'Cross-discipline libraries'],
        deepTarget: 'deep-stack',
        peek: 'Stack matrix → Frontend: Vue/Nuxt · React/Next for state-driven UIs…',
    },
    {
        id: 'velocity',
        index: '03',
        label: 'Velocity & ROI',
        headline: 'Shorter path from concept to shipped—and measured.',
        body: 'Tight loops: prototype in the browser, validate with performance budgets, cut scope without killing quality. Modern stacks and reusable primitives compress timelines so you learn from the market sooner—not after a six-month deck cycle.',
        proof: ['Rapid prototyping', 'Performance-first', 'Scope discipline', 'Time-to-market'],
        deepTarget: 'deep-case-studies',
        peek: 'Outcome → −38% concept-to-prototype cycle (representative)…',
    },
    {
        id: 'growth',
        index: '04',
        label: 'Product Growth',
        headline: 'Design engineered for conversion and retention—not just applause.',
        body: 'I design for the full funnel: fast first paint, clear onboarding, friction-aware flows, and instrumentation you can trust. Brand and UX work together—trust at the hero, clarity in the product, momentum in the upgrade path.',
        proof: ['Conversion UX', 'Onboarding flows', 'Core Web Vitals', 'Data-informed iteration'],
        deepTarget: 'deep-case-studies',
        peek: 'Measurable outcome → retention & load-time targets…',
    },
    {
        id: 'collab',
        index: '05',
        label: 'The Collaboration Vibe',
        headline: 'Studio ownership. Radical clarity. Low drama.',
        body: 'High autonomy and direct communication: agendas, written decisions, async updates that respect focus time. I challenge assumptions with evidence, flag risks early, and own outcomes like a partner—not a ticket-taker.',
        proof: ['Async-first', 'Transparent tradeoffs', 'Accountable delivery', 'Product pushback'],
        deepTarget: 'deep-timeline',
        peek: 'Career timeline → roles, consulting, product launches…',
    },
]
