<template>
    <section class="pw">
        <p class="pw-tag">{{ "<!-- What clients say -->" }}</p>
        <h2 class="pw-title normal-font">People’s <span class="muted">Word</span></h2>

        <div class="tg-thread normal-font">
            <article v-for="m in rendered" :key="m.id" class="tg-row md:grid md:[grid-template-columns:44px_1fr] md:items-start md:gap-2"
                :class="m.side === 'right' ? 'is-right' : 'is-left'">
                <img v-if="m.groupTop" :src="m.avatar" :alt="m.name" class="hidden md:block tg-avatar" draggable="false"/>

                <div class="tg-bubble border border-seperator bg-[#1b1b1b]/95 backdrop-blur">
                    <header class="grid md:flex tg-head justify-unset md:justify-between">
                        <div class="grid grid-cols-2 items-start gap-1 md:flex md:items-center md:gap-2 text-[12.5px]">
                            <span class="text-emerald-400 font-semibold text-[14px]">{{ m.name }}</span>
                            <span class="role text-end md:text-start">{{ m.role }}</span>
                            <span class="sep hidden md:block">·</span>
                            <span v-if="m.project" class="chip chip--proj">{{ m.project }}</span>
                            <div class="block md:hidden tg-time text-end">{{ m.ts }}</div>
                        </div>
                        <div class="hidden md:block tg-time">{{ m.ts }}</div>
                    </header>

                    <!-- Telegram-like quoted reply -->
                    <div v-if="m.reply" class="tg-quote" :class="m.side === 'right' ? 'q-right' : 'q-left'">
                        <div class="q-head">
                            <span class="q-bar" />
                            <span class="q-badge">{{ m.reply.name }}</span>
                        </div>
                        <div class="q-text">{{ m.reply.text }}</div>
                    </div>

                    <p class="tg-text pb-2">{{ m.text }}</p>

                    <ul v-if="m.scope?.length" class="tags">
                        <li v-for="t in m.scope" :key="t" class="chip">{{ t }}</li>
                    </ul>

                    <!-- Reactions -->
                    <footer class="rx-row">
                        <button v-for="r in EMOJI_TYPES" :key="r.k + m.id" class="rx" :class="{ on: voted(m.id, r.k) }"
                            @mouseenter="playLottie(m.id, r.k)" @click.stop="onReact(m.id, r.k)">
                            <span class="lottie-box" :class="{ bump: bumping === makeKey(m.id, r.k) }">
                                <span class="lottie-canvas" :ref="setLottieRef(m.id, r.k)" />
                                <span v-if="!hasAnim(m.id, r.k)" class="emo-fallback">{{ r.emoji }}</span>
                            </span>
                            <span class="cnt">{{ displayCount(m.id, r.k) }}</span>
                        </button>
                    </footer>
                </div>
            </article>
        </div>
    </section>
</template>

<script setup lang="ts">
import { computed, reactive, ref, onMounted } from 'vue'
import lottie from 'lottie-web'

type Side = 'left' | 'right'
type RxKey = 'cool' | 'money' | 'idea'

/* Reactions (JSONs live in /public/lottie/) */
const EMOJI_TYPES = [
    { k: 'cool' as RxKey, emoji: '🕶', json: '/lottie/cool.json' },
    { k: 'money' as RxKey, emoji: '💸', json: '/lottie/money.json' },
    { k: 'idea' as RxKey, emoji: '💡', json: '/lottie/idea.json' },
]

/* Messages (avatars all /avatar/a.png) */
const MESSAGES = [
    {
        id: 'm1', side: 'left' as Side, name: 'Hanis Afifah', role: 'Client',
        avatar: '/avatar/avatar-1.jpg', ts: 'October 2025',
        project: 'Wedding Website',
        reply: { name: 'Details', text: 'RSVP Wedding Website' },
        text: 'The wedding website is truly beyond my expectations, it’s absolutely beautiful. Every small detail and the overall style are exactly what I envisioned. Thank you so much for bringing my dream wedding e-card invitation to life! ❤️',
        scope: ['Laravel API', 'Vue 3', 'Lottie'],
        reactions: { cool: 1200, money: 980, idea: 740 },
    },
    {
        id: 'm2', side: 'right' as Side, name: 'Dato Dr Hj Hazzaini', role: 'Client',
        avatar: '/avatar/avatar-2.jpg', ts: 'March 2025',
        project: 'Internal System',
        reply: { name: 'Details', text: 'Internal System Dashboard' },
        text: 'Excellent service from start to finish. The team was professional, responsive, and truly understood my business needs. The dashboard looks clean, modern, and works perfectly. Highly recommend their service to anyone looking for quality and reliability 👍🏻',
        scope: ['Laravel API', 'Vue 3', 'Bootstrap'],
        reactions: { cool: 830, money: 1740, idea: 500 },
    },
    {
        id: 'm3', side: 'left' as Side, name: 'Afiq', role: 'Software Engineer',
        avatar: '/avatar/avatar-3.jpg', ts: 'September 2024',
        project: 'Fortifi Sdn Bhd',
        reply: { name: 'Details', text: 'Worked together' },
        text: 'Adib is an exceptional engineer with deep technical knowledge and a constant drive to improve the team. Reliable, self-sufficient, and always willing to share insights. A great asset in every project',
        scope: ['Node.js', 'Telegram Bot', 'Telegram Mini Apps', 'Laravel', 'Web3'],
        reactions: { cool: 700, money: 510, idea: 320 },
    },
]

/* Show avatar only at the start of a cluster */
const rendered = computed(() =>
    MESSAGES.map((m, i, arr) => {
        const prev = arr[i - 1]
        const groupTop = !prev || prev.name !== m.name || prev.side !== m.side
        return { ...m, groupTop }
    })
)

/* ── Local reaction storage + monotonic compact numbers ── */
const STORE_KEY = 'pw_feedback_rx_v7'
const store = reactive({
    counts: {} as Record<string, Partial<Record<RxKey, number>>>,
    votes: {} as Record<string, Partial<Record<RxKey, boolean>>>,
    uiShown: {} as Record<string, Partial<Record<RxKey, number>>>,
    uiDay: '',
    lastDay: '',
})

const todayStr = () => {
    const d = new Date()
    return `${d.getUTCFullYear()}-${d.getUTCMonth() + 1}-${d.getUTCDate()}`
}

const hashInt = (s: string) => {
    let h = 2166136261 >>> 0
    for (let i = 0; i < s.length; i++) {
        h ^= s.charCodeAt(i)
        h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24)
    }
    return h >>> 0
}

const loadStore = () => {
    try {
        const raw = JSON.parse(localStorage.getItem(STORE_KEY) || '{}')
        Object.assign(store, raw)
    } catch { }
    MESSAGES.forEach(m => {
        store.counts[m.id] ||= { ...m.reactions }
        store.uiShown[m.id] ||= { ...m.reactions }
    })
}
const saveStore = () => localStorage.setItem(STORE_KEY, JSON.stringify(store))

/* real tiny daily drift on baseline counts */
const applyDailyDrift = () => {
    const day = todayStr()
    if (store.lastDay === day) return
    MESSAGES.forEach(m => {
        ; (['cool', 'money', 'idea'] as RxKey[]).forEach(k => {
            const drift = (hashInt(`${m.id}-${k}-${day}`) % 3) / 1000 // 0..0.002
            if (!store.counts[m.id]) {
                store.counts[m.id] = {}
            }

            store.counts[m.id]![k] = Math.round((store.counts[m.id]![k] ?? 0) * (1 + drift))
        })
    })
    store.lastDay = day
    saveStore()
}

const voted = (id: string, k: RxKey) => !!store.votes[id]?.[k]
const toggleReact = (id: string, k: RxKey) => {
    if (!store.votes[id]) {
        store.votes[id] = {}
    }

    store.votes[id]![k] = !store.votes[id]![k]
    saveStore()
}

const nf = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 })
const ensureUiSlot = (id: string, k: RxKey) => {
    store.uiShown[id] ||= {} as Record<RxKey, number>
    if (store.uiShown[id][k] == null) store.uiShown[id][k] = store.counts[id]?.[k] ?? 0
}
const dailyDisplayTarget = (id: string, k: RxKey, base: number, day: string) => {
    if (base < 1000) {
        const jitter = hashInt(`${id}|${k}|${day}|near1k`) % 60 // 1000..1059
        return 1000 + jitter
    }
    const micro = hashInt(`${id}|${k}|${day}|micro`) % 3 // +0..2
    return base + micro
}
const displayCount = (id: string, k: RxKey) => {
    ensureUiSlot(id, k)

    if (!store.uiShown[id]) {
        store.uiShown[id] = {}
    }

    const base = (store.counts[id]?.[k] ?? 0) + (voted(id, k) ? 1 : 0)
    const day = todayStr()
    const target = dailyDisplayTarget(id, k, base, day)
    const prev = store.uiShown[id]![k] ?? 0
    const shown = Math.max(prev, target) // never go down
    if (shown !== prev || store.uiDay !== day) {
        store.uiShown[id]![k] = shown
        store.uiDay = day
        saveStore()
    }
    return nf.format(shown)
}

/* ── Lottie: fetch from /public, hover/click play, click bump ── */
const anims = reactive(new Map<string, any>())
const holders = new Map<string, HTMLElement>()
const bumping = ref<string>('')

const makeKey = (id: string, k: RxKey) => `${id}|${k}`

const setLottieRef = (id: string, k: RxKey) => {
    return (el: any) => {
        const key = makeKey(id, k)
        const htmlEl = el as HTMLElement | null

        if (!htmlEl) {
            // element got unmounted → clean up
            holders.delete(key)
            return
        }

        holders.set(key, htmlEl)
    }
}

const hasAnim = (id: string, k: RxKey) => anims.has(makeKey(id, k))

const fetchJson = async (url: string) => {
    const res = await fetch(url, { cache: 'force-cache' })
    return await res.json()
}

const initLotties = async () => {
    for (const m of MESSAGES) {
        for (const r of EMOJI_TYPES) {
            const key = makeKey(m.id, r.k)
            if (anims.has(key)) continue
            const el = holders.get(key)
            if (!el) continue

            try {
                const data = await fetchJson(r.json) // ✅ load from /public
                const anim = lottie.loadAnimation({
                    container: el,
                    renderer: 'svg',
                    loop: false,
                    autoplay: false,
                    animationData: data,
                })
                anims.set(key, anim)
            } catch (e) {
                console.warn('Lottie load failed:', r.json, e)
            }
        }
    }
}

const playLottie = (id: string, k: RxKey) => {
    const anim = anims.get(makeKey(id, k))
    if (!anim) return
    anim.goToAndPlay(0, true)
}
const onReact = (id: string, k: RxKey) => {
    toggleReact(id, k)
    playLottie(id, k)
    const key = makeKey(id, k)
    bumping.value = key
    setTimeout(() => (bumping.value = ''), 220)
}

onMounted(() => {
    loadStore()
    applyDailyDrift()
    setTimeout(initLotties, 60)
})
</script>

<style scoped>
.pw-tag {
    font-size: 12px;
    color: #8F8F8F;
    margin-bottom: .5rem;
}

.pw-title {
    color: #fff;
    font-weight: 800;
    line-height: 1.05;
    font-size: clamp(32px, 4vw, 48px);
    margin-bottom: 1.25rem;
}

.pw-title .muted {
    color: #a3a3a3;
}

/* Thread */
.tg-thread {
    display: grid;
    gap: 18px;
}

.tg-row {
    /* display: grid;
    grid-template-columns: 44px 1fr;
    align-items: start;
    column-gap: 10px; */
    /* ✅ consistent gap between avatar & bubble */
}

/* Right side layout */
.tg-row.is-right {
    grid-template-columns: 1fr 44px;
    column-gap: 10px;
    /* ✅ ensures same spacing on right side */
}

.tg-row.is-right .tg-avatar {
    order: 2;
    justify-self: end;
    /* keeps avatar aligned neatly to the edge */
}

.tg-row.is-right .tg-bubble {
    order: 1;
    justify-self: end;
    margin-right: 0;
    /* ✅ prevents flush against avatar */
}

/* Avatar */
.tg-avatar {
    width: 40px;
    height: 40px;
    border-radius: 11px;
    object-fit: cover;
    border: 1px solid rgba(255, 255, 255, .12);
}

/* Bubbles — Telegramish with accessible green for right side */
.tg-bubble {
    position: relative;
    max-width: 880px;
    border-radius: 18px;
    padding: 12px 14px;
    border: 1px solid rgba(255, 255, 255, .06);
}

/* Header */
.tg-head {
    align-items: center;
    gap: 12px;
}

.name {
    color: #60a5fa;
    font-weight: 800;
}

.role {
    opacity: .85;
}

.sep {
    opacity: .4;
}

.chip {
    border: 1px solid rgba(255, 255, 255, .14);
    background: rgba(255, 255, 255, .05);
    padding: 2px 8px;
    border-radius: 999px;
    font-size: 12px;
}

.chip--proj {
    border-color: #16a34a80;
    background: #16a34a1a;
    color: #a7f3d0;
}

.view {
    margin-left: 6px;
    color: #a7f3d0;
    display: inline-flex;
    gap: 6px;
    align-items: center;
    padding: 2px 8px;
    border: 1px solid rgba(22, 163, 74, .45);
    border-radius: 999px;
    background: rgba(22, 163, 74, .10);
}

.view:hover {
    border-color: #16a34a;
    background: #16a34a1a;
}

.tg-time {
    color: #94a3b8;
    font-size: 12px;
}

/* Quoted reply */
.tg-quote {
    margin: 8px 0 10px;
    border-radius: 12px;
    padding: 8px 10px;
    border: 1px solid rgba(255, 255, 255, .06);
}

.q-right {
    background: #0d1b16;
}

.q-left {
    background: #111417;
}

.q-head {
    display: flex;
    align-items: center;
    margin-bottom: 2px;
}

.q-bar {
    width: 4px;
    height: 25px;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    background: #16a34a;
    display: inline-block;
}

.q-badge {
    background: #195e3b;
    color: #c7f9e7;
    font-weight: 800;
    padding: 3px 8px;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    font-size: 13px;
}

.q-text {
    color: #d1d5db;
    font-size: 13.5px;
}

/* Text */
.tg-text {
    color: #e5e7eb;
    font: 400 16px/1.55 ui-sans-serif, system-ui;
}

/* Tags */
.tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin: 6px 0 2px;
}

/* Reactions */
.rx-row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 10px;
}

.rx {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font: 12.5px/1 ui-monospace, monospace;
    color: #e5e7eb;
    border: 1px solid rgba(255, 255, 255, .14);
    background: rgba(255, 255, 255, .06);
    padding: 6px 10px;
    border-radius: 999px;
    transition: .15s;
    cursor: pointer;
}

.rx.on {
    border-color: rgba(16, 185, 129, 0.6);
    background: rgba(16, 185, 129, 0.6);

}

.rx:hover {
    border-color: #16a34a80;
    background: #16a34a1a;
    color: #d1fae5;
}

/* Lottie box + click bump */
.lottie-box {
    width: 18px;
    height: 18px;
    position: relative;
    display: inline-block;
}

.lottie-box.bump {
    animation: bump .22s ease;
}

@keyframes bump {
    0% {
        transform: scale(1)
    }

    40% {
        transform: scale(1.2)
    }

    100% {
        transform: scale(1)
    }
}

.lottie-canvas {
    position: absolute;
    inset: 0;
}

.emo-fallback {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    transform: translateY(1px);
}

.cnt {
    min-width: 10px;
    text-align: right;
}

/* Note */
.local-note {
    margin-top: 10px;
    color: #8fa3a9;
    font-size: 12.5px;
    opacity: .85;
}

/* Small screens */
@media (max-width:640px) {
    .tg-row {
        grid-template-columns: 36px 1fr;
    }

    .tg-row.is-right {
        grid-template-columns: 1fr 36px;
    }

    .tg-avatar {
        width: 34px;
        height: 34px;
        border-radius: 9px;
    }

    .tg-text {
        font-size: 15px;
    }
}
</style>