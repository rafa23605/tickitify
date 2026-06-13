<script setup lang="ts">
export interface AdminEvent {
  slug: string
  title: string
  venue: string
  city: string
  day: string
  month: string
  weekday: string
  time: string
  status: 'published' | 'draft' | 'completed' | 'cancelled'
  sold?: number
  capacity?: number
  revenue?: string
  note?: string
}

const props = defineProps<{ event: AdminEvent }>()

const soldOut = computed(
  () =>
    props.event.status === 'published'
    && props.event.sold !== undefined
    && props.event.capacity !== undefined
    && props.event.sold >= props.event.capacity
)

const badge = computed(() => {
  if (soldOut.value) return { label: 'Sold out', color: 'primary' as const, variant: 'subtle' as const }
  switch (props.event.status) {
    case 'published': return { label: 'On sale', color: 'success' as const, variant: 'subtle' as const }
    case 'draft': return { label: 'Draft', color: 'neutral' as const, variant: 'subtle' as const }
    case 'completed': return { label: 'Completed', color: 'neutral' as const, variant: 'outline' as const }
    case 'cancelled': return { label: 'Cancelled', color: 'error' as const, variant: 'subtle' as const }
  }
})

const fmt = (n: number) => n.toLocaleString('cs-CZ')
</script>

<template>
  <UPageCard
    :to="`/events/${event.slug}`"
    variant="outline"
    :ui="{ container: 'p-4 sm:p-4' }"
    :class="(event.status === 'completed' || event.status === 'cancelled') ? 'opacity-75' : ''"
  >
    <div class="flex items-center gap-4 sm:gap-5 w-full">
      <!-- date -->
      <div class="w-12 shrink-0 text-center">
        <p class="text-2xl font-semibold text-highlighted tabular-nums leading-none">{{ event.day }}</p>
        <p class="text-xs font-medium text-muted uppercase mt-1">{{ event.month }}</p>
      </div>

      <USeparator orientation="vertical" class="h-10" />

      <!-- main -->
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2.5">
          <UBadge v-bind="badge" size="sm" />
          <span v-if="event.status === 'draft' && event.note" class="text-xs text-dimmed">{{ event.note }}</span>
        </div>
        <p class="text-[15px] font-semibold text-highlighted truncate mt-1.5">{{ event.title }}</p>
        <p class="flex items-center gap-1.5 text-sm text-muted truncate mt-0.5">
          <UIcon name="i-lucide-map-pin" class="size-3.5 shrink-0 text-dimmed" />
          {{ event.venue }} · {{ event.city }}
          <span class="text-dimmed">· {{ event.weekday }} {{ event.time }}</span>
        </p>
      </div>

      <!-- stats -->
      <div class="hidden sm:flex flex-col items-end gap-1 w-44 shrink-0">
        <template v-if="event.status === 'published'">
          <p class="text-sm tabular-nums">
            <span class="font-medium text-highlighted">{{ fmt(event.sold ?? 0) }}</span>
            <span class="text-muted"> / {{ fmt(event.capacity ?? 0) }}</span>
          </p>
          <UProgress :model-value="event.sold" :max="event.capacity" size="sm" class="w-36" />
          <p class="text-sm font-semibold text-highlighted tabular-nums mt-0.5">{{ event.revenue }}</p>
        </template>

        <template v-else-if="event.status === 'draft'">
          <p class="flex items-center gap-1 text-sm font-medium text-primary">
            Continue setup
            <UIcon name="i-lucide-arrow-right" class="size-4" />
          </p>
        </template>

        <template v-else-if="event.status === 'completed'">
          <p class="text-sm font-semibold text-highlighted tabular-nums">{{ event.revenue }}</p>
          <p class="flex items-center gap-1 text-xs text-success">
            <UIcon name="i-lucide-check" class="size-3.5" />
            {{ event.note }}
          </p>
        </template>

        <template v-else>
          <p class="text-sm text-muted">{{ event.note }}</p>
        </template>
      </div>

      <UIcon name="i-lucide-chevron-right" class="size-4 shrink-0 text-dimmed" />
    </div>
  </UPageCard>
</template>
