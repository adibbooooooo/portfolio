<template>
    <a
        v-if="href"
        :href="href"
        target="_blank"
        rel="noopener noreferrer"
        :aria-label="`Open Crystal Knows ${label} assessment`"
        class="cli-block group block rounded-md border border-white/10 bg-[#141414] px-4 py-3 cursor-pointer transition-colors hover:border-white/15 hover:bg-[#161616] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/40">
        <AssessmentCardBody :label="label" :segments="segments" show-external-icon />
    </a>
    <div
        v-else
        class="cli-block block rounded-md border border-white/10 bg-[#141414] px-4 py-3">
        <AssessmentCardBody :label="label" :segments="segments" />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { parseAssessmentValueSegments } from '@/lib/personalityAssessmentValue'
import AssessmentCardBody from '@/components/personality/AssessmentCardBody.vue'

const props = defineProps<{
    label: string
    value: string
    href?: string
}>()

const segments = computed(() => parseAssessmentValueSegments(props.value))
</script>
