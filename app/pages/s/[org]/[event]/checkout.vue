<script setup lang="ts">
definePageMeta({ layout: 'storefront' })

const route = useRoute()
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
    title: 'Přesměrování na platbu',
    description: 'Bezpečnou platbu zpracuje Stripe.',
    icon: 'i-lucide-lock',
    color: 'primary'
  })
  navigateTo(`/s/${org.value}/${slug.value}/done`)
}

useHead({ title: () => (event.value ? `Pokladna · ${event.value.title}` : 'Pokladna') })
</script>

<template>
  <!-- empty cart -->
  <div v-if="items.length === 0" class="px-6 py-24 text-center">
    <UIcon name="i-lucide-shopping-cart" class="size-10 text-dimmed mx-auto" />
    <h1 class="text-lg font-semibold text-highlighted mt-4">Košík je prázdný</h1>
    <p class="text-sm text-muted mt-1">Zatím nemáte vybrané žádné vstupenky.</p>
    <UButton :to="eventLink" class="mt-5" color="primary" label="Zpět na událost" />
  </div>

  <div v-else-if="event" class="pb-24">
    <!-- back row -->
    <div class="px-4 pt-4">
      <NuxtLink :to="selectLink" class="inline-flex items-center gap-1 text-sm font-medium text-muted hover:text-highlighted transition-colors">
        <UIcon name="i-lucide-chevron-left" class="size-4" />
        Pokladna
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
              <p v-if="item.sublabel" class="text-xs text-dimmed">{{ item.sublabel }}</p>
            </div>
            <span class="text-highlighted tabular-nums shrink-0">{{ fmtCzk(item.price) }}</span>
          </div>
        </div>

        <USeparator class="my-4" />

        <div class="flex flex-col gap-2 text-sm">
          <div class="flex items-center justify-between">
            <span class="text-muted">Mezisoučet</span>
            <span class="text-toned tabular-nums">{{ fmtCzk(cartSubtotal(items)) }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-muted">Servisní poplatek</span>
            <span class="text-toned tabular-nums">{{ fmtCzk(cartFee(items)) }}</span>
          </div>
        </div>

        <USeparator class="my-4" />

        <div class="flex items-center justify-between">
          <span class="text-sm font-semibold text-highlighted">Celkem</span>
          <span class="text-base font-bold text-highlighted tabular-nums">{{ fmtCzk(cartTotal(items)) }}</span>
        </div>
      </UPageCard>
    </section>

    <!-- buyer form -->
    <section class="px-4 pt-6">
      <h2 class="text-base font-semibold text-highlighted">Kupující</h2>
      <div class="flex flex-col gap-4 mt-3">
        <UFormField label="Jméno" required>
          <UInput v-model="buyer.firstName" class="w-full" placeholder="Jan" autocomplete="given-name" />
        </UFormField>
        <UFormField label="Příjmení" required>
          <UInput v-model="buyer.lastName" class="w-full" placeholder="Novák" autocomplete="family-name" />
        </UFormField>
        <UFormField label="E-mail" required :error="buyer.email && !emailValid ? 'Zadejte platný e-mail.' : undefined">
          <UInput v-model="buyer.email" type="email" class="w-full" placeholder="jan@email.cz" autocomplete="email" />
        </UFormField>
        <UFormField label="Telefon" required>
          <UInput v-model="buyer.phone" type="tel" class="w-full" placeholder="+420 777 123 456" autocomplete="tel" />
        </UFormField>
      </div>

      <p class="text-xs text-muted mt-3">
        Po nákupu vám automaticky vytvoříme účet — přihlášení proběhne odkazem zaslaným na e-mail.
      </p>

      <div class="mt-4">
        <UCheckbox v-model="consent" required label="Souhlasím s obchodními podmínkami a zpracováním osobních údajů." />
      </div>
    </section>

    <!-- sticky pay bar -->
    <div class="fixed bottom-0 inset-x-0 z-40 border-t border-default bg-default/90 backdrop-blur">
      <div class="mx-auto max-w-md px-4 py-3">
        <UButton
          block
          size="lg"
          color="primary"
          :disabled="!canPay"
          :label="`Zaplatit ${fmtCzk(cartTotal(items))}`"
          @click="pay"
        />
        <p class="text-xs text-muted text-center mt-2">Platbu zpracovává Stripe.</p>
      </div>
    </div>
  </div>
</template>
