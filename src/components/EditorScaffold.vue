<template>
    <!-- 2 columns: fixed-height gutter + scrollable content -->
    <section class="h-full min-h-0 grid grid-cols-[48px_minmax(0,1fr)]">
        <!-- Gutter (container stays full height) -->
        <div
            class="h-full select-none border-r border-seperator bg-[#161616] text-right text-[12px] leading-[24px] text-[#7a7a7a] overflow-hidden">
            <!-- Only this inner wrapper moves -->
            <div :style="gutterTransform">
                <div :style="{ height: padTop }"></div>
                <ol>
                    <li v-for="n in lines" :key="n" class="px-2 tabular-nums hover:text-white cursor-pointer">
                        {{ n }}
                    </li>
                </ol>
                <div :style="{ height: padBottom }"></div>
            </div>
        </div>

        <!-- Content (the only scroll container) -->
        <div ref="contentEl" class="h-full min-h-0 overflow-auto text-white no-scrollbar" @scroll="onScroll">
            <div :style="{ height: padTop }"></div>
            <div ref="slotWrap" class="px-5">
                <slot />
            </div>
            <div :style="{ height: padBottom }"></div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

/** Tunables — keep in sync with your classes */
const LINE_HEIGHT = 24
const TOP_PAD = 8
const BOTTOM_PAD = 24

const contentEl = ref<HTMLDivElement | null>(null)
const slotWrap = ref<HTMLDivElement | null>(null)

const padTop = `${TOP_PAD}px`
const padBottom = `${BOTTOM_PAD}px`

const contentHeight = ref(0)
const scrollTop = ref(0)

const lines = computed(() => {
    const inner = Math.max(0, contentHeight.value)
    const count = Math.ceil((TOP_PAD + inner + BOTTOM_PAD) / LINE_HEIGHT)
    return count
})

/** Translate only the inner gutter block so numbers move with content */
const gutterTransform = computed(() => ({
    transform: `translateY(${-scrollTop.value}px)`
}))

const onScroll = () => {
    if (!contentEl.value) return
    scrollTop.value = contentEl.value.scrollTop
}

let ro: ResizeObserver | null = null
onMounted(() => {
    ro = new ResizeObserver(() => {
        if (!slotWrap.value) return
        contentHeight.value = slotWrap.value.scrollHeight
    })

    if (slotWrap.value) ro.observe(slotWrap.value)
})

onBeforeUnmount(() => {
    ro?.disconnect()
})

const getScrollEl = () => contentEl.value
/** Extra offset so hash / timeline jumps clear the editor tab bar */
const HASH_SCROLL_OFFSET = 72

const scrollToSelector = (selector: string) => {
    if (!contentEl.value) return
    const el = contentEl.value.querySelector(selector) as HTMLElement | null
    if (!el) return
    contentEl.value.scrollTo({
        top: Math.max(0, el.offsetTop - TOP_PAD - HASH_SCROLL_OFFSET),
        behavior: 'smooth',
    })
}

defineExpose({ getScrollEl, scrollToSelector })
</script>

<style>
.tabular-nums {
    font-variant-numeric: tabular-nums;
}
</style>