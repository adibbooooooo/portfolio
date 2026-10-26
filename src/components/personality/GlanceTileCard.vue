<template>
    <motion.div class="flex gap-2 min-h-[4.25rem] px-3 py-2.5">
        <motion.div
            class="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.03] text-emerald-200/90"
            :initial="tileInitial"
            :animate="{ opacity: 1, y: 0 }"
            :transition="transition">
            <i :class="tile.icon" class="text-sm" aria-hidden="true" />
        </motion.div>
        <motion.div class="min-w-0 flex flex-col justify-center">
            <h3 class="text-[12px] font-semibold text-white leading-snug">{{ tile.title }}</h3>
            <p class="mt-0.5 text-[10px] leading-snug text-white/58 line-clamp-3">{{ tile.line }}</p>
            <p v-if="evidence" class="mt-1 text-[10px] font-medium text-emerald-300/90">Open Executive Summary →</p>
        </motion.div>
    </motion.div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { motion } from 'motion-v'
import { usePreferredReducedMotion } from '@vueuse/core'
import type { GlanceTile } from '@/data/personalityGlanceDeck'

const props = defineProps<{
    tile: GlanceTile
    index: number
    evidence?: boolean
}>()

const reduceMotion = usePreferredReducedMotion()
const tileInitial = computed(() => (reduceMotion.value ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }))
const transition = computed(() =>
    reduceMotion.value ? { duration: 0 } : { delay: 0.03 * props.index, duration: 0.28, ease: [0.22, 1, 0.36, 1] as const }
)
</script>
