<script setup lang="ts">
const props = defineProps<{
  title: string
  description: string
  dateLabel: string
  venueLabel: string
  minPrice: number | null
}>()

const t = useT()

const priceLabel = computed(() =>
  props.minPrice ? t('preview.from', { n: `${props.minPrice.toLocaleString('cs-CZ')} Kč` }) : null
)
</script>

<template>
  <aside :aria-label="t('preview.ariaLabel')">
    <p class="flex items-center gap-1.5 text-xs font-semibold text-muted uppercase tracking-wide mb-3">
      <UIcon name="i-lucide-eye" class="size-3.5" />
      {{ t('preview.heading') }}
    </p>

    <UCard :ui="{ body: 'p-0 sm:p-0' }" class="overflow-hidden">
      <div class="p-4 flex flex-col gap-1.5">
        <p v-if="dateLabel" class="text-xs font-medium text-primary tabular-nums">{{ dateLabel }}</p>
        <USkeleton v-else class="h-3.5 w-28" />

        <p v-if="title" class="font-semibold text-highlighted text-[15px] leading-snug">{{ title }}</p>
        <USkeleton v-else class="h-4.5 w-3/4" />

        <p v-if="venueLabel" class="flex items-center gap-1.5 text-sm text-muted">
          <UIcon name="i-lucide-map-pin" class="size-3.5 shrink-0" />
          {{ venueLabel }}
        </p>
        <USkeleton v-else class="h-3.5 w-1/2" />

        <p v-if="description" class="text-sm text-muted line-clamp-2 mt-0.5">{{ description }}</p>

        <USeparator class="my-2.5" />

        <div class="flex items-center justify-between gap-3">
          <div>
            <p class="text-xs text-muted">{{ t('preview.tickets') }}</p>
            <p v-if="priceLabel" class="text-sm font-semibold text-highlighted tabular-nums">{{ priceLabel }}</p>
            <USkeleton v-else class="h-4 w-20 mt-0.5" />
          </div>
          <UButton :label="t('preview.buyTickets')" size="sm" color="primary" />
        </div>
      </div>
    </UCard>

    <p class="text-xs text-dimmed mt-3 leading-relaxed">
      {{ t('preview.helper') }}
    </p>
  </aside>
</template>
