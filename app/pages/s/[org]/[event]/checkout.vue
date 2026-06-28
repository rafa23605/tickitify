<script setup lang="ts">
definePageMeta({ layout: 'storefront' })

const route = useRoute()
const t = useT()
const org = computed(() => String(route.params.org))
const slug = computed(() => String(route.params.event))

const event = computed(() => STORE_EVENTS[slug.value] ?? null)
const items = useStoreCart()
const buyer = useStoreBuyer()
const consent = ref(false)

const eventLink = computed(() => `/s/${org.value}/${slug.value}`)
const selectLink = computed(() => `/s/${org.value}/${slug.value}/select`)

const emailValid = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(buyer.value.email.trim()))
const canPay = computed(() =>
  !!buyer.value.firstName.trim()
  && !!buyer.value.lastName.trim()
  && emailValid.value
  && !!buyer.value.phone.trim()
  && consent.value
)

const toast = useToast()
function pay() {
  if (!canPay.value) return
  toast.add({
    title: t('store.checkout.payToastTitle'),
    description: t('store.checkout.payToastDesc'),
    icon: 'i-lucide-lock',
    color: 'primary'
  })
  navigateTo(`/s/${org.value}/${slug.value}/done`)
}

useHead({ title: () => (event.value ? `${t('store.checkout.title')} · ${event.value.title}` : t('store.checkout.title')) })
</script>

<template>
  <!-- empty cart -->
  <div v-if="items.length === 0" class="mx-auto max-w-md px-6 py-24 text-center">
    <UIcon name="i-lucide-shopping-cart" class="size-10 text-dimmed mx-auto" />
    <h1 class="text-lg font-semibold text-highlighted mt-4">{{ t('store.checkout.emptyTitle') }}</h1>
    <p class="text-sm text-muted mt-1">{{ t('store.checkout.emptyDesc') }}</p>
    <UButton :to="eventLink" class="mt-5" color="primary" :label="t('store.checkout.backToEvent')" />
  </div>

  <div v-else-if="event" class="mx-auto max-w-md lg:max-w-2xl pb-24">
    <!-- back row -->
    <div class="px-4 pt-4">
      <NuxtLink :to="selectLink" class="inline-flex items-center gap-1 text-sm font-medium text-muted hover:text-highlighted transition-colors">
        <UIcon name="i-lucide-chevron-left" class="size-4" />
        {{ t('store.checkout.title') }}
      </NuxtLink>
    </div>

    <!-- order summary -->
    <section class="px-4 pt-4">
      <UPageCard variant="outline" :ui="{ container: 'p-4 sm:p-4' }">
        <p class="text-sm font-semibold text-highlighted">{{ event.title }}</p>
        <p class="text-xs text-muted mt-0.5">
          {{ event.dateFull }} · {{ event.time }} · {{ event.venue }}
        </p>

        <div class="flex flex-col gap-2 mt-4">
          <div v-for="item in items" :key="item.uid" class="flex items-start justify-between gap-3 text-sm">
            <div class="min-w-0">
              <p class="text-toned">{{ item.label }}</p>
            </div>
            <span class="text-highlighted tabular-nums shrink-0">{{ fmtCzk(item.price) }}</span>
          </div>
        </div>

        <USeparator class="my-4" />

        <div class="flex flex-col gap-2 text-sm">
          <div class="flex items-center justify-between">
            <span class="text-muted">{{ t('store.checkout.subtotal') }}</span>
            <span class="text-toned tabular-nums">{{ fmtCzk(cartSubtotal(items)) }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-muted">{{ t('store.checkout.fee') }}</span>
            <span class="text-toned tabular-nums">{{ fmtCzk(cartFee(items)) }}</span>
          </div>
        </div>

        <USeparator class="my-4" />

        <div class="flex items-center justify-between">
          <span class="text-sm font-semibold text-highlighted">{{ t('store.checkout.total') }}</span>
          <span class="text-base font-bold text-highlighted tabular-nums">{{ fmtCzk(cartTotal(items)) }}</span>
        </div>
      </UPageCard>
    </section>

    <!-- buyer form -->
    <section class="px-4 pt-6">
      <h2 class="text-base font-semibold text-highlighted">{{ t('store.checkout.buyer') }}</h2>
      <div class="flex flex-col gap-4 mt-3">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <UFormField :label="t('store.checkout.firstName')" required>
            <UInput v-model="buyer.firstName" class="w-full" placeholder="Jan" autocomplete="given-name" />
          </UFormField>
          <UFormField :label="t('store.checkout.lastName')" required>
            <UInput v-model="buyer.lastName" class="w-full" placeholder="Novák" autocomplete="family-name" />
          </UFormField>
        </div>
        <UFormField :label="t('store.checkout.email')" required :error="buyer.email && !emailValid ? t('store.checkout.emailErr') : undefined">
          <UInput v-model="buyer.email" type="email" class="w-full" placeholder="jan@email.cz" autocomplete="email" />
        </UFormField>
        <UFormField :label="t('store.checkout.phone')" required>
          <UInput v-model="buyer.phone" type="tel" class="w-full" placeholder="+420 777 123 456" autocomplete="tel" />
        </UFormField>
      </div>

      <p class="text-xs text-muted mt-3">{{ t('store.checkout.accountNote') }}</p>

      <div class="mt-4">
        <UCheckbox v-model="consent" required :label="t('store.checkout.consent')" />
      </div>
    </section>

    <!-- sticky pay bar -->
    <div class="fixed bottom-0 inset-x-0 z-40 border-t border-default bg-default/90 backdrop-blur">
      <div class="mx-auto max-w-md lg:max-w-2xl px-4 py-3">
        <UButton
          block
          size="lg"
          color="primary"
          :disabled="!canPay"
          :label="`${t('store.checkout.pay')} ${fmtCzk(cartTotal(items))}`"
          @click="pay"
        />
        <p class="text-xs text-muted text-center mt-2">{{ t('store.checkout.stripeNote') }}</p>
      </div>
    </div>
  </div>
</template>
