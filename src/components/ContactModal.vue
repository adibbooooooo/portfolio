<template>
    <Teleport to="body">
        <transition name="cfade">
            <div
                v-if="isContactModalOpen"
                class="fixed inset-0 z-[10070] flex items-end sm:items-center justify-center bg-black/70 px-3 pb-3 sm:px-4 sm:pb-0"
                role="dialog"
                aria-modal="true"
                aria-labelledby="contact-modal-title"
                @click.self="closeContactModal"
                @keydown.esc.prevent="closeContactModal">
                <div
                    class="w-full max-w-xl rounded-xl border border-white/15 bg-[#181818] shadow-xl overflow-hidden max-h-[min(92vh,720px)] flex flex-col">
                    <header class="flex items-start justify-between gap-3 border-b border-white/10 px-4 py-4 shrink-0">
                        <div>
                            <h2 id="contact-modal-title" class="normal-font text-[22px] md:text-[28px] font-extrabold text-white leading-tight">
                                Let’s Work <span class="text-neutral-400">Together</span>
                            </h2>
                            <p class="mt-1 text-[12px] text-white/45">Share a short brief and reach out however you prefer.</p>
                        </div>
                        <button
                            type="button"
                            class="inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded bg-white/5 text-white/70 hover:bg-white/10"
                            aria-label="Close"
                            @click="closeContactModal">
                            <i class="pi pi-times text-[12px]" />
                        </button>
                    </header>

                    <div class="overflow-y-auto px-4 py-4 sm:px-5 sm:py-5">
                        <ContactMeForm id-prefix="modal-" />
                    </div>
                </div>
            </div>
        </transition>
    </Teleport>
</template>

<script setup lang="ts">
import { watch, onBeforeUnmount } from 'vue'
import ContactMeForm from '@/components/ContactMeForm.vue'
import { useContactModal } from '@/composables/useContactModal'

const { isContactModalOpen, closeContactModal } = useContactModal()

watch(isContactModalOpen, (open) => {
    document.body.style.overflow = open ? 'hidden' : ''
})

onBeforeUnmount(() => {
    document.body.style.overflow = ''
})
</script>

<style scoped>
.cfade-enter-active,
.cfade-leave-active {
    transition: opacity 0.2s ease;
}

.cfade-enter-from,
.cfade-leave-to {
    opacity: 0;
}
</style>
