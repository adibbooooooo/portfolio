<template>
    <button
        type="button"
        class="group/hint inline-flex items-center gap-1.5 text-[12px] font-medium transition-colors cursor-pointer"
        :class="variant === 'light' ? 'text-teal-800/90 hover:text-teal-950' : 'text-emerald-300/90 hover:text-emerald-200'"
        @click="focusDeep(target)">
        <span>Deep dive</span>
        <i
            class="pi pi-arrow-right text-[10px] transition-transform group-hover/hint:translate-x-0.5"
            aria-hidden="true" />
    </button>
</template>

<script setup lang="ts">
import { usePerspective } from '@/composables/usePerspective'

defineProps<{
    target: string
    variant?: 'light' | 'dark'
}>()

const { focusDeep } = usePerspective()
</script>
