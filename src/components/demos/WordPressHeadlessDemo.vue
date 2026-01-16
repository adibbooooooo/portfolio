<!-- WordPressBlogCards.vue -->
<template>
    <div class="p-4 md:p-6 text-white/90 space-y-5">
        <!-- Header -->
        <header class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
                <h2 class="text-xl font-bold text-white normal-font">
                    WordPress <span class="text-[#a3a3a3]">Blog Cards</span>
                </h2>
            </div>

            <div class="flex gap-2">
                <button class="btn" @click="resetFilters">Reset</button>
                <button class="btn ghost" @click="simulateFetch">Simulate Fetch</button>
            </div>
        </header>

        <!-- Controls -->
        <div class="panel p-3 flex flex-col md:flex-row md:items-center gap-3">
            <div class="flex-1">
                <input v-model.trim="q" class="in w-full" placeholder="Search posts (title, excerpt)…" />
            </div>

            <div class="flex flex-wrap gap-2">
                <button v-for="cat in categories" :key="cat" class="chip" :class="{ on: activeCats.includes(cat) }"
                    @click="toggleCat(cat)">
                    {{ cat }}
                </button>
            </div>
        </div>

        <!-- Grid -->
        <div v-if="filtered.length" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <article v-for="p in filtered" :key="p.id" class="card">
                <div class="card-hero" :style="bg(p._embedded?.['wp:featuredmedia']?.[0]?.source_url)"></div>
                <div class="p-3">
                    <div class="text-[12px] text-white/50 mb-1">
                        {{ fmtDate(p.date) }}
                    </div>
                    <h3 class="text-white font-semibold leading-snug text-[16px] line-clamp-2"
                        v-html="p.title.rendered"></h3>
                    <p class="text-white/70 text-[13px] mt-2 line-clamp-3" v-html="p.excerpt.rendered"></p>
                    <div class="flex flex-wrap gap-1 mt-3">
                        <span v-for="c in p._embedded?.terms?.[0] || []" :key="c.id" class="tag">{{ c.name }}</span>
                    </div>
                    <a :href="`/blog/${p.slug}`" class="cta">Read more</a>
                </div>
            </article>
        </div>

        <!-- Empty state -->
        <div v-else class="empty">
            <div class="emoji">📰</div>
            <div class="title">No posts found</div>
            <div class="sub">Try clearing the search, or pick different categories.</div>
        </div>

        <!-- Log -->
        <div class="log-area">
            <div v-for="(line, i) in logs" :key="i" class="log-line">
                <span class="ts">{{ line.ts }}</span>
                <span :class="line.type">{{ line.msg }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'

/**
 * Mock data shaped like WordPress REST API v2 (/wp-json/wp/v2/posts?_embed)
 * Famous & simple: title, excerpt, featured image, date, categories.
 */
type WPMedia = { source_url: string }
type WPTerm = { id: number; name: string }
type WPPost = {
    id: number
    slug: string
    date: string
    title: { rendered: string }
    excerpt: { rendered: string }
    _embedded?: {
        ['wp:featuredmedia']?: WPMedia[]
        terms?: WPTerm[][]
    }
}

const posts = reactive<WPPost[]>([
    {
        id: 1,
        slug: 'design-system-tokens',
        date: '2025-02-12T10:00:00',
        title: { rendered: 'Design System Tokens for Consistent UI' },
        excerpt: { rendered: 'Why tokens matter for scalable themes across WordPress blocks and headless front-ends.' },
        _embedded: {
            ['wp:featuredmedia']: [{ source_url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=80&auto=format' }],
            terms: [[{ id: 31, name: 'Design' }, { id: 12, name: 'Headless' }]],
        },
    },
    {
        id: 2,
        slug: 'content-modeling-101',
        date: '2025-03-01T09:15:00',
        title: { rendered: 'Content Modeling 101 — Blocks, CPTs & ACF' },
        excerpt: { rendered: 'Structure content for Gutenberg and REST: custom post types, fields, and reusable blocks.' },
        _embedded: {
            ['wp:featuredmedia']: [{ source_url: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=1200&q=80&auto=format' }],
            terms: [[{ id: 14, name: 'Gutenberg' }, { id: 52, name: 'ACF' }]],
        },
    },
    {
        id: 3,
        slug: 'seo-checklist',
        date: '2025-04-18T14:40:00',
        title: { rendered: 'Practical SEO Checklist for Blog Editors' },
        excerpt: { rendered: 'From slugs to meta descriptions — easy wins your editorial team can ship today.' },
        _embedded: {
            ['wp:featuredmedia']: [{ source_url: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=1200&q=80&auto=format' }],
            terms: [[{ id: 77, name: 'SEO' }, { id: 31, name: 'Design' }]],
        },
    },
])

/** Controls */
const q = ref('')
const activeCats = ref<string[]>([])

/** Derive category list from mock posts */
const categories = computed(() => {
    const set = new Set<string>()
    posts.forEach(p => p._embedded?.terms?.[0]?.forEach(t => set.add(t.name)))
    return Array.from(set).sort()
})

function toggleCat(cat: string) {
    const i = activeCats.value.indexOf(cat)
    if (i >= 0) activeCats.value.splice(i, 1)
    else activeCats.value.push(cat)
}

function resetFilters() {
    q.value = ''
    activeCats.value = []
}

/** Filter logic: search title/excerpt + category AND filter */
const filtered = computed(() => {
    const query = q.value.toLowerCase()
    return posts.filter(p => {
        const title = p.title.rendered.toLowerCase()
        const excerpt = p.excerpt.rendered.toLowerCase()
        const matchesQ = !query || title.includes(query) || excerpt.includes(query)
        const cats = (p._embedded?.terms?.[0] || []).map(t => t.name)
        const matchesCats = !activeCats.value.length || activeCats.value.every(c => cats.includes(c))
        return matchesQ && matchesCats
    })
})

/** Helpers */
function fmtDate(iso: string) {
    const d = new Date(iso)
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}
function bg(url?: string) {
    return { backgroundImage: url ? `url('${url}')` : 'none' }
}

/** Simulated fetch log */
const logs = ref<{ ts: string; type: 'ok' | 'warn' | 'err' | ''; msg: string }[]>([])
function now() {
    return new Date().toLocaleTimeString([], { hour12: false })
}
function simulateFetch() {
    logs.value.unshift({ ts: now(), type: 'ok', msg: 'GET /wp-json/wp/v2/posts?_embed (mocked)' })
}
</script>

<style scoped>
.panel {
    background: #0f0f10;
    border: 1px solid rgba(255, 255, 255, .08);
    border-radius: 10px;
}

.chip {
    border: 1px solid rgba(255, 255, 255, .14);
    background: rgba(255, 255, 255, .06);
    color: #e5e7eb;
    border-radius: 999px;
    font-size: 12px;
    padding: 6px 10px;
    transition: .15s;
}

.chip.on {
    border-color: rgba(16, 185, 129, .6);
    background: rgba(16, 185, 129, .12);
    color: #a7f3d0;
}

.card {
    background: #0f0f10;
    border: 1px solid rgba(255, 255, 255, .08);
    border-radius: 10px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.card-hero {
    height: 120px;
    background: #111;
    background-size: cover;
    background-position: center;
    border-bottom: 1px solid rgba(255, 255, 255, .08);
}

.tag {
    font-size: 11.5px;
    color: #cbd5e1;
    border: 1px solid rgba(255, 255, 255, .12);
    padding: 2px 8px;
    border-radius: 999px;
}

.cta {
    display: inline-flex;
    margin-top: 10px;
    color: #a7f3d0;
    border: 1px solid rgba(16, 185, 129, .35);
    background: rgba(16, 185, 129, .1);
    padding: 6px 10px;
    border-radius: 8px;
}

.in {
    background: #0e0f10;
    color: #e5e7eb;
    border: 1px solid rgba(255, 255, 255, .14);
    border-radius: 8px;
    padding: 7px 10px;
    font-size: 13px;
    width: 100%;
}

.btn {
    border: 1px solid rgba(255, 255, 255, .15);
    background: rgba(255, 255, 255, .05);
    color: #e5e7eb;
    font-size: 13px;
    border-radius: 8px;
    padding: 7px 12px;
    cursor: pointer;
    transition: .15s;
}

.btn:hover {
    border-color: rgba(16, 185, 129, .5);
    background: rgba(16, 185, 129, .1);
    color: #a7f3d0;
    transform: translateY(-1px);
}

.btn.ghost {
    background: transparent;
    color: #9ca3af;
    border-color: rgba(255, 255, 255, .1);
}

.log-area {
    background: #0f0f10;
    border: 1px solid rgba(255, 255, 255, .08);
    border-radius: 10px;
    padding: 12px 14px;
    font-family: ui-monospace, monospace;
    font-size: 13px;
    max-height: 180px;
    overflow: auto;
}

.log-line {
    margin-bottom: 4px;
}

.ts {
    color: #64748b;
    margin-right: 8px;
}

.ok {
    color: #10b981;
}

.warn {
    color: #facc15;
}

.err {
    color: #ef4444;
}
</style>