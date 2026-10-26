import { ref, computed, provide, inject, type InjectionKey, type Ref, type ComputedRef } from 'vue'
import { useRouter } from 'vue-router'

export type Perspective = 'executive' | 'deep'

export type PerspectiveContext = {
    perspective: Ref<Perspective>
    isExecutive: ComputedRef<boolean>
    isDeep: ComputedRef<boolean>
    setPerspective: (p: Perspective, opts?: { hash?: string }) => void
    focusDeep: (sectionId: string) => void
    hoverVectorId: Ref<string | null>
}

const PerspectiveKey: InjectionKey<PerspectiveContext> = Symbol('perspective')

/** Scoped to `/personality` — legacy API kept for home value vectors and deep links. */
export function providePersonalityPerspective(): PerspectiveContext {
    const router = useRouter()
    const perspective = ref<Perspective>('executive')
    const hoverVectorId = ref<string | null>(null)

    function setPerspective(_p: Perspective, opts?: { hash?: string }) {
        void router.replace({
            path: '/personality',
            hash: opts?.hash ? `#${opts.hash}` : '',
        })
    }

    function focusDeep(sectionId: string) {
        void router.push({
            path: '/personality',
            hash: `#${sectionId}`,
        })
    }

    const isExecutive = computed(() => true)
    const isDeep = computed(() => false)

    const ctx: PerspectiveContext = {
        perspective,
        isExecutive,
        isDeep,
        setPerspective,
        focusDeep,
        hoverVectorId,
    }

    provide(PerspectiveKey, ctx)
    return ctx
}

export function usePerspective(): PerspectiveContext {
    const ctx = inject(PerspectiveKey)
    if (!ctx) throw new Error('usePerspective() requires providePersonalityPerspective() on PersonalityPage')
    return ctx
}
