<template>
    <div class="executive-canvas min-h-full pb-16">
        <section id="exec-hero" class="scroll-mt-24 pt-10 md:pt-14 pb-10 md:pb-12">
            <p class="font-mono text-[11px] uppercase tracking-[0.2em] text-teal-800/80">
                {{ executiveHero.eyebrow }}
            </p>
            <h1
                class="mt-3 font-serif text-[2.35rem] md:text-[3.25rem] font-semibold text-neutral-950 tracking-tight leading-[1.05] max-w-3xl">
                {{ executiveHero.headline }}
            </h1>
            <p class="mt-4 text-base md:text-lg text-neutral-600 max-w-2xl leading-relaxed">
                {{ executiveHero.subhead }}
            </p>
            <div class="mt-6 flex flex-wrap items-center gap-3">
                <a
                    href="https://cal.com/adibomar/meeting"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center rounded-lg bg-neutral-950 px-4 py-2 text-[13px] font-semibold text-white hover:bg-neutral-800 transition-colors">
                    Schedule a call
                </a>
            </div>
        </section>

        <section class="space-y-4 md:space-y-5 max-w-3xl" aria-label="Value vectors">
            <ValueVectorCard v-for="v in executiveVectors" :key="v.id" :vector="v" />
        </section>
    </div>
</template>

<script setup lang="ts">
import { executiveHero, executiveVectors } from '@/content/executiveVectors'
import ValueVectorCard from '@/components/perspective/ValueVectorCard.vue'
</script>
