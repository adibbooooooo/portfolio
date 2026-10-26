import { ref } from 'vue'
import { useAskAdibModal } from '@/composables/useAskAdibModal'

const isContactModalOpen = ref(false)

export function useContactModal() {
    const { closeAskAdibModal } = useAskAdibModal()

    function openContactModal(options?: { keepChatOpen?: boolean } | Event) {
        const keepChatOpen =
            options !== null &&
            typeof options === 'object' &&
            !(options instanceof Event) &&
            (options as { keepChatOpen?: boolean }).keepChatOpen === true

        if (!keepChatOpen) {
            closeAskAdibModal()
        }
        isContactModalOpen.value = true
    }

    function closeContactModal() {
        isContactModalOpen.value = false
    }

    return { isContactModalOpen, openContactModal, closeContactModal }
}
