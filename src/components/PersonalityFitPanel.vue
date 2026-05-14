<template>
    <div class="mt-8 space-y-10">
        <h2 class="sr-only">Stakeholder summary — how I fit teams and deliver</h2>
        <!-- Type + letters -->
        <div class="rounded-2xl border border-white/10 bg-gradient-to-br from-[#161616] to-[#101818] p-5 md:p-6 overflow-hidden relative">
            <div
                class="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-emerald-500/10 blur-3xl" />
            <div class="relative flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                    <p class="text-[11px] font-medium uppercase tracking-[0.2em] text-emerald-300/90">16Personalities</p>
                    <p class="mt-1 normal-font text-2xl md:text-3xl font-bold text-white">
                        ISTP<span class="text-emerald-300">-T</span>
                        <span class="text-white/40 font-normal text-lg md:text-xl"> · </span>
                        <span class="text-neutral-300">The Virtuoso</span>
                    </p>
                    <p class="mt-2 max-w-xl text-sm text-white/70 leading-relaxed">
                        Hands-on pragmatist: calm under noise, fast when the path is unclear, allergic to busywork.
                    </p>
                </div>
                <div class="flex gap-1.5 shrink-0" aria-hidden="true">
                    <component
                        v-for="(L, i) in letters"
                        :key="L"
                        :is="motionBox"
                        class="grid h-11 w-10 place-items-center rounded-lg border border-emerald-400/35 bg-emerald-500/10 text-sm font-bold tracking-tight text-emerald-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                        :initial="letterInitial"
                        :animate="{ opacity: 1, y: 0, scale: 1 }"
                        :transition="letterTransition(i)"
                    >
                        {{ L }}
                    </component>
                </div>
            </div>
        </div>

        <!-- Signal strip -->
        <div ref="signalsEl" class="space-y-2">
            <p class="text-[11px] font-medium uppercase tracking-wider text-white/40">signal.strip</p>
            <div class="flex flex-wrap gap-2 md:gap-3">
                <template v-for="s in fitSignals" :key="s.id">
                    <div
                        v-if="s.kind === 'badge'"
                        class="min-w-[140px] flex-1 rounded-xl border border-white/10 bg-[#141414] px-3 py-2.5 shadow-sm transition-colors duration-200 hover:border-emerald-400/25 hover:bg-[#181818]">
                        <p class="text-[10px] uppercase tracking-wide text-white/45">{{ s.label }}</p>
                        <p class="mt-0.5 text-sm font-semibold text-white">{{ s.value }}</p>
                        <p v-if="s.hint" class="mt-0.5 text-[11px] text-white/50">{{ s.hint }}</p>
                    </div>
                    <div
                        v-else
                        class="min-w-[160px] flex-[1_1_45%] rounded-xl border border-white/10 bg-[#141414] px-3 py-2.5 md:flex-1 transition-colors duration-200 hover:border-white/15">
                        <div class="flex items-center justify-between gap-2">
                            <p class="text-[11px] text-white/60">{{ s.label }}</p>
                            <span class="text-[11px] tabular-nums text-emerald-200/90">{{ s.percent }}%</span>
                        </div>
                        <div class="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
                            <div
                                class="h-full rounded-full bg-gradient-to-r from-emerald-600/90 to-emerald-400/85 transition-[width] duration-[900ms] ease-out"
                                :style="{ width: barsAnimated ? `${s.percent}%` : '0%' }" />
                        </div>
                    </div>
                </template>
            </div>
        </div>

        <!-- Bento -->
        <div>
            <p class="text-[11px] font-medium uppercase tracking-wider text-white/40 mb-3">my.fit · bento</p>
            <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
                <component
                    :is="motionBox"
                    v-for="(sec, i) in fitSections"
                    :key="sec.id"
                    :class="[
                        'group relative overflow-hidden rounded-xl border border-white/10 bg-[#141414] p-4 md:p-5 transition-shadow duration-200',
                        sec.colSpan === 2 ? 'md:col-span-2' : '',
                    ]"
                    :initial="cardInitial"
                    :animate="{ opacity: 1, y: 0, scale: 1 }"
                    :transition="cardTransition(i)"
                    :while-hover="cardWhileHover"
                    :while-press="{ scale: 0.99 }"
                >
                    <div
                        class="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-emerald-500/[0.07] blur-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <div class="relative flex gap-3">
                        <div
                            class="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-emerald-200/95 transition-colors duration-200 group-hover:border-emerald-400/30 group-hover:text-emerald-100">
                            <i :class="sec.icon" class="text-lg" />
                        </div>
                        <div class="min-w-0 flex-1">
                            <h3 class="text-base md:text-lg font-semibold text-white">{{ sec.title }}</h3>
                            <p class="mt-1 text-[13px] text-white/70 leading-relaxed">{{ sec.lead }}</p>
                            <ul class="mt-2.5 space-y-1.5 text-[13px] text-white/78 leading-relaxed">
                                <li v-for="(b, bi) in sec.bullets" :key="bi" class="flex gap-2">
                                    <span class="mt-2 h-1 w-1 shrink-0 rounded-full bg-emerald-400/70" aria-hidden="true" />
                                    <span>{{ b }}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </component>
            </div>
        </div>

        <!-- Virtuoso lane -->
        <div class="space-y-2">
            <div class="flex flex-wrap items-end justify-between gap-2">
                <p class="text-[11px] font-medium uppercase tracking-wider text-white/40">virtuoso.lane</p>
                <span class="text-[10px] text-white/35 hidden sm:inline">Scroll sideways →</span>
            </div>
            <p class="text-[12px] text-white/50 leading-relaxed max-w-3xl">{{ virtuosoLaneDisclaimer }}</p>
            <div class="relative -mx-5 md:mx-0">
                <div
                    class="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-[#121212] to-transparent md:from-[#161616]" />
                <div
                    class="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-[#121212] to-transparent md:from-[#161616]" />
                <div
                    role="list"
                    aria-label="Figures often associated with ISTP or Virtuoso in community typing"
                    class="flex gap-3 overflow-x-auto snap-x snap-mandatory px-5 pb-2 pt-1 no-scrollbar scroll-pl-5 md:px-0 md:scroll-pl-0">
                    <div
                        v-for="f in virtuosoFigures"
                        :key="f.id"
                        role="listitem"
                        class="snap-start shrink-0 w-[200px] rounded-xl border border-white/10 bg-[#141414] p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-400/30 hover:shadow-[0_12px_32px_rgba(0,0,0,0.35)]">
                        <div class="flex items-start gap-2.5">
                            <div
                                class="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-emerald-400/25 bg-emerald-500/[0.08] text-[11px] font-bold text-emerald-100">
                                {{ f.initials }}
                            </div>
                            <div class="min-w-0">
                                <span
                                    class="inline-block rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide"
                                    :class="f.lane === 'fiction'
                                        ? 'bg-violet-500/15 text-violet-200 ring-1 ring-violet-400/25'
                                        : 'bg-amber-500/12 text-amber-100 ring-1 ring-amber-400/20'">
                                    {{ f.lane }}
                                </span>
                                <p class="mt-1 text-[13px] font-semibold leading-snug text-white">{{ f.name }}</p>
                                <p class="mt-1 text-[11px] leading-snug text-white/55">{{ f.note }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { motion } from 'motion-v'
import { usePreferredReducedMotion, useElementVisibility } from '@vueuse/core'
import { fitSections } from '@/data/personalityFit'
import { fitSignals } from '@/data/personalityFitSignals'
import { virtuosoFigures, virtuosoLaneDisclaimer } from '@/data/personalityVirtuosoLane'

const letters = ['I', 'S', 'T', 'P'] as const

const reduceMotion = usePreferredReducedMotion()
const motionBox = motion.div

const letterInitial = computed(() =>
    reduceMotion.value ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 10, scale: 0.92 }
)
function letterTransition(i: number) {
    if (reduceMotion.value) return { duration: 0 }
    return { delay: 0.06 * i, type: 'spring' as const, stiffness: 380, damping: 22 }
}

const cardInitial = computed(() =>
    reduceMotion.value ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 18, scale: 0.97 }
)
function cardTransition(i: number) {
    if (reduceMotion.value) return { duration: 0 }
    return { delay: 0.05 * i + 0.12, type: 'spring' as const, stiffness: 320, damping: 26 }
}

const cardWhileHover = computed(() =>
    reduceMotion.value
        ? {}
        : {
              y: -3,
              borderColor: 'rgba(52, 211, 153, 0.28)',
              boxShadow: '0 14px 36px rgba(0, 0, 0, 0.35)',
          }
)

const signalsEl = ref<HTMLElement | null>(null)
const stripVisible = useElementVisibility(signalsEl)
const barsAnimated = ref(false)

watch(stripVisible, (v) => {
    if (v) barsAnimated.value = true
})
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
    display: none;
}
.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>
