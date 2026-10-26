<template>
    <Teleport to="body">
        <transition name="ask-fade">
            <div
                v-if="isAskAdibModalOpen"
                class="fixed inset-0 z-[10060] flex items-end sm:items-center justify-center bg-black/70 px-3 pb-3 sm:px-4 sm:pb-0"
                role="dialog"
                aria-modal="true"
                aria-labelledby="ask-adib-modal-title"
                @click.self="closeAskAdibModal"
                @keydown.esc.prevent="closeAskAdibModal">
                <div
                    class="ask-modal-shell w-full max-w-lg rounded-2xl border border-white/12 bg-[#121212] shadow-2xl shadow-black/50 overflow-hidden flex flex-col max-h-[min(90vh,680px)]">
                    <header
                        class="flex items-start justify-between gap-3 border-b border-white/10 bg-gradient-to-b from-emerald-500/[0.07] to-transparent px-4 pt-5 pb-4 shrink-0">
                        <div>
                            <h2
                                id="ask-adib-modal-title"
                                class="flex flex-wrap items-center gap-2 text-[16px] font-semibold text-white">
                                <span>
                                    Chat with <span class="text-emerald-300">AI-dib</span>
                                </span>
                                <span
                                    class="inline-flex items-center rounded-md border border-amber-300/50 bg-amber-400/15 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-100">
                                    Beta
                                </span>
                            </h2>
                        </div>
                        <button
                            type="button"
                            class="inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded bg-white/5 text-white/70 hover:bg-white/10"
                            aria-label="Close"
                            @click="closeAskAdibModal">
                            <i class="pi pi-times text-[12px]" />
                        </button>
                    </header>

                    <div class="min-h-0 flex-1 px-3 pb-3">
                        <AskAdibPanel variant="modal" input-id="ask-adib-modal-input" :show-header="false" />
                    </div>
                </div>
            </div>
        </transition>
    </Teleport>
</template>

<script setup lang="ts">
import { watch, onBeforeUnmount } from 'vue'
import AskAdibPanel from '@/components/ask/AskAdibPanel.vue'
import { useAskAdibModal } from '@/composables/useAskAdibModal'

const { isAskAdibModalOpen, closeAskAdibModal } = useAskAdibModal()

watch(isAskAdibModalOpen, (open) => {
    document.body.style.overflow = open ? 'hidden' : ''
})

onBeforeUnmount(() => {
    if (isAskAdibModalOpen.value) {
        document.body.style.overflow = ''
    }
})
</script>

<style scoped>
.ask-fade-enter-active,
.ask-fade-leave-active {
    transition: opacity 0.22s ease;
}

.ask-fade-enter-from,
.ask-fade-leave-to {
    opacity: 0;
}

.ask-fade-enter-active .ask-modal-shell,
.ask-fade-leave-active .ask-modal-shell {
    transition:
        transform 0.28s cubic-bezier(0.22, 1, 0.36, 1),
        opacity 0.22s ease;
    will-change: transform, opacity;
}

.ask-fade-enter-from .ask-modal-shell {
    transform: translateY(14px) scale(0.985);
    opacity: 0.92;
}

.ask-fade-leave-to .ask-modal-shell {
    transform: translateY(10px) scale(0.99);
    opacity: 0.92;
}

.ask-modal-shell {
    transform: translateY(0) scale(1);
}

.ask-modal-shell :deep(.ask-panel) {
    max-height: none;
    height: min(560px, calc(90vh - 5.5rem));
    border: none;
    background: transparent;
    backdrop-filter: none;
}
</style>
