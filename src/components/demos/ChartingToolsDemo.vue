<template>
  <div class="rounded-lg border border-white/10 bg-[#0b1118] p-3">
    <div class="mb-2 flex items-center justify-between text-xs text-white/70">
      <span class="font-medium text-white">HABO/AO</span>
    </div>
    <div ref="chartHost" class="h-[300px] w-full"></div>
  </div>
</template>

<script setup lang="ts">
import { createChart, CandlestickSeries, type IChartApi, type ISeriesApi, type CandlestickData } from 'lightweight-charts'
import { onBeforeUnmount, onMounted, ref } from 'vue'

const chartHost = ref<HTMLElement | null>(null)
let chart: IChartApi | null = null
let candleSeries: ISeriesApi<'Candlestick'> | null = null
let timer: ReturnType<typeof setInterval> | null = null
let currentBar: CandlestickData | null = null

const basePrice = 1.0
const randomBetween = (min: number, max: number) => Math.random() * (max - min) + min
const to4 = (n: number) => Number(n.toFixed(4))
const nowSec = () => Math.floor(Date.now() / 1000)

const seedBars = (count: number): CandlestickData[] => {
  const bars: CandlestickData[] = []
  const end = nowSec()
  let open = basePrice

  for (let i = count - 1; i >= 0; i--) {
    const time = (end - i * 60) as CandlestickData['time']
    const close = to4(open + randomBetween(-0.02, 0.02))
    const high = to4(Math.max(open, close) + randomBetween(0.002, 0.012))
    const low = to4(Math.min(open, close) - randomBetween(0.002, 0.012))

    bars.push({
      time,
      open: to4(open),
      high,
      low,
      close
    })
    open = close
  }
  return bars
}

const tick = () => {
  if (!candleSeries || !currentBar) return

  const now = nowSec()
  const bucket = Math.floor(now / 5) * 5

  if (currentBar.time !== bucket) {
    const nextOpen = currentBar.close
    currentBar = {
      time: bucket as CandlestickData['time'],
      open: nextOpen,
      high: nextOpen,
      low: nextOpen,
      close: nextOpen
    }
  }

  const delta = randomBetween(-0.008, 0.008)
  const nextClose = to4(Math.max(0.1, currentBar.close + delta))

  currentBar.close = nextClose
  currentBar.high = to4(Math.max(currentBar.high, nextClose))
  currentBar.low = to4(Math.min(currentBar.low, nextClose))
  candleSeries.update(currentBar)
}

onMounted(() => {
  if (!chartHost.value) return

  chart = createChart(chartHost.value, {
    autoSize: true,
    layout: {
      background: { color: '#0b1118' },
      textColor: '#b8c0cc'
    },
    grid: {
      vertLines: { color: '#1a2533' },
      horzLines: { color: '#1a2533' }
    },
    rightPriceScale: { borderColor: '#213247' },
    timeScale: { borderColor: '#213247', timeVisible: true, secondsVisible: true },
    crosshair: {
      vertLine: { color: '#3c4f68' },
      horzLine: { color: '#3c4f68' }
    }
  })

  candleSeries = chart.addSeries(CandlestickSeries, {
    upColor: '#22c55e',
    downColor: '#ef4444',
    borderVisible: false,
    wickUpColor: '#22c55e',
    wickDownColor: '#ef4444'
  })

  const history = seedBars(120)
  candleSeries.setData(history)
  const lastIndex = history.length - 1
  if (lastIndex < 0) return
  const last = history[lastIndex]!
  currentBar = {
    time: last.time,
    open: last.open,
    high: last.high,
    low: last.low,
    close: last.close
  }
  chart.timeScale().fitContent()
  timer = setInterval(tick, 600)
})

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
  timer = null
  candleSeries = null
  currentBar = null
  chart?.remove()
  chart = null
})
</script>
