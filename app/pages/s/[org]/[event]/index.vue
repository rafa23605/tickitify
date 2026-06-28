<script setup lang="ts">
definePageMeta({ layout: 'storefront' })

const route = useRoute()
const t = useT()
const org = computed(() => String(route.params.org))
const slug = computed(() => String(route.params.event))

const event = computed(() => STORE_EVENTS[slug.value] ?? null)
const from = computed(() => (event.value ? priceFrom(event.value) : 0))
const showFullDesc = ref(false)

const selectLink = computed(() => `/s/${org.value}/${slug.value}/select`)
const organizerLink = computed(() => `/s/${org.value}`)

/* desktop: seats are chosen inline on this page */
const selected = ref<SeatVM[]>([])
const count = computed(() => selected.value.length)
const total = computed(() => selected.value.reduce((s, x) => s + x.price, 0))
const confirm = () => {
  if (!count.value) return
  useStoreCart().value = selected.value.map(s => ({ uid: s.key, tierId: s.tierId, label: s.label, price: s.price }))
  navigateTo(`/s/${org.value}/${slug.value}/checkout`)
}
const mapEl = ref<HTMLElement>()
const scrollToMap = () => mapEl.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })

useHead({ title: () => (event.value ? `${event.value.title} · Tickitify` : 'Tickitify') })
</script>

<template>
  <div v-if="event" class="pb-24 lg:pb-28">
    <!-- hero band (no event cover in PoC — typographic) -->
    <section class="border-b border-default bg-muted/50">
      <div class="mx-auto max-w-6xl px-4 py-6 lg:py-12">
        <div class="flex flex-wrap items-center gap-2">
          <UBadge :label="event.sport" color="primary" variant="subtle" size="sm" />
          <UBadge :label="event.ageLimit" color="neutral" variant="subtle" size="sm" />
        </div>

        <div class="lg:flex lg:items-end lg:justify-between lg:gap-10 mt-3">
          <div class="lg:max-w-3xl">
            <h1 class="text-2xl lg:text-5xl font-bold text-highlighted leading-tight">{{ event.title }}</h1>
            <p class="text-[15px] lg:text-xl text-toned mt-1.5 lg:mt-3">{{ event.subtitle }}</p>

            <div class="hidden lg:flex flex-wrap items-center gap-x-6 gap-y-2 mt-5 text-sm text-muted">
              <span class="flex items-center gap-2"><UIcon name="i-lucide-calendar-days" class="size-4 text-dimmed" />{{ event.dateFull }} · {{ event.time }}</span>
              <span class="flex items-center gap-2"><UIcon name="i-lucide-map-pin" class="size-4 text-dimmed" />{{ event.venue }} · {{ event.city }}</span>
              <span class="flex items-center gap-2"><UIcon name="i-lucide-clock" class="size-4 text-dimmed" />{{ event.durationLabel }}</span>
            </div>
          </div>

          <!-- desktop price + CTA -->
          <div class="hidden lg:flex flex-col items-end gap-3 shrink-0">
            <div class="text-right">
              <p class="text-xs text-muted leading-none">{{ t('store.event.from') }}</p>
              <p class="text-3xl font-bold text-highlighted tabular-nums mt-1">{{ fmtCzk(from) }}</p>
            </div>
            <UButton size="xl" color="primary" :label="t('store.event.buy')" @click="scrollToMap" />
          </div>
        </div>
      </div>
    </section>

    <!-- desktop: embedded seat map -->
    <section ref="mapEl" class="hidden lg:block border-b border-default scroll-mt-16">
      <div class="mx-auto max-w-6xl px-4 py-12">
        <div class="text-center">
          <h2 class="text-xl font-bold text-highlighted">{{ t('store.select.title') }}</h2>
          <div class="mt-3 inline-flex items-center gap-1.5 rounded-full ring ring-primary bg-primary/10 px-3 py-1 text-sm font-medium text-toned">
            <UIcon name="i-lucide-calendar-days" class="size-3.5 text-primary" />
            {{ event.dateFull }} · {{ event.time }}
          </div>
          <p class="text-xs text-muted mt-3">{{ t('store.select.hint') }}</p>
        </div>
        <div class="mt-8 mx-auto max-w-3xl rounded-2xl ring ring-default bg-default p-8">
          <StoreSeatMap v-model="selected" />
        </div>
      </div>
    </section>

    <!-- mobile: session card -->
    <section class="lg:hidden px-4 pt-5">
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

    <!-- about + address -->
    <section class="mx-auto max-w-6xl px-4 pt-6 lg:py-12 lg:grid lg:grid-cols-2 lg:gap-12">
      <div>
        <h2 class="text-base lg:text-lg font-semibold text-highlighted">{{ t('store.event.about') }}</h2>
        <p class="text-sm lg:text-[15px] text-toned mt-2 leading-relaxed" :class="{ 'line-clamp-4 lg:line-clamp-none': !showFullDesc }">{{ event.description }}</p>
        <UButton v-if="!showFullDesc" variant="link" color="primary" class="px-0 mt-1 lg:hidden" :label="t('store.event.readMore')" @click="showFullDesc = true" />
        <div class="flex items-center gap-2 mt-4 text-sm text-muted">
          <UIcon name="i-lucide-clock" class="size-4 shrink-0 text-dimmed" />{{ event.durationLabel }}
        </div>
      </div>

      <div class="mt-6 lg:mt-0">
        <h2 class="text-base lg:text-lg font-semibold text-highlighted">{{ t('store.event.address') }}</h2>
        <p class="text-sm text-toned mt-2">{{ event.venue }}</p>
        <p class="text-sm text-muted">{{ event.address }}</p>
        <div class="mt-4 aspect-[16/10] lg:aspect-[16/9] rounded-xl ring ring-default bg-muted flex items-center justify-center">
          <span class="flex items-center gap-2 text-sm text-dimmed"><UIcon name="i-lucide-map" class="size-5" /> {{ event.city }}</span>
        </div>
      </div>
    </section>

    <!-- organizer -->
    <section class="mx-auto max-w-6xl px-4 pt-6 lg:pb-8">
      <p class="text-[11px] font-semibold uppercase tracking-wide text-muted mb-2">{{ t('store.event.organizer') }}</p>
      <UPageCard :to="organizerLink" variant="outline" class="lg:max-w-md" :ui="{ container: 'p-3 sm:p-3' }">
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

    <!-- mobile: sticky buy bar → seat-selection page -->
    <div class="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-default bg-default/90 backdrop-blur">
      <div class="mx-auto max-w-md px-4 py-3 flex items-center gap-3">
        <div class="shrink-0">
          <p class="text-[11px] text-muted leading-none">{{ t('store.event.from') }}</p>
          <p class="text-base font-bold text-highlighted tabular-nums mt-0.5">{{ fmtCzk(from) }}</p>
        </div>
        <UButton :to="selectLink" class="flex-1 justify-center" size="lg" color="primary" :label="t('store.event.buy')" />
      </div>
    </div>

    <!-- desktop: action bar appears once seats are picked -->
    <Transition name="slide-up">
      <div v-if="count" class="hidden lg:block fixed bottom-0 inset-x-0 z-40 border-t border-default bg-default/90 backdrop-blur">
        <div class="mx-auto max-w-6xl px-4 py-4 flex items-center gap-4">
          <div class="flex-1 min-w-0 flex flex-wrap items-center gap-x-2 gap-y-1">
            <span class="text-sm font-semibold text-highlighted">{{ count }} {{ t('store.select.pcs') }}</span>
            <span class="text-sm text-dimmed">·</span>
            <span class="text-sm text-muted truncate">{{ selected.map(s => s.label).join(', ') }}</span>
          </div>
          <p class="text-lg font-bold text-highlighted tabular-nums shrink-0">{{ fmtCzk(total) }}</p>
          <UButton size="lg" color="primary" class="shrink-0" :label="t('store.select.continue')" @click="confirm" />
        </div>
      </div>
    </Transition>
  </div>

  <!-- event not available -->
  <div v-else class="mx-auto max-w-md px-6 py-24 text-center">
    <UIcon name="i-lucide-ticket-x" class="size-10 text-dimmed mx-auto" />
    <h1 class="text-lg font-semibold text-highlighted mt-4">{{ t('store.event.naTitle') }}</h1>
    <p class="text-sm text-muted mt-1">{{ t('store.event.naDesc') }}</p>
  </div>
</template>

<style scoped>
.slide-up-enter-active, .slide-up-leave-active { transition: transform 0.25s ease, opacity 0.25s ease; }
.slide-up-enter-from, .slide-up-leave-to { transform: translateY(100%); opacity: 0; }
</style>
