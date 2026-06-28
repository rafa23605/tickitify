<script setup lang="ts">
definePageMeta({ layout: 'storefront' })

const route = useRoute()
const t = useT()
const org = computed(() => String(route.params.org))

useHead({ title: () => `${ORGANIZER.name} · Tickitify` })
</script>

<template>
  <div class="pb-12">
    <!-- cover + overlapping avatar -->
    <img :src="ORGANIZER.cover" alt="" class="w-full aspect-[16/7] lg:aspect-[16/5] object-cover">

    <div class="mx-auto max-w-5xl px-4">
      <section>
        <UAvatar
          :text="ORGANIZER.avatar"
          size="2xl"
          class="-mt-10 ring-4 ring-default"
        />
        <h1 class="text-xl lg:text-3xl font-bold text-highlighted mt-3">{{ ORGANIZER.name }}</h1>
        <div class="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-1.5">
          <span class="flex items-center gap-1.5 text-sm text-muted">
            <UIcon name="i-lucide-map-pin" class="size-4 shrink-0 text-dimmed" />
            {{ ORGANIZER.city }}, {{ ORGANIZER.country }}
          </span>
          <UBadge :label="t('store.organizer.eventsCount', { n: ORGANIZER.eventsCount })" color="neutral" variant="subtle" size="sm" />
        </div>
        <p class="text-sm lg:text-[15px] text-toned mt-3 leading-relaxed lg:max-w-3xl">{{ ORGANIZER.bio }}</p>
      </section>

      <!-- upcoming events -->
      <section class="pt-7 lg:pt-10">
        <h2 class="text-base lg:text-lg font-semibold text-highlighted">{{ t('store.organizer.upcoming') }}</h2>
        <div class="grid gap-4 mt-4 sm:grid-cols-2 lg:grid-cols-3">
          <UPageCard
            v-for="(ev, i) in ORG_EVENTS"
            :key="ev.slug"
            :to="`/s/${org}/${ev.slug}`"
            variant="outline"
            :ui="{ container: 'p-4 sm:p-4 gap-0' }"
          >
            <div class="flex items-start gap-2">
              <p class="font-semibold text-highlighted flex-1 leading-snug">{{ ev.title }}</p>
              <UBadge v-if="i === 0" :label="t('store.organizer.nearest')" color="primary" variant="subtle" size="sm" class="shrink-0" />
            </div>
            <p class="flex items-center gap-1.5 text-sm text-muted mt-2">
              <UIcon name="i-lucide-calendar-days" class="size-3.5 shrink-0 text-dimmed" />
              {{ ev.dateFull }} · {{ ev.time }}
            </p>
            <p class="flex items-center gap-1.5 text-sm text-muted mt-0.5">
              <UIcon name="i-lucide-map-pin" class="size-3.5 shrink-0 text-dimmed" />
              {{ ev.venue }} · {{ ev.city }}
            </p>
            <div class="flex items-center justify-between mt-3 pt-3 border-t border-default">
              <span class="text-sm font-semibold text-highlighted tabular-nums">{{ t('store.event.from') }} {{ fmtCzk(ev.priceFrom) }}</span>
              <span class="flex items-center gap-1 text-sm text-primary font-medium">{{ t('store.organizer.buy') }} <UIcon name="i-lucide-chevron-right" class="size-4" /></span>
            </div>
          </UPageCard>
        </div>
      </section>
    </div>
  </div>
</template>
