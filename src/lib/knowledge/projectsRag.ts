/**
 * Shipped projects (Work showcase → Projects tab). Keep answers short in chat;
 * depth lives in Stories (case-pr, case-nft) or contact.
 */
export type ProjectRagEntry = {
    id: string
    title: string
    url: string
    stack: string
    /** One or two sentences for "tell me about X" */
    summary: string
    /** If set, point visitors here for problem/solution depth */
    storyUrl?: string
}

/** Canonical list — mirrors Projects tab on /work */
export const shippedProjects: ProjectRagEntry[] = [
    {
        id: 'pr.adibomar.com',
        title: 'Pull Request Creator',
        url: 'https://pr.adibomar.com',
        stack: 'Vue 3, AI Summarize, Markdown',
        summary:
            'A PR body builder with guided sections and AI Summarize that turns bullet notes into structured markdown for GitHub.',
        storyUrl: 'https://case-pr.adibomar.com/',
    },
    {
        id: 'ask-adib-rag',
        title: 'Ask AI-dib',
        url: 'https://adibomar.com',
        stack: 'PHP, Supabase, Gemini, Ollama, RAG',
        summary:
            'Grounded chat on this portfolio about my work, experience, and personality. Open the chat button on the site to try it.',
    },
    {
        id: 'habo-gencards',
        title: 'Habo GenCards',
        url: 'https://habo-gencards.adibomar.com',
        stack: 'React, Framer Motion, CSS',
        summary:
            'A TCG-style card generator: customize art, frames, and holo effects, then export polished collector-style cards in minutes.',
    },
    {
        id: 'haboforever.com',
        title: 'Wedding Invitations',
        url: 'https://haboforever.com',
        stack: 'Vue 3, Lottie',
        summary: 'Wedding and engagement invite site with motion, RSVP flow, and mobile-first layout for guests.',
    },
    {
        id: 'engagement.haboforever.com',
        title: 'Engagement Invitation',
        url: 'https://engagement.haboforever.com',
        stack: 'Vue 3',
        summary: 'Engagement event site with date, venue, and dress code for guests on mobile.',
    },
    {
        id: 'gender-reveal.haboforever.com',
        title: 'Gender Reveal RSVP',
        url: 'https://gender-reveal.haboforever.com',
        stack: 'Vue 3',
        summary: 'RSVP site for our gender reveal: attendance, event details, and updates on mobile.',
    },
    {
        id: 'safiya-adilah.adibomar.com',
        title: 'Birthday Surprise',
        url: 'https://safiya-adilah.adibomar.com',
        stack: 'Vue 3',
        summary: 'Surprise birthday site with photos, wishes, and party details for family and friends.',
    },
    {
        id: 'gym',
        title: 'Gym Website',
        url: 'https://gym.adibomar.com',
        stack: 'Vue 3',
        summary: 'Gym brand site with class info and responsive browsing on phone and desktop.',
    },
    {
        id: 'habo-chain',
        title: '$HABO',
        url: 'https://habo-chain.adibomar.com/',
        stack: 'Vue 3, TON, Web3',
        summary: 'Personal token on TON: a small Web3 page about the story and on-chain links.',
    },
]

export function buildProjectsListChunkContent(): string {
    const lines = shippedProjects.map(
        (p) => `- ${p.title}: ${p.url} (stack: ${p.stack})`,
    )
    return [
        'When asked what I have built or shipped, list these projects from my Projects tab (name + live URL + stack). Keep the list scannable. Offer contact for a deeper walkthrough.',
        'Shipped projects:',
        ...lines,
        'Browse all at https://adibomar.com/work (Projects tab). For problem-solving depth see Stories: case-pr.adibomar.com and case-nft.adibomar.com.',
    ].join('\n')
}

export function buildProjectChunkContent(p: ProjectRagEntry): string {
    const parts = [
        `Project: ${p.title}.`,
        p.summary,
        `Stack: ${p.stack}.`,
        `Live: ${p.url}.`,
    ]
    if (p.storyUrl) {
        parts.push(
            `For why I built it and what problem it solved, point to the story: ${p.storyUrl}. Otherwise invite them to contact me for a walkthrough (work@adibomar.com or Open for Collaboration on the site).`,
        )
    } else {
        parts.push(
            'For a deeper walkthrough, invite them to contact me (work@adibomar.com or Open for Collaboration on the site).',
        )
    }
    return parts.join(' ')
}
