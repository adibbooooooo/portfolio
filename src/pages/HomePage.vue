<template>
    <div class="h-full min-h-0">
        <div class="h-full min-h-0 md:pr-[300px]">
            <EditorScaffold 
                ref="scaffoldRef" 
                class="h-full"
                
            >
                <section id="init" class="fade-left pt-12 ">
                    <IntroSection />
                </section>

                <!-- ABOUT -->
                <section id="about" class="relative isolate pt-16 pb-12 fade-left">
                    <AboutMeSection />
                </section>

                <section id="what-i-do" class="pt-16">
                    <WhatIDoSection />
                </section>

                <section id="tech-stack" class="relative isolate pt-16 pb-12 fade-left">
                    <TechStackSection />
                </section>

                <section id="people-words" class="relative isolate pt-10 pb- fade-left">
                    <PeopleWordsSection />
                </section>

                <section id="contact-me" class="relative isolate pt-16 pb-12 fade-left">
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
import { ref, onMounted } from 'vue'

import EditorScaffold from '@/components/EditorScaffold.vue'
import RightTimeline from '@/components/RightTimeline.vue'
import FadeInLeft from '@/components/FadeInLeft.vue'

// Inside pages
import IntroSection from '@/components/IntroSection.vue'
import AboutMeSection from '@/components/AboutMeSection.vue'
import WhatIDoSection from '@/components/WhatIDoSection.vue'
import TechStackSection from '@/components/TechStackSection.vue'
import PeopleWordsSection from '@/components/PeopleWordsSection.vue'
import ContactMeSection from '@/components/ContactMeSection.vue'

// Right menu
const items = [
    { id: 'init', label: 'Intro' },
    { id: 'about', label: 'About me' },
    { id: 'what-i-do', label: 'What I Do' },
    { id: 'tech-stack', label: 'Tech Stack' },
    { id: 'people-words', label: `People's Word` },
    { id: 'contact-me', label: `Contact Me` },
]

const scaffoldRef = ref<InstanceType<typeof EditorScaffold> | null>(null)
const rootEl = ref<HTMLElement | null>(null)

onMounted(() => {
    // keep RightTimeline observing the editor's scroll root (unchanged)
    rootEl.value = scaffoldRef.value?.getScrollEl() ?? null
});

const onJump = (selector: string) => {
    scaffoldRef.value?.scrollToSelector(selector)
}

const scrollToContact = () => {
    scaffoldRef.value?.scrollToSelector('#contact-me')
}
</script>