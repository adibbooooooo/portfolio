<template>
    <component :is="tag" :class="textClass">
        <template v-for="(part, i) in parts" :key="i">
            <span
                v-if="part.highlight"
                class="mark"
                :style="{ '--d': `${(part.delayIndex ?? 0) * 0.12}s` }">
                {{ part.text }}
            </span>
            <template v-else>{{ part.text }}</template>
        </template>
    </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { splitWithHighlights } from '@/lib/highlightText'

const props = withDefaults(
    defineProps<{
        text: string
        highlights?: readonly string[]
        tag?: 'p' | 'span'
        textClass?: string
    }>(),
    {
        highlights: () => [],
        tag: 'p',
        textClass: 'text-[14px] leading-7 text-primary',
    }
)

const parts = computed(() => splitWithHighlights(props.text, props.highlights))
</script>
