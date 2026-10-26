<template>
    <motion.div class="mt-6 max-w-3xl space-y-8" :initial="false">
        <motion.div
            id="summary-profile"
            class="profile-hero scroll-mt-24 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#121212]"
            :initial="heroInitial"
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

        <section id="personality-signals" class="scroll-mt-24 space-y-3">
            <h3 class="text-[11px] font-semibold uppercase tracking-wider text-white/40">Signals</h3>
            <div class="space-y-2.5">
                <PersonalityAssessmentCard
                    v-for="row in assessmentRows"
                    :key="row.id"
                    :label="row.label"
                    :value="row.value"
                    :href="row.href" />
            </div>
        </section>

        <label class="sr-only" for="summary-jump">Jump to question</label>
        <select
            id="summary-jump"
            class="lg:hidden w-full rounded-lg border border-white/10 bg-[#141414] px-3 py-2 text-sm text-white/85"
            :value="''"
            @change="onJumpSelect">
            <option value="" disabled>Jump to a question…</option>
            <optgroup v-for="cat in summaryCategories" :key="cat.id" :label="cat.label">
                <option v-for="item in cat.items" :key="item.id" :value="`summary-q-${item.id}`">
                    {{ item.question }}
                </option>
            </optgroup>
        </select>

        <div class="space-y-8 min-w-0">
            <section
                v-for="cat in summaryCategories"
                :key="cat.id"
                :id="`summary-${cat.id}`"
                class="scroll-mt-24">
                <h3 class="text-[11px] font-semibold uppercase tracking-wider text-white/40 mb-3">
                    {{ cat.label }}
                </h3>
                <div class="space-y-2.5">
                    <motion.article
                        v-for="(item, i) in cat.items"
                        :key="item.id"
                        :id="`summary-q-${item.id}`"
                        class="summary-card scroll-mt-24 block transition-colors"
                        :initial="cardInitial"
                        :animate="{ opacity: 1, y: 0 }"
                        :transition="cardTransition(i)">
                        <CliTerminalCard
                            :title="item.question"
                            :body="item.summary"
                            :highlights="item.highlights"
                            class="hover:border-white/15" />
                    </motion.article>
                </div>
            </section>
        </div>

        <section id="personality-glance" class="scroll-mt-24 space-y-3">
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

        <section id="personality-figures" class="scroll-mt-24 space-y-3">
            <div class="space-y-1">
                <h3 class="text-[11px] font-semibold uppercase tracking-wider text-white/40">Figures like me</h3>
                <p class="text-[12px] text-white/45">Click a figure to learn more.</p>
            </div>
            <FiguresLikeMeStrip :items="figuresLikeMeItems" />
        </section>

        <section id="personality-sources" class="scroll-mt-24">
            <CliTerminalCard title="Sources" :body="personalitySourcesBody" :show-footer-rule="false" />
        </section>
    </motion.div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { motion } from 'motion-v'
import { usePreferredReducedMotion } from '@vueuse/core'
import { profileMeta, summaryCategories } from '@/data/personalitySummary'
import { personalityDeepAssessmentRows } from '@/data/personalityPreview'
import { personalitySourcesBody } from '@/data/personalityDownloads'
import { glanceTiles } from '@/data/personalityGlanceDeck'
import { virtuosoFigures } from '@/data/personalityVirtuosoLane'
import { buildFiguresLikeMeItems } from '@/lib/virtuosoAvatars'
import CliTerminalCard from '@/components/CliTerminalCard.vue'
import HighlightedText from '@/components/HighlightedText.vue'
import PersonalityAssessmentCard from '@/components/personality/PersonalityAssessmentCard.vue'
import FiguresLikeMeStrip from '@/components/personality/FiguresLikeMeStrip.vue'

const assessmentRows = personalityDeepAssessmentRows
const figuresLikeMeItems = computed(() => buildFiguresLikeMeItems(virtuosoFigures))

const reduceMotion = usePreferredReducedMotion()
const heroInitial = computed(() => (reduceMotion.value ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }))
const cardInitial = computed(() => (reduceMotion.value ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }))

function cardTransition(i: number) {
    if (reduceMotion.value) return { duration: 0 }
    return { delay: 0.02 * i, duration: 0.25, ease: [0.22, 1, 0.36, 1] as const }
}

function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    history.replaceState(null, '', `#${id}`)
}

function onJumpSelect(e: Event) {
    const v = (e.target as HTMLSelectElement).value
    if (v) scrollTo(v)
    ;(e.target as HTMLSelectElement).value = ''
}
</script>

<style scoped>
.summary-card {
    border-left-width: 3px;
    border-left-color: transparent;
}

.summary-card:target :deep(.cli-block) {
    border-color: rgba(16, 185, 129, 0.35);
    box-shadow: inset 3px 0 0 rgba(16, 185, 129, 0.45);
}

.profile-hero__img {
    filter: drop-shadow(0 12px 28px rgba(0, 0, 0, 0.45));
}
</style>
