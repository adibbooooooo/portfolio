<template>
	<div class="p-4 md:p-6 text-white/90 space-y-5">
		<!-- Header -->
		<header class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
			<div>
				<h2 class="text-xl font-bold text-white normal-font">
					Vite <span class="text-[#a3a3a3]">Reload Visualizer</span>
				</h2>
				<p class="text-sm text-white/60 pt-1">
					Click any module below to simulate instant rebuilds, just like Vite ⚡️😎
				</p>
			</div>

			<div class="flex gap-2">
				<button class="btn" @click="triggerFullReload">Full Reload</button>
				<button class="btn ghost" @click="clearLogs">Clear Log</button>
			</div>
		</header>

		<!-- Module grid -->
		<div class="grid grid-cols-3 md:grid-cols-5 gap-4 mt-4">
			<button v-for="mod in modules" :key="mod.id" class="module-tile cursor-pointer"
				:class="{ updating: mod.updating }" @click="triggerHotReload(mod.id)">
				<span class="text-[13px]">{{ mod.name }}</span>
			</button>
		</div>

		<!-- Log area -->
		<div class="log-area mt-6 no-scrollbar">
			<div v-for="(entry, i) in logs" :key="i" class="log-line vite">
				<span class="time">{{ entry.time }}</span>
				<span class="tag"> [vite]</span>
				<span class="context"> (client)</span>
				<span class="action"> hmr update </span>
				<span class="path text-white/80">{{ entry.file }}</span>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

/* ── Mock module grid ───────────────────────── */
const modules = ref([
	{ id: 1, name: 'main.js', updating: false },
	{ id: 2, name: 'Navbar.vue', updating: false },
	{ id: 3, name: 'Sidebar.vue', updating: false },
	{ id: 4, name: 'Dashboard.vue', updating: false },
	{ id: 5, name: 'App.vue', updating: false },
	{ id: 6, name: 'UserCard.vue', updating: false },
	{ id: 7, name: 'ChartPanel.vue', updating: false },
	{ id: 8, name: 'Settings.vue', updating: false },
	{ id: 9, name: 'router.js', updating: false },
	{ id: 10, name: 'vite.config.ts', updating: false }
])

const logs = ref<{ time: string; file: string; type: string }[]>([])

/* ── Simulate Vite HMR ───────────────────────── */
const triggerHotReload = (id: number) => {
	const mod = modules.value.find(m => m.id === id)
	if (!mod) return
	mod.updating = true

	const now = new Date().toLocaleTimeString([], { hour12: false })
	logs.value.unshift({
		time: now,
		file: `/src/pages/${mod.name}`,
		type: 'vite'
	})

	setTimeout(() => (mod.updating = false), 450)
}

const triggerFullReload = () => {
	logs.value.unshift({
		time: new Date().toLocaleTimeString([], { hour12: false }),
		file: 'Full page reload (simulated)...',
		type: 'warn'
	})
	modules.value.forEach(m => (m.updating = true))
	setTimeout(() => {
		modules.value.forEach(m => (m.updating = false))
		logs.value.unshift({
			time: new Date().toLocaleTimeString([], { hour12: false }),
			file: 'Rebuild complete (412ms)',
			type: 'ok'
		})
	}, 600)
}

const clearLogs = () => {
	logs.value = []
}
</script>

<style scoped>
/* Buttons (same tone as Laravel demo) */
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
	background: rgba(16, 185, 129, 0.1);
	color: #a7f3d0;
	box-shadow: 0 0 10px rgba(16, 185, 129, 0.2);
	transform: translateY(-1px);
}

.btn:active {
	transform: scale(0.96);
}

.btn.ghost {
	background: transparent;
	color: #9ca3af;
	border-color: rgba(255, 255, 255, 0.1);
}

.btn.ghost:hover {
	color: #d1fae5;
	border-color: rgba(16, 185, 129, 0.4);
}

/* Module grid */
.module-tile {
	border: 1px solid rgba(255, 255, 255, 0.08);
	background: #141414;
	border-radius: 10px;
	padding: 20px 0;
	text-align: center;
	color: #e5e7eb;
	font-weight: 500;
	font-family: ui-monospace, monospace;
	transition: all 0.2s ease;
}

.module-tile:hover {
	border-color: rgba(16, 185, 129, 0.5);
	box-shadow: 0 0 14px rgba(16, 185, 129, 0.15);
	transform: scale(1.05);
}

.module-tile.updating {
	background: rgba(16, 185, 129, 0.2);
	border-color: rgba(16, 185, 129, 0.7);
	box-shadow: 0 0 18px rgba(16, 185, 129, 0.3);
	color: #a7f3d0;
}

/* Log area */
.log-area {
	background: #0f0f0f;
	border: 1px solid rgba(255, 255, 255, 0.08);
	border-radius: 10px;
	padding: 12px 14px;
	height: 160px;
	overflow-y: auto;
	font-family: ui-monospace, monospace;
	font-size: 13px;
}

.log-line {
	margin-bottom: 4px;
	white-space: pre;
}

/* Terminal color scheme */
.time {
	color: #71717a;
	margin-right: 4px;
}

.tag {
	color: #3b82f6;
	/* blue for [vite] */
}

.context {
	color: #9ca3af;
	/* grey for (client) */
}

.action {
	color: #22c55e;
	/* green for hmr update */
}

.path {
	color: #e5e7eb;
}

/* scrollbar aesthetic */
.log-area::-webkit-scrollbar {
	height: 6px;
	width: 6px;
}

.log-area::-webkit-scrollbar-thumb {
	background: rgba(255, 255, 255, 0.15);
	border-radius: 4px;
}
</style>