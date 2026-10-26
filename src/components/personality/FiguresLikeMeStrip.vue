<template>
    <div
        ref="scrollerRef"
        class="logo-loop figures-loop"
        :class="{
            'figures-loop--dragging': isDragMode,
            'figures-loop--paused': userPaused,
        }"
        role="region"
        aria-label="Figures like me"
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="onPointerUp"
        @pointercancel="onPointerUp"
        @wheel.passive="onWheel">
        <div ref="trackRef" class="figures-loop__track flex items-end gap-8 px-2">
            <figure
                v-for="(item, i) in loopItems"
                :key="`${item.id}-${i}`"
                class="figures-loop__item shrink-0 m-0 cursor-pointer rounded-xl transition-colors hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/40"
                :data-figure-id="item.id"
                :title="item.note ? `${item.name}: ${item.note}` : item.name"
                role="button"
                tabindex="0"
                @keydown.enter.prevent="openFigureById(item.id)"
                @keydown.space.prevent="openFigureById(item.id)">
                <img
                    :src="item.src"
                    :alt="item.name"
                    width="112"
                    height="112"
                    class="figures-loop__img pointer-events-none select-none"
                    loading="lazy"
                    decoding="async"
                    draggable="false" />
                <figcaption class="figures-loop__name mt-2.5 max-w-[7rem] truncate text-center text-[10px] text-white/55">
                    {{ item.shortName ?? item.name }}
                </figcaption>
            </figure>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { usePreferredReducedMotion } from '@vueuse/core'
import type { LogoLoopItem } from '@/components/personality/LogoLoop.vue'
import { getVirtuosoFigureById } from '@/data/personalityVirtuosoLane'
import { useVirtuosoFigureModal } from '@/composables/useVirtuosoFigureModal'

const props = defineProps<{
    items: LogoLoopItem[]
}>()

const loopItems = computed(() => [...props.items, ...props.items])

const scrollerRef = ref<HTMLElement | null>(null)
const trackRef = ref<HTMLElement | null>(null)
const isDragMode = ref(false)
const userPaused = ref(false)

const preferredMotion = usePreferredReducedMotion()
const autoScrollEnabled = computed(() => preferredMotion.value !== 'reduce')
const { openFigure } = useVirtuosoFigureModal()

const DRAG_THRESHOLD_PX = 8

let startX = 0
let scrollStart = 0
let activePointerId: number | null = null
let pendingFigureId: string | null = null
let loopWidth = 0
let rafId = 0
let resumeTimer: ReturnType<typeof setTimeout> | null = null
let resizeObserver: ResizeObserver | null = null

const SCROLL_SPEED = 0.5
const RESUME_DELAY_MS = 1200

function figureIdFromTarget(target: EventTarget | null) {
    const el = (target as HTMLElement | null)?.closest?.('[data-figure-id]')
    return el?.getAttribute('data-figure-id') ?? null
}

function openFigureById(id: string) {
    const figure = getVirtuosoFigureById(id)
    if (figure) openFigure(figure)
}

function measureLoop() {
    const el = scrollerRef.value
    if (!el) return
    loopWidth = el.scrollWidth / 2
    if (loopWidth > 0 && el.scrollLeft >= loopWidth) {
        el.scrollLeft -= loopWidth
    }
}

function normalizeScroll() {
    const el = scrollerRef.value
    if (!el || loopWidth <= 0) return
    while (el.scrollLeft >= loopWidth) el.scrollLeft -= loopWidth
    while (el.scrollLeft < 0) el.scrollLeft += loopWidth
}

function tick() {
    const el = scrollerRef.value
    if (el && autoScrollEnabled.value && !isDragMode.value && !userPaused.value && loopWidth > 0) {
        el.scrollLeft += SCROLL_SPEED
        if (el.scrollLeft >= loopWidth) {
            el.scrollLeft -= loopWidth
        }
    }
    rafId = requestAnimationFrame(tick)
}

function pauseAutoScroll() {
    userPaused.value = true
    if (resumeTimer) clearTimeout(resumeTimer)
    resumeTimer = setTimeout(() => {
        userPaused.value = false
        resumeTimer = null
    }, RESUME_DELAY_MS)
}

function resetPointerState() {
    isDragMode.value = false
    activePointerId = null
    pendingFigureId = null
}

function onPointerDown(e: PointerEvent) {
    if (e.button !== 0 || !scrollerRef.value) return

    resetPointerState()
    userPaused.value = true
    if (resumeTimer) clearTimeout(resumeTimer)

    activePointerId = e.pointerId
    pendingFigureId = figureIdFromTarget(e.target)
    startX = e.clientX
    scrollStart = scrollerRef.value.scrollLeft
}

function onPointerMove(e: PointerEvent) {
    if (e.pointerId !== activePointerId || !scrollerRef.value) return

    const deltaX = e.clientX - startX

    if (!isDragMode.value) {
        if (Math.abs(deltaX) <= DRAG_THRESHOLD_PX) return
        isDragMode.value = true
        pendingFigureId = null
        scrollerRef.value.setPointerCapture(e.pointerId)
    }

    e.preventDefault()
    scrollerRef.value.scrollLeft = scrollStart - deltaX
    normalizeScroll()
}

function onPointerUp(e: PointerEvent) {
    if (e.pointerId !== activePointerId || !scrollerRef.value) return

    const figureId = pendingFigureId

    if (isDragMode.value && scrollerRef.value.hasPointerCapture(e.pointerId)) {
        scrollerRef.value.releasePointerCapture(e.pointerId)
    }

    resetPointerState()
    pauseAutoScroll()

    if (figureId) {
        openFigureById(figureId)
    }
}

function onWheel() {
    pauseAutoScroll()
    requestAnimationFrame(normalizeScroll)
}

onMounted(() => {
    measureLoop()
    if (scrollerRef.value) {
        resizeObserver = new ResizeObserver(measureLoop)
        resizeObserver.observe(scrollerRef.value)
        if (trackRef.value) resizeObserver.observe(trackRef.value)
    }
    rafId = requestAnimationFrame(tick)
})

onBeforeUnmount(() => {
    cancelAnimationFrame(rafId)
    if (resumeTimer) clearTimeout(resumeTimer)
    resizeObserver?.disconnect()
})
</script>

<style scoped>
.figures-loop {
    position: relative;
    overflow-x: auto;
    overflow-y: hidden;
    cursor: grab;
    touch-action: pan-x;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
}

.figures-loop::-webkit-scrollbar {
    display: none;
}

.figures-loop--dragging {
    cursor: grabbing;
    user-select: none;
}

.figures-loop__track {
    width: max-content;
    padding-top: 0.25rem;
    padding-bottom: 0.5rem;
}

.figures-loop__item {
    width: 7rem;
}

.figures-loop__img {
    display: block;
    width: 5.75rem;
    height: 5.75rem;
    margin: 0 auto;
    border-radius: 1rem;
    object-fit: cover;
    object-position: center 20%;
}

</style>
