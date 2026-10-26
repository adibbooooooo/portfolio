import { readonly, ref } from 'vue'

/** Intro hero (typing + fade) runs once per full page load. */
const introHeroComplete = ref(false)

export function useIntroSession() {
    function markIntroHeroComplete() {
        introHeroComplete.value = true
    }

    return {
        introHeroComplete: readonly(introHeroComplete),
        markIntroHeroComplete,
    }
}
