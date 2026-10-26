<template>
  <div class="relative min-h-[340px] overflow-hidden rounded-xl border border-white/10 bg-[#05070d]">
    <!-- backdrop -->
    <div
      class="pointer-events-none absolute inset-0 opacity-[0.4] [background-image:linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] [background-size:20px_20px]"
    />
    <component
      :is="motion.div"
      class="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-fuchsia-600/25 blur-3xl"
      :animate="{ x: [0, 24, 0], y: [0, 16, 0], scale: [1, 1.08, 1] }"
      :transition="{ duration: 10, repeat: Infinity, ease: 'easeInOut' }"
    />
    <component
      :is="motion.div"
      class="pointer-events-none absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl"
      :animate="{ x: [0, -20, 0], opacity: [0.25, 0.45, 0.25] }"
      :transition="{ duration: 9, repeat: Infinity, ease: 'easeInOut' }"
    />

    <div class="relative z-10 space-y-4 p-4">
      <div class="text-center">
        <div class="mt-2 flex flex-wrap justify-center gap-x-1 gap-y-0.5">
          <component
            v-for="(word, i) in headline"
            :key="word + i"
            :is="motion.span"
            class="inline-block px-0.5 text-lg font-semibold tracking-tight text-white sm:text-xl"
            :initial="{ opacity: 0, y: 18, rotateX: -40 }"
            :animate="{ opacity: 1, y: 0, rotateX: 0 }"
            :transition="{ delay: 0.05 * i, type: 'spring', stiffness: 280, damping: 20 }"
          >
            {{ word }}
          </component>
        </div>
      </div>

      <!-- bento -->
      <div class="mx-auto grid max-w-lg grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-2.5">
        <component
          v-for="(tile, i) in bentoTiles"
          :key="tile.k"
          :is="motion.div"
          :class="[
            'relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] p-3 shadow-lg backdrop-blur-sm',
            tile.span === 2 ? 'sm:col-span-2' : ''
          ]"
          :initial="{ opacity: 0, y: 22, scale: 0.96 }"
          :animate="{ opacity: 1, y: 0, scale: 1 }"
          :transition="{ delay: 0.07 * i, type: 'spring', stiffness: 320, damping: 24 }"
          :while-hover="{
            y: -4,
            scale: 1.02,
            borderColor: 'rgba(52, 211, 153, 0.35)',
            boxShadow: '0 16px 40px rgba(16, 185, 129, 0.12)'
          }"
          :while-press="{ scale: 0.98 }"
        >
          <span
            class="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-30 blur-2xl"
            :class="tile.glow"
          />
          <div class="relative flex items-start gap-2.5">
            <div class="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-white/10 bg-white">
              <img :src="`/stack/${tile.k}.png`" :alt="tile.title" class="h-6 w-6 object-contain" draggable="false" />
            </div>
            <div class="min-w-0">
              <p class="text-[12px] font-semibold text-white/95">{{ tile.title }}</p>
              <p class="mt-0.5 text-[10px] leading-snug text-white/45">{{ tile.line }}</p>
            </div>
          </div>
        </component>
      </div>

      <!-- marquee strip -->
      <div class="relative overflow-hidden rounded-lg border border-white/10 bg-black/30 py-2.5">
        <div
          class="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-[#05070d] to-transparent"
        />
        <div
          class="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-[#05070d] to-transparent"
        />
        <component
          :is="motion.div"
          class="flex w-max items-center gap-6 px-4"
          :animate="{ x: [0, -marqueeDistance] }"
          :transition="{ duration: 22, repeat: Infinity, ease: 'linear', repeatDelay: 0 }"
        >
          <template v-for="loop in 2" :key="loop">
            <img
              v-for="k in marqueeKeys"
              :key="`${loop}-${k}`"
              :src="`/stack/${k}.png`"
              alt=""
              class="h-8 w-8 shrink-0 object-contain opacity-75 grayscale-[0.2]"
              draggable="false"
            />
          </template>
        </component>
      </div>

      <!-- drag strip -->
      <div
        class="relative mx-auto flex h-16 max-w-md items-center justify-center rounded-lg border border-dashed border-white/12 bg-white/[0.02]"
      >
        <component
          :is="motion.div"
          drag
          :drag-constraints="{ left: -120, right: 120, top: -8, bottom: 8 }"
          :drag-elastic="0.12"
          :while-hover="{ scale: 1.02 }"
          :while-drag="{ scale: 1.04, cursor: 'grabbing', zIndex: 20 }"
          class="cursor-grab touch-none rounded-full border border-amber-400/35 bg-gradient-to-r from-amber-500/20 via-orange-500/15 to-rose-500/20 px-4 py-2.5 text-center text-[12px] font-medium text-amber-50 shadow-[0_8px_30px_rgba(251,191,36,0.12)]"
        >
          Drag Me!
        </component>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { motion } from 'motion-v'

const headline = ['Motion', 'that', 'sells', 'the', 'story']

const bentoTiles = [
  {
    k: 'vue',
    title: 'Vue + motion',
    line: 'Composition-friendly gestures & springs.',
    glow: 'bg-emerald-500/40',
    span: 1 as const
  },
  {
    k: 'tailwind',
    title: 'Tailwind polish',
    line: 'Utility layout + motion shadows.',
    glow: 'bg-cyan-500/40',
    span: 1 as const
  },
  {
    k: 'threejs',
    title: 'Depth cues',
    line: 'Pair 3D with subtle UI motion.',
    glow: 'bg-violet-500/40',
    span: 1 as const
  },
  {
    k: 'lottie',
    title: 'Lottie × handoff',
    line: 'Motion design meets dev timelines.',
    glow: 'bg-fuchsia-500/40',
    span: 2 as const
  }
]

const marqueeKeys = ['vue', 'vite', 'tailwind', 'threejs', 'laravel', 'nodejs', 'mysql', 'lottie', 'stripe', 'figma']
/** ~ one loop width in px for linear marquee (approximate; visuals still loop cleanly) */
const marqueeDistance = 320
</script>
