<template>
    <section class="live-builds">
        <p class="text-[12px] text-[#8F8F8F] mb-3">{{ '<!-- Featured work -->' }}</p>
        <h2 class="normal-font text-white font-extrabold leading-[1.05] text-[40px] md:text-6xl mb-6">
            Featured <span class="text-neutral-400">Projects</span>
        </h2>

        <div class="flex flex-col gap-6">
            <a
                v-for="(item, index) in featuredWorkItems"
                :key="item.id"
                :href="item.url"
                target="_blank"
                rel="noopener noreferrer"
                class="launch-row block rounded-2xl overflow-hidden border border-white/10 bg-[#141414] text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50">
                <div class="flex flex-col md:flex-row md:min-h-[280px]">
                    <div
                        class="flex flex-col justify-center p-8 md:p-10 md:pr-8 md:w-[48%] lg:w-[52%] xl:max-w-xl shrink-0 z-[1]">
                        <p class="text-[11px] font-semibold uppercase tracking-wide text-white/50">{{ item.subtitle }}</p>
                        <h3 class="normal-font mt-1.5 text-[26px] md:text-[28px] font-bold leading-snug tracking-tight text-white">
                            {{ item.title }}
                        </h3>
                        <p class="mt-3 text-[14px] md:text-[15px] leading-relaxed text-white/70 max-w-lg">
                            {{ item.pitch }}
                        </p>
                        <p class="mt-6 inline-flex items-center gap-1.5 text-[13px] font-semibold text-emerald-300">
                            Visit site
                            <i class="pi pi-arrow-up-right text-[11px]" aria-hidden="true" />
                        </p>
                    </div>

                    <div class="preview-stage relative flex-1 overflow-hidden" aria-hidden="true">
                        <div class="preview-3d">
                            <div class="preview-frame rounded-xl overflow-hidden border border-black/10 shadow-2xl">
                                <FeaturedPreviewVideo
                                    :base="item.previewVideo"
                                    :poster="item.previewPoster"
                                    :eager="index === 0"
                                    :ariaLabel="`${item.title} preview`" />
                            </div>
                        </div>
                    </div>
                </div>
            </a>
        </div>

        <div
            class="mt-10 rounded-[12px] border border-white/10 bg-gradient-to-b from-white/5 to-transparent px-5 py-5 relative overflow-hidden transition-all duration-300 hover:border-emerald-400/30 hover:from-emerald-500/[0.06] flex flex-wrap items-center gap-4">
            <p class="text-[13px] text-white/80 leading-relaxed md:flex-1 font-mono">
                These are real things I have shipped.
                <span class="text-emerald-400 font-semibold">work.showcase</span>
                has shipped projects, case studies, and skill demos.
            </p>

            <RouterLink
                to="/work"
                class="inline-flex items-center gap-2 font-mono text-[13px] text-white/90 border border-white/20 rounded px-3.5 py-2 hover:border-emerald-400/40 hover:bg-emerald-400/[0.07] transition-all duration-300 group/btn shrink-0">
                <span>Open work.showcase</span>
                <i
                    class="pi pi-arrow-up-right text-[11px] text-emerald-400 transition-transform duration-300 group-hover/btn:translate-x-[2px] group-hover/btn:-translate-y-[2px]"
                    aria-hidden="true" />
            </RouterLink>
        </div>
    </section>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { featuredWorkItems } from '@/data/featuredWork'
import FeaturedPreviewVideo from '@/components/FeaturedPreviewVideo.vue'
</script>

<style scoped>
.preview-stage {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    min-height: 240px;
    perspective: 1400px;
    perspective-origin: 92% 50%;
}

.preview-frame {
    width: 100%;
    height: 248px;
    background: #0a0a0a;
}

.preview-3d {
    width: min(100%, 480px);
    margin-right: -0.75rem;
    transform: rotateX(20deg) rotateY(9deg) rotate(-4deg) scale(1.06) translateX(8%);
    transform-origin: 12% 18%;
    transform-style: preserve-3d;
}

/* Cover fills frame edge-to-edge (no letterboxing); crop sides if needed */
.preview-video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: left top;
}

@media (min-width: 768px) {
    .preview-frame {
        height: 268px;
    }
}

@media (max-width: 767px) {
    .preview-3d {
        width: min(100%, 400px);
        margin-inline: auto;
        margin-right: auto;
        transform: rotateX(16deg) rotateY(6deg) rotate(-3deg) scale(0.98);
        transform-origin: 50% 100%;
    }

    .preview-frame {
        height: 220px;
    }

}

@media (prefers-reduced-motion: reduce) {
    .preview-3d {
        transform: none;
        width: min(100%, 440px);
    }

    .preview-video {
        transform: none;
    }
}
</style>
