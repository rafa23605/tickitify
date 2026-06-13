<script setup lang="ts">
import { fmtN, pct } from '~/utils/campaignAnalytics'

const props = defineProps<{
  viewed: number
  initiated: number
  purchased: number
}>()

const steps = computed(() => [
  {
    label: 'Viewed',
    value: props.viewed,
    sub: 'unique visitors',
    badge: null as string | null,
    bar: 100
  },
  {
    label: 'Initiated checkout',
    value: props.initiated,
    sub: 'started buying',
    badge: pct(props.initiated, props.viewed) + ' of viewed',
    bar: props.viewed ? (props.initiated / props.viewed) * 100 : 0
  },
  {
    label: 'Purchased',
    value: props.purchased,
    sub: pct(props.purchased, props.viewed) + ' of viewed',
    badge: pct(props.purchased, props.initiated) + ' of initiated',
    bar: props.viewed ? (props.purchased / props.viewed) * 100 : 0
  }
])
</script>

<template>
  <div class="grid sm:grid-cols-3 gap-3">
    <div
      v-for="(s, i) in steps"
      :key="s.label"
      class="rounded-lg ring ring-default bg-default p-4"
    >
      <div class="flex items-center justify-between gap-2">
        <p class="text-[11px] font-semibold uppercase tracking-wide text-muted">{{ s.label }}</p>
        <UIcon v-if="i > 0" name="i-lucide-chevron-right" class="size-3.5 text-dimmed hidden sm:block -ml-6" />
        <UBadge v-if="s.badge" :label="s.badge" color="neutral" variant="subtle" size="sm" />
      </div>
      <p class="text-2xl font-semibold text-highlighted tabular-nums mt-2">{{ fmtN(s.value) }}</p>
      <p class="text-xs text-muted mt-0.5">{{ s.sub }}</p>
      <div class="h-1 rounded-full bg-elevated mt-3 overflow-hidden">
        <div
          class="h-full rounded-full bg-primary transition-all"
          :style="{ width: Math.max(s.value > 0 ? 2 : 0, s.bar) + '%' }"
        />
      </div>
    </div>
  </div>
</template>
