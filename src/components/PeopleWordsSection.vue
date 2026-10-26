<template>
    <section>
        <p class="text-[12px] text-[#8F8F8F] mb-3">{{ "<!-- People's word -->" }}</p>
        <h2 class="normal-font text-white font-extrabold leading-[1.05] text-[40px] md:text-6xl mb-3">
            People’s <span class="text-neutral-400">Word</span>
        </h2>
        <p class="font-mono text-[13px] text-white/45 mb-6">
            <span class="text-emerald-400">&gt;</span>
            <span class="ml-1">feedback.log</span>
            <span class="text-white/30"> — from clients and teammates</span>
        </p>

        <div class="space-y-4">
            <article
                v-for="m in peopleWordMessages"
                :key="m.id"
                class="pw-card group rounded-md border border-white/10 bg-[#141414] px-4 py-3 transition-colors hover:border-white/15">
                <header class="flex items-start gap-3">
                    <img
                        :src="m.avatar"
                        :alt="m.name"
                        class="h-10 w-10 shrink-0 rounded-[11px] border border-white/10 object-cover"
                        draggable="false" />
                    <div class="flex min-w-0 flex-1 items-start justify-between gap-3 pt-0.5">
                        <div class="min-w-0 font-mono text-[12.5px] leading-5">
                            <p class="font-semibold text-emerald-400/95">{{ m.name }}</p>
                            <p class="mt-0.5 text-white/45">{{ m.role }}</p>
                        </div>
                        <time class="shrink-0 font-mono text-[12px] text-white/40">{{ m.ts }}</time>
                    </div>
                </header>

                <div class="cli-divider my-3 h-px bg-white/10" />

                <blockquote class="text-[15px] md:text-[16px] leading-relaxed text-primary">
                    <span class="text-white/25" aria-hidden="true">“</span>{{ m.text }}<span
                        class="text-white/25"
                        aria-hidden="true"
                        >”</span
                    >
                </blockquote>

                <div
                    v-if="m.project || m.projectUrl"
                    class="mt-3 flex flex-wrap items-center gap-2 font-mono text-[12px]">
                    <span v-if="m.project" class="chip">{{ m.project }}</span>
                    <a
                        v-if="m.projectUrl"
                        :href="m.projectUrl"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="visit-link">
                        Visit site
                    </a>
                </div>

                <ul v-if="m.scope?.length" class="mt-3 flex flex-wrap gap-1.5">
                    <li v-for="t in m.scope.slice(0, 3)" :key="t" class="chip chip--muted">{{ t }}</li>
                </ul>
            </article>
        </div>
    </section>
</template>

<script setup lang="ts">
import { peopleWordMessages } from '@/data/peopleWords'
</script>

<style scoped>
.chip {
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: rgba(255, 255, 255, 0.04);
    padding: 2px 8px;
    border-radius: 999px;
    font-size: 12px;
    color: #d4d4d4;
}

.chip--muted {
    color: #a3a3a3;
}

.visit-link {
    display: inline-flex;
    align-items: center;
    padding: 2px 8px;
    border-radius: 999px;
    border: 1px solid rgba(255, 255, 255, 0.14);
    color: #d4d4d4;
    transition: border-color 0.15s, background 0.15s, color 0.15s;
}

.visit-link:hover {
    border-color: rgba(255, 255, 255, 0.28);
    background: rgba(255, 255, 255, 0.06);
    color: #fafafa;
}

@media (prefers-reduced-motion: reduce) {
    .pw-card {
        transition: none;
    }
}
</style>
