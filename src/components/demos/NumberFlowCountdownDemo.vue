<template>
  <div class="rounded-lg border border-white/10 bg-[#08080c] px-4 py-5">
    <NumberFlowGroup>
      <div class="flex flex-wrap items-end justify-center gap-3 sm:gap-5">
        <div v-for="u in units" :key="u.key" class="flex flex-col items-center gap-1">
          <div
            class="min-w-[3.2rem] rounded-lg border border-white/10 bg-white/[0.04] px-2 py-2 text-center font-mono text-2xl font-semibold tabular-nums text-white sm:min-w-[3.75rem] sm:text-3xl"
          >
            <NumberFlow :value="u.value" :format="u.format" />
          </div>
          <span class="text-[10px] uppercase tracking-wider text-white/40">{{ u.label }}</span>
        </div>
      </div>
    </NumberFlowGroup>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import NumberFlow, { NumberFlowGroup, styles } from '@number-flow/vue'

const DEMO_MS = 2 * 60 * 60 * 1000 + 45 * 60 * 1000 + 30 * 1000
const target = ref(Date.now() + DEMO_MS)
const remainingMs = ref(DEMO_MS)

const targetLabel = computed(() =>
  new Intl.DateTimeFormat(undefined, {
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(target.value))
)

const units = computed(() => {
  const ms = remainingMs.value
  const s = Math.max(0, Math.floor(ms / 1000))
  return [
    { key: 'd', label: 'Days', value: Math.floor(s / 86400), format: { minimumIntegerDigits: 2 } as const },
    { key: 'h', label: 'Hours', value: Math.floor((s % 86400) / 3600), format: { minimumIntegerDigits: 2 } as const },
    { key: 'm', label: 'Minutes', value: Math.floor((s % 3600) / 60), format: { minimumIntegerDigits: 2 } as const },
    { key: 's', label: 'Seconds', value: s % 60, format: { minimumIntegerDigits: 2 } as const }
  ]
})

let intervalId: ReturnType<typeof setInterval> | undefined
const styleElId = 'number-flow-countdown-demo-styles'

onMounted(() => {
  if (!document.getElementById(styleElId)) {
    const el = document.createElement('style')
    el.id = styleElId
    el.textContent = styles.join('')
    document.head.appendChild(el)
  }
  const tick = () => {
    remainingMs.value = Math.max(0, target.value - Date.now())
  }
  tick()
  intervalId = setInterval(tick, 1000)
})

onBeforeUnmount(() => {
  if (intervalId) clearInterval(intervalId)
  document.getElementById(styleElId)?.remove()
})
</script>
