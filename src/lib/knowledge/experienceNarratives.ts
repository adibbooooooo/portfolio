/**
 * First-person experience narratives for AI-dib RAG (source of truth for job Q&A).
 * Based on work.experience page; leaving reasons worded for recruiters.
 */
export const experienceNarrativeChunks = [
    {
        id: 'exp-infomina',
        topic: 'experience' as const,
        content: `At Infomina Berhad (Feb 2026 — May 2026, Kuala Lumpur), I am a Senior Software Engineer developing and maintaining production applications while migrating legacy codebases to modern architecture, APIs, and data flows.

Day to day I work across Laravel, Vue 3, NuxtJS, Docker, and Oracle. I focus on making systems easier to maintain and safer to change while keeping delivery practical.

Why I am open to moving on: I prefer small-to-medium companies where I can own meaningful responsibility end to end. Those roles are where I do my best work.`,
    },
    {
        id: 'exp-career-break',
        topic: 'experience' as const,
        content: `Career break (late 2025 — early 2026): I stepped away from full-time work to prepare for my wedding in November, travel on honeymoon, and spend time with family.

This was planned time off, not a gap from lack of work. I stayed technically active and returned ready for a senior engineering role at Infomina.`,
    },
    {
        id: 'exp-fortifi',
        topic: 'experience' as const,
        content: `At Fortifi Sdn Bhd (May 2024 — Oct 2025, Kuala Lumpur), I was Senior Software Engineer and acted as de-facto CTO. I was the primary engineer continuing product development after the founding team, driving delivery across web apps, Telegram Mini Apps, and Web3 platforms.

I scaled the company from a three-person founding team into engineering, design, and marketing functions. I led five engineers, set coding standards, PR reviews, sprint rhythm, and deployment practices.

On the product side I shipped Laravel and Vue.js applications, a full Telegram Mini App (auth, payments, real-time flows), Web3 livestream and social platforms, NFT and SBT automation (metadata, wallet checks, mint workflows), Duffel flight booking inside Telegram, Stripe payments, and legacy re-engineering for stability and uptime.

Stack highlights: Laravel, Vue.js, MySQL, AWS, Stripe, Telegram Mini Apps, Web3, NFT, SBT.

Why I left: the Ownershipcoin.com launch completed successfully. I moved on after that milestone.`,
    },
    {
        id: 'exp-etctech',
        topic: 'experience' as const,
        content: `At Etctech Global Sdn Bhd (Aug 2023 — Mar 2024, Kuala Lumpur), I was Web Team Lead. I managed delivery of internal and client-facing web applications, introduced Vue.js to replace legacy jQuery stacks, and built modules in Laravel and Vue.

I reviewed PRs, mentored juniors, and coordinated cross-team communication for enterprise clients. Outcomes included better engineering quality and faster delivery.

Stack: Vue.js, Laravel, SCSS, REST APIs, MySQL.

Why I left: I needed a hybrid-friendly role so I could support my mother during cancer treatment while still growing as an engineer.`,
    },
    {
        id: 'exp-abss',
        topic: 'experience' as const,
        content: `At ABSS, Asian Business Software Solutions (Aug 2022 — Jul 2023, Kuala Lumpur), I was a Full Stack Engineer on enterprise applications.

I built Angular frontends and Laravel and Phalcon backends with JWT auth. I led integration with UOB Bank: API contracts, secure data flows, compliance-aware design, and documentation. I also set up Docker dev environments and REST APIs for external partners.

Stack: Angular, Laravel, Phalcon PHP, Docker, JWT, REST APIs.

Why I left: I received a stronger offer and a role that matched the next step in my career.`,
    },
    {
        id: 'exp-bestweb-lead',
        topic: 'experience' as const,
        content: `At BestWeb Technologies (Dec 2021 — Jul 2022, Kuala Lumpur), I was Development Team Lead. I managed developers, planned sprints, and delivered web and mobile projects across CodeIgniter and Laravel.

I implemented JWT security, payment gateway and logistics API integrations, reusable modules, Figma UI/UX, and AWS hosting (EC2, Lightsail, RDS, S3).

Why I left: the workload became unsustainable and led to burnout. I chose to step back from the lead role for my health.`,
    },
    {
        id: 'exp-zeno',
        topic: 'experience' as const,
        content: `At Zeno Group (Sep — Nov 2021, Kuala Lumpur), I was a Web Developer building WordPress and WooCommerce sites for marketing and corporate clients.

I customized themes and plugins, improved performance and SEO, and integrated REST APIs for dynamic content.

Why I left: BestWeb Technologies offered me a team lead position, which matched the growth path I wanted.`,
    },
    {
        id: 'exp-bestweb-dev',
        topic: 'experience' as const,
        content: `At BestWeb Technologies (Feb 2020 — Aug 2021, Kuala Lumpur), I was a Full-stack Developer building CodeIgniter and Laravel apps, dashboards, JWT auth, payment gateways, Flutter hybrid apps, and MySQL schema work.

I shipped reusable components that sped up later client projects.

Why I left: I moved into the development team lead role for career advancement.`,
    },
    {
        id: 'exp-education',
        topic: 'experience' as const,
        content: `Earlier path: VeecoTech internship (2019) on WordPress, Prestashop, and Opencart plugins and ecommerce fixes.

Education: Kolej Vokasional Balik Pulau, Diploma in Computer Science (2017 — 2019). I served on student council, presented at national exhibitions, and advised peers on industry expectations as Penashihat Industri.`,
    },
]
