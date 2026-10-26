<template>
  <div class="rounded-lg border border-white/10 bg-[#0a0d13] p-3">

    <div ref="wrapperRef" class="scene-wrap">
      <div ref="contentRef" class="scene-scroll-spacer">
        <div class="scene-sticky">
          <div class="scene-bg-grid"></div>
          <div class="scene-bg-glow scene-bg-glow-a"></div>
          <div class="scene-bg-glow scene-bg-glow-b"></div>
          <div class="scene-floor-lines"></div>

          <div class="scene-copy-left" :style="copyFadeStyle">
            Unrivaled<br />
            build quality
          </div>
          <div class="scene-copy-right" :style="copyFadeStyle">
            Scroll through depth.<br />
            Beautiful websites.
          </div>

          <div class="depth-layer depth-back" :style="layerStyle(0.2)">
            <span v-for="(k, i) in backLayer" :key="`b-${k}`" class="logo-orb" :style="orbStyle(i)">
              <img :src="`/stack/${k}.png`" alt="" loading="lazy" draggable="false" />
            </span>
          </div>

          <div class="depth-layer depth-mid" :style="layerStyle(0.55)">
            <span v-for="(k, i) in midLayer" :key="`m-${k}`" class="logo-chip" :style="chipStyle(i)">
              {{ k }}
            </span>
          </div>

          <div class="depth-layer depth-text" :style="layerStyle(0.72)">
            <span v-for="(k, i) in textLayer" :key="`t-${k}`" class="word-mark" :style="wordStyle(i)">
              {{ k }}
            </span>
          </div>

          <div class="hero-wrap" :style="heroStyle">
            <div class="hero-logo-shell">
              <img src="/avatar.jpeg" alt="Adib Omar" class="hero-logo" draggable="false" />
            </div>
          </div>

          <div class="depth-layer depth-front" :style="layerStyle(1)">
            <span v-for="(k, i) in frontLayer" :key="`f-${k}`" class="logo-pill" :style="pillStyle(i)">
              <img :src="`/stack/${k}.png`" alt="" loading="lazy" draggable="false" />
              <em>{{ k }}</em>
            </span>
          </div>

          <div class="scene-tagline">
            I can bring this smooth spatial feel to your website too.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Lenis from 'lenis'
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

const backLayer = ['vue', 'tailwind', 'laravel', 'nodejs']
const midLayer = ['mysql', 'threejs', 'lottie', 'vite']
const frontLayer = ['konva', 'stripe', 'figma']
const textLayer = ['Vue', 'Laravel', 'Node', 'Tailwind']

const wrapperRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const progress = ref(0)
let lenis: Lenis | null = null
let unlistenLenisScroll: (() => void) | null = null

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v))

const heroStyle = computed(() => ({
  transform: `translate(-50%, -50%) translate3d(0, ${Math.sin(progress.value * Math.PI * 2) * -6}px, 0) scale(${1 + progress.value * 0.08})`
}))
const copyFadeStyle = computed(() => ({
  opacity: String(clamp(1 - progress.value * 2.6, 0, 1))
}))

const onScrollUpdate = () => {
  const wrap = wrapperRef.value
  if (!wrap) return
  const max = Math.max(1, wrap.scrollHeight - wrap.clientHeight)
  progress.value = clamp(wrap.scrollTop / max, 0, 1)
}

const layerStyle = (speed: number) => ({
  transform: `translate3d(0, ${-progress.value * 140 * speed}px, 0)`
})

const orbStyle = (i: number) => ({ left: `${8 + i * 19}%`, top: `${16 + (i % 2) * 26}%` })
const chipStyle = (i: number) => ({ left: `${10 + i * 20}%`, top: `${36 + ((i + 1) % 2) * 20}%` })
const pillStyle = (i: number) => ({ left: `${6 + i * 30}%`, top: `${66 + (i % 2) * 10}%` })
const wordStyle = (i: number) => ({ left: `${18 + i * 18}%`, top: `${50 + (i % 2) * 13}%` })

onMounted(async () => {
  const wrap = wrapperRef.value
  const inner = contentRef.value
  if (!wrap || !inner) return

  lenis = new Lenis({
    wrapper: wrap,
    content: inner,
    eventsTarget: wrap,
    smoothWheel: true,
    lerp: 0.085,
    wheelMultiplier: 0.9,
    autoRaf: true
  })

  unlistenLenisScroll = lenis.on('scroll', onScrollUpdate)
  wrap.addEventListener('scroll', onScrollUpdate, { passive: true })

  await nextTick()
  lenis.resize()
  onScrollUpdate()
})

onBeforeUnmount(() => {
  wrapperRef.value?.removeEventListener('scroll', onScrollUpdate)
  unlistenLenisScroll?.()
  unlistenLenisScroll = null
  lenis?.destroy()
  lenis = null
})
</script>

<style scoped>
.scene-wrap {
  position: relative;
  height: 305px;
  overflow: hidden;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: radial-gradient(120% 85% at 50% 50%, #0d1b3d 0%, #060c1e 48%, #040914 100%);
}

.scene-scroll-spacer {
  position: relative;
  padding: 0 10px;
  min-height: calc(305px + 220px);
}
.scene-sticky {
  position: sticky;
  top: 0;
  height: 305px;
  overflow: hidden;
}
.scene-bg-grid {
  position: absolute; inset: 0;
  background-image: linear-gradient(rgba(150, 180, 255, 0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(150, 180, 255, 0.06) 1px, transparent 1px);
  background-size: 22px 22px;
}
.scene-bg-glow { position: absolute; border-radius: 999px; filter: blur(28px); opacity: 0.45; }
.scene-bg-glow-a { width: 220px; height: 120px; left: -40px; top: 40px; background: #2a73ff; }
.scene-bg-glow-b { width: 200px; height: 140px; right: -50px; top: 120px; background: #38bdf8; }
.scene-floor-lines {
  position: absolute;
  left: -5%;
  right: -5%;
  bottom: -8px;
  height: 52%;
  background:
    repeating-linear-gradient(
      -8deg,
      rgba(96, 165, 250, 0.38) 0px,
      rgba(96, 165, 250, 0.38) 2px,
      transparent 2px,
      transparent 24px
    );
  opacity: 0.45;
  transform: perspective(420px) rotateX(58deg);
  transform-origin: bottom center;
  pointer-events: none;
}
.scene-copy-left, .scene-copy-right {
  position: absolute; z-index: 6; font-size: 12px; line-height: 1.3; color: rgba(232, 243, 255, 0.92);
}
.scene-copy-left { left: 12px; top: 66px; }
.scene-copy-right { right: 12px; top: 146px; text-align: right; color: rgba(209, 224, 255, 0.85); }
.depth-layer { position: absolute; inset: 0; pointer-events: none; transition: transform 120ms linear; }
.logo-orb, .logo-pill { position: absolute; display: grid; place-items: center; }
.logo-orb {
  width: 30px; height: 30px; border-radius: 999px;
  background: rgba(255, 255, 255, 0.12); border: 1px solid rgba(255, 255, 255, 0.2); backdrop-filter: blur(6px);
}
.logo-orb img { width: 16px; height: 16px; object-fit: contain; }
.logo-chip {
  position: absolute; padding: 4px 8px; border-radius: 999px;
  border: 1px solid rgba(103, 232, 249, 0.35); background: rgba(16, 53, 86, 0.55);
  color: rgba(221, 245, 255, 0.95); font-size: 10px; text-transform: uppercase; letter-spacing: 0.04em;
}
.word-mark {
  position: absolute;
  font-size: 18px;
  font-weight: 700;
  color: rgba(197, 220, 255, 0.26);
  letter-spacing: -0.01em;
}
.hero-wrap {
  position: absolute; left: 50%; top: 50%; z-index: 7;
  width: min(34vw, 132px); height: min(34vw, 132px); transform: translate(-50%, -50%);
  transition: transform 180ms ease-out;
}
.hero-logo-shell {
  position: absolute;
  inset: 0;
  border-radius: 16px;
  padding: 6px;
  border: 1px solid rgba(103, 232, 249, 0.35);
  background: linear-gradient(145deg, rgba(9, 20, 40, 0.85), rgba(6, 14, 28, 0.95));
  box-shadow: 0 0 28px rgba(56, 189, 248, 0.25);
}
.hero-logo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
  filter: saturate(1.05) contrast(1.05);
}
.logo-pill {
  gap: 5px; display: inline-flex; align-items: center;
  padding: 5px 8px; border-radius: 999px;
  background: rgba(7, 17, 33, 0.8); border: 1px solid rgba(163, 230, 255, 0.38);
}
.logo-pill img { width: 14px; height: 14px; object-fit: contain; }
.logo-pill em { font-style: normal; color: rgba(223, 245, 255, 0.95); font-size: 10px; text-transform: uppercase; }
.scene-tagline {
  position: absolute; left: 0; right: 0; bottom: 10px; z-index: 8;
  text-align: center; font-size: 11px; letter-spacing: 0.02em;
  color: rgba(209, 224, 255, 0.9);
}

@media (max-width: 640px) {
  .scene-copy-left,
  .scene-copy-right {
    display: none;
  }
  .hero-wrap {
    width: min(42vw, 124px);
    height: min(42vw, 124px);
  }
}
</style>
