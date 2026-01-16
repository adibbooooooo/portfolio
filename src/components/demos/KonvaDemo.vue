<!-- KonvaCollector.vue -->
<template>
    <div class="collector-wrap py-4">
        <!-- Controls (outside canvas) -->
        <div class="ctrls-bar">
            <div class="ctrls-inner">
                <button class="btn" @click="toggleRun">{{ running ? 'Pause' : 'Start' }}</button>
                <button class="btn ghost" @click="addStickers(10)">Add 10 ⭐️</button>
                <button class="btn ghost" @click="reset">Reset</button>

                <div class="speed">
                    <button class="btn ghost" :class="{ on: speed === 0.75 }" @click="setSpeed(0.75)">0.75×</button>
                    <button class="btn ghost" :class="{ on: speed === 1 }" @click="setSpeed(1)">1×</button>
                    <button class="btn ghost" :class="{ on: speed === 1.5 }" @click="setSpeed(1.5)">1.5×</button>
                    <button class="btn ghost" :class="{ on: speed === 2 }" @click="setSpeed(2)">2×</button>
                </div>

                <div class="score">Score: <span>{{ score }}</span></div>
            </div>
        </div>

        <!-- Canvas -->
        <div class="board" ref="mountRef"></div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import Konva from 'konva'

/* --- DOM refs & reactive state --- */
const mountRef = ref<HTMLDivElement | null>(null)
const running = ref(false)
const score = ref(0)
const speed = ref(1)

/* --- Konva objects --- */
let stage: Konva.Stage | null = null
let bgLayer: Konva.Layer | null = null
let gameLayer: Konva.Layer | null = null
let anim: Konva.Animation | null = null

/* --- Shapes --- */
let bot: Konva.Circle | null = null
let stickers: Konva.Star[] = []

/* --- Config --- */
const SIZE = 300
const GRID = 30
const BOT_SPEED = 90   // world units per second at 1×
const COLLECT_DIST = 14

/* Utils */
const rand = (min: number, max: number) => Math.random() * (max - min) + min

function drawGrid() {
    if (!bgLayer) return
    bgLayer.destroyChildren()

    // background box
    const bg = new Konva.Rect({
        x: 0, y: 0, width: SIZE, height: SIZE,
        fill: '#0e0f10',
        cornerRadius: 10
    })
    bgLayer.add(bg)

    // grid lines
    for (let x = GRID; x < SIZE; x += GRID) {
        bgLayer.add(new Konva.Line({
            points: [x, 0, x, SIZE],
            stroke: 'rgba(255,255,255,0.05)',
            strokeWidth: 1
        }))
    }
    for (let y = GRID; y < SIZE; y += GRID) {
        bgLayer.add(new Konva.Line({
            points: [0, y, SIZE, y],
            stroke: 'rgba(255,255,255,0.05)',
            strokeWidth: 1
        }))
    }

    bgLayer.draw()
}

function spawnSticker() {
    if (!gameLayer) return
    const x = rand(20, SIZE - 20)
    const y = rand(20, SIZE - 20)

    const star = new Konva.Star({
        x, y: -20, // drop from top
        numPoints: 5,
        innerRadius: 6,
        outerRadius: 12,
        fill: '#FACC15',            // amber-400
        stroke: 'rgba(255,255,255,0.25)',
        strokeWidth: 1,
        shadowColor: '#FACC15',
        shadowBlur: 8,
        opacity: 0.0
    })
    gameLayer.add(star)
    stickers.push(star)

    // cute drop-in tween
    new Konva.Tween({
        node: star,
        y,
        opacity: 1,
        duration: 0.35,
        easing: Konva.Easings.EaseOut
    }).play()
}

function addStickers(n = 1) {
    for (let i = 0; i < n; i++) spawnSticker()
    gameLayer?.draw()
}

function createBot() {
    if (!gameLayer) return
    bot = new Konva.Circle({
        x: SIZE / 2,
        y: SIZE - 24,
        radius: 8,
        fill: '#22D3EE', // cyan-400
        shadowColor: '#22D3EE',
        shadowBlur: 8
    })
    gameLayer.add(bot)
}

function burst(x: number, y: number) {
    if (!gameLayer) return
    const ring = new Konva.Circle({
        x, y, radius: 2,
        stroke: 'rgba(34,211,238,0.9)',
        strokeWidth: 2,
        opacity: 1
    })
    gameLayer.add(ring)
    new Konva.Tween({
        node: ring,
        radius: 16,
        opacity: 0,
        duration: 0.25,
        onFinish: () => { ring.destroy(); gameLayer?.batchDraw() }
    }).play()
}

function closestSticker(from: Konva.Circle) {
    let best: Konva.Star | null = null
    let bestDist = Infinity
    for (const s of stickers) {
        const dx = s.x() - from.x()
        const dy = s.y() - from.y()
        const d = Math.hypot(dx, dy)
        if (d < bestDist) { bestDist = d; best = s }
    }
    return best ? { node: best, dist: bestDist } : null
}

function tick(dtSec: number) {
    if (!running.value || !bot || !stickers.length) return

    const target = closestSticker(bot)
    if (!target) return

    const { node: s, dist } = target
    if (dist < COLLECT_DIST) {
        // collect
        burst(s.x(), s.y())
        s.destroy()
        stickers = stickers.filter(x => x !== s)
        score.value += 1
        gameLayer?.batchDraw()
        return
    }

    // move bot towards target
    const dx = s.x() - bot.x()
    const dy = s.y() - bot.y()
    const angle = Math.atan2(dy, dx)
    const step = BOT_SPEED * speed.value * dtSec
    const nx = bot.x() + Math.cos(angle) * Math.min(step, dist)
    const ny = bot.y() + Math.sin(angle) * Math.min(step, dist)
    bot.position({ x: nx, y: ny })

    // subtle sway
    bot.rotation(Math.sin(Date.now() * 0.005) * 6)

    gameLayer?.batchDraw()
}

function toggleRun() {
    running.value = !running.value
}

function setSpeed(v: number) {
    speed.value = v
}

function reset() {
    running.value = false
    score.value = 0
    // clear stickers
    for (const s of stickers) s.destroy()
    stickers = []
    // reset bot
    if (bot) bot.position({ x: SIZE / 2, y: SIZE - 24 })
    gameLayer?.batchDraw()
}

onMounted(() => {
    // Stage & layers
    stage = new Konva.Stage({
        container: mountRef.value!,
        width: SIZE,
        height: SIZE
    })
    bgLayer = new Konva.Layer()
    gameLayer = new Konva.Layer()

    stage.add(bgLayer)
    stage.add(gameLayer)

    drawGrid()
    createBot()
    addStickers(6)

    // Animation loop
    let last = performance.now()
    anim = new Konva.Animation(() => {
        const now = performance.now()
        const dtSec = (now - last) / 1000
        last = now
        tick(dtSec)
    }, gameLayer)
    anim.start()
})

onBeforeUnmount(() => {
    anim?.stop()
    stage?.destroy()
})
</script>

<style scoped>
.collector-wrap {
    width: 100%;
    max-width: 300px;
    margin: 0 auto;
}

/* controls bar OUTSIDE the canvas */
.ctrls-bar {
    margin: 0 auto 10px;
    max-width: 360px;
}

.ctrls-inner {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    align-items: center;
    justify-content: center;
}

.board {
    width: 100%;
    aspect-ratio: 1/1;
    background: #0b0c0d;
    border: 1px solid rgba(255, 255, 255, .08);
    border-radius: 12px;
    overflow: hidden;
}

/* buttons (same system you use elsewhere) */
.btn {
    border: 1px solid rgba(255, 255, 255, 0.15);
    background: rgba(255, 255, 255, 0.05);
    color: #e5e7eb;
    font-size: 12px;
    border-radius: 8px;
    padding: 6px 10px;
    cursor: pointer;
    transition: all .2s ease;
}

.btn:hover {
    border-color: rgba(16, 185, 129, .5);
    background: rgba(16, 185, 129, .1);
    color: #a7f3d0;
    box-shadow: 0 0 10px rgba(16, 185, 129, .2);
    transform: translateY(-1px);
}

.btn:active {
    transform: scale(.96);
}

.btn.ghost {
    background: transparent;
    color: #9ca3af;
    border-color: rgba(255, 255, 255, .1);
}

.btn.ghost:hover {
    color: #d1fae5;
    border-color: rgba(16, 185, 129, .4);
}

.btn.ghost.on {
    border-color: rgba(16, 185, 129, .6);
    color: #a7f3d0;
}

.speed {
    display: inline-flex;
    gap: 6px;
}

.score {
    margin-left: 6px;
    font-size: 12.5px;
    color: #cbd5e1;
}

.score span {
    color: #a7f3d0;
    font-weight: 600;
}
</style>