<template>

    <div class="h-full min-h-0">
        <div class="h-full min-h-0">
            <EditorScaffold class="h-full">
                <section class="space-y-6 pt-8 fade-left">
                    <header>
                        <h1 class="normal-font text-white font-extrabold leading-[1.05] text-[34px] md:text-5xl">
                            Skill <span class="text-neutral-400">Demos</span>
                        </h1>
                        <p class="mt-2 text-sm text-white/60">
                            Small, focused demos that show <span class="mark">how I build</span>
                        </p>
                    </header>

                    <!-- Filters -->
                    <div class="flex flex-wrap items-center gap-2">
                        <button v-for="g in groups" :key="g" @click="toggleGroup(g)"
                            class="px-3 py-1.5 rounded-full border transition cursor-pointer" :class="activeGroups.has(g)
                                ? 'border-emerald-400/60 bg-emerald-400/10 text-emerald-200'
                                : 'border-white/15 bg-white/5 text-white/80 hover:bg-white/10'">
                            {{ g }}
                        </button>

                        <div class="hidden md:block mx-2 h-5 w-px bg-white/10"></div>

                        <div class="relative">
                            <input v-model.trim="q" placeholder="Search demos…"
                                class="pl-8 pr-3 py-1.5 rounded-md bg-white/5 border border-white/15 text-white/90 placeholder-white/30 focus:outline-none focus:border-emerald-400/50 text-sm" />
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
                                :style="{ backgroundImage: `url(${d.logo})`, backgroundSize: '40%' }" />
                            <span class="absolute inset-0 bg-gradient-to-tr from-black/10 to-transparent" />

                            <div class="relative z-10">
                                <div class="flex items-center justify-between">
                                    <h3 class="normal-font text-white text-[16px] font-semibold">{{ d.title }}</h3>
                                    <span class="text-[12px] text-white/70">{{ d.confidence }}%</span>
                                </div>

                                <p class="mt-2 text-sm text-white/70 line-clamp-3">{{ d.pitch }}</p>

                                <div class="mt-3 flex flex-wrap gap-2">
                                    <span v-for="t in d.tags" :key="t"
                                        class="text-[11px] px-2 py-0.5 rounded border border-white/15 bg-white/5 text-white/75">
                                        {{ t }}
                                    </span>
                                </div>

                                <div class="mt-4 flex items-center gap-2 text-[12px] text-emerald-300">
                                    Open demo <i class="pi pi-arrow-up-right translate-y-[1px]" />
                                </div>
                            </div>
                        </button>
                    </div>

                    <!-- Drawer -->
                    
                        <!-- Drawer -->
                        <div v-if="drawerOpen" class="fixed inset-0 z-50">
                            <!-- Backdrop -->
                            <transition name="backdrop" appear>
                                <div class="absolute inset-0 bg-black/60" @click="closeDrawer" key="backdrop" />
                            </transition>

                            <!-- Panel -->
                            <transition name="panel" appear>
                                <aside key="panel"
                                    class="absolute right-0 top-0 h-full w-full sm:w-[600px] md:w-[820px] lg:w-[1000px] xl:w-[1120px] bg-[#111] border-l border-white/10 will-change-transform will-change-opacity">
                                    <div class="flex items-center justify-between px-4 py-3 border-b border-white/10">
                                        <div class="flex items-center gap-2">
                                            <img :src="active?.logo" alt=""
                                                class="h-6 w-6 object-contain rounded bg-white" />
                                            <div>
                                                <div class="text-white font-semibold leading-tight">{{ active?.title }}
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
                                        <!-- Live area -->
                                        <div class="rounded-lg border border-white/10 bg-black/30 overflow-hidden">
                                            <component v-if="active?.component" :is="active.component" />
                                            <iframe v-else-if="active?.url" :src="active.url"
                                                class="w-full h-[340px] bg-[#0e0f10]" loading="lazy" />
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

                                        <div class="flex flex-wrap gap-2">
                                            <a v-if="active?.url" :href="active.url" target="_blank"
                                                class="inline-flex items-center gap-2 rounded border border-emerald-400/40 bg-emerald-400/10 px-3 py-1.5 text-emerald-200 hover:bg-emerald-400/15">
                                                Open full demo <i class="pi pi-arrow-up-right text-[11px]" />
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
import ViteVisualizer from '@/components/demos/ViteVisualizer.vue'
import TailwindPlayground from '@/components/demos/TailwindPlayground.vue'
import ThreeCharacterDemo from '@/components/demos/ThreeCharacterDemo.vue'
import LottieLab from '@/components/demos/LottieLab.vue'
import LaravelExplorer from '@/components/demos/LaravelExplorer.vue'
import KonvaDemo from '@/components/demos/KonvaDemo.vue'
import CodeIgniterApiDemo from '@/components/demos/CodeIgniterApiDemo.vue'
import NodeJsDemo from '@/components/demos/NodeJsDemo.vue'
import MySqlQueryVisualizer from '@/components/demos/MySqlQueryVisualizer.vue'
import WordPressHeadlessDemo from '@/components/demos/WordPressHeadlessDemo.vue'

type Demo = {
    id: string
    title: string
    subtitle?: string
    pitch: string
    logo: string
    group: 'Frontend' | 'Backend' | 'Tools'
    tags: string[]
    confidence: number
    component?: any
    url?: string
    notes: string[]
    stack: string[]
}

const DEMOS: Demo[] = [
    {
        id: 'vue',
        title: 'Vue.js',
        subtitle: 'Skill Demo',
        pitch: 'Live data visualization showing Vue’s reactivity and component state updates in action',
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
        id: 'vite',
        title: 'Vite',
        subtitle: 'Skill Demo',
        pitch: 'A playful view of how Vite reloads modules instantly on change',
        logo: '/stack/vite.png',
        group: 'Frontend',
        tags: ['Vite', 'Hot Reload', 'DX'],
        confidence: 86,
        component: markRaw(ViteVisualizer),
        notes: [
            'Explains how Vite rebuilds modules instantly during development',
            'Click modules to trigger a quick update animation',
            'Highlights understanding of dev experience (DX) and performance'
        ],
        stack: ['Vite', 'Vue 3', 'Tailwind']
    },
    {
        id: 'tailwind',
        title: 'Tailwind',
        subtitle: 'Skill Demo',
        pitch: 'Shows how I use Tailwind utilities to build, preview, and fine-tune component styles in real time',
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
        pitch: 'GLB viewer with controls, animation speed and responsive camera fitting',
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
        pitch: 'A Konva.js demo with a bot that collects stars on a 2D grid with burst effects and scoring',
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
        pitch: 'Try common rules (required/email/min/max/in/same) and see Laravel Validator errors',
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
        id: 'codeigniter',
        title: 'CodeIgniter',
        subtitle: 'Skill Demo',
        pitch: 'Mock REST API console: login (JWT), hit endpoints, see JSON responses and timings',
        logo: '/stack/codeigniter.png',
        group: 'Backend',
        tags: ['CodeIgniter', 'REST', 'JWT'],
        confidence: 82,
        component: markRaw(CodeIgniterApiDemo),
        notes: [
            'Login to get a token',
            'Send requests to sample endpoints',
            'See JSON response & time taken'
        ],
        stack: ['CodeIgniter (concept)', 'Vue 3']
    },
    {
        id: 'nodejs',
        title: 'Node.js',
        subtitle: 'Skill Demo',
        pitch: 'Interactive Linux-style terminal simulating Node.js commands and npm tools',
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
        pitch: 'Interactive SQL builder showing how SELECT/WHERE/ORDER/LIMIT shape results in real time',
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
        pitch: 'A focused showcase of precision Lottie animations',
        logo: '/stack/lottie.png',
        group: 'Tools',
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

/* filters */
const groups = ['Frontend', 'Backend', 'Tools']
const activeGroups = ref<Set<string>>(new Set(groups))
const q = ref('')

const toggleGroup = (g: string) => {
    const s = new Set(activeGroups.value)
    s.has(g) ? s.delete(g) : s.add(g)
    if (s.size === 0) groups.forEach(x => s.add(x))
    activeGroups.value = s
}

const filtered = computed(() => {
    const s = activeGroups.value
    const term = q.value.toLowerCase()
    return DEMOS.filter(d =>
        s.has(d.group) &&
        (!term ||
            d.title.toLowerCase().includes(term) ||
            d.tags.some(t => t.toLowerCase().includes(term)) ||
            d.pitch.toLowerCase().includes(term))
    )
})

/* drawer + deep link */
const route = useRoute()
const router = useRouter()
const drawerOpen = ref(false)
const active = ref<Demo | null>(null)

const openDemo = (id: string) => {
    const d = DEMOS.find(x => x.id === id) || null
    active.value = d
    drawerOpen.value = !!d
    const params = new URLSearchParams(route.query as Record<string, string>)
    if (d) params.set('tool', d.id); else params.delete('tool')
    router.replace({ query: Object.fromEntries(params.entries()) })
}
const closeDrawer = () => openDemo('')

onMounted(() => {
    const pre = route.query.tool as string | undefined
    if (pre) openDemo(pre)
})
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