<script setup lang="ts">
definePageMeta({ layout: 'storefront' })

const route = useRoute()
const t = useT()
const org = computed(() => String(route.params.org))
const slug = computed(() => String(route.params.event))

// capture BEFORE clearing
const cart = useStoreCart()
const buyerRef = useStoreBuyer()
const items = ref<CartItem[]>([...cart.value])
const buyer = { ...buyerRef.value }
const event = STORE_EVENTS[slug.value]
const paid = cartTotal(items.value)

const eventLink = computed(() => `/s/${org.value}/${slug.value}`)
const organizerLink = computed(() => `/s/${org.value}`)

onMounted(() => {
  cart.value = []
})

useHead({ title: () => `${t('store.done.confirmed')} · Tickitify` })
</script>

<template>
  <!-- direct visit / no order -->
  <div v-if="items.length === 0" class="px-6 py-24 text-center">
    <UIcon name="i-lucide-ticket-x" class="size-10 text-dimmed mx-auto" />
    <h1 class="text-lg font-semibold text-highlighted mt-4">{{ t('store.done.noTitle') }}</h1>
    <p class="text-sm text-muted mt-1">{{ t('store.done.noDesc') }}</p>
    <UButton :to="eventLink" class="mt-6" color="primary" :label="t('store.done.backToEvent')" />
  </div>

  <!-- confirmation -->
  <div v-else class="px-4 pt-10 pb-12">
    <div class="text-center">
      <UIcon name="i-lucide-circle-check" class="size-12 text-success mx-auto" />
      <h1 class="text-xl font-bold text-highlighted mt-4">{{ t('store.done.confirmed') }}</h1>
      <p class="text-sm text-muted mt-1.5">
        {{ t('store.done.emailedTo') }} <span class="text-toned font-medium">{{ buyer.email }}</span>.
      </p>
    </div>

    <!-- recap -->
    <UPageCard variant="outline" class="mt-8" :ui="{ container: 'p-4 sm:p-4' }">
      <p class="text-sm font-semibold text-highlighted">{{ event?.title }}</p>
      <p v-if="event" class="text-xs text-muted mt-0.5">
        {{ event.dateFull }} · {{ event.time }} · {{ event.venue }}
      </p>

      <USeparator class="my-3" />

      <ul class="flex flex-col gap-2">
        <li v-for="i in items" :key="i.uid" class="flex items-start justify-between gap-3 text-sm">
          <div class="min-w-0">
            <p class="text-toned truncate">{{ i.label }}</p>
          </div>
          <span class="text-muted tabular-nums shrink-0">{{ fmtCzk(i.price) }}</span>
        </li>
      </ul>

      <USeparator class="my-3" />

      <div class="flex items-center justify-between">
        <span class="text-sm text-muted">{{ t('store.done.total') }}</span>
        <span class="text-base font-bold text-highlighted tabular-nums">{{ fmtCzk(paid) }}</span>
      </div>
    </UPageCard>

    <UAlert
      class="mt-6"
      color="info"
      variant="subtle"
      icon="i-lucide-mail"
      :title="t('store.done.mailAlert')"
    />

    <div class="flex flex-col gap-2.5 mt-8">
      <UButton :to="eventLink" block size="lg" color="primary" :label="t('store.done.backToEvent')" />
      <UButton :to="organizerLink" block size="lg" variant="subtle" :label="t('store.done.organizerPage')" />
    </div>
  </div>
</template>
