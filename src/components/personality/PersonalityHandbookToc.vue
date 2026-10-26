<template>
    <nav class="handbook-toc hidden lg:block" :aria-label="ariaLabel">
        <p class="text-[10px] font-semibold uppercase tracking-wider text-white/40 mb-3">Contents</p>

        <ul class="space-y-5 max-h-[min(70vh,32rem)] overflow-y-auto nice-scroll nice-scroll--thin pr-1">
            <li v-for="group in groups" :key="group.label">
                <p class="text-[10px] font-semibold uppercase tracking-wider text-white/35 mb-1.5">
                    {{ group.label }}
                </p>
                <ul class="handbook-toc__list border-l border-white/10 ml-0.5 pl-2.5 space-y-0.5">
                    <li v-for="item in group.items" :key="item.id">
                        <a
                            :href="`#${item.id}`"
                            class="handbook-toc__link block py-1 text-[12px] leading-snug transition-colors"
                            :class="
                                activeId === item.id
                                    ? 'text-emerald-300'
                                    : 'text-white/55 hover:text-emerald-200/90'
                            "
                            @click.prevent="scrollTo(item.id)">
                            {{ item.label }}
                        </a>
                    </li>
                </ul>
            </li>
        </ul>
    </nav>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import type { HandbookTocGroup } from '@/lib/personalityHandbook'

const props = defineProps<{
    groups: HandbookTocGroup[]
    scrollRoot?: HTMLElement | null
    ariaLabel?: string
}>()

const activeId = ref(props.groups[0]?.items[0]?.id ?? '')

const sections = ref<HTMLElement[]>([])
let ticking = false

function targetPick() {
    const root = props.scrollRoot
    if (!root || sections.value.length === 0) return

    const targetY = root.scrollTop + root.clientHeight * 0.32
    let current = sections.value[0] as HTMLElement
    for (const el of sections.value) {
        if (el.offsetTop <= targetY) current = el
        else break
    }
    const id = current.id
    if (id && id !== activeId.value) activeId.value = id
}

function onScroll() {
    if (ticking) return
    ticking = true
    requestAnimationFrame(() => {
        targetPick()
        ticking = false
    })
}

function collectSections() {
    const ids = props.groups.flatMap((g) => g.items.map((i) => i.id))
    sections.value = ids
        .map((id) => document.getElementById(id))
        .filter((el): el is HTMLElement => !!el)
}

async function bind() {
    collectSections()
    await nextTick()
    targetPick()
    props.scrollRoot?.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
}

function unbind() {
    props.scrollRoot?.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onScroll)
}

function scrollTo(id: string) {
    const el = document.getElementById(id)
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    if (el instanceof HTMLDetailsElement) el.open = true
    activeId.value = id
    history.replaceState(null, '', `#${id}`)
}

defineExpose({ scrollTo })

watch(
    () => [props.scrollRoot, props.groups] as const,
    async () => {
        unbind()
        if (props.scrollRoot) await bind()
    },
    { immediate: true, deep: true }
)

onMounted(() => {
    if (props.scrollRoot) void bind()
})

onBeforeUnmount(() => unbind())
</script>

<style scoped>
.handbook-toc {
    position: sticky;
    top: 1rem;
    align-self: start;
}
</style>
