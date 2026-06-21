<script setup lang="ts">
import { h } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import {
  UPCOMING_PAYOUTS, PENDING_TOTAL, THIS_WEEK_TOTAL, NEXT_PAYOUT, PAYOUT_HISTORY, PAID_TOTAL, BANK_ACCOUNT, fmtKc
} from '~/utils/payouts'
import type { UpcomingPayout, PayoutTransfer } from '~/utils/payouts'

const UBadge = resolveComponent('UBadge')

const tiles = computed(() => [
  {
    label: 'Pending balance',
    value: fmtKc(PENDING_TOTAL),
    sub: `${UPCOMING_PAYOUTS.length} events on sale`
  },
  {
    label: 'Next payout',
    value: NEXT_PAYOUT,
    sub: `${fmtKc(THIS_WEEK_TOTAL)} this week`
  },
  {
    label: 'Paid out to date',
    value: fmtKc(PAID_TOTAL),
    sub: `${PAYOUT_HISTORY.length} weekly transfers · last ${PAYOUT_HISTORY[0]!.dateLabel}`
  }
])

const upcomingColumns: TableColumn<UpcomingPayout>[] = [
  {
    accessorKey: 'event',
    header: 'Event',
    cell: ({ row }) => h('span', { class: 'font-medium text-highlighted' }, row.original.event)
  },
  { accessorKey: 'onSaleLabel', header: 'Sale' },
  {
    accessorKey: 'thisWeek',
    header: 'This week',
    cell: ({ row }) => h('span', { class: 'block tabular-nums font-medium text-default' }, fmtKc(row.original.thisWeek))
  },
  {
    accessorKey: 'net',
    header: 'Pending balance',
    cell: ({ row }) => h('span', { class: 'block tabular-nums font-semibold text-highlighted' }, fmtKc(row.original.net))
  },
  {
    id: 'status',
    header: 'Status',
    cell: () => h(UBadge, { label: `Next payout ${NEXT_PAYOUT}`, color: 'info', variant: 'subtle', size: 'sm', icon: 'i-lucide-calendar-clock' })
  }
]

const historyColumns: TableColumn<PayoutTransfer>[] = [
  {
    accessorKey: 'id',
    header: 'Transfer',
    cell: ({ row }) => h('span', { class: 'font-medium text-highlighted tabular-nums' }, row.original.id)
  },
  { accessorKey: 'dateLabel', header: 'Sent' },
  { accessorKey: 'event', header: 'Event' },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => h('span', { class: 'block tabular-nums font-semibold text-highlighted' }, fmtKc(row.original.amount))
  },
  {
    id: 'status',
    header: 'Status',
    cell: ({ row }) => h(UBadge, { label: `Paid · arrived ${row.original.arrivedLabel}`, color: 'success', variant: 'subtle', size: 'sm' })
  }
]
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- balance tiles -->
    <div class="grid sm:grid-cols-3 gap-3">
      <div v-for="t in tiles" :key="t.label" class="rounded-lg ring ring-default bg-default p-4">
        <p class="text-[11px] font-semibold uppercase tracking-wide text-muted">{{ t.label }}</p>
        <p class="text-2xl font-semibold text-highlighted tabular-nums mt-2">{{ t.value }}</p>
        <p class="text-xs text-muted mt-0.5">{{ t.sub }}</p>
      </div>
    </div>

    <!-- how payouts work -->
    <UAlert
      color="info"
      variant="subtle"
      icon="i-lucide-calendar-clock"
      title="Weekly automatic payouts"
      description="Payouts run automatically every week while your event is on sale — use ticket revenue as it comes in."
    />

    <!-- upcoming payouts -->
    <UPageCard
      variant="outline"
      title="Upcoming payouts"
      :description="`What each event on sale is accruing for ${BANK_ACCOUNT.bank} ${BANK_ACCOUNT.masked.slice(-4)} — paid out with the weekly run on ${NEXT_PAYOUT}.`"
    >
      <UTable
        :data="UPCOMING_PAYOUTS"
        :columns="upcomingColumns"
        class="mt-2"
        :ui="{ td: 'py-3', th: 'py-2.5' }"
      />
    </UPageCard>

    <!-- payout history -->
    <UPageCard
      variant="outline"
      title="Payout history"
      description="Every weekly transfer we've sent you, with its Stripe status."
    >
      <UTable
        :data="PAYOUT_HISTORY"
        :columns="historyColumns"
        class="mt-2"
        :ui="{ td: 'py-3', th: 'py-2.5' }"
      />
    </UPageCard>
  </div>
</template>
