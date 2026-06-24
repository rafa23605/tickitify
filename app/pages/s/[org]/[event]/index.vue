<script setup lang="ts">
definePageMeta({ layout: 'storefront' })

const route = useRoute()
const org = computed(() => String(route.params.org))
const slug = computed(() => String(route.params.event))

const event = computed(() => STORE_EVENTS[slug.value] ?? null)
const from = computed(() => (event.value ? priceFrom(event.value) : 0))
const showFullDesc = ref(false)

const selectLink = computed(() => `/s/${org.value}/${slug.value}/select`)
const organizerLink = computed(() => `/s/${org.value}`)

useHead({ title: () => (event.value ? `${event.value.title} · Tickitify` : 'Tickitify') })
</script>

<template>
  <div v-if="event" class="pb-24">
    <!-- text hero (no event cover in PoC) -->
    <section class="px-4 pt-6">
      <div class="flex flex-wrap items-center gap-2">
        <UBadge :label="event.sport" color="primary" variant="subtle" size="sm" />
        <UBadge :label="event.ageLimit" color="neutral" variant="subtle" size="sm" />
      </div>
      <h1 class="text-2xl font-bold text-highlighted leading-tight mt-3">{{ event.title }}</h1>
      <p class="text-[15px] text-toned mt-1.5">{{ event.subtitle }}</p>
    </section>

    <!-- session: clear full date -->
    <section class="px-4 pt-5">
      <UPageCard variant="outline" :ui="{ container: 'p-4 sm:p-4' }">
        <div class="flex flex-col gap-2">
          <p class="flex items-center gap-2 text-sm font-semibold text-highlighted">
            <UIcon name="i-lucide-calendar-days" class="size-4 shrink-0 text-dimmed" />
            {{ event.dateFull }} · {{ event.time }}
          </p>
          <p class="flex items-center gap-2 text-sm text-muted">
            <UIcon name="i-lucide-map-pin" class="size-4 shrink-0 text-dimmed" />
            {{ event.venue }} · {{ event.city }}
          </p>
        </div>
      </UPageCard>
    </section>

    <!-- about -->
    <section class="px-4 pt-6">
      <h2 class="text-base font-semibold text-highlighted">O události</h2>
      <p class="text-sm text-toned mt-2 leading-relaxed" :class="{ 'line-clamp-4': !showFullDesc }">{{ event.description }}</p>
      <UButton v-if="!showFullDesc" variant="link" color="primary" class="px-0 mt-1" label="Číst více" @click="showFullDesc = true" />

      <div class="flex flex-col gap-2.5 mt-4 text-sm">
        <p class="flex items-center gap-2 text-muted">
          <UIcon name="i-lucide-clock" class="size-4 shrink-0 text-dimmed" />{{ event.durationLabel }}
        </p>
        <p class="flex items-start gap-2 text-muted">
          <UIcon name="i-lucide-map-pin" class="size-4 shrink-0 text-dimmed mt-0.5" />
          <span>{{ event.venue }}<br><span class="text-dimmed">{{ event.address }}</span></span>
        </p>
      </div>
    </section>

    <!-- organizer -->
    <section class="px-4 pt-6">
      <p class="text-[11px] font-semibold uppercase tracking-wide text-muted mb-2">Pořadatel</p>
      <UPageCard :to="organizerLink" variant="outline" :ui="{ container: 'p-3 sm:p-3' }">
        <div class="flex items-center gap-3">
          <UAvatar :text="event.organizer.avatar" />
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-highlighted truncate">{{ event.organizer.name }}</p>
            <p class="text-xs text-muted">{{ event.organizer.country }}</p>
          </div>
          <UIcon name="i-lucide-chevron-right" class="size-4 text-dimmed shrink-0" />
        </div>
      </UPageCard>
    </section>

    <!-- sticky buy bar -->
    <div class="fixed bottom-0 inset-x-0 z-40 border-t border-default bg-default/90 backdrop-blur">
      <div class="mx-auto max-w-md px-4 py-3 flex items-center gap-3">
        <div class="shrink-0">
          <p class="text-[11px] text-muted leading-none">od</p>
          <p class="text-base font-bold text-highlighted tabular-nums mt-0.5">{{ fmtCzk(from) }}</p>
        </div>
        <UButton :to="selectLink" class="flex-1 justify-center" size="lg" color="primary" label="Koupit vstupenky" />
      </div>
    </div>
  </div>

  <!-- event not available -->
  <div v-else class="px-6 py-24 text-center">
    <UIcon name="i-lucide-ticket-x" class="size-10 text-dimmed mx-auto" />
    <h1 class="text-lg font-semibold text-highlighted mt-4">Událost není dostupná</h1>
    <p class="text-sm text-muted mt-1">Tato událost neexistuje nebo už není v prodeji.</p>
  </div>
</template>
