<template>
    <p class="text-[12px] text-[#8F8F8F] mb-3">{{ "<!-- What I do -->" }}</p>
    <h2 class="normal-font text-white font-extrabold leading-[1.05] text-[40px] md:text-6xl mb-6">
        What I <span class="text-neutral-400">Can Do</span>
    </h2>

    <div class="mt-8 space-y-4">
        <CliTerminalCard
            v-for="blk in skillBlocks"
            :key="blk.key"
            :type="blk.type"
            :arg="blk.arg"
            :lines="blk.items" />
    </div>
</template>

<script setup lang="ts">
import CliTerminalCard, { type CliLine } from '@/components/CliTerminalCard.vue'

type SkillBlock = {
    key: string
    type: string
    arg: string
    items: CliLine[]
}

const skillBlocks: SkillBlock[] = [
    {
        key: 'soft',
        type: 'soft-skill',
        arg: 'leadership',
        items: [
            { text: 'Leading meetings & planning' },
            { text: 'Brainstorming & idea refinement' },
            { text: 'Stakeholder alignment' },
            { text: 'Cross-team communication' },
            { text: 'Giving talks & presentations', comment: 'Tech sharing & events' },
        ],
    },
    {
        key: 'hard',
        type: 'hard-skill',
        arg: 'software',
        items: [
            { text: 'Scalable REST/JSON APIs' },
            { text: 'PHP (Laravel / Phalcon / CodeIgniter)', comment: 'Main Skill' },
            { text: 'Vue 3 / Tailwind / TypeScript' },
            { text: 'AWS deployment' },
        ],
    },
    {
        key: 'platform',
        type: 'platform-skill',
        arg: 'integrations',
        items: [
            { text: 'Telegram / TON (bots, wallets, NFTs/SBTs)' },
            { text: 'Third-party APIs (Stripe)' },
            { text: 'Webhooks & retry policies' },
            { text: 'File pipelines (S3, presigned uploads)' },
        ],
    },
]
</script>
