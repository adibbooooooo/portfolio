<template>
    <motion.div
        ref="rootRef"
        v-bind="attrs"
        :class="['relative overflow-hidden', className]"
        @mousemove="onMouseMove"
        @focus="onFocus"
        @blur="onBlur"
        @mouseenter="onMouseEnter"
        @mouseleave="onMouseLeave">
        <div
            class="pointer-events-none absolute inset-0 transition-opacity duration-500 ease-in-out"
            :style="spotlightStyle" />
        <slot />
    </motion.div>
</template>

<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue'
import { motion } from 'motion-v'
import { usePreferredReducedMotion } from '@vueuse/core'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
    defineProps<{
        className?: string
        spotlightColor?: string
    }>(),
    {
        className: '',
        spotlightColor: 'rgba(52, 211, 153, 0.22)',
    }
)

const attrs = useAttrs()
const reduceMotion = usePreferredReducedMotion()
const rootRef = ref<HTMLElement | null>(null)
const isFocused = ref(false)
const position = ref({ x: 0, y: 0 })
const opacity = ref(0)

const spotlightStyle = computed(() => {
    if (reduceMotion.value) return { opacity: 0 }
    return {
        opacity: opacity.value,
        background: `radial-gradient(circle at ${position.value.x}px ${position.value.y}px, ${props.spotlightColor}, transparent 80%)`,
    }
})

function rootEl(): HTMLElement | null {
    const r = rootRef.value
    if (!r) return null
    return (r as { $el?: HTMLElement }).$el ?? (r as HTMLElement)
}

function onMouseMove(e: MouseEvent) {
    if (reduceMotion.value || isFocused.value) return
    const el = rootEl()
    if (!el) return
    const rect = el.getBoundingClientRect()
    position.value = { x: e.clientX - rect.left, y: e.clientY - rect.top }
}

function onFocus() {
    if (reduceMotion.value) return
    isFocused.value = true
    opacity.value = 0.5
}

function onBlur() {
    isFocused.value = false
    opacity.value = 0
}

function onMouseEnter() {
    if (reduceMotion.value) return
    opacity.value = 0.5
}

function onMouseLeave() {
    opacity.value = 0
}
</script>
