<template>
    <motion.div
        v-show="show"
        :initial="false"
        :animate="panelAnimate"
        :transition="transition">
        <slot />
    </motion.div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { motion } from 'motion-v'
import { usePreferredReducedMotion } from '@vueuse/core'

const props = defineProps<{ show: boolean }>()

const reduceMotion = usePreferredReducedMotion()

const panelAnimate = computed(() =>
    props.show ? { opacity: 1, y: 0 } : { opacity: 0, y: reduceMotion.value ? 0 : 6 }
)

const transition = computed(() =>
    reduceMotion.value ? { duration: 0 } : { duration: 0.22, ease: [0.22, 1, 0.36, 1] as const }
)
</script>
