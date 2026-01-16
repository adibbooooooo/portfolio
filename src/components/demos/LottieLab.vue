<template>
    <div class="p-3 md:p-4 text-white/90 text-[13px] space-y-4">
        <div class="flex justify-center gap-6 md:gap-10">
            <button v-for="b in buttons" :key="b.k" class="rx-btn" @mouseenter="play(b.k)" @click="react(b.k)">
                <span class="lottie-box" :class="{ bump: bumping === b.k }">
                    <span class="lottie-canvas" :ref="el => setHolder(b.k, el as HTMLElement)" />
                    <span v-if="!hasAnim(b.k)" class="emo-fallback">{{ b.emoji }}</span>
                </span>
            </button>
        </div>

        <p class="text-white/60 text-center">
            Hover to preview. Click to react — same Lottie engine as Telegram.
        </p>
    </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import lottie from 'lottie-web'

type Key = 'cool' | 'money' | 'idea'
const buttons = [
    { k: 'cool' as Key, emoji: '🕶', json: '/lottie/cool.json' },
    { k: 'money' as Key, emoji: '💸', json: '/lottie/money.json' },
    { k: 'idea' as Key, emoji: '💡', json: '/lottie/idea.json' },
]

const holders = new Map<Key, HTMLElement>()
const anims = reactive(new Map<Key, any>())
const bumping = ref<Key | ''>('')

const setHolder = (k: Key, el: HTMLElement | null) => { if (el) holders.set(k, el) }
const hasAnim = (k: Key) => anims.has(k)

const fetchJson = async (url: string) => {
    const res = await fetch(url, { cache: 'force-cache' })
    return await res.json()
}

const initLotties = async () => {
    for (const b of buttons) {
        if (anims.has(b.k)) continue
        const el = holders.get(b.k)
        if (!el) continue
        try {
            const data = await fetchJson(b.json)
            const anim = lottie.loadAnimation({
                container: el,
                renderer: 'svg',
                loop: false,
                autoplay: false,
                animationData: data,
            })
            anims.set(b.k, anim)
        } catch (err) {
            console.warn('Lottie failed', b.json, err)
        }
    }
}

const play = (k: Key) => {
    const anim = anims.get(k)
    if (anim) anim.goToAndPlay(0, true)
}

const react = (k: Key) => {
    play(k)
    bumping.value = k
    setTimeout(() => (bumping.value = ''), 250)
}

onMounted(() => setTimeout(initLotties, 50))
</script>
<style scoped>
.rx-btn {
    background: transparent;
    border: none;
    border-radius: 12px;
    padding: 8px;
    display: grid;
    place-items: center;
    cursor: pointer;
    transition: transform 0.2s ease;
}

.rx-btn:hover {
    transform: scale(1.05);
}

.lottie-box {
    position: relative;
    width: 90px;
    height: 90px;
    display: grid;
    place-items: center;
    pointer-events: none;
}

.lottie-canvas {
    position: absolute;
    inset: 0;
}

.emo-fallback {
    font-size: 64px;
    display: grid;
    place-items: center;
    opacity: 0.9;
}

/* subtle bounce when clicked */
.lottie-box.bump {
    animation: bump 0.35s cubic-bezier(0.25, 1.1, 0.5, 1);
}

@keyframes bump {
    0% {
        transform: scale(1);
    }

    40% {
        transform: scale(1.18);
    }

    70% {
        transform: scale(0.94);
    }

    100% {
        transform: scale(1);
    }
}
</style>