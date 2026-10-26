<template>
    <div class="deep-extras space-y-16 pb-8">
        <section id="deep-case-studies" class="scroll-mt-24">
            <p class="text-[12px] text-[#8F8F8F] mb-2">{{ '<!-- Case studies -->' }}</p>
            <h2 class="normal-font text-white font-extrabold leading-[1.05] text-[32px] md:text-5xl mb-2">
                Case <span class="text-neutral-400">Studies</span>
            </h2>
            <p class="text-primary text-[14px] max-w-2xl leading-relaxed mb-8">
                Exhaustive breakdowns: brief, brand strategy, system architecture, and measurable outcomes.
            </p>

            <motion.div class="space-y-4" :initial="false">
                <article
                    v-for="(c, i) in caseStudyPlaceholders"
                    :key="c.id"
                    class="rounded-xl border border-white/10 bg-[#141414] p-5 md:p-6"
                    :initial="cardInitial"
                    :animate="{ opacity: 1, y: 0 }"
                    :transition="cardTransition(i)">
                    <motion.div class="flex flex-wrap gap-2 mb-3">
                        <span
                            v-for="t in c.tags"
                            :key="t"
                            class="rounded-full border border-emerald-400/25 bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-100">
                            {{ t }}
                        </span>
                    </motion.div>
                    <h3 class="text-lg font-semibold text-white">{{ c.title }}</h3>
                    <div class="mt-4 grid gap-4 md:grid-cols-2">
                        <div>
                            <p class="text-[10px] uppercase tracking-wider text-white/40 mb-1">Brief</p>
                            <p class="text-[13px] text-white/75 leading-relaxed">{{ c.brief }}</p>
                            <p class="text-[10px] uppercase tracking-wider text-white/40 mt-4 mb-1">Brand</p>
                            <p class="text-[13px] text-white/75 leading-relaxed">{{ c.brand }}</p>
                        </div>
                        <div>
                            <p class="text-[10px] uppercase tracking-wider text-white/40 mb-1">Architecture</p>
                            <p class="text-[13px] text-white/75 leading-relaxed font-mono text-[12px]">
                                {{ c.architecture }}
                            </p>
                            <p class="text-[10px] uppercase tracking-wider text-white/40 mt-4 mb-1">Outcome</p>
                            <p class="text-[13px] text-emerald-200/90 leading-relaxed">{{ c.outcome }}</p>
                        </div>
                    </div>
                </article>
            </motion.div>
        </section>

        <section id="deep-stack" class="scroll-mt-24">
            <p class="text-[12px] text-[#8F8F8F] mb-2">{{ '<!-- Tech stack -->' }}</p>
            <h2 class="normal-font text-white font-extrabold leading-[1.05] text-[32px] md:text-5xl mb-2">
                Stack <span class="text-neutral-400">Matrix</span>
            </h2>
            <p class="text-primary text-[14px] mb-6 max-w-2xl">
                Contextual usage—not an icon cloud. How each layer shows up in real delivery.
            </p>
            <div class="overflow-hidden rounded-xl border border-white/10">
                <table class="w-full text-left text-[13px]">
                    <thead class="bg-[#1a1a1a] text-white/50 text-[11px] uppercase tracking-wider">
                        <tr>
                            <th class="px-4 py-3 font-medium">Domain</th>
                            <th class="px-4 py-3 font-medium">Tools</th>
                            <th class="px-4 py-3 font-medium hidden md:table-cell">Used for</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="row in stackMatrix"
                            :key="row.domain"
                            class="border-t border-white/10 bg-[#141414] hover:bg-[#181818] transition-colors">
                            <td class="px-4 py-3 text-white font-medium">{{ row.domain }}</td>
                            <td class="px-4 py-3 text-emerald-200/90 font-mono text-[12px]">{{ row.tools }}</td>
                            <td class="px-4 py-3 text-white/65 hidden md:table-cell">{{ row.usage }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>

        <section id="deep-timeline" class="scroll-mt-24">
            <p class="text-[12px] text-[#8F8F8F] mb-2">{{ '<!-- Career -->' }}</p>
            <h2 class="normal-font text-white font-extrabold leading-[1.05] text-[32px] md:text-5xl mb-2">
                Career <span class="text-neutral-400">Timeline</span>
            </h2>
            <p class="text-primary text-[14px] mb-4 max-w-2xl">
                Full chronological detail lives in
                <RouterLink to="/experience" class="text-emerald-300/90 hover:text-emerald-200 underline-offset-2 hover:underline">
                    work.experience
                </RouterLink>
                — expand roles, stacks, and outcomes there.
            </p>
            <RouterLink
                to="/experience"
                class="inline-flex items-center gap-2 rounded-lg border border-emerald-400/35 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-200 hover:bg-emerald-500/15 transition-colors">
                Open work.experience
                <i class="pi pi-arrow-right text-xs" aria-hidden="true" />
            </RouterLink>
        </section>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { motion } from 'motion-v'
import { usePreferredReducedMotion } from '@vueuse/core'
import { caseStudyPlaceholders, stackMatrix } from '@/content/deepDivePlaceholders'

const reduceMotion = usePreferredReducedMotion()
const cardInitial = computed(() => (reduceMotion.value ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }))

function cardTransition(i: number) {
    if (reduceMotion.value) return { duration: 0 }
    return { delay: 0.05 * i, duration: 0.3 }
}
</script>
