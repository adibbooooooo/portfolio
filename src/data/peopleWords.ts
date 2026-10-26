export type PeopleWordMessage = {
    id: string
    name: string
    role: string
    avatar: string
    ts: string
    project?: string
    projectUrl?: string
    text: string
    scope?: string[]
    /** Use in RAG when answering founding-engineer / SMB fit */
    foundingEngineerHighlight?: boolean
}

export const peopleWordMessages: PeopleWordMessage[] = [
    {
        id: 'm1',
        name: 'Hanis Afifah',
        role: 'Client',
        avatar: '/avatar/avatar-1.jpg',
        ts: 'October 2025',
        project: 'Wedding Website',
        projectUrl: 'https://haboforever.com',
        text: 'The wedding website is truly beyond my expectations, it’s absolutely beautiful. Every small detail and the overall style are exactly what I envisioned. Thank you so much for bringing my dream wedding e-card invitation to life! ❤️',
        scope: ['Laravel API', 'Vue 3', 'Lottie'],
    },
    {
        id: 'm5',
        name: 'June Siang',
        role: 'CEO · Fortifi Sdn Bhd · TON Ambassador',
        avatar: '/avatar/avatar-june-siang.png',
        ts: 'October 2025',
        project: 'Fortifi Sdn Bhd',
        text: 'Adib was our foundational technical pillar when we had no other engineers on board. From our first tech conferences in Hong Kong and Taiwan to scaling our operations, his work ethic was unmatched—often making me wonder when he found time to sleep. Originally hired as a developer, Adib seamlessly managed frontend, backend, and DevOps tasks. He is a practical, fast, and collaborative solution provider who eventually scaled our capabilities by onboarding key talent across marketing, tech, and design. Adib adapts to high-pressure situations instantly, executes vision with military precision, and remains a deeply trustworthy comrade and family member to the team. He has my highest recommendation.',
        scope: ['Full stack', 'DevOps', 'Team leadership'],
        foundingEngineerHighlight: true,
    },
    {
        id: 'm2',
        name: 'Dato Dr Hj Hazzaini',
        role: 'Client',
        avatar: '/avatar/avatar-2.jpg',
        ts: 'March 2025',
        project: 'Internal System',
        text: 'Excellent service from start to finish. The team was professional, responsive, and truly understood my business needs. The dashboard looks clean, modern, and works perfectly. Highly recommend their service to anyone looking for quality and reliability 👍🏻',
        scope: ['Laravel API', 'Vue 3', 'Bootstrap'],
    },
    {
        id: 'm3',
        name: 'Afiq',
        role: 'Software Engineer',
        avatar: '/avatar/avatar-3.jpg',
        ts: 'September 2024',
        project: 'Fortifi Sdn Bhd',
        text: 'Adib is an exceptional engineer with deep technical knowledge and a constant drive to improve the team. Reliable, self-sufficient, and always willing to share insights. A great asset in every project',
        scope: ['Node.js', 'Telegram Bot', 'Telegram Mini Apps', 'Laravel', 'Web3'],
        foundingEngineerHighlight: true,
    },
    {
        id: 'm4',
        name: 'Sudesh Wong',
        role: 'WebRTC Mentor',
        avatar: '/avatar/avatar-sudesh-wong.png',
        ts: 'January 2026',
        project: 'PR Creator',
        projectUrl: 'https://pr.adibomar.com',
        text: 'As a developer, pr.adibomar.com has helped me tremendously during development, before this I have cracking my head on commit message, but ever since using this, life has been much easier !!!',
        scope: ['Vue', 'Markdown', 'Developer tool'],
    },
    {
        id: 'm6',
        name: 'Adibah Ariffin',
        role: 'Fullstack Software Engineer',
        avatar: '/avatar/avatar-adibah-ariffin.png',
        ts: 'May 2023',
        project: 'ABSS Sdn Bhd',
        text: "Adib is truly exceptional software engineer with an in-depth knowledge of the latest technical advancements in web development field and he is never shy to share his knowledge and introduce new things to our team. Since he joined the company last year, he has been a great resource in all projects he's involved in. A great team player, self-sufficient and reliable developer. He will certainly be an asset for any team he joins. Wishing you nothing but the best and to many more successes in your career.",
        scope: ['Web development', 'Team collaboration', 'Knowledge sharing'],
        foundingEngineerHighlight: true,
    },
    {
        id: 'm7',
        name: 'Jeffry Handani',
        role: 'Team Lead',
        avatar: '/avatar/avatar-jeffry-handani.png',
        ts: 'August 2022',
        project: 'Bestweb Technologies Sdn Bhd',
        text: "Some say he's greedy, some say he's too bold. But actually he's just passionate and likes to work. He even talks about work when we're having dinner. He brings a lot of value to the team, and we grew together through the Bestweb journey. He's fast, sometimes too fast, and very practical. I'm definitely looking forward to crossing paths with him again.",
        scope: ['Team Lead', 'Bestweb', 'Full stack'],
        foundingEngineerHighlight: true,
    },
]
