<template>
    <div class="p-4 md:p-6 text-white/90 space-y-5">
        <!-- Header -->
        <header>
            <h2 class="text-xl font-bold text-white normal-font">
                Tailwind <span class="text-[#a3a3a3]"> Playground</span>
            </h2>
        </header>

        <!-- Component type selector -->
        <div class="flex flex-wrap gap-2">
            <button v-for="c in components" :key="c" class="btn" :class="{ active: activeComponent === c }"
                @click="activeComponent = c">
                {{ c }}
            </button>
        </div>

        <!-- Utility toggles -->
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            <button v-for="u in utilities" :key="u.class" class="util-btn"
                :class="{ active: appliedClasses.includes(u.class) }" @click="toggleClass(u.class)">
                {{ u.label }}
            </button>
        </div>

        <!-- Live preview -->
        <div class="preview-area">
            <component :is="currentComponent" :class="appliedClasses.join(' ')" />
        </div>

        <!-- Class inspector -->
        <div class="class-box">
            <div class="text-[12.5px] text-white/70 mb-1">Applied classes:</div>
            <code class="block text-[13px] text-emerald-300 whitespace-pre-wrap break-all">
                {{ appliedClasses.join(' ') || '— none —' }}
            </code>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

/* ── Data ─────────────────────────── */
const components = ['Button', 'Card', 'Badge']
const activeComponent = ref('Button')

const utilities = [
    { label: 'Hover Glow', class: 'hover:shadow-[0_0_10px_rgba(16,185,129,0.4)]' },
    { label: 'Rounded', class: 'rounded-xl' },
    { label: 'Ring', class: 'ring-2 ring-emerald-400/50' },
    { label: 'Shadow', class: 'shadow-lg shadow-emerald-800/30' },
    { label: 'Gradient', class: 'bg-gradient-to-r from-emerald-400 to-teal-500' },
    { label: 'Outline', class: 'border border-emerald-400/50' },
    { label: 'Scale Hover', class: 'hover:scale-[1.05] transition-transform' },
    { label: 'Text Glow', class: 'text-emerald-300 drop-shadow-[0_0_6px_rgba(16,185,129,0.6)]' },
    { label: 'Cursor Pointer', class: 'cursor-pointer' },
    { label: 'Center', class: 'flex items-center justify-center' }
]

const appliedClasses = ref<string[]>([])

/* ── Logic ─────────────────────────── */
const toggleClass = (cls: string) => {
    const idx = appliedClasses.value.indexOf(cls)
    if (idx >= 0) appliedClasses.value.splice(idx, 1)
    else appliedClasses.value.push(cls)
}

/* ── Component previews ─────────────── */
const Button = {
    template: `<button class="bg-[#1b1b1b] px-4 py-2 text-white font-medium transition-all">Click Me</button>`
}
const Card = {
    template: `
    <div class="bg-[#1b1b1b] p-4 rounded-lg text-white w-[200px] text-sm transition-all">
        <h3 class="font-bold mb-1 text-[15px]">Sample Card</h3>
        <p class="text-white/70 leading-snug">Utility-first styling at your fingertips.</p>
    </div>`
}
const Badge = {
    template: `<span class="bg-[#1b1b1b] text-white px-3 py-1 rounded-full text-sm transition-all">Tailwind</span>`
}

const currentComponent = computed(() => {
    switch (activeComponent.value) {
        case 'Card':
            return Card
        case 'Badge':
            return Badge
        default:
            return Button
    }
})
</script>

<style scoped>
.btn {
    border: 1px solid rgba(255, 255, 255, 0.15);
    background: rgba(255, 255, 255, 0.05);
    color: #e5e7eb;
    font-size: 13px;
    border-radius: 8px;
    padding: 7px 12px;
    cursor: pointer;
    transition: all 0.2s ease;
}

.btn:hover {
    border-color: rgba(16, 185, 129, 0.5);
    color: #a7f3d0;
}

.btn.active {
    border-color: rgba(16, 185, 129, 0.6);
    background: rgba(16, 185, 129, 0.1);
    color: #a7f3d0;
}

.util-btn {
    border: 1px solid rgba(255, 255, 255, 0.08);
    background: rgba(255, 255, 255, 0.05);
    color: #e5e7eb;
    font-size: 12.5px;
    border-radius: 6px;
    padding: 6px 8px;
    cursor: pointer;
    transition: all 0.2s ease;
}

.util-btn:hover {
    border-color: rgba(16, 185, 129, 0.4);
    color: #a7f3d0;
}

.util-btn.active {
    border-color: rgba(16, 185, 129, 0.6);
    background: rgba(16, 185, 129, 0.1);
    color: #a7f3d0;
}

.preview-area {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 160px;
    background: #111;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 10px;
    transition: all 0.3s ease;
}

.class-box {
    background: #0f0f0f;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 10px;
    padding: 10px 12px;
}

/* Shared button base (matches Laravel & Chart demos) */
.btn,
.util-btn {
    position: relative;
    border: 1px solid rgba(255, 255, 255, 0.15);
    background: rgba(255, 255, 255, 0.05);
    color: #e5e7eb;
    font-size: 13px;
    border-radius: 8px;
    padding: 7px 12px;
    cursor: pointer;
    transition: all 0.22s ease;
    overflow: hidden;
}

.btn:hover,
.util-btn:hover {
    border-color: rgba(16, 185, 129, 0.6);
    background: rgba(16, 185, 129, 0.1);
    color: #a7f3d0;
    box-shadow: 0 0 10px rgba(16, 185, 129, 0.25);
    transform: translateY(-1px) scale(1.02);
}

.btn:active,
.util-btn:active {
    transform: scale(0.96);
}

/* Subtle animated glow */
.btn::after,
.util-btn::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(120px 120px at var(--x, 50%) var(--y, 50%),
            rgba(16, 185, 129, 0.15),
            transparent 60%);
    opacity: 0;
    transition: opacity 0.25s ease;
}

.btn:hover::after,
.util-btn:hover::after {
    opacity: 1;
}

/* Active highlight states */
.btn.active,
.util-btn.active {
    border-color: rgba(16, 185, 129, 0.8);
    background: rgba(16, 185, 129, 0.12);
    color: #a7f3d0;
    box-shadow: 0 0 14px rgba(16, 185, 129, 0.25);
}

/* Playground visuals */
.preview-area {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 160px;
    background: #111;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 10px;
    transition: all 0.3s ease;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.4) inset;
}

.class-box {
    background: #0f0f0f;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 10px;
    padding: 10px 12px;
}
</style>