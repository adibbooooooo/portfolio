<template>

    <div class="h-full min-h-0">
        <div class="h-full min-h-0">
            <EditorScaffold class="h-full">
                <section class="space-y-6 pt-8 fade-left">
                    <header>
                        <h1 class="normal-font text-white font-extrabold leading-[1.05] text-[34px] md:text-5xl">
                            Work <span class="text-neutral-400">Showcase</span>
                        </h1>
                        <p class="mt-2 min-h-[2.5rem] text-sm leading-relaxed text-white/60 max-w-2xl">
                            Shipped work, problem-solving stories, and interactive demos that show how I build.
                        </p>
                    </header>

                    <div class="flex flex-wrap items-center gap-2 gap-y-3">
                        <div
                            class="inline-flex rounded-lg border border-white/15 bg-white/[0.04] p-0.5"
                            role="tablist"
                            aria-label="Showcase sections">
                            <button
                                v-for="s in showcaseSectionOptions"
                                :key="s.id"
                                type="button"
                                role="tab"
                                :aria-selected="activeSection === s.id"
                                class="px-3 py-1.5 rounded-md text-sm font-medium transition cursor-pointer"
                                :class="
                                    activeSection === s.id
                                        ? 'bg-emerald-400/15 text-emerald-200 shadow-sm ring-1 ring-emerald-400/35'
                                        : 'text-white/75 hover:text-white hover:bg-white/5'
                                "
                                @click="setShowcaseSection(s.id)">
                                {{ s.label }}
                            </button>
                        </div>

                        <button
                            type="button"
                            @click="pickRandomDemo"
                            class="inline-flex items-center gap-1.5 rounded-lg border border-amber-400/35 bg-amber-400/10 px-3 py-1.5 text-sm font-medium text-amber-100 transition hover:bg-amber-400/15 cursor-pointer"
                            title="Opens a random item from the current tab"
                            aria-label="Surprise me: open a random item">
                            <i class="pi pi-sparkles text-[12px]" />
                            Surprise me
                        </button>
                    </div>

                    <div class="flex flex-wrap items-center gap-2 gap-y-3">
                        <div
                            v-if="activeSection === 'demos'"
                            class="inline-flex rounded-lg border border-white/15 bg-white/[0.04] p-0.5"
                            role="tablist"
                            aria-label="Demo categories">
                            <button v-for="t in tabs" :key="t" type="button" role="tab"
                                :aria-selected="activeTab === t" @click="activeTab = t"
                                class="px-3 py-1.5 rounded-md text-sm font-medium transition cursor-pointer"
                                :class="activeTab === t
                                    ? 'bg-emerald-400/15 text-emerald-200 shadow-sm ring-1 ring-emerald-400/35'
                                    : 'text-white/75 hover:text-white hover:bg-white/5'">
                                {{ t }}
                            </button>
                        </div>

                        <div v-if="activeSection === 'demos'" class="hidden md:block mx-1 h-5 w-px bg-white/10"></div>

                        <div class="relative min-w-[200px] flex-1 max-w-md">
                            <input v-model.trim="q" :placeholder="searchPlaceholder"
                                class="w-full pl-8 pr-3 py-1.5 rounded-md bg-white/5 border border-white/15 text-white/90 placeholder-white/30 focus:outline-none focus:border-emerald-400/50 text-sm" />
                            <i
                                class="pi pi-search absolute left-2 top-1/2 -translate-y-1/2 text-white/50 text-[12px]" />
                        </div>
                    </div>

                    <!-- Grid -->
                    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        <button v-for="d in filtered" :key="d.id" @click="openDemo(d.id)"
                            class="group relative text-left rounded-xl border border-white/10 bg-[#141414] p-4 overflow-hidden hover:border-white/20 transition cursor-pointer hover:scale-[1.01]">
                            <!-- faint bg logo -->
                            <span class="absolute inset-0 opacity-[.08] bg-no-repeat bg-right-bottom"
                                :style="{ backgroundImage: `url(${d.logo})`, backgroundSize: d.logoBgSize ?? '40%' }" />
                            <span class="absolute inset-0 bg-gradient-to-tr from-black/10 to-transparent" />

                            <span
                                v-if="d.isCase"
                                class="absolute bottom-3 right-3 z-20 inline-flex items-center rounded-md border border-sky-300/45 bg-sky-400/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-sky-100">
                                Story
                            </span>
                            <span
                                v-else-if="d.aiBadge"
                                class="absolute bottom-3 right-3 z-20 inline-flex items-center rounded-md border border-amber-300/55 bg-gradient-to-br from-amber-200/25 via-yellow-500/20 to-amber-600/30 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-amber-50 shadow-[0_0_12px_rgba(251,191,36,0.25)]">
                                AI Agent
                            </span>

                            <div class="relative z-10">
                                <div class="flex items-start justify-between gap-2">
                                    <h3 class="normal-font min-w-0 flex-1 text-white text-[16px] font-semibold leading-snug">{{ d.title }}</h3>
                                </div>

                                <p class="mt-2 text-sm leading-snug text-white/70">{{ d.pitch }}</p>

                                <div class="mt-3 flex flex-wrap gap-2">
                                    <span v-for="t in d.tags" :key="t"
                                        class="text-[11px] px-2 py-0.5 rounded border border-white/15 bg-white/5 text-white/75">
                                        {{ t }}
                                    </span>
                                </div>

                                <div class="mt-4 flex items-center gap-2 text-[12px] text-emerald-300">
                                    {{ openCardLabel(d) }}
                                    <i class="pi pi-angle-right translate-y-[1px]" />
                                </div>
                            </div>
                        </button>
                    </div>

                    <!-- Drawer -->
                    
                        <!-- Drawer -->
                        <div v-if="drawerOpen" class="fixed inset-0 z-[10040]">
                            <!-- Backdrop -->
                            <transition name="backdrop" appear>
                                <div class="absolute inset-0 bg-black/60" @click="closeDrawer" key="backdrop" />
                            </transition>

                            <!-- Panel -->
                            <transition name="panel" appear>
                                <aside key="panel"
                                    class="absolute right-0 top-0 h-full w-full sm:w-[600px] md:w-[820px] lg:w-[1000px] xl:w-[1120px] bg-[#111] border-l border-white/10 will-change-transform will-change-opacity">
                                    <div class="flex items-center justify-between px-4 py-3 border-b border-white/10">
                                        <div class="flex items-center gap-2 min-w-0">
                                            <img :src="active?.logo" alt=""
                                                class="h-6 w-6 shrink-0 object-contain rounded bg-white" />
                                            <div class="min-w-0">
                                                <div class="flex flex-wrap items-center gap-2 gap-y-1">
                                                    <div class="text-white font-semibold leading-tight truncate">{{ active?.title }}
                                                    </div>
                                                    <span v-if="active?.featured"
                                                        class="shrink-0 inline-flex items-center rounded border border-amber-400/40 bg-amber-400/12 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-amber-100">
                                                        Featured
                                                    </span>
                                                    <span v-if="active?.aiBadge"
                                                        class="shrink-0 inline-flex items-center rounded-md border border-amber-300/55 bg-gradient-to-br from-amber-200/25 via-yellow-500/20 to-amber-600/30 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-amber-50">
                                                        AI Agent
                                                    </span>
                                                </div>
                                                <div class="text-[12px] text-white/60">{{ active?.subtitle }}</div>
                                            </div>
                                        </div>
                                        <button
                                            class="h-8 w-8 grid place-items-center rounded bg-white/5 text-white/80 hover:bg-white/10 cursor-pointer"
                                            @click="closeDrawer" aria-label="Close">
                                            <i class="pi pi-times text-[13px]" />
                                        </button>
                                    </div>

                                    <div class="p-4 space-y-4 overflow-y-auto h-[calc(100%-49px)]">
                                        <!-- Live area (:key remounts on each Surprise so the drawer does not feel "stuck") -->
                                        <div :key="`${active?.id ?? ''}-${liveMountKey}`"
                                            class="rounded-lg border border-white/10 bg-black/30 overflow-hidden">
                                            <component v-if="active?.component" :is="active.component" />
                                            <!-- Wedding / engagement: show mirror preview; click overlay opens canonical site -->
                                            <div v-else-if="active?.url && active.clickPreviewOpensCanonical"
                                                class="relative h-[340px] w-full bg-[#0e0f10] overflow-hidden isolate">
                                                <iframe v-if="activePreviewSrc" :src="activePreviewSrc"
                                                    class="pointer-events-none absolute inset-0 h-full w-full border-0 opacity-[0.92]"
                                                    tabindex="-1" loading="lazy" title="Demo preview snapshot" />
                                                <div v-else class="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.06] to-transparent" />
                                                <button type="button"
                                                    class="absolute inset-0 z-10 flex cursor-pointer flex-col items-center justify-center gap-2 bg-black/55 px-4 text-center text-white transition hover:bg-black/65"
                                                    @click.stop="openFullDemoInNewTab(active.url!)">
                                                    <span class="text-sm font-medium text-emerald-200">Open full site</span>
                                                    <span class="text-xs text-white/55">Click anywhere in this preview</span>
                                                </button>
                                            </div>
                                            <iframe v-else-if="activePreviewSrc" :src="activePreviewSrc"
                                                class="h-[340px] w-full border-0 bg-[#0e0f10]" loading="lazy"
                                                :title="active?.title ?? 'Demo preview'" />
                                        </div>

                                        <div class="space-y-2">
                                            <h4 class="text-white font-semibold">What this shows</h4>
                                            <ul class="list-disc list-inside text-white/80 text-[14px] leading-6">
                                                <li v-for="n in active?.notes" :key="n">{{ n }}</li>
                                            </ul>
                                        </div>

                                        <div class="space-y-1">
                                            <h4 class="text-white font-semibold">Stack</h4>
                                            <div class="flex flex-wrap gap-2">
                                                <span v-for="t in active?.stack" :key="t"
                                                    class="text-[12px] px-2 py-0.5 rounded border border-white/15 bg-white/5 text-white/80">
                                                    {{ t }}
                                                </span>
                                            </div>
                                        </div>

                                        <div v-if="active?.url" class="flex flex-wrap gap-2">
                                            <a :href="active.url" target="_blank" rel="noopener noreferrer"
                                                class="inline-flex items-center gap-2 rounded border border-emerald-400/40 bg-emerald-400/10 px-3 py-1.5 text-emerald-200 hover:bg-emerald-400/15">
                                                {{ active.isCase ? 'Open story' : active.featured ? 'Open project' : 'Open full demo' }}
                                                <i class="pi pi-arrow-up-right text-[11px]" />
                                            </a>
                                        </div>
                                    </div>
                                </aside>
                            </transition>
                        </div>
                </section>
            </EditorScaffold>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, markRaw } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import EditorScaffold from '@/components/EditorScaffold.vue'
import VueChartDemo from '@/components/demos/VueChartDemo.vue'
import FramerMotionDemo from '@/components/demos/FramerMotionDemo.vue'
import NumberFlowCountdownDemo from '@/components/demos/NumberFlowCountdownDemo.vue'
import LenisScrollDemo from '@/components/demos/LenisScrollDemo.vue'
import TailwindPlayground from '@/components/demos/TailwindPlayground.vue'
import ThreeCharacterDemo from '@/components/demos/ThreeCharacterDemo.vue'
import LottieLab from '@/components/demos/LottieLab.vue'
import LaravelExplorer from '@/components/demos/LaravelExplorer.vue'
import KonvaDemo from '@/components/demos/KonvaDemo.vue'
import NodeJsDemo from '@/components/demos/NodeJsDemo.vue'
import MySqlQueryVisualizer from '@/components/demos/MySqlQueryVisualizer.vue'
import ChartingToolsDemo from '@/components/demos/ChartingToolsDemo.vue'
import { withPreviewCacheBust } from '@/lib/demoPreviewUrl'
import { useAskAdibModal } from '@/composables/useAskAdibModal'

type Demo = {
    id: string
    title: string
    subtitle?: string
    pitch: string
    logo: string
    group: 'Frontend' | 'Backend' | 'AI'
    tags: string[]
    confidence: number
    /** Shipped product / full app — not an in-page skill sandbox */
    featured?: boolean
    /** Gold “AI Agent” badge — product uses an AI agent, not “building AI”. */
    aiBadge?: boolean
    /** Problem-solving case study (work.showcase → Cases tab). */
    isCase?: boolean
    component?: any
    url?: string
    /** When set + clickPreviewOpensCanonical, shown under the click-to-open overlay (mirrors iframe-friendly URL). */
    previewUrl?: string
    /** If true: preview pane click opens canonical `url` in a new tab (wedding / engagement only). */
    clickPreviewOpensCanonical?: boolean
    /** Card watermark size (sticker art often reads better slightly larger). */
    logoBgSize?: string
    /** Card click opens AI-dib chat modal instead of the detail drawer. */
    openAskAdibChat?: boolean
    notes: string[]
    stack: string[]
}

const { openAskAdibModal } = useAskAdibModal()

/** Featured products always sort first, in this order (when present in the current tab/filter). */
const FEATURED_DEMO_ORDER = [
    'pr.adibomar.com',
    'ask-adib-rag',
    'habo-gencards',
    'gym',
    'haboforever.com',
    'engagement.haboforever.com',
    'gender-reveal.haboforever.com',
    'safiya-adilah.adibomar.com',
    'habo-chain',
] as const

/** Stories tab display order (first wins). */
const STORY_DEMO_ORDER = ['case-pr', 'case-nft'] as const

function siteFavicon(hostname: string): string {
    return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(hostname)}&sz=128`
}

function sortFeaturedDemosFirst(list: Demo[]): Demo[] {
    const inList = new Set(list.map((d) => d.id))
    const head: Demo[] = []
    for (const id of FEATURED_DEMO_ORDER) {
        if (!inList.has(id)) continue
        const d = list.find((x) => x.id === id)
        if (d) head.push(d)
    }
    const headIds = new Set(head.map((d) => d.id))
    return [...head, ...list.filter((d) => !headIds.has(d.id))]
}

function sortStoryDemosFirst(list: Demo[]): Demo[] {
    const inList = new Set(list.map((d) => d.id))
    const head: Demo[] = []
    for (const id of STORY_DEMO_ORDER) {
        if (!inList.has(id)) continue
        const d = list.find((x) => x.id === id)
        if (d) head.push(d)
    }
    const headIds = new Set(head.map((d) => d.id))
    return [...head, ...list.filter((d) => !headIds.has(d.id))]
}

const DEMOS: Demo[] = [
    {
        id: 'habo-gencards',
        title: 'Habo GenCards',
        subtitle: 'Live App',
        pitch: 'Polished TCG cards in seconds with Framer Motion, CSS holo shine, and React.',
        logo: '/stack/react.png',
        group: 'Frontend',
        tags: ['React', 'Framer Motion', 'CSS', 'TCG'],
        confidence: 87,
        featured: true,
        url: 'https://habo-gencards.adibomar.com',
        notes: [
            'Card creation pipeline that produces finished-looking TCG cards almost instantly',
            'Framer Motion handles card interactions: motion, gestures, and smooth layout transitions',
            'CSS-driven shine and holographic treatments for a premium collectible-card look',
            'Shipped as a React SPA with a responsive, component-driven structure'
        ],
        stack: ['React', 'Framer Motion', 'CSS']
    },
    {
        id: 'haboforever.com',
        title: 'Wedding Invitations',
        subtitle: 'Wedding Webite',
        pitch: 'Vue 3 wedding invites with Lottie animation for guests on phone or desktop.',
        logo: '/habo-logo.png',
        group: 'Frontend',
        tags: ['Vue 3', 'Lottie', 'Wedding Invitation'],
        confidence: 93,
        featured: true,
        url: 'https://haboforever.com',
        previewUrl: 'https://wedding.adibomar.com',
        clickPreviewOpensCanonical: true,
        notes: [
            'Wedding invitation website planned and built end-to-end',
            'Polished interactions and transitions to make the invitation feel personal',
            'Lottie animations used for tasteful motion moments throughout the flow',
            'Responsive design for both phone and desktop guests'
        ],
        stack: ['Vue 3', 'Lottie']
    },
    {
        id: 'engagement.haboforever.com',
        title: 'Engagement Invitation',
        subtitle: 'Engagement Website',
        pitch: 'Vue 3 engagement site with date, venue, and dress code on mobile.',
        logo: '/habo-logo.png',
        group: 'Frontend',
        tags: ['Vue 3', 'Engagement Site', 'Responsive UI'],
        confidence: 92,
        featured: true,
        url: 'https://engagement.haboforever.com',
        previewUrl: 'https://engagement.adibomar.com',
        clickPreviewOpensCanonical: true,
        notes: [
            'Dedicated engagement website tailored for event storytelling',
            'Built with Vue 3 components for clean structure and maintainability',
            'Mobile-first layout so guests can access details smoothly',
            'Minimal, elegant interface focused on clarity'
        ],
        stack: ['Vue 3']
    },
    {
        id: 'gym',
        title: 'Gym Website',
        subtitle: 'Real Project',
        pitch: 'Vue 3 gym site with responsive layout and smooth class browsing.',
        logo: '/stack/vue.png',
        group: 'Frontend',
        tags: ['Vue 3', 'Frontend', 'Responsive UI'],
        confidence: 88,
        featured: true,
        url: 'https://gym.adibomar.com',
        notes: [
            'Built using Vue 3 only for the full frontend implementation',
            'Component-based architecture for reusable UI sections',
            'Responsive layout optimized for desktop and mobile',
            'Smooth interactions and polished user experience'
        ],
        stack: ['Vue 3']
    },
    {
        id: 'pr.adibomar.com',
        title: 'Pull Request Creator',
        subtitle: 'PR Creator · AI Summarize',
        pitch: 'PR builder with AI Summarize: bullets in, structured markdown out.',
        logo: '/stack/github.webp',
        group: 'AI',
        tags: ['Vue 3', 'AI Agent', 'Markdown', 'PR'],
        confidence: 90,
        featured: true,
        aiBadge: true,
        url: 'https://pr.adibomar.com',
        notes: [
            'Guided UI for comprehensive PR bodies with consistent sections',
            'AI Summarize: paste bullet notes → structured PR markdown (Ollama Cloud)',
            'Copy-ready output for GitHub and GitLab',
            'Useful for teams that want standardized PR templates'
        ],
        stack: ['Vue 3', 'AI Agent', 'Markdown', 'Developer Tooling']
    },
    {
        id: 'gender-reveal.haboforever.com',
        title: 'Gender Reveal RSVP',
        subtitle: 'Friends & family',
        pitch: 'Gender reveal RSVP: confirm attendance and get event details on mobile.',
        logo: '/showcase/gender-reveal-love.png',
        logoBgSize: '48%',
        group: 'Frontend',
        tags: ['Vue 3', 'RSVP', 'Event site'],
        confidence: 90,
        featured: true,
        url: 'https://gender-reveal.haboforever.com',
        previewUrl: 'https://gender-reveal.haboforever.com',
        clickPreviewOpensCanonical: true,
        notes: [
            'RSVP captures who is coming and headcount so we can plan food and seating',
            'One page for date, location, dress code, and reveal-day details on mobile',
            'Vue 3 site I designed and shipped; preview here opens the live guest site',
        ],
        stack: ['Vue 3'],
    },
    {
        id: 'safiya-adilah.adibomar.com',
        title: 'Birthday Surprise',
        subtitle: 'Birthday site',
        pitch: 'Surprise birthday site with photos, wishes, and party details on mobile.',
        logo: '/showcase/birthday-cake.png',
        logoBgSize: '48%',
        group: 'Frontend',
        tags: ['Vue 3', 'Birthday', 'Personal'],
        confidence: 90,
        featured: true,
        url: 'https://safiya-adilah.adibomar.com',
        previewUrl: 'https://safiya-adilah.adibomar.com',
        clickPreviewOpensCanonical: true,
        notes: [
            'Built as a surprise: gallery, personal notes, and a simple party schedule',
            'Warm, playful tone so family and friends can enjoy it without instructions',
            'Vue 3, mobile-first; click the preview to open the full birthday site',
        ],
        stack: ['Vue 3'],
    },
    {
        id: 'habo-chain',
        title: '$HABO',
        subtitle: 'TON · Personal token',
        pitch: 'Personal $HABO token on TON by Hanis and Adib. A Web3 page that tells the story and links to explore on-chain.',
        logo: '/stack/vue.png',
        group: 'Frontend',
        tags: ['TON', 'Web3', 'Personal'],
        confidence: 85,
        featured: true,
        url: 'https://habo-chain.adibomar.com/',
        notes: [
            'Public Web3 portfolio piece with a clear narrative',
            'Shows comfort shipping unconventional product ideas',
        ],
        stack: ['Vue 3', 'Web3'],
    },
    {
        id: 'case-pr',
        title: 'PR Creator',
        subtitle: 'Problem-solving story',
        pitch: 'How PR Creator helps the team write better pull requests with templates and AI Summarize.',
        logo: '/stack/github.webp',
        group: 'AI',
        tags: ['Story', 'Vue 3', 'AI Agent', 'PR'],
        confidence: 92,
        isCase: true,
        url: 'https://case-pr.adibomar.com/',
        notes: [
            'Inconsistent PR descriptions were slowing reviews and losing context',
            'Guided sections plus AI Summarize turn rough bullets into paste-ready markdown',
            'Open the story site for the problem, build, and how the team uses it',
        ],
        stack: ['Vue 3', 'AI Agent', 'Markdown'],
    },
    {
        id: 'case-nft',
        title: 'NFT Images',
        subtitle: 'Problem-solving story',
        pitch: 'Automated download and pixelation so the team ships NFT assets faster with less manual work.',
        logo: '/showcase/nft-collectibles.png',
        logoBgSize: '48%',
        group: 'Backend',
        tags: ['Story', 'Automation', 'Laravel', 'NFT'],
        confidence: 92,
        isCase: true,
        url: 'https://case-nft.adibomar.com',
        notes: [
            'Replaced one-by-one downloads and pixel edits with a repeatable pipeline',
            'Less manual busywork for design and ops during NFT drops',
            'Open the story site for the workflow, tooling, and what we learned',
        ],
        stack: ['Laravel', 'Automation', 'Image processing'],
    },
    {
        id: 'ask-adib-rag',
        title: 'Ask AI-dib',
        subtitle: 'Portfolio chat',
        pitch: 'Ask AI-dib about my work; answers are grounded in this portfolio via RAG.',
        logo: '/ai-dib.webp',
        group: 'AI',
        tags: ['RAG', 'Ollama', 'Gemini', 'Supabase'],
        confidence: 88,
        featured: true,
        aiBadge: true,
        openAskAdibChat: true,
        notes: [
            'Ollama gates small talk; Supabase vectors + Gemini answer portfolio questions',
            'Knowledge is ingested from this site’s real copy, not scraped from the open web',
            'PHP API keeps keys off the client; click the card to open chat and try a question',
        ],
        stack: ['PHP', 'Supabase', 'Gemini', 'Ollama'],
    },
    {
        id: 'vue',
        title: 'Vue.js',
        subtitle: 'Skill Demo',
        pitch: 'Live chart demo powered by Vue 3 reactivity. Change inputs and watch the dashboard update instantly.',
        logo: '/stack/vue.png',
        group: 'Frontend',
        tags: ['Vue 3', 'Reactivity', 'Dashboard', 'Charts'],
        confidence: 90,
        component: markRaw(VueChartDemo),
        notes: [
            'Live charts that react as data changes',
            'Clean layout built with Vue 3 and Tailwind',
            'Smooth, animated visuals for better UX',
            'Simple example of a Vue-powered dashboard'
        ],
        stack: ['Vue 3', 'Tailwind', 'Chart.js']
    },
    {
        id: 'charting-tools',
        title: 'TradingView',
        subtitle: 'Live Mock Chart',
        pitch: 'Mock candlestick chart for HABO/AO price ticks. Built with lightweight-charts entirely on the frontend.',
        logo: '/stack/trading-view.png',
        group: 'Frontend',
        tags: ['AO Token', 'Candlestick', 'Mock Data'],
        confidence: 87,
        component: markRaw(ChartingToolsDemo),
        notes: [
            'Runs entirely on the frontend with no backend dependency',
            'Generates random up/down price action to simulate live market ticks',
            'Uses candlestick visualization for realistic charting behavior'
        ],
        stack: ['Vue 3', 'TypeScript', 'lightweight-charts']
    },
    {
        id: 'framer-motion',
        title: 'Framer Motion',
        subtitle: 'motion-v',
        pitch: 'motion-v demo: springs, bento cards, logo marquee, and draggable chips.',
        logo: '/stack/framer-motion.png',
        group: 'Frontend',
        tags: ['motion-v', 'Framer Motion', 'Gestures'],
        confidence: 88,
        component: markRaw(FramerMotionDemo),
        notes: [
            'Ambient gradients + grid backdrop for depth',
            'Infinite marquee + drag gesture'
        ],
        stack: ['Vue 3', 'motion-v', 'Framer Motion']
    },
    {
        id: 'number-flow',
        title: 'NumberFlow',
        subtitle: 'Animated digits',
        pitch: 'Morphing digit countdown using NumberFlow.',
        logo: '/stack/vue.png',
        group: 'Frontend',
        tags: ['NumberFlow', 'Countdown', 'Typography'],
        confidence: 85,
        component: markRaw(NumberFlowCountdownDemo),
        notes: [
            'Synced digit group for days, hours, minutes, seconds',
            'Inspired by landing pages like Fragment’s live timer'
        ],
        stack: ['Vue 3', '@number-flow/vue']
    },
    {
        id: 'lenis',
        title: 'Lenis',
        subtitle: 'Smooth scroll',
        pitch: 'Lenis smooth scroll through Frontend, Backend, and Tools in this drawer.',
        logo: '/stack/lenis.png',
        group: 'Frontend',
        tags: ['Lenis', 'Scroll', 'UX'],
        confidence: 84,
        component: markRaw(LenisScrollDemo),
        notes: [
            'Mirrors the Tech Stack page idea: logos, blurbs, and confidence % in one scrollable panel',
            'Jump links snap to chapters; wheel feels weighted inside the drawer only',
            'resize() on image load so Lenis tracks real content height'
        ],
        stack: ['Vue 3', 'Lenis']
    },
    {
        id: 'tailwind',
        title: 'Tailwind',
        subtitle: 'Skill Demo',
        pitch: 'Tailwind playground: tweak utility classes and preview component styles in real time inside the drawer.',
        logo: '/stack/tailwind.png',
        group: 'Frontend',
        tags: ['Tailwind', 'UI Design', 'Responsive'],
        confidence: 92,
        component: markRaw(TailwindPlayground),
        notes: [
            'Try different Tailwind utilities and see instant changes',
            'Demonstrates hands-on, utility-first styling workfloW'
        ],
        stack: ['Tailwind CSS', 'Vue 3']
    },
    {
        id: 'threejs',
        title: 'Three.js',
        subtitle: 'Skill Demo',
        pitch: 'Three.js GLB viewer with clip picker, play/stop, speed control, and auto camera fit to the model.',
        logo: '/stack/threejs.png',
        group: 'Frontend',
        tags: ['three.js', 'GLTF'],
        confidence: 70,
        component: markRaw(ThreeCharacterDemo),
        notes: [
            'Auto-fits model to frame via bounding box and ground alignment',
            'Selectable animation clips from GLB, with Play/Stop controls',
            'Adjustable animation speed (0.5×, 1×, 1.5×, 2×)',
        ],
        stack: ['Three.js', 'GLTFLoader', 'DRACOLoader', 'Vue 3', 'TypeScript']
    },
    {
        id: 'konva',
        title: 'Konva.js',
        subtitle: 'Canvas Mini Game',
        pitch: 'Konva mini game: a bot collects stars on a grid with bursts, scoring, and speed controls.',
        logo: '/stack/konva.png',
        group: 'Frontend',
        tags: ['Konva', 'Canvas', 'Animation'],
        confidence: 58,
        component: markRaw(KonvaDemo),
        notes: [
            'Autonomous bot collects falling stickers',
            'Collision & burst animations via Konva.Tween',
            'Adjustable speed, start/pause and reset controls'
        ],
        stack: ['Konva', 'Vue 3', 'Vite']
    },
    {
        id: 'laravel',
        title: 'Laravel',
        subtitle: 'Skill Demo',
        pitch: 'Laravel Validator explorer: try required, email, min, max, and same rules and read the error messages.',
        logo: '/stack/laravel.png',
        group: 'Backend',
        tags: ['Laravel', 'Validator', 'FormRequest'],
        confidence: 96,
        component: markRaw(LaravelExplorer),
        notes: [
            'Clear, Laravel validator error messaging',
            'Preset scenarios (Register, Create Invoice, Contact)',
            'Mini validator mirrors common rules'
        ],
        stack: ['Laravel (concept)', 'Vue 3']
    },
    {
        id: 'nodejs',
        title: 'Node.js',
        subtitle: 'Skill Demo',
        pitch: 'Fake Linux terminal for Node.js and npm commands. Shows how I explain runtime and CLI workflows.',
        logo: '/stack/nodejs.png',
        group: 'Backend',
        tags: ['Node.js', 'CLI', 'Runtime'],
        confidence: 80,
        component: markRaw(NodeJsDemo),
        notes: [
            'Understands Node.js runtime and event loop fundamentals',
            'Experienced with npm scripts, CLI tools, and automation',
            'Proficient in building backend scripts and utilities',
        ],
        stack: ['Node.js', 'Vue 3', 'Vite']
    },
    {
        id: 'mysql',
        title: 'MySQL',
        subtitle: 'Skill Demo',
        pitch: 'SQL builder demo: change SELECT, WHERE, ORDER, and LIMIT and see the result set update live.',
        logo: '/stack/mysql.png',
        group: 'Backend',
        tags: ['MySQL', 'SQL', 'Data Modeling'],
        confidence: 88,
        component: markRaw(MySqlQueryVisualizer),
        notes: [
            'Solid grasp of SQL (SELECT/WHERE/ORDER/LIMIT/JOINS)',
            'Designs relational schemas & indices for performance',
            'Comfortable with migrations, seeding and data integrity'
        ],
        stack: ['MySQL', 'SQL', 'Vue 3']
    },
    {
        id: 'lottie',
        title: 'Lottie',
        subtitle: 'Skill Demo',
        pitch: 'Lottie micro-interactions: hover to preview, click for bounce feedback, one shared player instance.',
        logo: '/stack/lottie.png',
        group: 'Frontend',
        tags: ['Lottie', 'Motion Design', 'Micro-Interactions'],
        confidence: 76,
        component: markRaw(LottieLab),
        notes: [
            'Hover plays Lottie preview instantly',
            'Click triggers micro-bounce (interaction feedback)',
            'Single-instance Lottie runtime (crash-proof)',
            'Demonstrates tactile UI motion principles'
        ],
        stack: ['Lottie', 'Tailwind CSS', 'Vue 3 Composition API']
    }
]

/* sections + tabs + search */
type ShowcaseSection = 'projects' | 'stories' | 'demos'

const showcaseSectionOptions: { id: ShowcaseSection; label: string }[] = [
    { id: 'projects', label: 'Projects' },
    { id: 'stories', label: 'Stories' },
    { id: 'demos', label: 'Demos' },
]

function parseShowcaseSection(raw: unknown): ShowcaseSection {
    if (raw === 'stories' || raw === 'cases') return 'stories'
    if (raw === 'demos') return 'demos'
    return 'projects'
}

const activeSection = ref<ShowcaseSection>('projects')

const searchPlaceholder = computed(() => {
    switch (activeSection.value) {
        case 'projects':
            return 'Search projects…'
        case 'stories':
            return 'Search stories…'
        default:
            return 'Search demos…'
    }
})

type TabId = 'All' | 'Frontend' | 'Backend' | 'AI'
const tabs: TabId[] = ['All', 'Frontend', 'Backend', 'AI']
const activeTab = ref<TabId>('All')
const q = ref('')

const matchesSearch = (d: Demo, term: string) =>
    !term ||
    d.title.toLowerCase().includes(term) ||
    d.tags.some(t => t.toLowerCase().includes(term)) ||
    d.pitch.toLowerCase().includes(term) ||
    (term === 'featured' && d.featured) ||
    (term === 'shipped' && d.featured)

const sectionPool = computed(() => {
    switch (activeSection.value) {
        case 'projects':
            return DEMOS.filter((d) => d.featured && !d.isCase)
        case 'stories':
            return DEMOS.filter((d) => d.isCase)
        case 'demos':
            return DEMOS.filter(
                (d) =>
                    !d.isCase &&
                    (!d.featured || d.openAskAdibChat) &&
                    (d.component || d.openAskAdibChat || (d.group === 'AI' && !!d.url)),
            )
    }
})

function demoMatchesStackTab(d: Demo, tab: TabId): boolean {
    if (tab === 'All') return true
    if (tab === 'AI') {
        return d.group === 'AI' || d.aiBadge === true
    }
    return d.group === tab
}

const listMatchingTab = computed(() => {
    if (activeSection.value !== 'demos') {
        return sortFeaturedDemosFirst([...sectionPool.value])
    }

    let pool = [...sectionPool.value]
    if (activeTab.value === 'AI') {
        const aiFeatured = DEMOS.filter(
            (d) => d.featured && !d.isCase && (d.aiBadge || d.openAskAdibChat),
        )
        const ids = new Set<string>()
        const merged: Demo[] = []
        for (const d of [...aiFeatured, ...pool.filter((item) => demoMatchesStackTab(item, 'AI'))]) {
            if (ids.has(d.id)) continue
            ids.add(d.id)
            merged.push(d)
        }
        pool = merged
    } else if (activeTab.value !== 'All') {
        pool = pool.filter((d) => d.group === activeTab.value)
    }

    return sortFeaturedDemosFirst(pool)
})

const filtered = computed(() => {
    const term = q.value.toLowerCase()
    const matches = listMatchingTab.value.filter((d) => matchesSearch(d, term))
    if (activeSection.value === 'stories') return sortStoryDemosFirst(matches)
    return sortFeaturedDemosFirst(matches)
})

function openCardLabel(d: Demo): string {
    if (d.openAskAdibChat) return 'Open chat'
    if (d.isCase) return 'Read story'
    if (d.featured) return 'View project'
    return 'Open demo'
}

/* drawer + deep link */
const route = useRoute()
const router = useRouter()

function setShowcaseSection(section: ShowcaseSection) {
    activeSection.value = section
    q.value = ''
    const params = new URLSearchParams(route.query as Record<string, string>)
    params.set('section', section)
    if (section !== 'demos') {
        activeTab.value = 'All'
    }
    router.replace({ query: Object.fromEntries(params.entries()) })
}
const drawerOpen = ref(false)
const active = ref<Demo | null>(null)
/** Last id opened via Surprise me — avoided on the next pick when other demos exist */
const lastSurprisePick = ref<string | null>(null)
/** Bumps on each Surprise pick so the live preview remounts (avoids stale reused component / iframe) */
const liveMountKey = ref(0)

const activePreviewSrc = computed(() => {
    const d = active.value
    if (!d) return ''
    const base = d.previewUrl ?? d.url
    if (!base) return ''
    return withPreviewCacheBust(base, liveMountKey.value)
})

function openFullDemoInNewTab(url: string) {
    window.open(url, '_blank', 'noopener,noreferrer')
}

const randomIndex = (n: number) => {
    if (n <= 1) return 0
    const buf = new Uint32Array(1)
    crypto.getRandomValues(buf)
    return buf[0]! % n
}

const openDemo = (id: string) => {
    const params = new URLSearchParams(route.query as Record<string, string>)

    if (!id) {
        active.value = null
        drawerOpen.value = false
        params.delete('tool')
        router.replace({ query: Object.fromEntries(params.entries()) })
        return
    }

    const d = DEMOS.find((x) => x.id === id) || null
    if (!d) {
        active.value = null
        drawerOpen.value = false
        params.delete('tool')
        router.replace({ query: Object.fromEntries(params.entries()) })
        return
    }

    if (d.openAskAdibChat) {
        active.value = null
        drawerOpen.value = false
        params.set('tool', d.id)
        router.replace({ query: Object.fromEntries(params.entries()) })
        openAskAdibModal()
        return
    }

    active.value = d
    drawerOpen.value = true
    liveMountKey.value += 1
    params.set('tool', d.id)
    router.replace({ query: Object.fromEntries(params.entries()) })
}

const pickRandomDemo = () => {
    let pool: Demo[] = [...filtered.value]
    if (pool.length === 0) pool = [...listMatchingTab.value]
    if (pool.length === 0) pool = [...sectionPool.value]

    const currentId = active.value?.id
    const avoidLast = lastSurprisePick.value

    const withoutCurrent = currentId ? pool.filter(d => d.id !== currentId) : pool
    const withoutLast =
        avoidLast && withoutCurrent.length > 1
            ? withoutCurrent.filter(d => d.id !== avoidLast)
            : withoutCurrent

    let candidates = withoutLast.length > 0 ? withoutLast : withoutCurrent
    if (candidates.length === 0) candidates = pool

    if (candidates.length === 0) return
    const pick = candidates[randomIndex(candidates.length)]
    if (!pick) return
    lastSurprisePick.value = pick.id
    liveMountKey.value += 1
    openDemo(pick.id)
}

const closeDrawer = () => openDemo('')

onMounted(() => {
    const pre = route.query.tool as string | undefined
    if (pre) {
        const d = DEMOS.find((x) => x.id === pre)
        if (d?.isCase) activeSection.value = 'stories'
        else if (d?.featured) activeSection.value = 'projects'
        else if (d?.component || d?.openAskAdibChat) activeSection.value = 'demos'
        if (d?.openAskAdibChat) openAskAdibModal()
        else if (d) openDemo(pre)
    } else {
        activeSection.value = parseShowcaseSection(route.query.section)
    }
})

watch(
    () => route.query.section,
    (v) => {
        activeSection.value = parseShowcaseSection(v)
    },
)

watch(() => route.query.tool, (v) => {
    if (!v && drawerOpen.value) closeDrawer()
})
</script>

<style scoped>
.drawer-enter-active,
.drawer-leave-active {
    transition: opacity .15s ease, transform .2s ease;
}

.drawer-enter-from,
.drawer-leave-to {
    opacity: 0;
}

.drawer-enter-from aside,
.drawer-leave-to aside {
    transform: translateX(8px);
}

/* Backdrop fade */
.backdrop-enter-active,
.backdrop-leave-active {
    transition: opacity .28s ease;
}

.backdrop-enter-from,
.backdrop-leave-to {
    opacity: 0;
}

/* Panel slide+scale (desktop: from right; mobile: from bottom) */
.panel-enter-active {
    transition:
        transform .32s cubic-bezier(.22, .61, .36, 1),
        opacity .32s ease,
        box-shadow .32s ease;
}

.panel-leave-active {
    transition:
        transform .22s cubic-bezier(.4, 0, .2, 1),
        opacity .22s ease;
}

.panel-enter-from {
    transform: translateX(18px) scale(.985);
    opacity: 0;
}

.panel-leave-to {
    transform: translateX(10px) scale(.995);
    opacity: 0;
}

/* On small screens, slide up instead of from the right */
@media (max-width: 640px) {
    .panel-enter-from {
        transform: translateY(14px) scale(.985);
    }

    .panel-leave-to {
        transform: translateY(8px) scale(.995);
    }
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {

    .backdrop-enter-active,
    .backdrop-leave-active,
    .panel-enter-active,
    .panel-leave-active {
        transition: none !important;
    }
}
</style>