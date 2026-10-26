<template>
    <motion.div
        role="img"
        aria-label="Profile photo placeholder"
        :class="sizeClass"
        :initial="reduceMotion ? false : { opacity: 0, scale: 0.92 }"
        :animate="{ opacity: 1, scale: 1 }"
        :transition="{ duration: 0.35 }">
        <i class="pi pi-user text-base text-white/25" aria-hidden="true" />
    </motion.div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { motion } from 'motion-v'
import { usePreferredReducedMotion } from '@vueuse/core'

const props = withDefaults(
    defineProps<{
        size?: 'md' | 'lg'
    }>(),
    { size: 'md' }
)

const reduceMotion = usePreferredReducedMotion()

const sizeClass = computed(() =>
    props.size === 'lg'
        ? 'grid h-14 w-14 md:h-16 md:w-16 shrink-0 place-items-center rounded-full border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02]'
        : 'grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] md:h-12 md:w-12'
)
</script>
