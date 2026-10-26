<template>
    <div class="cli-header flex items-center gap-2 font-mono text-[13px] leading-6">
        <span class="text-emerald-400 shrink-0">&gt;</span>
        <span class="min-w-0 flex-1 truncate">
            <span class="text-cyan-300">assessment</span><span class="text-primary">:</span>
            <span class="ml-1 font-semibold text-white">{{ label }}</span>
        </span>
        <i
            v-if="showExternalIcon"
            class="pi pi-arrow-up-right shrink-0 text-[11px] text-white/80 transition-transform duration-200 group-hover:translate-x-[2px] group-hover:-translate-y-[2px] group-hover:text-white"
            aria-hidden="true" />
    </div>

    <div class="cli-divider my-2 h-px bg-white/10" aria-hidden="true" />

    <p class="font-mono text-[13px] leading-7 text-primary flex gap-2">
        <span class="text-emerald-400 shrink-0" aria-hidden="true">✓</span>
        <span class="min-w-0">
            <template v-for="(seg, i) in segments" :key="i">
                <span v-if="seg.kind === 'up'" class="font-semibold text-emerald-400">{{ seg.text }}</span>
                <span v-else-if="seg.kind === 'down'" class="font-semibold text-rose-400">{{ seg.text }}</span>
                <span v-else>{{ seg.text }}</span>
            </template>
        </span>
    </p>
</template>

<script setup lang="ts">
import type { AssessmentValueSegment } from '@/lib/personalityAssessmentValue'

defineProps<{
    label: string
    segments: AssessmentValueSegment[]
    showExternalIcon?: boolean
}>()
</script>
