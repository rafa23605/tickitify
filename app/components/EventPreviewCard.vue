<script setup lang="ts">
const props = defineProps<{
  title: string
  dateLabel: string
  venueLabel: string
  coverUrl: string | null
  minPrice: number | null
}>()

const priceLabel = computed(() =>
  props.minPrice ? `from ${props.minPrice.toLocaleString('cs-CZ')} Kč` : null
)
</script>

<template>
  <aside aria-label="Storefront preview">
    <p class="flex items-center gap-1.5 text-xs font-semibold text-muted uppercase tracking-wide mb-3">
      <UIcon name="i-lucide-eye" class="size-3.5" />
      Storefront preview
    </p>

    <UCard :ui="{ body: 'p-0 sm:p-0' }" class="overflow-hidden">
      <!-- cover -->
      <div class="aspect-video bg-elevated relative">
        <img
          v-if="coverUrl"
          :src="coverUrl"
          alt=""
          class="absolute inset-0 size-full object-cover"
        >
        <div v-else class="absolute inset-0 flex flex-col items-center justify-center gap-2 text-dimmed">
          <UIcon name="i-lucide-image" class="size-6" />
          <span class="text-xs">Cover appears when you pick a venue</span>
        </div>
      </div>

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

        <USeparator class="my-2.5" />

        <div class="flex items-center justify-between gap-3">
          <div>
            <p class="text-xs text-muted">Tickets</p>
            <p v-if="priceLabel" class="text-sm font-semibold text-highlighted tabular-nums">{{ priceLabel }}</p>
            <USkeleton v-else class="h-4 w-20 mt-0.5" />
          </div>
          <UButton label="Buy tickets" size="sm" color="primary" />
        </div>
      </div>
    </UCard>

    <p class="text-xs text-dimmed mt-3 leading-relaxed">
      Approximate look of your event card for buyers. The final storefront design is a separate screen.
    </p>
  </aside>
</template>
