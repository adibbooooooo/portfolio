<template>
    <video
        ref="videoEl"
        class="preview-video block h-full w-full"
        :poster="poster"
        muted
        loop
        playsinline
        :preload="preload"
        :aria-label="ariaLabel"
        @loadeddata="tryPlay"
        @canplay="tryPlay">
        <!-- MP4 first — Safari does not play WebM -->
        <source :src="`${base}.mp4`" type="video/mp4" />
        <source :src="`${base}.webm`" type="video/webm" />
    </video>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps<{
    base: string
    poster: string
    ariaLabel: string
    /** Eager-load the first visible project preview sooner */
    eager?: boolean
}>()

const videoEl = ref<HTMLVideoElement | null>(null)
const inView = ref(false)
const preload = ref<'none' | 'metadata' | 'auto'>(props.eager ? 'metadata' : 'none')

let observer: IntersectionObserver | null = null

function tryPlay() {
    const el = videoEl.value
    if (!el || !inView.value) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    void el.play().catch(() => {
        /* Autoplay blocked or not enough data yet — ignore */
    })
}

function onIntersect(entries: IntersectionObserverEntry[]) {
    const entry = entries[0]
    if (!entry) return
    inView.value = entry.isIntersecting
    if (entry.isIntersecting) {
        preload.value = 'auto'
        tryPlay()
    } else {
        videoEl.value?.pause()
    }
}

onMounted(() => {
    const el = videoEl.value
    if (!el) return

    observer = new IntersectionObserver(onIntersect, {
        threshold: 0.15,
        rootMargin: '80px 0px',
    })
    observer.observe(el)

    // If already in view on mount (e.g. short viewport / deep link), start immediately
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) {
        inView.value = true
        preload.value = 'auto'
        tryPlay()
    }
})

watch(inView, (visible) => {
    if (visible) tryPlay()
})

onBeforeUnmount(() => {
    observer?.disconnect()
    observer = null
})
</script>
