import { readonly, ref } from 'vue'
import { preloadCriticalAssets } from '@/lib/preloadAssets'

const isAppReady = ref(false)
const bootProgress = ref(0)

let bootPromise: Promise<void> | null = null

function lockScroll() {
    document.documentElement.classList.add('app-boot-lock')
}

function unlockScroll() {
    document.documentElement.classList.remove('app-boot-lock')
}

export function useAppBoot() {
    async function runAppBoot() {
        if (isAppReady.value) return
        if (bootPromise) return bootPromise

        lockScroll()
        bootPromise = preloadCriticalAssets((ratio) => {
            bootProgress.value = ratio
        }).finally(() => {
            isAppReady.value = true
            unlockScroll()
        })

        return bootPromise
    }

    return {
        isAppReady: readonly(isAppReady),
        bootProgress: readonly(bootProgress),
        runAppBoot,
    }
}
