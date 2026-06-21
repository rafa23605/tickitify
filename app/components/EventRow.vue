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
  note?: { k: string, n: number }
}

const props = defineProps<{ event: AdminEvent }>()
const t = useT()

const noteText = computed(() =>
  props.event.note ? t(`events.${props.event.note.k}`, { n: props.event.note.n }) : ''
)

/** a draft is an unfinished event — open it in the creation wizard, not the workspace */
const target = computed(() =>
  props.event.status === 'draft'
    ? `/events/new?draft=${props.event.slug}`
    : `/events/${props.event.slug}`
)

const badge = computed(() => {
  switch (props.event.status) {
    case 'published': return { label: t('events.status.published'), color: 'success' as const, variant: 'subtle' as const }
    case 'draft': return { label: t('events.status.draft'), color: 'neutral' as const, variant: 'subtle' as const }
    case 'completed': return { label: t('events.status.completed'), color: 'neutral' as const, variant: 'outline' as const }
    case 'cancelled': return { label: t('events.status.cancelled'), color: 'error' as const, variant: 'subtle' as const }
  }
})

const fmt = (n: number) => n.toLocaleString('cs-CZ')
</script>

<template>
  <UPageCard
    :to="target"
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
          <span v-if="event.status === 'draft' && event.note" class="text-xs text-dimmed">{{ noteText }}</span>
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
          <p class="text-sm font-medium text-primary">{{ t('events.continueSetup') }}</p>
        </template>

        <template v-else-if="event.status === 'completed'">
          <p class="text-sm font-semibold text-highlighted tabular-nums">{{ event.revenue }}</p>
        </template>

        <template v-else>
          <p class="text-sm text-muted">{{ noteText }}</p>
        </template>
      </div>

      <UIcon name="i-lucide-chevron-right" class="size-4 shrink-0 text-dimmed" />
    </div>
  </UPageCard>
</template>
