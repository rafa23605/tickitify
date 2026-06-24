<script setup lang="ts">
definePageMeta({ layout: 'storefront' })

const route = useRoute()
const org = computed(() => String(route.params.org))
const toast = useToast()

const user = reactive({ ...STORE_USER })
const orders = USER_ORDERS

/* ——— tickets filter ——— */
const ticketTab = ref<'upcoming' | 'past'>('upcoming')
const ticketTabs = computed(() => [
  { label: 'Nadcházející', value: 'upcoming', badge: orders.filter(o => o.status === 'upcoming').length },
  { label: 'Proběhlé', value: 'past', badge: orders.filter(o => o.status === 'past').length }
])
const visibleOrders = computed(() => orders.filter(o => o.status === ticketTab.value))

/* ——— personal data edit ——— */
const editing = ref(false)
const form = reactive({ firstName: '', lastName: '', email: '', phone: '' })
const startEdit = () => {
  Object.assign(form, { firstName: user.firstName, lastName: user.lastName, email: user.email, phone: user.phone })
  editing.value = true
}
const saveEdit = () => {
  Object.assign(user, form)
  editing.value = false
  toast.add({ title: 'Údaje uloženy', icon: 'i-lucide-check-circle', color: 'success' })
}
const personalRows = computed(() => [
  { label: 'Jméno', value: user.firstName },
  { label: 'Příjmení', value: user.lastName },
  { label: 'E-mail', value: user.email },
  { label: 'Telefon', value: user.phone }
])

const marketing = ref(true)

const ticketModal = ref(false)
const activeOrder = ref<UserOrder | null>(null)
const showTickets = (o: UserOrder) => { activeOrder.value = o; ticketModal.value = true }

const exportData = () => toast.add({ title: 'Export dat', description: 'Vaše data připravíme a pošleme na e-mail.', icon: 'i-lucide-download', color: 'neutral' })
const deleteAccount = () => toast.add({ title: 'Smazání účtu', description: 'Pošleme potvrzovací odkaz na e-mail.', icon: 'i-lucide-trash-2', color: 'error' })
const signOut = () => navigateTo(`/s/${org.value}/login`)

useHead({ title: 'Můj účet · Tickitify' })
</script>

<template>
  <div class="px-4 py-6 pb-10">
    <!-- profile header -->
    <div class="flex items-center gap-3">
      <UAvatar :text="user.avatar" size="xl" />
      <div class="min-w-0">
        <p class="text-lg font-bold text-highlighted truncate">{{ user.firstName }} {{ user.lastName }}</p>
        <p class="text-sm text-muted truncate">{{ user.email }}</p>
      </div>
    </div>

    <!-- my tickets -->
    <section class="mt-7">
      <h2 class="text-base font-semibold text-highlighted">Moje vstupenky</h2>
      <UTabs v-model="ticketTab" :items="ticketTabs" :content="false" color="primary" variant="pill" size="sm" class="mt-3" />

      <div class="flex flex-col gap-3 mt-4">
        <UPageCard v-for="o in visibleOrders" :key="o.id" variant="outline" :ui="{ container: 'p-4 sm:p-4' }">
          <p class="text-sm font-semibold text-highlighted">{{ o.eventTitle }}</p>
          <p class="text-xs text-muted mt-0.5">{{ o.dateFull }} · {{ o.time }} · {{ o.venue }}</p>
          <p class="text-xs text-muted mt-2">{{ o.seats.join(' · ') }}</p>
          <div class="flex items-center justify-between mt-3">
            <span class="text-sm font-semibold text-highlighted tabular-nums">{{ fmtCzk(o.total) }}</span>
            <UButton
              v-if="o.status === 'upcoming'"
              label="Zobrazit vstupenky"
              icon="i-lucide-qr-code"
              color="primary"
              variant="subtle"
              size="sm"
              @click="showTickets(o)"
            />
            <span v-else class="text-xs text-dimmed">{{ o.id }}</span>
          </div>
        </UPageCard>

        <UPageCard v-if="!visibleOrders.length" variant="subtle" :ui="{ container: 'py-8 sm:py-8' }">
          <p class="text-sm text-muted text-center">{{ ticketTab === 'upcoming' ? 'Žádné nadcházející vstupenky.' : 'Žádné proběhlé události.' }}</p>
        </UPageCard>
      </div>
    </section>

    <!-- personal data -->
    <section class="mt-7">
      <div class="flex items-center justify-between">
        <h2 class="text-base font-semibold text-highlighted">Osobní údaje</h2>
        <UButton v-if="!editing" label="Upravit" icon="i-lucide-pencil" color="neutral" variant="ghost" size="xs" @click="startEdit" />
      </div>

      <UPageCard v-if="!editing" variant="outline" class="mt-3 overflow-hidden" :ui="{ container: 'p-0 sm:p-0' }">
        <dl class="divide-y divide-default">
          <div v-for="row in personalRows" :key="row.label" class="flex items-center justify-between gap-4 px-4 py-3">
            <dt class="text-sm text-muted">{{ row.label }}</dt>
            <dd class="text-sm font-medium text-highlighted text-right truncate">{{ row.value }}</dd>
          </div>
        </dl>
      </UPageCard>

      <div v-else class="mt-3 flex flex-col gap-3">
        <div class="grid grid-cols-2 gap-3">
          <UFormField label="Jméno"><UInput v-model="form.firstName" class="w-full" /></UFormField>
          <UFormField label="Příjmení"><UInput v-model="form.lastName" class="w-full" /></UFormField>
        </div>
        <UFormField label="E-mail"><UInput v-model="form.email" type="email" class="w-full" /></UFormField>
        <UFormField label="Telefon"><UInput v-model="form.phone" class="w-full" /></UFormField>
        <div class="flex gap-2 mt-1">
          <UButton label="Uložit" icon="i-lucide-check" color="primary" @click="saveEdit" />
          <UButton label="Zrušit" color="neutral" variant="ghost" @click="editing = false" />
        </div>
      </div>
    </section>

    <!-- consents -->
    <section class="mt-7">
      <h2 class="text-base font-semibold text-highlighted">Souhlasy</h2>
      <UPageCard variant="outline" class="mt-3" :ui="{ container: 'p-4 sm:p-4' }">
        <div class="flex items-start justify-between gap-4">
          <div class="min-w-0">
            <p class="text-sm font-medium text-highlighted">Novinky a nabídky</p>
            <p class="text-xs text-muted mt-0.5">E-maily o zápasech a předprodejích. Můžete kdykoli odvolat.</p>
          </div>
          <USwitch v-model="marketing" class="shrink-0 mt-0.5" />
        </div>
      </UPageCard>
    </section>

    <!-- privacy -->
    <section class="mt-7">
      <h2 class="text-base font-semibold text-highlighted">Soukromí</h2>
      <UPageCard variant="outline" class="mt-3 overflow-hidden" :ui="{ container: 'p-0 sm:p-0' }">
        <div class="divide-y divide-default">
          <UButton
            block
            color="neutral"
            variant="ghost"
            icon="i-lucide-download"
            trailing-icon="i-lucide-chevron-right"
            label="Stáhnout moje data"
            :ui="{ base: 'rounded-none px-4 py-3 justify-start', label: 'flex-1 text-left', trailingIcon: 'text-dimmed' }"
            @click="exportData"
          />
          <UButton
            block
            color="error"
            variant="ghost"
            icon="i-lucide-trash-2"
            trailing-icon="i-lucide-chevron-right"
            label="Smazat účet"
            :ui="{ base: 'rounded-none px-4 py-3 justify-start', label: 'flex-1 text-left', trailingIcon: 'text-dimmed' }"
            @click="deleteAccount"
          />
        </div>
      </UPageCard>
    </section>

    <UButton class="mt-7 justify-center" block color="neutral" variant="subtle" icon="i-lucide-log-out" label="Odhlásit se" @click="signOut" />

    <!-- ticket QR modal -->
    <UModal v-model:open="ticketModal" title="Vaše vstupenky">
      <template #body>
        <div v-if="activeOrder" class="text-center">
          <p class="text-sm font-semibold text-highlighted">{{ activeOrder.eventTitle }}</p>
          <p class="text-xs text-muted mt-0.5">{{ activeOrder.dateFull }} · {{ activeOrder.time }} · {{ activeOrder.venue }}</p>
          <div class="mx-auto mt-5 size-44 rounded-xl ring ring-default bg-elevated flex items-center justify-center">
            <UIcon name="i-lucide-qr-code" class="size-36 text-highlighted" />
          </div>
          <p class="text-xs text-dimmed mt-3">{{ activeOrder.id }}</p>
          <div class="mt-4 flex flex-col gap-1.5">
            <p v-for="s in activeOrder.seats" :key="s" class="text-sm text-toned">{{ s }}</p>
          </div>
          <p class="text-xs text-muted mt-4">Vstupenky máte i v e-mailu. Na vstupu stačí QR kód.</p>
        </div>
      </template>
    </UModal>
  </div>
</template>
