<script setup lang="ts">
import { fmtN, pct } from '~/utils/campaignAnalytics'

export interface DonutItem {
  label: string
  value: number
  /** css color value, e.g. var(--color-indigo-500) */
  color: string
  /** tailwind bg class for the legend dot */
  dot: string
}

const props = defineProps<{
  items: DonutItem[]
  centerLabel: string
}>()

const total = computed(() => props.items.reduce((s, i) => s + i.value, 0))

/** stroke-dasharray segments on a circle with circumference 100 */
const segments = computed(() => {
  let offset = 25 // start at 12 o'clock
  return props.items
    .filter(i => i.value > 0)
    .map((i) => {
      const len = (i.value / total.value) * 100
      const seg = { ...i, len, offset }
      offset -= len
      return seg
    })
})
</script>

<template>
  <div class="flex flex-col items-center gap-5">
    <div class="relative">
      <svg viewBox="0 0 42 42" class="size-44 -rotate-0" role="img" :aria-label="`${centerLabel}: ${fmtN(total)}`">
        <!-- track / empty state ring -->
        <circle
          cx="21" cy="21" r="15.9155"
          fill="none"
          stroke="var(--ui-bg-elevated)"
          stroke-width="6"
        />
        <circle
          v-for="s in segments"
          :key="s.label"
          cx="21" cy="21" r="15.9155"
          fill="none"
          :stroke="s.color"
          stroke-width="6"
          :stroke-dasharray="`${s.len} ${100 - s.len}`"
          :stroke-dashoffset="s.offset"
        />
      </svg>
      <div class="absolute inset-0 flex flex-col items-center justify-center">
        <p class="text-xl font-semibold text-highlighted tabular-nums">{{ fmtN(total) }}</p>
        <p class="text-[11px] text-muted">{{ centerLabel }}</p>
      </div>
    </div>

    <p v-if="!total" class="text-xs text-dimmed -mt-2">No data yet — share your links to start tracking.</p>

    <ul class="w-full flex flex-col gap-1.5">
      <li
        v-for="i in items"
        :key="i.label"
        class="flex items-center justify-between gap-3 text-sm"
        :class="i.value === 0 ? 'opacity-50' : ''"
      >
        <span class="flex items-center gap-2 min-w-0">
          <span class="size-2.5 rounded-full shrink-0" :class="i.dot" />
          <span class="truncate text-default">{{ i.label }}</span>
        </span>
        <span class="tabular-nums text-muted shrink-0">
          <span class="font-medium text-highlighted">{{ fmtN(i.value) }}</span>
          · {{ pct(i.value, total) }}
        </span>
      </li>
    </ul>
  </div>
</template>
