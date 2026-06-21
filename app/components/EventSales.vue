<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import { fmtN } from '~/utils/campaignAnalytics'
import {
  EVENT_SALES_TOTALS, STATUS_BADGE, orderTotal, itemsLabel, displayEmail, orderBreakdown
} from '~/utils/salesOrders'
import type { Order, OrderStatus } from '~/utils/salesOrders'

const orders = useOrders()

/* ——— stats tiles (event totals) ——— */
const tiles = computed(() => {
  const tickets = EVENT_SALES_TOTALS.tickets
  const revenue = EVENT_SALES_TOTALS.revenue
  const failed = orders.value.filter(o => o.status === 'failed').length
  return [
    { label: 'Tickets sold', value: fmtN(tickets), sub: `of ${fmtN(EVENT_SALES_TOTALS.capacity)} capacity` },
    { label: 'Revenue', value: `${fmtN(revenue)} Kč`, sub: 'gross, before 7% commission' },
    { label: 'Avg ticket', value: `${fmtN(Math.round(revenue / tickets))} Kč`, sub: 'revenue / tickets sold' },
    { label: 'Failed', value: fmtN(failed), sub: 'payments not captured' }
  ]
})

/* ——— filters (search is shared state so Customers can deep-link into Sales) ——— */
const search = useState('sales-search', () => '')
const status = ref<'all' | OrderStatus>('all')
const statusItems = [
  { label: 'All statuses', value: 'all' },
  { label: 'Paid', value: 'paid' },
  { label: 'Failed', value: 'failed' }
]
const period = ref('all')
const periodItems = [
  { label: 'All time', value: 'all' },
  { label: 'Last 30 days', value: '30d' },
  { label: 'Last 7 days', value: '7d' }
]

const filtered = computed(() => orders.value.filter((o) => {
  if (status.value !== 'all' && o.status !== status.value) return false
  const q = search.value.trim().toLowerCase().replace(/^#/, '')
  if (!q) return true
  return o.id.toLowerCase().includes(q) || displayEmail(o).toLowerCase().includes(q)
}))

/* ——— orders table ——— */
const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')
const UIcon = resolveComponent('UIcon')

const sorting = ref([{ id: 'ts', desc: true }])

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

const columns: TableColumn<Order>[] = [
  {
    accessorKey: 'id',
    header: 'Order',
    cell: ({ row }) => h('span', { class: 'font-medium text-highlighted tabular-nums' }, `#${row.original.id}`)
  },
  {
    accessorKey: 'email',
    header: 'Buyer',
    cell: ({ row }) => h('span', { class: 'flex items-center gap-1.5 min-w-0' }, [
      h('span', { class: 'truncate ' + (row.original.consent ? 'text-default' : 'text-muted') }, displayEmail(row.original)),
      row.original.consent
        ? null
        : h(UIcon, { 'name': 'i-lucide-lock', 'class': 'size-3 shrink-0 text-dimmed', 'aria-label': 'No data-sharing consent' })
    ])
  },
  {
    id: 'items',
    header: 'Tickets',
    cell: ({ row }) => h('span', { class: 'text-muted' }, itemsLabel(row.original))
  },
  {
    id: 'total',
    accessorFn: (o: Order) => orderTotal(o),
    header: sortHeader('Total'),
    cell: ({ row }) => h('span', { class: 'block tabular-nums font-medium text-highlighted' }, `${fmtN(orderTotal(row.original))} Kč`)
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => h(UBadge, { size: 'sm', ...STATUS_BADGE[row.original.status] })
  },
  {
    accessorKey: 'ts',
    header: sortHeader('Date'),
    cell: ({ row }) => h('span', { class: 'block tabular-nums text-muted' }, row.original.dateLabel)
  },
  {
    id: 'open',
    header: () => h('span', { class: 'sr-only' }, 'Open'),
    cell: () => h(UIcon, { name: 'i-lucide-chevron-right', class: 'size-4 text-dimmed block' })
  }
]

/* ——— order detail slideover ——— */
const selectedId = ref<string | null>(null)
const slideoverOpen = ref(false)
const selected = computed(() => orders.value.find(o => o.id === selectedId.value) ?? null)
const breakdown = computed(() => selected.value ? orderBreakdown(selected.value) : null)

const openOrder = (_e: Event, row: any) => {
  selectedId.value = row.original.id
  slideoverOpen.value = true
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- stats -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <div v-for="t in tiles" :key="t.label" class="rounded-lg ring ring-default bg-default p-4">
        <p class="text-[11px] font-semibold uppercase tracking-wide text-muted">{{ t.label }}</p>
        <p class="text-2xl font-semibold text-highlighted tabular-nums mt-2">{{ t.value }}</p>
        <p class="text-xs text-muted mt-0.5">{{ t.sub }}</p>
      </div>
    </div>

    <!-- orders -->
    <UPageCard variant="outline">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p class="text-base font-semibold text-highlighted">Orders</p>
          <p class="text-[15px] text-muted mt-1">Find an order by buyer email or order ID.</p>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <UInput
            v-model="search"
            icon="i-lucide-search"
            placeholder="Email or order ID…"
            class="w-56"
          />
          <USelect v-model="status" :items="statusItems" class="w-36" />
          <USelect v-model="period" :items="periodItems" class="w-32" />
        </div>
      </div>

      <UTable
        v-if="filtered.length"
        v-model:sorting="sorting"
        :data="filtered"
        :columns="columns"
        class="mt-3"
        :ui="{ td: 'py-3', th: 'py-2.5' }"
        @select="openOrder"
      />
      <UEmpty
        v-else
        icon="i-lucide-search-x"
        title="No orders match"
        description="Try a different email, order ID or status filter."
        class="py-10"
      />

      <p class="text-xs text-dimmed mt-3">
        Showing the {{ filtered.length }} most recent of {{ fmtN(EVENT_SALES_TOTALS.tickets) }} orders ·
        <UIcon name="i-lucide-lock" class="size-3 inline-block align-[-1px]" />
        masked — buyer hasn't shared contact details.
      </p>
    </UPageCard>

    <!-- ════ order detail slideover ════ -->
    <USlideover
      v-model:open="slideoverOpen"
      :title="selected ? `Order #${selected.id}` : 'Order'"
      :description="selected?.dateLabel"
    >
      <template #body>
        <div v-if="selected" class="flex flex-col gap-6">
          <!-- status & buyer -->
          <div class="flex items-center justify-between gap-3">
            <UBadge v-bind="STATUS_BADGE[selected.status]" />
            <span class="text-sm text-muted tabular-nums">{{ fmtN(orderTotal(selected)) }} Kč</span>
          </div>

          <div class="rounded-lg ring ring-default p-3.5">
            <p class="text-[11px] font-semibold uppercase tracking-wide text-muted">Buyer</p>
            <p class="flex items-center gap-1.5 text-sm font-medium text-highlighted mt-1.5">
              {{ displayEmail(selected) }}
              <UIcon v-if="!selected.consent" name="i-lucide-lock" class="size-3.5 text-dimmed" />
            </p>
            <div class="flex flex-wrap gap-2 mt-2.5">
              <UBadge
                :label="selected.consent ? 'Data sharing ✓' : 'Data sharing —'"
                :color="selected.consent ? 'success' : 'neutral'"
                variant="subtle"
                size="sm"
              />
              <UBadge
                :label="selected.marketingConsent ? 'Marketing ✓' : 'Marketing —'"
                :color="selected.marketingConsent ? 'success' : 'neutral'"
                variant="subtle"
                size="sm"
              />
            </div>
          </div>

          <!-- tickets -->
          <div>
            <p class="text-[11px] font-semibold uppercase tracking-wide text-muted mb-2">
              Tickets · {{ selected.tickets.length }}
            </p>
            <ul class="flex flex-col divide-y divide-default rounded-lg ring ring-default">
              <li v-for="(t, i) in selected.tickets" :key="i" class="flex items-center gap-3 px-3.5 py-2.5">
                <UIcon :name="t.standing ? 'i-lucide-users' : 'i-lucide-armchair'" class="size-4 text-dimmed shrink-0" />
                <span class="flex-1 text-sm text-default">{{ t.seat }}</span>
                <UBadge :label="t.type" color="neutral" variant="subtle" size="sm" />
                <span class="text-sm tabular-nums text-highlighted w-20 text-right">{{ fmtN(t.price) }} Kč</span>
              </li>
            </ul>
          </div>

          <!-- money -->
          <div v-if="breakdown && selected.status !== 'failed'">
            <p class="text-[11px] font-semibold uppercase tracking-wide text-muted mb-2">Payment</p>
            <dl class="flex flex-col gap-2 text-sm">
              <div class="flex justify-between gap-4">
                <dt class="text-muted">Buyer paid</dt>
                <dd class="tabular-nums font-medium text-highlighted">{{ fmtN(breakdown.total) }} Kč</dd>
              </div>
              <div class="flex justify-between gap-4">
                <dt class="text-muted">Platform commission · 7%</dt>
                <dd class="tabular-nums text-muted">−{{ fmtN(breakdown.platformFee) }} Kč</dd>
              </div>
              <div class="flex justify-between gap-4">
                <dt class="text-muted">Payment provider fee</dt>
                <dd class="tabular-nums text-muted">−{{ fmtN(breakdown.providerFee) }} Kč</dd>
              </div>
              <USeparator />
              <div class="flex justify-between gap-4">
                <dt class="font-medium text-highlighted">Your payout</dt>
                <dd class="tabular-nums font-semibold text-highlighted">{{ fmtN(breakdown.net) }} Kč</dd>
              </div>
            </dl>
            <p v-if="selected.status === 'paid'" class="text-xs text-dimmed mt-2">
              Added to your balance — paid out in the next weekly payout.
            </p>
          </div>

          <!-- status-specific notes -->
          <UAlert
            v-if="selected.status === 'failed'"
            color="error"
            variant="subtle"
            icon="i-lucide-circle-x"
            title="Payment failed"
            description="No money was captured. The buyer received an email with the failure reason and a link to retry checkout."
          />
          <UAlert
            v-else-if="selected.status === 'disputed'"
            color="error"
            variant="subtle"
            icon="i-lucide-shield-alert"
            title="Chargeback opened"
            description="The buyer disputed this charge with their bank. Manual resolution required — our team has been notified."
          />
        </div>
      </template>

      <template #footer="{ close }">
        <div class="flex w-full items-center justify-end gap-2">
          <UButton label="Close" color="neutral" variant="ghost" @click="close" />
        </div>
      </template>
    </USlideover>
  </div>
</template>
