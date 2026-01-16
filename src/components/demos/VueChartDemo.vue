<template>
    <div class="p-4 md:p-6 text-white/90 space-y-5">
        <!-- Header -->
        <header class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
                <h2 class="text-[18px] font-bold text-white normal-font">
                    Vue <span class="text-[#a3a3a3]">Chart Dashboard</span>
                </h2>
                <p class="text-sm text-white/60">Live reactive data updates with smooth transitions.</p>
            </div>

            <div class="flex items-center gap-2">
                <button v-for="opt in datasets" :key="opt.key" @click="setDataset(opt.key)" class="btn"
                    :class="{ active: activeDataset === opt.key }">
                    {{ opt.label }}
                </button>
            </div>
        </header>

        <!-- Charts -->
        <div class="grid md:grid-cols-2 gap-6 mt-4">
            <div class="chart-card">
                <h3 class="chart-title">Performance Over Time</h3>
                <LineChart :chart-data="lineChartData" :options="chartOptions" class="h-[240px]" />
            </div>

            <div class="chart-card">
                <h3 class="chart-title">Category Breakdown</h3>
                <BarChart :chart-data="barChartData" :options="chartOptions" class="h-[240px]" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { LineChart, BarChart } from 'vue-chart-3'
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

/* ── Demo Config ─────────────────────────── */
const datasets = [
    { key: 'revenue', label: 'Revenue' },
    { key: 'users', label: 'Users' },
    { key: 'sessions', label: 'Sessions' },
] as const

type DatasetKey = (typeof datasets)[number]['key']

const activeDataset = ref<DatasetKey>('revenue')

/* ── Reactive Mock Data ───────────────────── */
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
const makeRandom = (base: number, variance = 0.25) =>
    months.map(() => Math.round(base * (1 + (Math.random() - 0.5) * variance)))

const dataMap = ref<Record<DatasetKey, number[]>>({
    revenue: makeRandom(6000),
    users: makeRandom(800),
    sessions: makeRandom(1500),
})

/* Update data every few seconds */
onMounted(() => {
    setInterval(() => {
        dataMap.value = {
            revenue: makeRandom(6000),
            users: makeRandom(800),
            sessions: makeRandom(1500)
        }
    }, 3500)
})

/* ── Computed Chart Data ───────────────────── */
const setDataset = (key: DatasetKey) => {
    activeDataset.value = key
}

const lineChartData = computed(() => {
    const key = activeDataset.value
    const cfg = datasets.find(d => d.key === key)

    return {
        labels: months,
        datasets: [
            {
                label: cfg?.label ?? '',
                data: dataMap.value[key] ?? [],   // <- always an array
                borderColor: '#34d399',
                backgroundColor: 'rgba(52,211,153,0.15)',
                fill: true,
                tension: 0.35,
                borderWidth: 2,
            },
        ],
    }
})

const barChartData = computed(() => ({
    labels: ['North', 'South', 'East', 'West'],
    datasets: [
        {
            label: 'Region Share',
            data: Array.from({ length: 4 }, () => Math.round(Math.random() * 100)),
            backgroundColor: ['#60a5fa', '#f472b6', '#facc15', '#34d399']
        }
    ]
}))

/* ── Chart.js Options ─────────────────────── */
const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        x: {
            ticks: { color: '#9ca3af' },
            grid: { color: 'rgba(255,255,255,0.05)' }
        },
        y: {
            ticks: { color: '#9ca3af' },
            grid: { color: 'rgba(255,255,255,0.05)' }
        }
    },
    plugins: {
        legend: { labels: { color: '#e5e7eb', font: { size: 12 } } },
        tooltip: {
            backgroundColor: '#111827',
            titleColor: '#fff',
            bodyColor: '#e5e7eb',
            cornerRadius: 8,
            padding: 8
        }
    },
    animation: {
        duration: 800,
        easing: 'easeOutQuart'
    }
}
</script>

<style scoped>
/* Chart cards */
.chart-card {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: #141414;
    border-radius: 12px;
    padding: 16px;
    transition: all 0.3s ease;
}

.chart-card:hover {
    box-shadow: 0 0 16px rgba(52, 211, 153, 0.08);
    transform: scale(1.015);
}

.chart-title {
    font-size: 13px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 8px;
}

/* Laravel-like buttons */
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

.btn.active {
    border-color: rgba(16, 185, 129, 0.6);
    background: rgba(16, 185, 129, 0.15);
    color: #d1fae5;
    box-shadow: 0 0 14px rgba(16, 185, 129, 0.25);
}
</style>