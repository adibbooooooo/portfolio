<template>
    <motion.div class="mt-6 max-w-3xl space-y-8" :initial="false">
        <!-- Profile hero (matches Summarized) -->
        <motion.div
            id="deep-profile"
            class="profile-hero scroll-mt-24 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#121212]"
            :initial="bandInitial"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.35 }">
            <div
                class="profile-hero__layout px-5 py-5 md:flex md:items-center md:gap-6 md:py-6 md:pl-4 md:pr-6">
                <div
                    class="profile-hero__visual relative hidden h-[164px] w-[220px] shrink-0 md:block"
                    aria-hidden="true">
                    <img
                        src="/istp.png"
                        srcset="/istp.png 1x, /istp@2x.png 2x"
                        alt=""
                        width="176"
                        height="176"
                        class="profile-hero__img pointer-events-none absolute -bottom-7 -left-18 h-[9.25rem] w-auto max-w-none md:h-[10.25rem]" />
                </div>
                <div class="profile-hero__copy min-w-0 flex-1">
                    <p class="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-400">
                        {{ profileMeta.archetype }}
                    </p>
                    <p
                        class="mt-2 text-[17px] font-semibold leading-snug tracking-tight text-emerald-300 md:mt-2.5 md:text-lg">
                        {{ profileMeta.typeLine }}
                    </p>
                    <HighlightedText
                        :text="profileMeta.tagline"
                        :highlights="profileMeta.taglineHighlights"
                        tag="p"
                        text-class="mt-3 text-[13px] leading-7 text-primary md:mt-4 md:max-w-[36rem] md:text-[14px] md:leading-[1.7]" />
                </div>
            </div>
        </motion.div>

        <section id="deep-signals" class="scroll-mt-24 space-y-3">
            <h3 class="text-[11px] font-semibold uppercase tracking-wider text-white/40">Signals</h3>
            <div class="space-y-2.5">
                <PersonalityAssessmentCard
                    v-for="row in deepAssessmentRows"
                    :key="row.id"
                    :label="row.label"
                    :value="row.value"
                    :href="row.href" />
            </div>
        </section>

        <!-- Glance tiles as CLI cards -->
        <section id="deep-glance" class="scroll-mt-24 space-y-3">
            <h3 class="text-[11px] font-semibold uppercase tracking-wider text-white/40">At a glance</h3>
            <div class="space-y-2.5">
                <CliTerminalCard
                    v-for="tile in glanceTiles"
                    :key="tile.id"
                    :title="tile.title"
                    :body="tile.line"
                    class="hover:border-white/15" />
            </div>
        </section>

        <section id="deep-virtuoso" class="scroll-mt-24 space-y-3">
            <div class="space-y-1">
                <h3 class="text-[11px] font-semibold uppercase tracking-wider text-white/40">Figures like me</h3>
                <p class="text-[12px] text-white/45">Click a figure to learn more.</p>
            </div>
            <FiguresLikeMeStrip :items="figuresLikeMeItems" />
        </section>

        <!-- Handbook -->
        <section id="deep-handbook" class="scroll-mt-24 space-y-4 pt-2">
            <h3 class="text-[11px] font-semibold uppercase tracking-wider text-white/40">Handbook</h3>

            <label class="sr-only" for="deep-handbook-jump">Jump to handbook section</label>
            <select
                id="deep-handbook-jump"
                class="lg:hidden w-full rounded-lg border border-white/10 bg-[#141414] px-3 py-2 text-sm text-white/85"
                :value="''"
                @change="onHandbookJump">
                <option value="" disabled>Jump to section…</option>
                <optgroup v-for="group in tocGroups" :key="group.label" :label="group.label">
                    <option v-for="item in group.items" :key="item.id" :value="item.id">
                        {{ item.label }}
                    </option>
                </optgroup>
            </select>

            <div
                class="lg:grid lg:grid-cols-[minmax(10rem,11rem)_minmax(0,1fr)] lg:gap-8 xl:grid-cols-[12rem_1fr]">
                <PersonalityHandbookToc
                    :groups="tocGroups"
                    :scroll-root="scrollRoot"
                    aria-label="Handbook contents" />
                <div class="handbook-main min-w-0 space-y-2.5">
                    <HandbookChapterCard
                        v-for="(ch, idx) in crystalChapters"
                        :key="ch.id"
                        :id="ch.id"
                        :chapter="padChapter(idx + 1)"
                        :title="shortCrystalTitle(idx)"
                        :body="ch.body" />

                    <h4
                        class="text-[11px] font-semibold uppercase tracking-wider text-white/40 pt-4 pb-1 scroll-mt-24"
                        id="istp-section">
                        ISTP cognitive guide
                    </h4>

                    <HandbookChapterCard
                        v-for="(ch, idx) in istpChunks"
                        :key="ch.id"
                        :id="ch.id"
                        :chapter="padChapter(idx + 1)"
                        :title="istpChunks.length > 1 ? `Part ${idx + 1}` : 'Full export'"
                        :body="ch.body" />

                    <CliTerminalCard
                        title="Sources"
                        body="Content synthesized from my personal Crystal handbook (Crystal Knows) and an ISTP cognitive typing guide. Frameworks belong to their publishers; this page is for context only."
                        :show-footer-rule="false"
                        class="mt-4" />
                </div>
            </div>
        </section>
    </motion.div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { motion } from 'motion-v'
import { usePreferredReducedMotion } from '@vueuse/core'
import HighlightedText from '@/components/HighlightedText.vue'
import CliTerminalCard from '@/components/CliTerminalCard.vue'
import PersonalityAssessmentCard from '@/components/personality/PersonalityAssessmentCard.vue'
import FiguresLikeMeStrip from '@/components/personality/FiguresLikeMeStrip.vue'
import HandbookChapterCard from '@/components/personality/HandbookChapterCard.vue'
import PersonalityHandbookToc from '@/components/personality/PersonalityHandbookToc.vue'
import { profileMeta } from '@/data/personalitySummary'
import { personalityDeepAssessmentRows } from '@/data/personalityPreview'
import { glanceTiles } from '@/data/personalityGlanceDeck'
import { virtuosoFigures } from '@/data/personalityVirtuosoLane'
import { buildFiguresLikeMeItems } from '@/lib/virtuosoAvatars'
import {
    parseCrystalHandbook,
    parseIstpHandbook,
    buildHandbookToc,
    type HandbookTocGroup,
} from '@/lib/personalityHandbook'

const props = defineProps<{
    scrollRoot?: HTMLElement | null
}>()

const scrollRoot = computed(() => props.scrollRoot ?? null)

const CRYSTAL_SHORT = [
    'Personality',
    'Assessments',
    'Natural style',
    'Decisions',
    'Energy & stress',
    'Relationships',
    'Career',
    'Personal growth',
] as const

const deepAssessmentRows = personalityDeepAssessmentRows

const crystalChapters = computed(() => parseCrystalHandbook())
const istpChunks = computed(() => parseIstpHandbook())
const tocGroups = computed<HandbookTocGroup[]>(() => buildHandbookToc(crystalChapters.value, istpChunks.value))
const figuresLikeMeItems = computed(() => buildFiguresLikeMeItems(virtuosoFigures))

const reduceMotion = usePreferredReducedMotion()
const bandInitial = computed(() => (reduceMotion.value ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }))

function padChapter(n: number) {
    return String(n).padStart(2, '0')
}

function shortCrystalTitle(idx: number) {
    return CRYSTAL_SHORT[idx] ?? `Chapter ${idx + 1}`
}

function onHandbookJump(e: Event) {
    const v = (e.target as HTMLSelectElement).value
    if (!v) return
    const el = document.getElementById(v)
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    if (el instanceof HTMLDetailsElement) el.open = true
    history.replaceState(null, '', `#${v}`)
    ;(e.target as HTMLSelectElement).value = ''
}

</script>

<style scoped>
.handbook-main {
    padding-bottom: 2rem;
}

.profile-hero__img {
    filter: drop-shadow(0 12px 28px rgba(0, 0, 0, 0.45));
}
</style>
