<template>
    <div class="mt-6 space-y-6">
        <h2 class="sr-only">Recruiter skim — how I work in under ten seconds</h2>

        <!-- Type: one scannable row -->
        <div
            class="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#141414] px-4 py-3 md:px-5">
            <div class="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm md:text-base">
                <span class="font-bold text-white">ISTP<span class="text-emerald-300">-T</span></span>
                <span class="text-white/35">·</span>
                <span class="text-neutral-300">Virtuoso</span>
                <span class="text-white/35">·</span>
                <span class="text-white/60 text-[13px]">Operator / builder</span>
            </div>
            <div class="flex gap-1" aria-hidden="true">
                <span
                    v-for="L in letters"
                    :key="L"
                    class="grid h-8 w-7 place-items-center rounded border border-emerald-400/30 bg-emerald-500/10 text-[11px] font-bold text-emerald-100">
                    {{ L }}
                </span>
            </div>
        </div>

        <!-- Signals: compact chips + two thin bars -->
        <div ref="signalsEl" class="flex flex-wrap items-end gap-2 md:gap-3">
            <template v-for="s in badgeSignals" :key="s.id">
                <div
                    class="rounded-lg border border-white/10 bg-[#161616] px-2.5 py-1.5 text-center min-w-[4.5rem]">
                    <p class="text-[9px] uppercase tracking-wide text-white/40">{{ s.label }}</p>
                    <p class="text-[12px] font-semibold text-white leading-tight">{{ s.value }}</p>
                </div>
            </template>
            <div
                v-for="s in barSignals"
                :key="s.id"
                class="min-w-[100px] flex-1 max-w-[140px] rounded-lg border border-white/10 bg-[#161616] px-2.5 py-1.5">
                <div class="flex justify-between text-[9px] text-white/45">
                    <span class="truncate">{{ s.label }}</span>
                    <span class="tabular-nums text-emerald-200/90">{{ s.percent }}%</span>
                </div>
                <div class="mt-1 h-1 overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                        class="h-full rounded-full bg-emerald-400/85 transition-[width] duration-700 ease-out"
                        :style="{ width: barsAnimated ? `${s.percent}%` : '0%' }" />
                </div>
            </div>
        </div>

        <!-- Glance grid: 6 tiles, no bullets -->
        <div>
            <p class="text-[10px] font-medium uppercase tracking-wider text-white/35 mb-2">glance.deck</p>
            <div class="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                <component
                    :is="motionBox"
                    v-for="(t, i) in glanceTiles"
                    :key="t.id"
                    :class="[
                        'rounded-xl border border-white/10 bg-[#141414] px-3.5 py-3 transition-colors duration-150 hover:border-white/18',
                        t.id === 'evidence' ? 'cursor-pointer ring-1 ring-emerald-400/20' : 'cursor-default',
                    ]"
                    :initial="tileInitial"
                    :animate="{ opacity: 1, y: 0 }"
                    :transition="tileTransition(i)"
                    :while-hover="tileHover"
                    @click="onTileClick(t)"
                    :role="t.id === 'evidence' ? 'button' : undefined"
                    :tabindex="t.id === 'evidence' ? 0 : -1"
                    :aria-label="t.id === 'evidence' ? 'Open full personality handbook' : undefined"
                    @keydown.enter.prevent="onTileClick(t)"
                >
                    <div class="flex gap-2.5">
                        <div
                            class="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.03] text-emerald-200/90">
                            <i :class="t.icon" class="text-sm" />
                        </div>
                        <div class="min-w-0">
                            <h3 class="text-[13px] font-semibold text-white leading-snug">{{ t.title }}</h3>
                            <p class="mt-0.5 text-[11px] leading-snug text-white/60">{{ t.line }}</p>
                            <p
                                v-if="t.id === 'evidence'"
                                class="mt-1.5 text-[10px] font-medium text-emerald-300/90">
                                Open my.handbook →
                            </p>
                        </div>
                    </div>
                </component>
            </div>
        </div>

        <!-- Virtuoso: pills only -->
        <div class="space-y-1.5">
            <p class="text-[10px] font-medium uppercase tracking-wider text-white/35">virtuoso.lane · community typing</p>
            <div class="flex flex-wrap gap-1.5">
                <button
                    v-for="f in virtuosoFigures"
                    :key="f.id"
                    type="button"
                    class="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-[#161616] py-1 pl-1.5 pr-2.5 text-left text-[11px] text-white/80 transition-colors hover:border-emerald-400/25 hover:text-white"
                    :title="`${f.name} — ${f.note}`">
                    <span
                        class="grid h-6 w-6 place-items-center rounded-full border border-emerald-400/20 bg-emerald-500/10 text-[9px] font-bold text-emerald-100">
                        {{ f.initials }}
                    </span>
                    <span class="max-w-[10rem] truncate">{{ f.name }}</span>
                    <span class="text-[9px] uppercase text-white/35">{{ f.lane }}</span>
                </button>
            </div>
            <p class="text-[10px] leading-snug text-white/40 max-w-3xl">{{ virtuosoLaneDisclaimer }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { motion } from 'motion-v'
import { usePreferredReducedMotion, useElementVisibility } from '@vueuse/core'
import { fitSignals } from '@/data/personalityFitSignals'
import { glanceTiles, type GlanceTile } from '@/data/personalityGlanceDeck'
import { virtuosoFigures, virtuosoLaneDisclaimer } from '@/data/personalityVirtuosoLane'

const letters = ['I', 'S', 'T', 'P'] as const
const router = useRouter()

const badgeSignals = computed(() => fitSignals.filter((s): s is Extract<typeof s, { kind: 'badge' }> => s.kind === 'badge'))
const barSignals = computed(() => fitSignals.filter((s): s is Extract<typeof s, { kind: 'bar' }> => s.kind === 'bar').slice(0, 2))

const reduceMotion = usePreferredReducedMotion()
const motionBox = motion.div

const tileInitial = computed(() => (reduceMotion.value ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }))
function tileTransition(i: number) {
    if (reduceMotion.value) return { duration: 0 }
    return { delay: 0.04 * i, duration: 0.28, ease: [0.22, 1, 0.36, 1] as const }
}
const tileHover = computed(() => (reduceMotion.value ? {} : { y: -2 }))

const signalsEl = ref<HTMLElement | null>(null)
const stripVisible = useElementVisibility(signalsEl)
const barsAnimated = ref(false)
watch(stripVisible, (v) => {
    if (v) barsAnimated.value = true
})

function goHandbook() {
    void router.replace({ path: '/personality', query: { view: 'handbook' } })
}

function onTileClick(t: GlanceTile) {
    if (t.id === 'evidence') goHandbook()
}
</script>
