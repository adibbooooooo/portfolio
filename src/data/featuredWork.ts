/** Featured live sites shown on `my.info` — mirrors top picks from work.showcase projects. */

export type FeaturedWorkTheme = 'sky' | 'emerald' | 'amber' | 'violet'

export type FeaturedWorkItem = {
    id: string
    title: string
    subtitle: string
    pitch: string
    url: string
    theme: FeaturedWorkTheme
    /** Base path for optimized preview assets in /public (serves .webm + .mp4) */
    previewVideo: string
    previewPoster: string
}

export const featuredWorkItems: FeaturedWorkItem[] = [
    {
        id: 'pr.adibomar.com',
        title: 'Pull Request Creator',
        subtitle: 'PR Creator · AI Summarize',
        pitch: 'Turn rough bullet notes into review-ready PR markdown in minutes—guided sections plus AI Summarize so you ship better pull requests without memorizing templates.',
        url: 'https://pr.adibomar.com',
        theme: 'emerald',
        previewVideo: '/pull-request-creator',
        previewPoster: '/pull-request-creator-poster.jpg',
    },
    {
        id: 'habo-gencards',
        title: 'Habo GenCards',
        subtitle: 'Live App',
        pitch: 'Own your legend on a trading card — customize art, frame, and holo finish, then export a collector-grade card in minutes. Built for creators who want TCG-quality results without the design grind.',
        url: 'https://habo-gencards.adibomar.com',
        theme: 'sky',
        previewVideo: '/habo-gencards',
        previewPoster: '/habo-gencards-poster.jpg',
    },
    {
        id: 'haboforever.com',
        title: 'Wedding Invitations',
        subtitle: 'Wedding Website',
        pitch: 'A digital invitation experience for our wedding — guests get dates, directions, and RSVP in one polished site with thoughtful motion and mobile-first layout.',
        url: 'https://haboforever.com',
        theme: 'emerald',
        previewVideo: '/wedding',
        previewPoster: '/wedding-poster.jpg',
    },
    {
        id: 'habo-chain',
        title: '$HABO',
        subtitle: 'TON · Personal Token',
        pitch: '$HABO is a personal token deployed on TON by Hanis and Adib. Half love letter, half Web3 portfolio — a small piece of two people’s relationship, written into a public ledger.',
        url: 'https://habo-chain.adibomar.com/',
        theme: 'violet',
        previewVideo: '/habo-chain',
        previewPoster: '/habo-chain-poster.jpg',
    },
    {
        id: 'gym',
        title: 'Gym Website',
        subtitle: 'Client Project',
        pitch: 'A full gym brand site — class schedules, membership paths, and location info in a fast, responsive experience that feels as energetic as the training floor.',
        url: 'https://gym.adibomar.com',
        theme: 'amber',
        previewVideo: '/gym',
        previewPoster: '/gym-poster.jpg',
    },
]
