<template>
    <div
        class="logo-loop rounded-xl border border-white/10 bg-[#141414] py-4"
        :class="{ 'logo-loop--static': isReducedMotion }">
        <div class="logo-loop__fade logo-loop__fade--left" aria-hidden="true" />
        <div class="logo-loop__fade logo-loop__fade--right" aria-hidden="true" />

        <div class="logo-loop__viewport overflow-hidden">
            <div class="logo-loop__track" :style="trackStyle">
                <div
                    v-for="(item, i) in duplicatedItems"
                    :key="`${item.id}-${i}`"
                    class="logo-loop__item shrink-0"
                    :title="item.note ? `${item.name}: ${item.note}` : item.name">
                    <div
                        class="logo-loop__avatar overflow-hidden rounded-xl border border-white/10 bg-[#161616]"
                        :class="item.featured ? 'ring-1 ring-emerald-400/35' : ''">
                        <img
                            :src="item.src"
                            :alt="item.name"
                            width="96"
                            height="96"
                            class="h-full w-full object-cover object-top"
                            loading="lazy"
                            decoding="async" />
                    </div>
                    <p class="logo-loop__name mt-2 max-w-[6.5rem] truncate text-center text-[10px] text-white/70">
                        {{ item.shortName ?? item.name }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePreferredReducedMotion } from '@vueuse/core'

export type LogoLoopItem = {
    id: string
    name: string
    shortName?: string
    src: string
    note?: string
    featured?: boolean
}

const props = withDefaults(
    defineProps<{
        items: LogoLoopItem[]
        duration?: string
    }>(),
    {
        duration: '42s',
    }
)

const preferredMotion = usePreferredReducedMotion()
const isReducedMotion = computed(() => preferredMotion.value === 'reduce')

const duplicatedItems = computed(() => [...props.items, ...props.items])

const trackStyle = computed(() => ({
    '--logo-loop-duration': props.duration,
}))
</script>

<style scoped>
.logo-loop {
    position: relative;
}

.logo-loop__viewport {
    mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
}

.logo-loop__track {
    display: flex;
    width: max-content;
    gap: 1.25rem;
    padding: 0 1.25rem;
    animation: logo-loop-scroll var(--logo-loop-duration, 42s) linear infinite;
}

.logo-loop:hover .logo-loop__track {
    animation-play-state: paused;
}

.logo-loop--static .logo-loop__track {
    animation: none;
    flex-wrap: wrap;
    justify-content: center;
    width: 100%;
    max-width: 100%;
}

.logo-loop__item {
    width: 6.5rem;
}

.logo-loop__avatar {
    width: 5.5rem;
    height: 5.5rem;
    margin: 0 auto;
}

.logo-loop__fade {
    pointer-events: none;
    position: absolute;
    top: 0;
    bottom: 0;
    width: 2.5rem;
    z-index: 1;
}

.logo-loop__fade--left {
    left: 0;
    background: linear-gradient(90deg, #141414, transparent);
}

.logo-loop__fade--right {
    right: 0;
    background: linear-gradient(270deg, #141414, transparent);
}

@keyframes logo-loop-scroll {
    from {
        transform: translateX(0);
    }
    to {
        transform: translateX(-50%);
    }
}

@media (prefers-reduced-motion: reduce) {
    .logo-loop__track {
        animation: none;
    }
}
</style>
