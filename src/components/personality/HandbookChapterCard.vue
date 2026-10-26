<template>
    <details
        :id="id"
        class="handbook-chapter cli-block scroll-mt-24 rounded-md border border-white/10 bg-[#141414] overflow-hidden transition-colors hover:border-white/15"
        :open="defaultOpen">
        <summary class="handbook-chapter__summary cursor-pointer list-none select-none">
            <div class="flex items-center gap-1.5 px-4 py-3 font-mono text-[13px] leading-6">
                <i
                    class="pi pi-caret-right handbook-chapter__chevron shrink-0 text-[10px] text-white/45"
                    aria-hidden="true" />
                <span class="text-emerald-400">&gt;</span>
                <span v-if="chapter" class="text-white/35 tabular-nums">{{ chapter }}</span>
                <span class="text-cyan-300" :class="chapter ? 'ml-1' : ''">{{ title }}</span>
            </div>
        </summary>

        <div class="handbook-chapter__body px-4 pb-3">
            <div class="cli-divider mb-2 h-px bg-white/10" aria-hidden="true" />
            <p class="font-mono text-[13px] leading-7 text-primary whitespace-pre-wrap overflow-wrap-anywhere">
                {{ body }}
            </p>
        </div>
    </details>
</template>

<script setup lang="ts">
withDefaults(
    defineProps<{
        id: string
        title: string
        body: string
        chapter?: string
        defaultOpen?: boolean
    }>(),
    {
        defaultOpen: false,
    }
)
</script>

<style scoped>
.handbook-chapter__summary::-webkit-details-marker {
    display: none;
}

.handbook-chapter__summary::marker {
    content: '';
}

.handbook-chapter[open] .handbook-chapter__chevron {
    transform: rotate(90deg);
}

.handbook-chapter__chevron {
    transition: transform 0.15s ease;
}

.handbook-chapter[open] {
    border-color: rgba(255, 255, 255, 0.14);
}

.handbook-chapter__body {
    max-width: 42rem;
}
</style>
