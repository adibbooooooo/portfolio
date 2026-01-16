<template>
    <EditorScaffold class="h-full">
        <section class="pb-8 fade-left">
            <!-- Header -->
            <h1 class="normal-font text-white font-extrabold leading-[1.05] text-[34px] md:text-5xl mb-2 mt-9">
                Work <span class="text-neutral-400">Experience</span>
            </h1>
            <p class="text-white/60 text-[12px]">
                {{ "<!-- Tracing the evolution of my skills through real products and real results -->" }}
            </p>

            <!-- FILTERS – uses .btn styles -->
            <div class="flex flex-wrap gap-2 mt-6">
                <button v-for="f in filters" :key="f" type="button" class="btn" :class="{ ghost: activeFilter !== f }"
                    @click="setFilter(f)">
                    {{ f }}
                </button>
            </div>

            <!-- EXPERIENCE LIST -->
            <ul class="mt-6 space-y-4">
                <li v-for="(e, i) in shown" :key="e.id" class="group outline-none" :tabindex="0">
                    <article
                        class="card relative pl-7 pr-4 py-5 md:py-6 transition duration-300 opacity-0 translate-y-2"
                        :class="{ 'opacity-100 translate-y-0': visible[i] }" role="button" @click="toggle(i)"
                        @keydown.enter.prevent="toggle(i)" @keydown.space.prevent="toggle(i)">
                        <!-- vertical line + dot inside the card -->
                        <span class="timeline-dot" />

                        <!-- top row -->
                        <div class="flex items-start justify-between gap-3">
                            <div class="min-w-0">
                                <div class="text-white/80 text-sm md:text-[15px] mb-0.5">
                                    {{ e.company }}
                                </div>
                                <div class="title group-hover:text-emerald-200 transition-colors">
                                    {{ e.role }}
                                </div>
                                <div class="muted mt-1">
                                    {{ e.period }}
                                    <span class="mx-1.5 text-white/35">·</span>
                                    {{ e.location }}
                                </div>
                            </div>

                            <!-- Detail toggle button (also using .btn) -->
                            <button type="button" class="btn ghost hidden md:block" @click.stop="toggle(i)"
                                :aria-expanded="expanded[i] ? 'true' : 'false'">
                                {{ expanded[i] ? 'Hide details' : 'Show details' }}
                            </button>
                        </div>

                        <!-- summary -->
                        <p class="desc">
                            {{ e.summary }}
                        </p>

                        <!-- DETAILS -->
                        <transition name="fade">
                            <div v-if="expanded[i]" class="mt-4 details-card">
                                <div class="section">
                                    <div class="section-title">Responsibilities</div>
                                    <ul class="list-disc list-inside text-white/80 text-[14px] leading-7 space-y-1">
                                        <li v-for="(b, bi) in e.bullets" :key="bi">{{ b }}</li>
                                    </ul>
                                </div>

                                <div class="section" v-if="e.stack.length">
                                    <div class="section-title">Tech Stack</div>
                                    <div class="flex flex-wrap gap-2">
                                        <span v-for="(s, si) in e.stack" :key="si" class="chip"
                                            :title="s.level + ' proficiency'">
                                            <span class="dots" aria-hidden="true">
                                                <span class="dot" :class="dotFill(s.level, 1)" />
                                                <span class="dot" :class="dotFill(s.level, 2)" />
                                                <span class="dot" :class="dotFill(s.level, 3)" />
                                            </span>
                                            {{ s.name }}
                                        </span>
                                    </div>
                                </div>

                                <div v-if="e.outcomes?.length" class="section">
                                    <div class="section-title">Notable</div>
                                    <div class="flex flex-wrap gap-2">
                                        <span v-for="(o, oi) in e.outcomes" :key="oi" class="pill">
                                            {{ o }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </transition>
                    </article>
                </li>
            </ul>
        </section>
    </EditorScaffold>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import EditorScaffold from '@/components/EditorScaffold.vue'

type Level = 'Core' | 'Strong' | 'Working'
type StackItem = { name: string; level: Level }
type Exp = {
    id: string
    type: 'Work' | 'Education'
    company: string
    role: string
    summary: string
    period: string
    location: string
    bullets: string[]
    stack: StackItem[]
    outcomes?: string[]
}

/* DATA */
const data = ref<Exp[]>([
    {
        id: 'fortifi',
        type: 'Work',
        company: 'Fortifi Sdn Bhd',
        role: 'Senior Software Engineer',
        summary:
            'Acted as the de-facto CTO, steering engineering direction across payments, Mini Apps, Web3 products, platform architecture and team scaling.',
        period: 'May 2024 — Oct 2025',
        location: 'Kuala Lumpur, MY',
        bullets: [
            'Scaled the company from a 3-person founding team into a functioning organisation with dedicated engineering, design and marketing divisions.',
            'Led and mentored a team of 5 engineers while defining engineering culture, coding standards, deployment flows and documentation practices.',
            'Architected and developed multiple production web applications using Laravel, Vue.js and MySQL—focusing on performance, stability and long-term maintainability.',
            'Shipped a full Telegram Mini App built with Laravel + Vue, handling authentication, payments, user flows and real-time interactions.',
            'Built automation pipelines for NFT, SBT, and token creation, including metadata generation, wallet security validation and minting workflows.',
            'Developed a Web3-enabled livestream platform featuring seat management, gated access, review logic and integrated payment flows.',
            'Developed a Web3-driven social media platform featuring posts, reactions, feeds, XP/token logic and SBT-based identity.',
            'Integrated the Duffel API for flight search and booking inside a Telegram Mini App.',
            'Re-engineered legacy codebases for stability—resolving deep architectural issues and improving uptime and performance.',
            'Implemented Git standards, PR reviews, sprint rhythms and cross-team delivery processes to ensure consistent engineering output.',
        ],
        stack: [
            { name: 'Laravel', level: 'Core' },
            { name: 'Vue.js', level: 'Core' },
            { name: 'MySQL', level: 'Core' },
            { name: 'AWS', level: 'Strong' },
            { name: 'Stripe', level: 'Strong' },
            { name: 'Telegram Mini Apps', level: 'Strong' },
            { name: 'Web3 / NFT / SBT', level: 'Strong' },
            { name: 'Node.js', level: 'Working' },
        ],
        outcomes: [
            'Scaled company from 3 people → full multi-disciplinary organisation',
            'Shipped production-grade Mini Apps and Web3 platforms',
            'Improved system reliability and engineering delivery pipelines',
        ],
    },
    {
        id: 'etctech',
        type: 'Work',
        company: 'Etctech Global Sdn Bhd',
        role: 'Web Team Lead',
        summary:
            'Managed the delivery of multiple web applications while modernizing frontend architecture and improving team velocity.',
        period: 'Aug 2023 — Mar 2024',
        location: 'Kuala Lumpur, MY',
        bullets: [
            'Led a web team in building internal platforms and client-facing applications.',
            'Introduced Vue.js to replace legacy jQuery stacks, improving performance and maintainability.',
            'Developed both frontend and backend modules using Laravel and Vue.',
            'Reviewed PRs, established coding standards and mentored junior developers.',
            'Coordinated cross-team communication to ensure smooth delivery for large enterprise clients.',
        ],
        stack: [
            { name: 'Vue.js', level: 'Strong' },
            { name: 'Laravel', level: 'Core' },
            { name: 'SCSS', level: 'Working' },
            { name: 'REST APIs', level: 'Strong' },
            { name: 'MySQL', level: 'Strong' },
        ],
        outcomes: ['Improved engineering quality', 'Reduced delivery time'],
    },
    {
        id: 'abss',
        type: 'Work',
        company: 'ABSS (Asian Business Software Solutions)',
        role: 'Full Stack Engineer',
        summary:
            'Developed end-to-end enterprise applications and led API integration with UOB Banking systems.',
        period: 'Aug 2022 — Jul 2023',
        location: 'Kuala Lumpur, MY',
        bullets: [
            'Developed enterprise frontend applications using Angular & SCSS.',
            'Built backend services using Laravel & Phalcon, managing authentication, JWT and API architecture.',
            'Led a small team in integrating ABSS systems with UOB Bank, including API contract reading, documentation review, and secure data flow design.',
            'Guided junior developers in reading documentation, writing maintainable code and understanding banking compliance requirements.',
            'Developed Docker-based local development containers for standardized onboarding.',
            'Created REST APIs for external parties to integrate with ABSS products.',
            'Implemented secure communication workflows between multiple enterprise systems.',
        ],
        stack: [
            { name: 'Angular', level: 'Strong' },
            { name: 'Laravel', level: 'Core' },
            { name: 'Phalcon PHP', level: 'Working' },
            { name: 'Docker', level: 'Strong' },
            { name: 'JWT', level: 'Strong' },
            { name: 'REST APIs', level: 'Core' },
        ],
        outcomes: ['UOB banking integration delivered', 'Improved internal API architecture'],
    },
    {
        id: 'bestweb-lead',
        type: 'Work',
        company: 'BestWeb Technologies Sdn Bhd',
        role: 'Development Team Lead',
        summary:
            'Led the engineering team, delivered web + mobile applications and architected backend systems across multiple industries.',
        period: 'Dec 2021 — Jul 2022',
        location: 'Kuala Lumpur, MY',
        bullets: [
            'Managed and mentored a team of developers, planning sprint deliverables and improvement roadmaps.',
            'Developed web apps using CodeIgniter and Laravel including authentication and role-based access systems.',
            'Created clean UI/UX using HTML, CSS, Bootstrap, jQuery and AJAX.',
            'Implemented JWT and custom security layers for client applications.',
            'Integrated multiple external APIs (banks, payment gateways, logistics).',
            'Built reusable modules and templates to accelerate future development.',
            'Created REST APIs for mobile apps and integrated with mobile teams.',
            'Designed web and mobile UI/UX with Figma.',
            'Used AWS (EC2, Lightsail, RDS, S3) for application hosting and deployment.',
        ],
        stack: [
            { name: 'Laravel', level: 'Strong' },
            { name: 'CodeIgniter', level: 'Strong' },
            { name: 'Bootstrap / jQuery', level: 'Strong' },
            { name: 'AWS (EC2/S3/RDS)', level: 'Working' },
            { name: 'REST APIs', level: 'Strong' },
        ],
        outcomes: ['Faster delivery velocity', 'Standardized backend patterns'],
    },
    {
        id: 'zeno',
        type: 'Work',
        company: 'Zeno Group',
        role: 'Web Developer',
        summary:
            'Built and customized marketing and corporate websites using WordPress, WooCommerce and modern frontend tooling.',
        period: 'Sep 2021 — Nov 2021',
        location: 'Kuala Lumpur, MY',
        bullets: [
            'Developed and customized WordPress themes and plugins tailored to client marketing needs.',
            'Implemented WooCommerce features, product logic and checkout customizations for campaign-specific requirements.',
            'Delivered pixel-perfect, responsive interfaces using HTML5, SASS, Bootstrap and JavaScript.',
            'Integrated REST APIs and external services into WordPress websites for dynamic content delivery.',
            'Optimized website performance, SEO structure, caching and security configurations.',
            'Collaborated with design and content teams to rapidly ship high-quality client-facing pages.',
        ],
        stack: [
            { name: 'WordPress', level: 'Core' },
            { name: 'WooCommerce', level: 'Strong' },
            { name: 'PHP', level: 'Core' },
            { name: 'SASS', level: 'Strong' },
            { name: 'Bootstrap', level: 'Strong' },
            { name: 'JavaScript', level: 'Working' },
            { name: 'REST APIs', level: 'Working' },
            { name: 'SQL', level: 'Working' },
            { name: 'Linux', level: 'Working' },
        ],
        outcomes: [
            'Delivered multiple client websites within short project windows',
            'Improved site performance and responsiveness across devices',
            'Strengthened WordPress customization and plugin development expertise',
        ],
    },
    {
        id: 'bestweb-dev',
        type: 'Work',
        company: 'BestWeb Technologies Sdn Bhd',
        role: 'Full-stack Developer',
        summary:
            'Developed full-stack web applications, implemented payment gateways and created reusable backend modules.',
        period: 'Feb 2020 — Aug 2021',
        location: 'Kuala Lumpur, MY',
        bullets: [
            'Built web apps using CodeIgniter and Laravel including dashboards and reporting systems.',
            'Designed UI/UX using HTML, CSS, Bootstrap, jQuery and AJAX.',
            'Implemented JWT authentication and session security.',
            'Integrated payment gateways and external APIs for client systems.',
            'Created reusable components for speeding up future projects.',
            'Developed hybrid mobile apps using Flutter.',
            'Handled MySQL optimisation and schema design.',
        ],
        stack: [
            { name: 'Laravel', level: 'Core' },
            { name: 'CodeIgniter', level: 'Strong' },
            { name: 'Flutter', level: 'Working' },
            { name: 'Bootstrap', level: 'Strong' },
            { name: 'MySQL', level: 'Strong' },
        ],
        outcomes: ['Reusable codebase', 'Faster development cycles'],
    },
    {
        id: 'veeco',
        type: 'Education',
        company: 'VeecoTech Web & Ecommerce',
        role: 'Web Developer (Internship)',
        summary:
            'Worked on CMS platforms, custom plugins and ecommerce features across WordPress, Prestashop and Opencart.',
        period: 'Jan 2019 — Jun 2019',
        location: 'Penang, MY',
        bullets: [
            'Developed and customized plugins for WordPress, Prestashop, Opencart and Joomla.',
            'Fixed bugs, improved UI layouts, and handled client-reported issues.',
            'Learned foundational skills in backend logic, plugin lifecycle and CMS architecture.',
        ],
        stack: [
            { name: 'WordPress', level: 'Strong' },
            { name: 'Prestashop', level: 'Working' },
            { name: 'Opencart', level: 'Working' },
            { name: 'SQL', level: 'Working' },
            { name: 'Bootstrap', level: 'Working' },
        ],
        outcomes: ['First production-ready contributions'],
    },
    {
        id: 'kvbp',
        type: 'Education',
        company: 'Kolej Vokasional Balik Pulau',
        role: 'Diploma in Computer Science (Database and Web Application)',
        summary:
            'Built solid foundations in software development while actively contributing to leadership, public-speaking and national-level exhibitions.',
        period: '2017 — 2019',
        location: 'Penang, MY',
        bullets: [
            'Served as a Student Council representative (Majlis Perwakilan Pelajar), leading student initiatives and managing communication with administration.',
            'Represented the college in national/state exhibitions, presenting software and innovation projects.',
            'Delivered public-speaking sessions and represented students during institutional events.',
            'Appointed as "Penashihat Industri" advising students on industry expectations and career growth.',
            'Completed foundational coursework in programming, systems, and IT operations.',
        ],
        stack: [],
        outcomes: [
            'Recognised as a student leader and industry-facing representative',
            'Strengthened communication and presentation skills',
            'Built early technical groundwork for future engineering career',
        ],
    },
])

const filters = ['All', 'Work', 'Education'] as const
type FilterOption = (typeof filters)[number]

const activeFilter = ref<FilterOption>('All')

const shown = computed(() =>
    activeFilter.value === 'All'
        ? data.value
        : data.value.filter(d => d.type === activeFilter.value)
)

function setFilter(f: FilterOption) {
    activeFilter.value = f
}

/* EXPAND + SIMPLE VISIBILITY */
const expanded = ref<boolean[]>([])
const visible = ref<boolean[]>([])

watch(
    shown,
    list => {
        // reset expanded + make all visible whenever filter changes
        expanded.value = list.map(() => false)
        visible.value = list.map(() => true)
    },
    { immediate: true }
)

function toggle(i: number) {
    expanded.value[i] = !expanded.value[i]
}

/* 3-dot indicator for stack */
function dotFill(level: Level, pos: 1 | 2 | 3) {
    const fill = level === 'Core' ? 3 : level === 'Strong' ? 2 : 1
    return pos <= fill ? 'dot-on' : 'dot-off'
}
</script>

<style scoped>
.card {
    cursor: pointer;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: rgba(15, 15, 15, 0.9);
}

.card:hover {
    border-color: rgba(16, 185, 129, 0.6);
    box-shadow: 0 0 22px rgba(16, 185, 129, 0.18);
    transform: translateY(-2px);
}

/* timeline */
.timeline-dot {
    position: absolute;
    left: 13px;
    top: 30px;
    width: 8px;
    height: 8px;
    border-radius: 999px;
    background: #22c55e;
    box-shadow: 0 0 12px rgba(34, 197, 94, 0.7);
}

/* text */
.title {
    color: #ffffff;
    font-size: 18px;
    line-height: 1.25;
    font-weight: 700;
    letter-spacing: -0.01em;
}

.muted {
    color: rgba(255, 255, 255, 0.5);
    font-size: 13.5px;
}

.desc {
    color: rgba(255, 255, 255, 0.7);
    font-size: 14px;
    line-height: 1.6;
    margin-top: 8px;
}

/* details block */
.details-card {
    background: rgba(0, 0, 0, 0.55);
    border-radius: 10px;
    border: 1px solid rgba(148, 163, 184, 0.3);
    padding: 12px 12px 10px;
}

.section {
    margin-top: 6px;
}

.section-title {
    font-size: 12px;
    color: #9ca3af;
    margin-bottom: 4px;
}

/* stack chips */
.chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: #e5e7eb;
    background: rgba(15, 23, 42, 0.9);
    border: 1px solid rgba(148, 163, 184, 0.7);
    padding: 4px 8px;
    border-radius: 999px;
}

.dots {
    display: inline-flex;
    gap: 2px;
}

.dot {
    width: 6px;
    height: 6px;
    border-radius: 999px;
}

.dot-on {
    background: #22c55e;
}

.dot-off {
    background: rgba(148, 163, 184, 0.5);
}

/* outcomes */
.pill {
    font-size: 12px;
    color: #fef3c7;
    background: rgba(251, 191, 36, 0.12);
    border: 1px solid rgba(251, 191, 36, 0.35);
    padding: 3px 8px;
    border-radius: 999px;
}

/* fade */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.18s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

/* Buttons */
.btn {
    border: 1px solid rgba(255, 255, 255, 0.15);
    background: rgba(255, 255, 255, 0.05);
    color: #e5e7eb;
    font-size: 13px;
    border-radius: 8px;
    padding: 7px 12px;
    cursor: pointer;
    transition: all 0.2s ease;
}

.btn[disabled] {
    opacity: 0.5;
    cursor: not-allowed;
}

.btn:hover {
    border-color: rgba(16, 185, 129, 0.5);
    background: rgba(16, 185, 129, 0.1);
    color: #a7f3d0;
    box-shadow: 0 0 10px rgba(16, 185, 129, 0.2);
    transform: translateY(-1px);
}

.btn:active {
    transform: scale(0.96);
}

.btn.ghost {
    background: transparent;
    color: #9ca3af;
    border-color: rgba(255, 255, 255, 0.1);
}

.btn.ghost:hover {
    color: #d1fae5;
    border-color: rgba(16, 185, 129, 0.4);
}

.btn.ghost.on {
    border-color: rgba(16, 185, 129, 0.6);
    color: #a7f3d0;
}
</style>