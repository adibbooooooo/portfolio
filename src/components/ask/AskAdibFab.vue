<template>
    <Teleport to="body">
        <div
            class="ask-fab-wrap fixed z-[10050] pointer-events-none"
            :class="isAskAdibModalOpen ? 'ask-fab-wrap--open' : ''">
            <button
                type="button"
                class="ask-fab relative z-[1] flex cursor-pointer items-center justify-center gap-1.5 rounded-full border transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 pointer-events-auto"
                :class="fabClass"
                :aria-label="isAskAdibModalOpen ? 'Close Chat with AI-dib' : 'Chat with AI-dib'"
                :aria-expanded="isAskAdibModalOpen"
                @click="onFabClick">
                <i class="pi text-[17px]" :class="isAskAdibModalOpen ? 'pi-times' : 'pi-code'" />
                <span
                    v-if="!isAskAdibModalOpen"
                    class="ask-fab-label hidden sm:inline text-[12px] font-semibold tracking-tight">
                    Chat with
                    <span class="ask-fab-accent">AI-dib</span>
                </span>
            </button>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAskAdibModal } from '@/composables/useAskAdibModal'
import { useContactModal } from '@/composables/useContactModal'

const { isAskAdibModalOpen, closeAskAdibModal, openAskAdibModal } = useAskAdibModal()
const { closeContactModal } = useContactModal()

const fabClass = computed(() =>
    isAskAdibModalOpen.value
        ? 'ask-fab--open h-12 w-12'
        : 'ask-fab--closed h-12 w-12 sm:h-11 sm:w-auto sm:min-w-[10.5rem] sm:px-4',
)

function onFabClick() {
    if (isAskAdibModalOpen.value) {
        closeAskAdibModal()
        return
    }
    closeContactModal()
    openAskAdibModal()
}
</script>

<style scoped>
.ask-fab-wrap {
    bottom: max(1.25rem, env(safe-area-inset-bottom, 0px));
    right: max(1.25rem, env(safe-area-inset-right, 0px));
}

/* Sit above mobile footer (collaboration pill + clock) */
@media (max-width: 767px) {
    .ask-fab-wrap {
        bottom: calc(3.5rem + env(safe-area-inset-bottom, 0px));
    }
}

.ask-fab--closed {
    border-color: rgba(52, 211, 153, 0.35);
    background: linear-gradient(180deg, #272727 0%, #1f1f1f 100%);
    color: #e5e7eb;
    box-shadow:
        0 8px 28px rgba(0, 0, 0, 0.55),
        0 0 0 1px rgba(16, 185, 129, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.06);
}

.ask-fab--closed:hover {
    border-color: rgba(52, 211, 153, 0.55);
    background: linear-gradient(180deg, #2d2d2d 0%, #222 100%);
    color: #f5f5f5;
    box-shadow:
        0 10px 32px rgba(0, 0, 0, 0.6),
        0 0 20px rgba(16, 185, 129, 0.12),
        0 0 0 1px rgba(52, 211, 153, 0.35);
}

.ask-fab-accent {
    color: #6ee7b7;
    border-radius: 2px;
}

.ask-fab--open {
    border-color: rgba(255, 255, 255, 0.15);
    background: #1b1b1b;
    color: #f5f5f5;
    box-shadow: 0 8px 28px rgba(0, 0, 0, 0.65);
}

@media (prefers-reduced-motion: reduce) {
    /* no-op */
}
</style>
