<template>
    <p class="text-[12px] text-[#8F8F8F] mb-3">{{ "<!-- What I do -->" }}</p>
    <h2 class="normal-font text-white font-extrabold leading-[1.05] text-[40px] md:text-6xl mb-6">
        What I <span class="text-neutral-400">Can Do</span>
    </h2>

    <div class="mt-8 space-y-4">
        <div v-for="blk in skillBlocks" :key="blk.key"
            class="cli-block rounded-md border border-white/10 bg-[#141414] px-4 py-3">
            <!-- header -->
            <div class="cli-header font-mono text-[13px] leading-6">
                <span class="text-emerald-400">&gt;</span>
                <span class="text-cyan-300 ml-1">{{ blk.type }}</span><span
                    class="text-primary">:</span>
                <span class="text-white ml-1">{{ blk.arg }}</span>
            </div>

            <!-- divider -->
            <div class="cli-divider my-2 h-px bg-white/10"></div>

            <!-- list -->
            <ul class="cli-list font-mono text-[13px] leading-7">
                <li v-for="(it, i) in blk.items" :key="i" class="flex gap-2">
                    <span class="text-emerald-400">✓</span>
                    <span class="text-primary">
                        {{ it.t }}
                        <span v-if="it.comment" class="text-white/40"># {{ it.comment }}</span>
                    </span>
                </li>
            </ul>

            <!-- divider -->
            <div class="cli-divider mt-2 h-px bg-white/10"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
const skillBlocks = [
    {
        key: 'soft',
        type: 'soft-skill',
        arg: 'leadership',
        items: [
            { t: 'Leading meetings & planning' },
            { t: 'Brainstorming & idea refinement' },
            { t: 'Stakeholder alignment' },
            { t: 'Cross-team communication' },
            { t: 'Giving talks & presentations', comment: 'Tech sharing & events' },
        ],
    },
    {
        key: 'hard',
        type: 'hard-skill',
        arg: 'software',
        items: [
            { t: 'Scalable REST/JSON APIs' },
            { t: 'PHP (Laravel / Phalcon / CodeIgniter)', comment: 'Main Skill' },
            { t: 'Vue 3 / Tailwind / TypeScript' },
            { t: 'AWS deployment' },
        ],
    },
    {
        key: 'platform',
        type: 'platform-skill',
        arg: 'integrations',
        items: [
            { t: 'Telegram / TON (bots, wallets, NFTs/SBTs)' },
            { t: 'Third-party APIs (Stripe)' },
            { t: 'Webhooks & retry policies' },
            { t: 'File pipelines (S3, presigned uploads)' },
        ],
    },
]
</script>