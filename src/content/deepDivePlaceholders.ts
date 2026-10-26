export type CaseStudyBlock = {
    id: string
    title: string
    brief: string
    brand: string
    architecture: string
    outcome: string
    tags: string[]
}

export const caseStudyPlaceholders: CaseStudyBlock[] = [
    {
        id: 'portfolio-revamp',
        title: 'Portfolio & design-system revamp',
        brief: 'Reframe a hybrid brand×engineering profile for recruiters and collaborators—dual perspective, scannable proof, dense handbook.',
        brand: 'Editorial light executive layer + dark deep workspace; emerald accent carried from existing identity; glass cards for value vectors.',
        architecture: 'Vue 3 · Vite · Tailwind v4 · motion-v · provide/inject perspective state · URL-synced `?mode=executive|deep`.',
        outcome: 'Single codebase serving 10s skim and full evidence without route churn; foundation for case-study expansion.',
        tags: ['Vue 3', 'Design systems', 'motion-v'],
    },
    {
        id: 'product-ui',
        title: 'Product UI — zero-to-one platform',
        brief: 'Placeholder: ship a multi-surface product from brand direction through component library to production routes.',
        brand: 'Positioning, typography, and motion language aligned to conversion goals.',
        architecture: 'Frontend: Vue/Nuxt or React/Next · API: Laravel or Node · Data: Supabase/PostgreSQL.',
        outcome: 'Placeholder metrics: faster release cadence, improved activation, stable Core Web Vitals.',
        tags: ['Full-stack', 'Design systems', 'Growth'],
    },
]

export type StackRow = {
    domain: string
    tools: string
    usage: string
}

export const stackMatrix: StackRow[] = [
    {
        domain: 'Brand & product design',
        tools: 'Figma · design tokens · motion specs',
        usage: 'Identity, UI kits, and handoff-ready systems—not static mocks alone.',
    },
    {
        domain: 'Frontend',
        tools: 'Vue 3 / Nuxt · React / Next.js · Tailwind',
        usage: 'State-driven, performance-conscious interfaces; design-system consumption in code.',
    },
    {
        domain: 'Backend & APIs',
        tools: 'Laravel · Node.js',
        usage: 'Business logic, auth, and integrations behind polished surfaces.',
    },
    {
        domain: 'Data & infra',
        tools: 'Supabase · PostgreSQL · Vercel / cloud hosting',
        usage: 'Scalable data layers, edge-friendly deploys, observability hooks.',
    },
    {
        domain: 'Craft & motion',
        tools: 'GSAP · motion-v · Three.js (selective)',
        usage: 'Purposeful interaction—not decoration for its own sake.',
    },
]
