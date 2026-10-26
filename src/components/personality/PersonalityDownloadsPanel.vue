<template>
    <aside v-bind="$attrs">
        <div class="flex w-full flex-col gap-3">
            <div class="gh-panel relative rounded-[8px] border border-seperator bg-[#1b1b1b]/95 backdrop-blur">
                <div class="gh-header">Full Report</div>

                <ul class="py-1">
                    <li v-for="item in downloads" :key="item.id">
                        <button
                            type="button"
                            class="dl-row group relative flex w-full items-start gap-2.5 px-3 py-2.5 text-left cursor-pointer"
                            @click="downloadPersonalityPdf(item)">
                            <span class="mt-0.5 font-mono text-[12px] text-emerald-400 shrink-0">&gt;</span>
                            <span class="min-w-0 flex-1">
                                <span
                                    class="block font-mono text-[13px] text-white group-hover:text-emerald-100 transition-colors">
                                    {{ item.label }}
                                </span>
                                <span class="mt-0.5 block text-[10px] leading-snug text-white/40">
                                    {{ item.description }}
                                </span>
                            </span>
                            <i
                                class="pi pi-download mt-0.5 shrink-0 text-[12px] text-white/50 group-hover:text-emerald-300 transition-colors"
                                aria-hidden="true" />
                        </button>
                    </li>
                </ul>
            </div>

            <a
                :href="personalityCrystalSource.href"
                target="_blank"
                rel="noopener noreferrer"
                class="gh-source flex items-center justify-between gap-2 rounded-[8px] border border-seperator bg-[#1b1b1b]/95 px-2.5 py-2 backdrop-blur transition-colors hover:bg-white/[0.04]">
                <span class="gh-source-label">{{ personalityCrystalSource.label }}</span>
                <img
                    :src="personalityCrystalSource.iconSrc"
                    alt=""
                    width="18"
                    height="18"
                    class="h-[18px] w-[18px] shrink-0 rounded-full object-cover opacity-90" />
            </a>
        </div>
    </aside>
</template>

<script setup lang="ts">
import {
    personalityDownloads,
    personalityCrystalSource,
    downloadPersonalityPdf,
} from '@/data/personalityDownloads'

const downloads = personalityDownloads
</script>

<style scoped>
.gh-panel {
    padding: 8px 0;
}

.gh-header {
    padding: 8px 12px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    color: #fff;
    font-size: 13px;
}

.dl-row {
    border-radius: 6px;
}

.dl-row:hover {
    background: rgba(255, 255, 255, 0.04);
}

.gh-source {
    text-decoration: none;
    color: inherit;
}

.gh-source-label {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.55);
}

.gh-source:hover .gh-source-label {
    color: rgba(255, 255, 255, 0.75);
}
</style>
