<template>
    <div class="h-full min-h-0">
        <div class="h-full min-h-0 md:pr-[300px]">
            <EditorScaffold 
                ref="scaffoldRef" 
                class="h-full"
                
            >
                <section
                    id="my-intro"
                    class="scroll-mt-28 pt-12"
                    :class="introHeroClass">
                    <IntroSection />
                </section>

                <!-- ABOUT -->
                <section id="about-me" class="relative isolate scroll-mt-28 pt-16 pb-12 fade-left">
                    <AboutMeSection />
                </section>

                <section id="my-personality" class="relative isolate scroll-mt-28 pt-16 pb-12 fade-left">
                    <PersonalityPreviewSection />
                </section>

                <section id="what-i-do" class="scroll-mt-28 pt-16">
                    <WhatIDoSection />
                </section>

                <section id="tech-stack" class="relative isolate scroll-mt-28 pt-16 pb-12 fade-left">
                    <TechStackSection />
                </section>

                <section id="some-work" class="relative isolate scroll-mt-28 pb-12 fade-left">
                    <SomeWorkSection />
                </section>

                <section id="people-words" class="relative isolate scroll-mt-28 pt-10 pb-12 fade-left">
                    <PeopleWordsSection />
                </section>

                <section id="contact-me" class="relative isolate scroll-mt-28 pt-16 pb-12 fade-left">
                    <ContactMeSection />
                </section>
            </EditorScaffold>
        </div>

        <!-- right rail -->
        <FadeInLeft>
            <RightTimeline :items="items" :rootEl="rootEl" @jump="onJump"
                class="hidden md:block fixed right-[20px] top-[46px] w-[240px] z-50" />
        </FadeInLeft>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useIntroSession } from '@/composables/useIntroSession'

defineOptions({ name: 'HomePage' })

import EditorScaffold from '@/components/EditorScaffold.vue'
import RightTimeline from '@/components/RightTimeline.vue'
import FadeInLeft from '@/components/FadeInLeft.vue'

// Inside pages
import IntroSection from '@/components/IntroSection.vue'
import AboutMeSection from '@/components/AboutMeSection.vue'
import PersonalityPreviewSection from '@/components/PersonalityPreviewSection.vue'
import WhatIDoSection from '@/components/WhatIDoSection.vue'
import TechStackSection from '@/components/TechStackSection.vue'
import SomeWorkSection from '@/components/SomeWorkSection.vue'
import PeopleWordsSection from '@/components/PeopleWordsSection.vue'
import ContactMeSection from '@/components/ContactMeSection.vue'

// Right menu
const items = [
    { id: 'my-intro', label: 'Intro' },
    { id: 'about-me', label: 'About me' },
    { id: 'my-personality', label: 'Personality' },
    { id: 'what-i-do', label: 'What I Do' },
    { id: 'tech-stack', label: 'Tech Stack' },
    { id: 'some-work', label: 'Projects' },
    { id: 'people-words', label: `People's Word` },
    { id: 'contact-me', label: `Contact Me` },
]

const route = useRoute()
const { introHeroComplete } = useIntroSession()
const scaffoldRef = ref<InstanceType<typeof EditorScaffold> | null>(null)
const rootEl = ref<HTMLElement | null>(null)

const introHeroClass = computed(() =>
    introHeroComplete.value ? 'fade-left--done' : 'fade-left',
)

function scrollToHash() {
    const raw = route.hash?.replace(/^#/, '')
    if (!raw) return
    nextTick(() => {
        scaffoldRef.value?.scrollToSelector(`#${raw}`)
    })
}

watch(() => route.hash, () => scrollToHash())

onMounted(() => {
    rootEl.value = scaffoldRef.value?.getScrollEl() ?? null
    scrollToHash()
})

const onJump = (selector: string) => {
    scaffoldRef.value?.scrollToSelector(selector)
}
</script>
