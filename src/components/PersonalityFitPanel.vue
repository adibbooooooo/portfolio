<template>
    <motion.div id="personality-fit" class="mt-5 space-y-4 scroll-mt-24" :initial="false">
        <h2 class="sr-only">Recruiter skim — how I work in under ten seconds</h2>

        <div
            class="rounded-xl border border-white/10 bg-[#141414] px-3.5 py-3 md:px-4 md:py-3.5 space-y-3">
            <motion.div
                class="flex flex-wrap items-center gap-3 md:gap-4"
                :initial="bandInitial"
                :animate="{ opacity: 1, y: 0 }"
                :transition="{ duration: 0.3 }">
                <PersonalityAvatarPlaceholder />
                <motion.div class="min-w-0 flex-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span class="text-base md:text-lg font-bold text-white tracking-tight">
                        ISTP<span class="text-emerald-300">-T</span>
                    </span>
                    <span class="text-white/30">·</span>
                    <span class="text-sm md:text-base text-neutral-200">Virtuoso</span>
                    <span class="text-white/30">·</span>
                    <span class="text-[13px] md:text-sm text-white/55">Operator / builder</span>
                </motion.div>
                <div class="flex gap-1 ml-auto" aria-hidden="true">
                    <span
                        v-for="L in letters"
                        :key="L"
                        class="grid h-8 w-7 place-items-center rounded border border-emerald-400/30 bg-emerald-500/10 text-[11px] font-bold text-emerald-100">
                        {{ L }}
                    </span>
                </div>
            </motion.div>

            <motion.div
                ref="signalsEl"
                class="flex flex-wrap items-end gap-2 md:gap-2.5 border-t border-white/[0.06] pt-3"
                :initial="bandInitial"
                :animate="{ opacity: 1, y: 0 }"
                :transition="{ duration: 0.3, delay: 0.05 }">
                <div
                    v-for="s in badgeSignals"
                    :key="s.id"
                    class="rounded-lg border border-white/10 bg-[#161616] px-2.5 py-1.5 text-center min-w-[4.25rem]"
                    :title="s.hint">
                    <p class="text-[9px] uppercase tracking-wide text-white/40 truncate max-w-[5.5rem]">
                        {{ s.label }}
                    </p>
                    <p class="text-[12px] font-semibold text-white leading-tight">{{ s.value }}</p>
                </div>
                <NumberFlowGroup>
                    <motion.div
                        v-for="s in barSignals"
                        :key="s.id"
                        class="min-w-[108px] flex-1 max-w-[150px] rounded-lg border border-white/10 bg-[#161616] px-2.5 py-1.5">
                        <motion.div class="flex justify-between gap-1 text-[9px] text-white/45">
                            <span class="truncate">{{ s.label }}</span>
                            <span class="tabular-nums text-emerald-200/90 shrink-0">
                                <NumberFlow :value="barValue(s.percent)" />
                                <span>%</span>
                            </span>
                        </motion.div>
                        <div class="mt-1 h-1 overflow-hidden rounded-full bg-white/[0.06]">
                            <motion.div
                                class="h-full rounded-full bg-emerald-400/85"
                                :initial="{ width: '0%' }"
                                :animate="{ width: barsAnimated ? `${s.percent}%` : '0%' }"
                                :transition="barTransition" />
                        </div>
                    </motion.div>
                </NumberFlowGroup>
            </motion.div>
        </div>

        <div class="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-6">
            <template v-for="(t, i) in glanceTiles" :key="t.id">
                <SpotlightCard
                    v-if="t.id === 'evidence'"
                    class-name="rounded-xl border border-white/10 bg-[#141414] ring-1 ring-emerald-400/25 hover:border-emerald-400/30 transition-colors cursor-pointer"
                    role="button"
                    tabindex="0"
                    aria-label="Open executive summary"
                    @click="goHandbook"
                    @keydown.enter.prevent="goHandbook"
                    @keydown.space.prevent="goHandbook">
                    <GlanceTileCard :tile="t" :index="i" evidence />
                </SpotlightCard>
                <motion.div
                    v-else
                    class="rounded-xl border border-white/10 bg-[#141414] hover:border-white/18 transition-colors"
                    :initial="tileInitial"
                    :animate="{ opacity: 1, y: 0 }"
                    :transition="tileTransition(i)"
                    :while-hover="tileHover">
                    <GlanceTileCard :tile="t" :index="i" />
                </motion.div>
            </template>
        </div>

        <motion.div
            class="space-y-1.5 pt-0.5"
            :initial="bandInitial"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.3, delay: 0.12 }">
            <div class="flex flex-wrap gap-1.5">
                <button
                    v-for="f in virtuosoFigures"
                    :key="f.id"
                    type="button"
                    class="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-[#161616] py-1 pl-1.5 pr-2.5 text-left text-[11px] text-white/80 transition-colors hover:border-emerald-400/25 hover:text-white"
                    :title="`${f.name} — ${f.note}`"
                    @click="openFigure(f)">
                    <span
                        class="grid h-6 w-6 place-items-center rounded-full border border-emerald-400/20 bg-emerald-500/10 text-[9px] font-bold text-emerald-100">
                        {{ f.initials }}
                    </span>
                    <span class="max-w-[10rem] truncate">{{ f.name }}</span>
                    <span class="text-[9px] uppercase text-white/35">{{ f.lane }}</span>
                </button>
            </div>
            <p class="text-[10px] leading-snug text-white/40 max-w-3xl">{{ virtuosoLaneDisclaimer }}</p>
        </motion.div>
    </motion.div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { usePerspective } from '@/composables/usePerspective'
import { motion } from 'motion-v'
import { usePreferredReducedMotion, useElementVisibility } from '@vueuse/core'
import NumberFlow, { NumberFlowGroup, styles } from '@number-flow/vue'
import { fitSignals } from '@/data/personalityFitSignals'
import { glanceTiles } from '@/data/personalityGlanceDeck'
import { virtuosoFigures, virtuosoLaneDisclaimer } from '@/data/personalityVirtuosoLane'
import { useVirtuosoFigureModal } from '@/composables/useVirtuosoFigureModal'
import PersonalityAvatarPlaceholder from '@/components/personality/PersonalityAvatarPlaceholder.vue'
import SpotlightCard from '@/components/personality/SpotlightCard.vue'
import GlanceTileCard from '@/components/personality/GlanceTileCard.vue'

const NUMBER_FLOW_STYLE_ID = 'number-flow-personality-fit'

const letters = ['I', 'S', 'T', 'P'] as const
const { setPerspective } = usePerspective()
const { openFigure } = useVirtuosoFigureModal()

const badgeSignals = computed(() => fitSignals.filter((s): s is Extract<typeof s, { kind: 'badge' }> => s.kind === 'badge'))
const barSignals = computed(() =>
    fitSignals.filter((s): s is Extract<typeof s, { kind: 'bar' }> => s.kind === 'bar').slice(0, 2)
)

const reduceMotion = usePreferredReducedMotion()
const bandInitial = computed(() => (reduceMotion.value ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }))
const tileInitial = computed(() => (reduceMotion.value ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }))
const barTransition = computed(() =>
    reduceMotion.value ? { duration: 0 } : { duration: 0.75, ease: [0.22, 1, 0.36, 1] as const }
)

function tileTransition(i: number) {
    if (reduceMotion.value) return { duration: 0 }
    return { delay: 0.03 * i, duration: 0.28, ease: [0.22, 1, 0.36, 1] as const }
}
const tileHover = computed(() => (reduceMotion.value ? {} : { y: -2 }))

const signalsEl = ref<HTMLElement | null>(null)
const stripVisible = useElementVisibility(signalsEl)
const barsAnimated = ref(false)
watch(stripVisible, (v) => {
    if (v) barsAnimated.value = true
})

function barValue(percent: number) {
    return barsAnimated.value ? percent : 0
}

function goHandbook() {
    setPerspective('executive')
}

onMounted(() => {
    if (!document.getElementById(NUMBER_FLOW_STYLE_ID)) {
        const el = document.createElement('style')
        el.id = NUMBER_FLOW_STYLE_ID
        el.textContent = styles.join('')
        document.head.appendChild(el)
    }
})

onBeforeUnmount(() => {
    document.getElementById(NUMBER_FLOW_STYLE_ID)?.remove()
})
</script>
