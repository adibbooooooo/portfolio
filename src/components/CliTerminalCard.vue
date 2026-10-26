<template>
    <div class="cli-block rounded-md border border-white/10 bg-[#141414] px-4 py-3" :class="$attrs.class">
        <div class="cli-header font-mono text-[13px] leading-6">
            <span class="text-emerald-400">&gt;</span>
            <span v-if="title" class="text-cyan-300 ml-1">{{ title }}</span>
            <template v-else>
                <span class="text-cyan-300 ml-1">{{ type }}</span><span class="text-primary">:</span>
                <span class="text-white ml-1">{{ arg }}</span>
                <span v-if="headerComment" class="text-white/40 ml-2"># {{ headerComment }}</span>
            </template>
        </div>

        <div class="cli-divider my-2 h-px bg-white/10" />

        <ul v-if="lines.length" class="cli-list font-mono text-[13px] leading-7">
            <li v-for="(line, i) in lines" :key="i">
                <span class="text-primary">
                    {{ line.text }}
                    <span v-if="line.comment" class="text-white/40"> # {{ line.comment }}</span>
                </span>
            </li>
        </ul>
        <HighlightedText
            v-else-if="body"
            :text="body"
            :highlights="highlights"
            tag="p"
            text-class="font-mono text-[13px] leading-7 text-primary" />

        <slot />

        <div v-if="showFooterRule" class="cli-divider mt-2 h-px bg-white/10" />
    </div>
</template>

<script setup lang="ts">
import HighlightedText from '@/components/HighlightedText.vue'

export type CliLine = {
    text: string
    comment?: string
}

withDefaults(
    defineProps<{
        /** Personality cards: question as cyan header after `>` */
        title?: string
        type?: string
        arg?: string
        headerComment?: string
        lines?: CliLine[]
        body?: string
        highlights?: readonly string[]
        showFooterRule?: boolean
    }>(),
    {
        lines: () => [],
        showFooterRule: true,
    }
)

defineOptions({ inheritAttrs: false })
</script>
