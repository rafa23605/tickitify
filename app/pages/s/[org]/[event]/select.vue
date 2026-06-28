<script setup lang="ts">
definePageMeta({ layout: 'storefront' })

const route = useRoute()
const t = useT()
const org = computed(() => String(route.params.org))
const slug = computed(() => String(route.params.event))
const event = computed(() => STORE_EVENTS[slug.value] ?? null)
const eventLink = computed(() => `/s/${org.value}/${slug.value}`)

useHead({ title: () => 'Výběr míst · Tickitify' })

const selected = ref<SeatVM[]>([])
const count = computed(() => selected.value.length)
const total = computed(() => selected.value.reduce((s, x) => s + x.price, 0))

const confirm = () => {
  if (!count.value) return
  useStoreCart().value = selected.value.map(s => ({ uid: s.key, tierId: s.tierId, label: s.label, price: s.price }))
  navigateTo(`/s/${org.value}/${slug.value}/checkout`)
}
</script>

<template>
  <div v-if="event" class="mx-auto max-w-md lg:max-w-2xl pb-24">
    <!-- back row -->
    <div class="sticky top-14 z-30 bg-default/90 backdrop-blur border-b border-default">
      <div class="px-4 py-2.5 flex items-center gap-2">
        <UButton :to="eventLink" icon="i-lucide-chevron-left" color="neutral" variant="ghost" size="sm" square :aria-label="t('store.back')" class="shrink-0" />
        <p class="text-sm font-semibold text-highlighted truncate">{{ event.title }}</p>
      </div>
    </div>

    <p class="px-4 pt-4 text-xs text-muted text-center">{{ t('store.select.hint') }}</p>

    <div class="px-4 pt-4">
      <StoreSeatMap v-model="selected" />
    </div>

    <!-- sticky bottom bar -->
    <div class="fixed bottom-0 inset-x-0 z-40 border-t border-default bg-default/90 backdrop-blur">
      <div class="mx-auto max-w-md lg:max-w-2xl px-4 py-3 flex items-center gap-3">
        <div class="shrink-0">
          <p class="text-[11px] text-muted leading-none">{{ count }} {{ t('store.select.pcs') }}</p>
          <p class="text-base font-bold text-highlighted tabular-nums mt-0.5">{{ fmtCzk(total) }}</p>
        </div>
        <UButton class="flex-1 justify-center" size="lg" color="primary" :label="t('store.select.continue')" :disabled="!count" @click="confirm" />
      </div>
    </div>
  </div>

  <div v-else class="px-6 py-24 text-center">
    <UIcon name="i-lucide-ticket-x" class="size-10 text-dimmed mx-auto" />
    <h1 class="text-lg font-semibold text-highlighted mt-4">{{ t('store.select.naTitle') }}</h1>
  </div>
</template>
