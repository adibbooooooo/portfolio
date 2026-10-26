<template>
    <Teleport to="body">
        <transition name="vfade">
            <div
                v-if="figure"
                class="fixed inset-0 z-[10055] flex items-end sm:items-center justify-center bg-black/70 px-3 pb-3 sm:px-4 sm:pb-0"
                role="dialog"
                aria-modal="true"
                :aria-labelledby="titleId"
                @click.self="closeFigure"
                @keydown.esc.prevent="closeFigure">
                <div
                    class="w-full max-w-lg rounded-xl border border-white/15 bg-[#181818] shadow-xl overflow-hidden max-h-[min(88vh,640px)] flex flex-col">
                    <header class="flex items-start gap-3 border-b border-white/10 px-4 py-4 shrink-0">
                        <img
                            :src="figure.avatarSrc ?? avatarFallback(figure.id)"
                            :alt="figure.name"
                            class="h-14 w-14 shrink-0 rounded-xl border border-white/10 object-cover object-top"
                            draggable="false" />
                        <div class="min-w-0 flex-1">
                            <h2 :id="titleId" class="text-[16px] font-semibold text-white leading-snug">
                                {{ figure.name }}
                            </h2>
                            <p class="mt-1 text-[11px] uppercase tracking-wide text-white/45">
                                {{ figure.lane === 'fiction' ? 'Fictional character' : 'Public figure' }}
                                <span class="text-white/25"> · </span>
                                Virtuoso lane
                            </p>
                        </div>
                        <button
                            type="button"
                            class="inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded bg-white/5 text-white/70 hover:bg-white/10"
                            aria-label="Close"
                            @click="closeFigure">
                            <i class="pi pi-times text-[12px]" />
                        </button>
                    </header>

                    <div class="overflow-y-auto px-4 py-4 space-y-4 text-[14px] leading-relaxed text-primary">
                        <div>
                            <h3 class="text-[11px] font-semibold uppercase tracking-wider text-emerald-300/90 mb-1.5">
                                Why they show up as ISTP / Virtuoso
                            </h3>
                            <p>{{ figure.whyTyped }}</p>
                        </div>
                        <div>
                            <h3 class="text-[11px] font-semibold uppercase tracking-wider text-emerald-300/90 mb-1.5">
                                Why I connect with this
                            </h3>
                            <p>{{ figure.whyLikeMe }}</p>
                        </div>
                        <p class="text-[12px] text-white/45 border-t border-white/10 pt-3">
                            {{ virtuosoLaneDisclaimer }}
                        </p>
                    </div>
                </div>
            </div>
        </transition>
    </Teleport>
</template>

<script setup lang="ts">
import { computed, watch, onBeforeUnmount } from 'vue'
import { useVirtuosoFigureModal } from '@/composables/useVirtuosoFigureModal'
import { virtuosoLaneDisclaimer } from '@/data/personalityVirtuosoLane'
import { virtuosoFigureAvatarSrc } from '@/lib/virtuosoAvatars'

const { selectedFigure, closeFigure } = useVirtuosoFigureModal()

const figure = computed(() => selectedFigure.value)
const titleId = 'virtuoso-figure-modal-title'

function avatarFallback(id: string) {
    return virtuosoFigureAvatarSrc(id)
}

watch(figure, (f) => {
    document.body.style.overflow = f ? 'hidden' : ''
})

onBeforeUnmount(() => {
    document.body.style.overflow = ''
})
</script>

<style scoped>
.vfade-enter-active,
.vfade-leave-active {
    transition: opacity 0.2s ease;
}

.vfade-enter-from,
.vfade-leave-to {
    opacity: 0;
}
</style>
