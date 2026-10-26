<template>
    <article
        :id="`vector-${vector.id}`"
        class="value-vector-card group relative scroll-mt-28 rounded-2xl border p-6 md:p-8 overflow-hidden transition-shadow duration-300"
        :class="cardClass"
        @mouseenter="onEnter"
        @mouseleave="onLeave"
        @focusin="onEnter"
        @focusout="onLeave">
        <!-- Micro-interaction: ghost peek -->
        <div
            class="peek-strip pointer-events-none absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 group-focus-within:translate-y-0 transition-transform duration-300 ease-out border-t"
            :class="peekClass"
            aria-hidden="true">
            <p class="font-mono text-[10px] leading-snug truncate px-4 py-2">{{ vector.peek }}</p>
        </div>

        <!-- Micro-interaction: corner thread -->
        <svg
            class="thread-line pointer-events-none absolute top-0 right-0 w-16 h-16 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            viewBox="0 0 64 64"
            fill="none"
            aria-hidden="true">
            <path
                d="M64 8 L8 8 L8 64"
                stroke="currentColor"
                stroke-width="1"
                class="text-teal-600/25" />
        </svg>

        <p class="font-mono text-[11px] uppercase tracking-[0.18em] text-neutral-500">
            {{ vector.index }} · {{ vector.label }}
        </p>
        <h2 class="mt-2 font-serif text-2xl md:text-[1.65rem] text-neutral-950 tracking-tight leading-tight">
            {{ vector.headline }}
        </h2>
        <p class="mt-4 text-[15px] leading-relaxed text-neutral-600 max-w-prose">{{ vector.body }}</p>

        <ul class="mt-4 flex flex-wrap gap-2">
            <li
                v-for="chip in vector.proof"
                :key="chip"
                class="rounded-full border border-black/[0.07] bg-white/80 px-2.5 py-1 text-[11px] text-neutral-600">
                {{ chip }}
            </li>
        </ul>

        <div class="mt-6">
            <DeepDiveHint :target="vector.deepTarget" variant="light" />
        </div>
    </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ExecutiveVector } from '@/content/executiveVectors'
import { usePerspective } from '@/composables/usePerspective'
import DeepDiveHint from '@/components/perspective/DeepDiveHint.vue'

const props = defineProps<{
    vector: ExecutiveVector
}>()

const { hoverVectorId } = usePerspective()

const cardClass = computed(() =>
    [
        'border-black/[0.08] bg-white/70 backdrop-blur-md',
        'hover:shadow-[0_16px_48px_-16px_rgba(0,0,0,0.14)]',
        'focus-within:shadow-[0_16px_48px_-16px_rgba(0,0,0,0.14)]',
    ].join(' ')
)

const peekClass = 'border-black/[0.06] bg-neutral-50/95 text-neutral-500'

function onEnter() {
    hoverVectorId.value = props.vector.id
}

function onLeave() {
    if (hoverVectorId.value === props.vector.id) hoverVectorId.value = null
}
</script>

<style scoped>
.value-vector-card:target {
    border-color: rgba(15, 118, 110, 0.35);
    box-shadow: 0 0 0 1px rgba(15, 118, 110, 0.12);
}

@media (prefers-reduced-motion: reduce) {
    .peek-strip {
        transform: none !important;
        opacity: 0.85;
        position: relative;
        translate: none;
        margin-top: 1rem;
        border-radius: 0.5rem;
    }

    .thread-line {
        display: none;
    }
}
</style>
