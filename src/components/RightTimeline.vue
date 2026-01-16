<template>
    <!-- Parent controls position (fixed) via passed classes -->
    <aside v-bind="$attrs">
        <div class="gh-panel relative rounded-[8px] border border-seperator bg-[#1b1b1b]/95 backdrop-blur">
            <div class="gh-header">Navigation</div>

            <nav class="py-2">
                <button v-for="(it, idx) in items" :key="it.id"
                    class="gh-row group relative flex w-full items-center gap-3 text-left cursor-pointer"
                    @click="$emit('jump', `#${it.id}`)">
                    <!-- active left bar -->
                    <span class="gh-activebar"
                        :class="activeId === it.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-30'" />

                    <!-- graph lane (dot + top/bottom connectors) -->
                    <span class="gh-lane">
                        <!-- top connector (to previous) -->
                        <span v-if="idx !== 0" class="gh-conn gh-conn-top"
                            :class="activeId === it.id ? 'bg-emerald-400/40' : 'bg-white/10'" />
                        <!-- bottom connector (to next) -->
                        <span v-if="idx !== items.length - 1" class="gh-conn gh-conn-btm"
                            :class="activeId === it.id ? 'bg-emerald-400/40' : 'bg-white/10'" />
                        <!-- dot -->
                        <span class="gh-dot border transition-colors duration-150" :class="activeId === it.id
                            ? 'bg-emerald-400/90 border-emerald-300'
                            : 'bg-[#2a2a2a] border-white/15 group-hover:bg-white/20'" />
                    </span>

                    <!-- label -->
                    <span class="truncate gh-label"
                        :class="activeId === it.id ? 'text-white' : 'text-primary group-hover:text-white/90'">
                        {{ it.label }}
                    </span>
                </button>
            </nav>
        </div>
    </aside>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'

const props = defineProps<{
    items: { id: string; label: string }[]
    rootEl: HTMLElement | null
}>()

const activeId = ref(props.items[0]?.id ?? '')

const sections = ref<HTMLElement[]>([])
const ticking = ref(false)

const targetPick = () => {
    if (!props.rootEl || sections.value.length === 0) return
    const root = props.rootEl
    const targetY = root.scrollTop + root.clientHeight * 0.35  // ~GitHub feel
    let current = sections.value[0] as HTMLElement
    for (const el of sections.value) {
        if (el.offsetTop <= targetY) current = el
        else break
    }
    const id = current.id
    if (id && id !== activeId.value) activeId.value = id
}

const onScroll = () => {
    if (ticking.value) return
    ticking.value = true
    requestAnimationFrame(() => {
        targetPick()
        ticking.value = false
    })
}

const bind = async () => {
    if (!props.rootEl) return
    sections.value = props.items
        .map(it => props.rootEl!.querySelector<HTMLElement>(`#${it.id}`))
        .filter((el): el is HTMLElement => !!el)
    await nextTick()
    targetPick()
    props.rootEl.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
}

const unbind = () => {
    if (!props.rootEl) return
    props.rootEl.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onScroll)
}

watch(() => props.rootEl, async (el, prev) => {
    if (prev) prev.removeEventListener('scroll', onScroll)
    if (el) await bind()
}, { immediate: true })

onMounted(() => { if (props.rootEl) bind() })
onBeforeUnmount(() => unbind())
</script>

<style scoped>
/* Panel */
.gh-panel {
    padding: 8px 0;
}

.gh-header {
    padding: 8px 12px;
    border-bottom: 1px solid rgba(255, 255, 255, .08);
    color: #fff;
    font-size: 13px;
}

/* Row (GitHub-ish) */
.gh-row {
    height: 32px;
    /* tight rows */
    padding-left: 12px;
    padding-right: 10px;
    border-radius: 6px;
}

.gh-row:hover {
    background: rgba(255, 255, 255, .04);
}

/* Left active bar */
.gh-activebar {
    position: absolute;
    left: 0;
    top: 4px;
    bottom: 4px;
    width: 2px;
    background: rgba(16, 185, 129, .75);
    border-radius: 2px;
    transition: opacity .18s ease;
}

/* Lane: 16px wide area for graph + connectors */
.gh-lane {
    position: relative;
    width: 22px;
    display: inline-flex;
    justify-content: center;
}

.gh-dot {
    position: relative;
    z-index: 1;
    width: 10px;
    height: 10px;
    border-radius: 9999px;
}

/* Connectors (top/bottom) */
.gh-conn {
    position: absolute;
    left: 10px;
    width: 2px;
}

.gh-conn-top {
    top: -20px;
    bottom: 50%;
}

.gh-conn-btm {
    top: 50%;
    bottom: -20px;
}

/* Label */
.gh-label {
    font-size: 13px;
}

/* Small pulse on active dot (optional, comment if not wanted) */
/* .gh-dot::after {
  content: ''; position: absolute; inset: -6px; border-radius: 9999px;
  background: rgba(16,185,129,.22); transform: scale(0.9);
  animation: gh-pulse 1.5s cubic-bezier(0,0,.2,1) infinite;
}
@keyframes gh-pulse { 0%{opacity:.5} 80%{opacity:0; transform:scale(1.7)} 100%{opacity:0; transform:scale(1.7)} } */
</style>