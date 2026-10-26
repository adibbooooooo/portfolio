import { ref } from 'vue'

const isAskAdibModalOpen = ref(false)

export function useAskAdibModal() {
    function openAskAdibModal() {
        isAskAdibModalOpen.value = true
    }

    function closeAskAdibModal() {
        isAskAdibModalOpen.value = false
    }

    function toggleAskAdibModal() {
        isAskAdibModalOpen.value = !isAskAdibModalOpen.value
    }

    return { isAskAdibModalOpen, openAskAdibModal, closeAskAdibModal, toggleAskAdibModal }
}
