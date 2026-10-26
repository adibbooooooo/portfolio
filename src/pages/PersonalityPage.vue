<template>
    <div class="h-full min-h-0">
        <div class="h-full min-h-0 md:pr-[300px]">
            <EditorScaffold ref="scaffoldRef" class="h-full">
                <section class="space-y-6 pt-8 pb-12 fade-left">
                    <header class="max-w-3xl">
                        <h1 class="normal-font text-white font-extrabold leading-[1.05] text-[34px] md:text-5xl">
                            My <span class="text-neutral-400">Personality</span>
                        </h1>
                        <p class="mt-5 md:mt-6 text-sm text-white/60 max-w-xl leading-relaxed">
                            How I think, communicate, and work with others. A direct overview of my style and what you
                            can expect from me.
                        </p>
                    </header>

                    <PersonalityDownloadsPanel class="md:hidden max-w-3xl" />

                    <PersonalitySummaryPanel />
                </section>
            </EditorScaffold>
        </div>

        <VirtuosoFigureModal />

        <FadeInLeft>
            <PersonalityDownloadsPanel
                class="hidden md:block fixed right-[20px] top-[46px] w-[240px] z-50" />
        </FadeInLeft>
    </div>
</template>

<script setup lang="ts">
import { watch, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import EditorScaffold from '@/components/EditorScaffold.vue'
import FadeInLeft from '@/components/FadeInLeft.vue'
import PersonalitySummaryPanel from '@/components/PersonalitySummaryPanel.vue'
import PersonalityDownloadsPanel from '@/components/personality/PersonalityDownloadsPanel.vue'
import VirtuosoFigureModal from '@/components/personality/VirtuosoFigureModal.vue'
import { providePersonalityPerspective } from '@/composables/usePerspective'

const route = useRoute()
const router = useRouter()

providePersonalityPerspective()

function scrollToHash() {
    const raw = route.hash?.replace(/^#/, '')
    if (!raw) return
    nextTick(() => {
        const el = document.getElementById(raw)
        el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
}

watch(() => route.hash, () => scrollToHash())

onMounted(() => {
    const v = route.query.view
    if (v) {
        void router.replace({ path: '/personality', hash: route.hash })
    }
    scrollToHash()
})
</script>
