<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import { fmtN, pct } from '~/utils/campaignAnalytics'
import {
  STATUS_BADGE, deriveCustomers, displayEmail, maskEmail, itemsLabel, orderTotal
} from '~/utils/salesOrders'
import type { CustomerProfile } from '~/utils/salesOrders'

const emit = defineEmits<{ viewOrders: [email: string] }>()

const orders = useOrders()
const customers = computed(() => deriveCustomers(orders.value))

const showEmail = (c: CustomerProfile) => c.consent ? c.email : maskEmail(c.email)

/* ——— tiles ——— */
const tiles = computed(() => {
  const total = customers.value.length
  const marketing = customers.value.filter(c => c.marketingConsent).length
  const repeat = customers.value.filter(c => c.ordersCount > 1 || c.pastEvents.length > 0).length
  return [
    { label: 'Buyers', value: fmtN(total), sub: 'bought this event' },
    { label: 'Marketing opt-in', value: fmtN(marketing), sub: `${pct(marketing, total)} reachable with news` },
    { label: 'Repeat buyers', value: fmtN(repeat), sub: 'bought your events before' }
  ]
})

/* ——— search & table ——— */
const search = ref('')
const filtered = computed(() => customers.value.filter((c) => {
  const q = search.value.trim().toLowerCase()
  if (!q) return true
  return showEmail(c).toLowerCase().includes(q)
}))

const UButton = resolveComponent('UButton')
const UIcon = resolveComponent('UIcon')

const sorting = ref([{ id: 'lastTs', desc: true }])

const sortHeader = (label: string) => ({ column }: any) =>
  h(UButton, {
    label,
    color: 'neutral',
    variant: 'ghost',
    size: 'sm',
    class: '-mx-2.5 font-semibold',
    trailingIcon: column.getIsSorted()
      ? (column.getIsSorted() === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow')
      : 'i-lucide-arrow-up-down',
    onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
  })

const consentIcons = (c: CustomerProfile) => h('span', { class: 'flex items-center gap-2' }, [
  h(UIcon, {
    'name': 'i-lucide-megaphone',
    'class': 'size-4 ' + (c.marketingConsent ? 'text-success' : 'text-dimmed opacity-40'),
    'aria-label': c.marketingConsent ? 'Marketing consent granted' : 'No marketing consent'
  }),
  h(UIcon, {
    'name': c.consent ? 'i-lucide-user-check' : 'i-lucide-lock',
    'class': 'size-4 ' + (c.consent ? 'text-success' : 'text-dimmed opacity-40'),
    'aria-label': c.consent ? 'Data sharing granted' : 'No data sharing consent'
  })
])

const columns: TableColumn<CustomerProfile>[] = [
  {
    accessorKey: 'email',
    header: 'Buyer',
    cell: ({ row }) => h('span', { class: 'flex items-center gap-1.5 min-w-0' }, [
      h('span', { class: 'truncate font-medium ' + (row.original.consent ? 'text-highlighted' : 'text-muted') }, showEmail(row.original)),
      row.original.consent ? null : h(UIcon, { name: 'i-lucide-lock', class: 'size-3 shrink-0 text-dimmed' })
    ])
  },
  {
    id: 'consents',
    header: 'Consents',
    cell: ({ row }) => consentIcons(row.original)
  },
  {
    accessorKey: 'ordersCount',
    header: sortHeader('Orders'),
    cell: ({ row }) => h('span', { class: 'block tabular-nums text-default' }, String(row.original.ordersCount))
  },
  {
    accessorKey: 'tickets',
    header: sortHeader('Tickets'),
    cell: ({ row }) => h('span', { class: 'block tabular-nums text-default' }, String(row.original.tickets))
  },
  {
    accessorKey: 'spent',
    header: sortHeader('Spent'),
    cell: ({ row }) => h('span', {
      class: 'block tabular-nums font-medium ' + (row.original.spent === 0 ? 'text-dimmed' : 'text-highlighted')
    }, `${fmtN(row.original.spent)} Kč`)
  },
  {
    accessorKey: 'lastTs',
    header: sortHeader('Last purchase'),
    cell: ({ row }) => h('span', { class: 'block tabular-nums text-muted' }, row.original.lastLabel)
  },
  {
    id: 'open',
    header: () => h('span', { class: 'sr-only' }, 'Open'),
    cell: () => h(UIcon, { name: 'i-lucide-chevron-right', class: 'size-4 text-dimmed block' })
  }
]

/* ——— profile slideover ——— */
const selectedEmail = ref<string | null>(null)
const slideoverOpen = ref(false)
const selected = computed(() => customers.value.find(c => c.email === selectedEmail.value) ?? null)

const openCustomer = (_e: Event, row: any) => {
  selectedEmail.value = row.original.email
  slideoverOpen.value = true
}

const viewOrders = () => {
  if (!selected.value) return
  const email = showEmail(selected.value)
  slideoverOpen.value = false
  emit('viewOrders', email)
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- tiles -->
    <div class="grid sm:grid-cols-3 gap-3">
      <div v-for="t in tiles" :key="t.label" class="rounded-lg ring ring-default bg-default p-4">
        <p class="text-[11px] font-semibold uppercase tracking-wide text-muted">{{ t.label }}</p>
        <p class="text-2xl font-semibold text-highlighted tabular-nums mt-2">{{ t.value }}</p>
        <p class="text-xs text-muted mt-0.5">{{ t.sub }}</p>
      </div>
    </div>

    <!-- customer list -->
    <UPageCard variant="outline">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p class="text-base font-semibold text-highlighted">Buyers of this event</p>
          <p class="text-[15px] text-muted mt-1">
            Contact details appear only where the buyer granted data sharing to you.
          </p>
        </div>
        <UInput
          v-model="search"
          icon="i-lucide-search"
          placeholder="Search by email…"
          class="w-56"
        />
      </div>

      <UTable
        v-if="filtered.length"
        v-model:sorting="sorting"
        :data="filtered"
        :columns="columns"
        class="mt-3"
        :ui="{ td: 'py-3', th: 'py-2.5' }"
        @select="openCustomer"
      />
      <UEmpty
        v-else
        icon="i-lucide-search-x"
        title="No buyers match"
        description="Try a different email."
        class="py-10"
      />

      <p class="text-xs text-dimmed mt-3">
        <UIcon name="i-lucide-megaphone" class="size-3 inline-block align-[-1px]" /> marketing news ·
        <UIcon name="i-lucide-user-check" class="size-3 inline-block align-[-1px]" /> contact details shared ·
        <UIcon name="i-lucide-lock" class="size-3 inline-block align-[-1px]" /> masked, no data-sharing consent
      </p>
    </UPageCard>

    <!-- ════ customer profile slideover ════ -->
    <USlideover
      v-model:open="slideoverOpen"
      :title="selected ? showEmail(selected) : 'Buyer'"
      :description="selected ? `Customer since ${selected.firstLabel}` : undefined"
    >
      <template #body>
        <div v-if="selected" class="flex flex-col gap-6">
          <!-- quick stats -->
          <div class="grid grid-cols-3 gap-2.5">
            <div class="rounded-lg bg-elevated px-3 py-2.5">
              <p class="text-lg font-semibold text-highlighted tabular-nums">{{ fmtN(selected.spent) }} Kč</p>
              <p class="text-[11px] text-muted">spent</p>
            </div>
            <div class="rounded-lg bg-elevated px-3 py-2.5">
              <p class="text-lg font-semibold text-highlighted tabular-nums">{{ selected.tickets }}</p>
              <p class="text-[11px] text-muted">tickets</p>
            </div>
            <div class="rounded-lg bg-elevated px-3 py-2.5">
              <p class="text-lg font-semibold text-highlighted tabular-nums">{{ selected.ordersCount }}</p>
              <p class="text-[11px] text-muted">orders</p>
            </div>
          </div>

          <!-- consents -->
          <div>
            <p class="text-[11px] font-semibold uppercase tracking-wide text-muted mb-2">Consents</p>
            <ul class="flex flex-col divide-y divide-default rounded-lg ring ring-default">
              <li class="flex items-center gap-3 px-3.5 py-2.5">
                <UIcon name="i-lucide-megaphone" class="size-4 shrink-0" :class="selected.marketingConsent ? 'text-success' : 'text-dimmed'" />
                <span class="flex-1 text-sm text-default">Event news from you</span>
                <UBadge
                  :label="selected.marketingConsent ? `Granted · ${selected.firstLabel}` : 'Not granted'"
                  :color="selected.marketingConsent ? 'success' : 'neutral'"
                  variant="subtle"
                  size="sm"
                />
              </li>
              <li class="flex items-center gap-3 px-3.5 py-2.5">
                <UIcon :name="selected.consent ? 'i-lucide-user-check' : 'i-lucide-lock'" class="size-4 shrink-0" :class="selected.consent ? 'text-success' : 'text-dimmed'" />
                <span class="flex-1 text-sm text-default">Contact details shared</span>
                <UBadge
                  :label="selected.consent ? `Granted · ${selected.firstLabel}` : 'Not granted'"
                  :color="selected.consent ? 'success' : 'neutral'"
                  variant="subtle"
                  size="sm"
                />
              </li>
            </ul>
            <p class="text-xs text-dimmed mt-2">
              Consents are timestamped records from checkout — the buyer can revoke them anytime from their profile.
            </p>
          </div>

          <UAlert
            v-if="!selected.consent"
            color="neutral"
            variant="subtle"
            icon="i-lucide-lock"
            title="Contact details hidden"
            description="This buyer hasn't shared their contact details with you. They still receive all transactional emails — tickets, reminders, refunds."
          />

          <!-- purchase history -->
          <div>
            <p class="text-[11px] font-semibold uppercase tracking-wide text-muted mb-2">
              Purchase history · this event
            </p>
            <ul class="flex flex-col divide-y divide-default rounded-lg ring ring-default">
              <li v-for="o in selected.orders" :key="o.id" class="flex items-center gap-3 px-3.5 py-2.5">
                <span class="text-sm font-medium text-highlighted tabular-nums">#{{ o.id }}</span>
                <span class="flex-1 text-sm text-muted truncate">{{ itemsLabel(o) }}</span>
                <UBadge v-bind="STATUS_BADGE[o.status]" size="sm" />
                <span class="text-sm tabular-nums text-highlighted w-20 text-right">{{ fmtN(orderTotal(o)) }} Kč</span>
              </li>
            </ul>
          </div>

          <!-- cross-event profile -->
          <div v-if="selected.pastEvents.length">
            <p class="text-[11px] font-semibold uppercase tracking-wide text-muted mb-2">Also attended</p>
            <div class="flex flex-wrap gap-2">
              <UBadge
                v-for="ev in selected.pastEvents"
                :key="ev"
                :label="ev"
                color="neutral"
                variant="outline"
              />
            </div>
            <p class="text-xs text-dimmed mt-2">
              One buyer profile across all your events — the foundation for loyalty.
            </p>
          </div>
        </div>
      </template>

      <template #footer="{ close }">
        <div class="flex w-full items-center justify-between gap-2">
          <UButton label="Close" color="neutral" variant="ghost" @click="close" />
          <UButton
            label="View orders in Sales"
            icon="i-lucide-receipt"
            color="primary"
            variant="subtle"
            @click="viewOrders"
          />
        </div>
      </template>
    </USlideover>
  </div>
</template>
