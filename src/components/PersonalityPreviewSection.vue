<template>
    <section class="personality-preview">
        <p class="text-[12px] text-[#8F8F8F] mb-3">{{ '<!-- Personality -->' }}</p>
        <h2 class="normal-font text-white font-extrabold leading-[1.05] text-[40px] md:text-6xl mb-6">
            My <span class="text-neutral-400">Personality</span>
        </h2>

        <div class="flex flex-wrap gap-3">
            <a
                v-for="pill in personalityTraitPills"
                :key="pill.label"
                :href="traitPillGoogleUrl(pill)"
                target="_blank"
                rel="noopener noreferrer"
                :aria-label="`Search Google: ${pill.searchQuery}`"
                class="personality-trait-pill group relative inline-flex cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e0f10]">
                <span
                    class="pointer-events-none absolute -inset-1 rounded-full bg-rose-500/0 blur-md transition-all duration-300 group-hover:scale-125 group-hover:bg-rose-500/45"
                    aria-hidden="true" />
                <span
                    class="relative rounded-full border border-rose-400/35 bg-rose-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-rose-100 transition-transform duration-200 group-hover:scale-105 group-hover:border-rose-300/55 group-hover:bg-rose-500/20">
                    {{ pill.label }}
                </span>
            </a>
        </div>

        <div class="mt-6 rounded-xl border border-white/10 bg-[#141414] overflow-hidden">
            <div class="mx-4 mt-4 rounded-xl border border-rose-500/15 bg-rose-500/[0.06] p-4">
                <p class="text-[10px] font-semibold uppercase tracking-wider text-rose-300/90">
                    {{ personalityQuickSummary.archetypeLabel }}
                </p>
                <p class="mt-0.5 text-xl font-bold text-white tracking-tight normal-font">
                    {{ personalityQuickSummary.archetype }}
                </p>
            </div>

            <p class="px-4 py-4 text-[14px] leading-7 text-primary max-w-3xl">
                I'm someone who <span class="mark" style="--d:0s">makes clear decisions</span>,
                <span class="mark" style="--d:.12s">cuts through confusion</span>, and
                <span class="mark" style="--d:.24s">stays focused on results</span>.
                I show up with <span class="mark" style="--d:.36s">confidence</span> and
                <span class="mark" style="--d:.48s">follow-through</span>, plus
                <span class="mark" style="--d:.6s">reliability</span> and
                <span class="mark" style="--d:.72s">calm under pressure</span>. That is why I perform well when
                <span class="mark" style="--d:.84s">the stakes are high</span>.
                I turn <span class="mark" style="--d:.96s">creative ideas</span> into
                <span class="mark" style="--d:1.08s">real outcomes</span>, move quickly while
                <span class="mark" style="--d:1.2s">holding a high bar</span>. What others read as bold is usually
                <span class="mark" style="--d:1.32s">clarity on what to do next</span> and the discipline to execute.
            </p>
        </div>

        <div class="mt-4 space-y-4">
            <PersonalityAssessmentCard
                v-for="row in personalityAssessmentRows"
                :key="row.id"
                :label="row.label"
                :value="row.value"
                :href="row.href" />
        </div>

        <div
            class="mt-8 rounded-[12px] border border-white/10 bg-gradient-to-b from-white/5 to-transparent px-5 py-5 relative overflow-hidden group transition-all duration-300 hover:border-emerald-400/30 hover:from-emerald-500/[0.06] flex flex-wrap items-center gap-4">
            <p class="text-[13px] text-white/80 leading-relaxed relative z-10 md:flex-1 font-mono">
                Want to know more about my personality? Head to
                <span class="text-emerald-400 font-semibold">my.personality</span>
                where you can find other information related to my personality!
            </p>

            <RouterLink
                to="/personality"
                class="inline-flex items-center gap-2 font-mono text-[13px] text-white/90 border border-white/20 rounded px-3.5 py-2 hover:border-emerald-400/40 hover:bg-emerald-400/[0.07] transition-all duration-300 group/btn shrink-0">
                <span>Learn more</span>
                <i
                    class="pi pi-arrow-up-right text-[11px] text-emerald-400 transition-transform duration-300 group-hover/btn:translate-x-[2px] group-hover/btn:-translate-y-[2px]"
                    aria-hidden="true" />
            </RouterLink>
        </div>
    </section>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import PersonalityAssessmentCard from '@/components/personality/PersonalityAssessmentCard.vue'
import {
    personalityTraitPills,
    personalityQuickSummary,
    personalityAssessmentRows,
    traitPillGoogleUrl,
} from '@/data/personalityPreview'
</script>
