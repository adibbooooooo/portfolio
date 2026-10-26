<template>
    <motion.div
        ref="rootRef"
        class="perspective-toggle relative inline-flex rounded-lg border p-0.5 text-[11px] font-medium select-none"
        :class="[toggleShellClass, { 'perspective-toggle--hint-deep': hintDeep }]"
        role="group"
        aria-label="Content perspective">
        <span
            class="absolute top-0.5 bottom-0.5 rounded-md pointer-events-none transition-all duration-300 ease-out"
            :class="pillClass"
            :style="{ left: `${pillX.left}px`, width: `${pillX.width}px` }" />
        <button
            type="button"
            class="relative z-[1] px-2.5 py-1 rounded-md transition-colors cursor-pointer"
            :class="btnClass('executive')"
            :aria-pressed="isExecutive"
            @click="setPerspective('executive')">
            Summarized
        </button>
        <button
            type="button"
            class="relative z-[1] px-2.5 py-1 rounded-md transition-colors cursor-pointer"
            :class="btnClass('deep')"
            :aria-pressed="isDeep"
            @click="setPerspective('deep')">
            Deep Dive
        </button>
    </motion.div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch, nextTick } from 'vue'
import { motion } from 'motion-v'
import { usePreferredReducedMotion } from '@vueuse/core'
import { usePerspective } from '@/composables/usePerspective'
import type { Perspective } from '@/composables/usePerspective'

const props = withDefaults(
    defineProps<{
        variant?: 'dark' | 'light'
    }>(),
    { variant: 'dark' }
)

const { isExecutive, isDeep, setPerspective, hoverVectorId } = usePerspective()
const reduceMotion = usePreferredReducedMotion()

const rootRef = ref<HTMLElement | null>(null)
const pillX = ref({ left: 2, width: 72 })

const hintDeep = computed(() => !!hoverVectorId.value && isExecutive.value)

const toggleShellClass = computed(() =>
    props.variant === 'light'
        ? 'border-black/10 bg-black/[0.04]'
        : 'border-white/15 bg-white/[0.04]'
)

const pillClass = computed(() =>
    props.variant === 'light' ? 'bg-white shadow-sm ring-1 ring-black/8' : 'bg-emerald-400/20 ring-1 ring-emerald-400/35'
)

function btnClass(p: Perspective) {
    const active = (p === 'executive' && isExecutive.value) || (p === 'deep' && isDeep.value)
    if (props.variant === 'light') {
        return active ? 'text-neutral-950' : 'text-neutral-500 hover:text-neutral-800'
    }
    return active ? 'text-emerald-100' : 'text-white/60 hover:text-white'
}

function measurePill() {
    const root = rootRef.value as { $el?: HTMLElement } | HTMLElement | null
    const el = root && '$el' in root && root.$el ? root.$el : (root as HTMLElement | null)
    if (!el) return
    const buttons = el.querySelectorAll<HTMLButtonElement>('button')
    const idx = isExecutive.value ? 0 : 1
    const btn = buttons[idx]
    if (!btn) return
    pillX.value = { left: btn.offsetLeft, width: btn.offsetWidth }
}

onMounted(() => nextTick(measurePill))
watch([isExecutive, () => props.variant], () => nextTick(measurePill))
</script>

<style scoped>
.perspective-toggle--hint-deep {
    box-shadow: 0 0 0 1px rgba(16, 185, 129, 0.35);
}
</style>
