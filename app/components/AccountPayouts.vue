<script setup lang="ts">
import { h } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import {
  UPCOMING_PAYOUTS, PENDING_TOTAL, THIS_WEEK_TOTAL, NEXT_PAYOUT, PAYOUT_HISTORY, PAID_TOTAL, BANK_ACCOUNT, fmtKc
} from '~/utils/payouts'
import type { UpcomingPayout, PayoutTransfer } from '~/utils/payouts'

const UBadge = resolveComponent('UBadge')

const t = useT()

const tiles = computed(() => [
  {
    label: t('payouts.pendingLabel'),
    value: fmtKc(PENDING_TOTAL),
    sub: t('payouts.pendingSub', { n: UPCOMING_PAYOUTS.length })
  },
  {
    label: t('payouts.nextLabel'),
    value: NEXT_PAYOUT,
    sub: t('payouts.nextSub', { kc: fmtKc(THIS_WEEK_TOTAL) })
  },
  {
    label: t('payouts.paidLabel'),
    value: fmtKc(PAID_TOTAL),
    sub: t('payouts.paidSub', { n: PAYOUT_HISTORY.length, date: PAYOUT_HISTORY[0]!.dateLabel })
  }
])

const upcomingColumns = computed<TableColumn<UpcomingPayout>[]>(() => [
  {
    accessorKey: 'event',
    header: t('payouts.colEvent'),
    cell: ({ row }) => h('span', { class: 'font-medium text-highlighted' }, row.original.event)
  },
  { accessorKey: 'onSaleLabel', header: t('payouts.colSale') },
  {
    accessorKey: 'thisWeek',
    header: t('payouts.colThisWeek'),
    cell: ({ row }) => h('span', { class: 'block tabular-nums font-medium text-default' }, fmtKc(row.original.thisWeek))
  },
  {
    accessorKey: 'net',
    header: t('payouts.colPending'),
    cell: ({ row }) => h('span', { class: 'block tabular-nums font-semibold text-highlighted' }, fmtKc(row.original.net))
  },
  {
    id: 'status',
    header: t('payouts.colStatus'),
    cell: () => h(UBadge, { label: t('payouts.nextPayoutBadge', { date: NEXT_PAYOUT }), color: 'info', variant: 'subtle', size: 'sm', icon: 'i-lucide-calendar-clock' })
  }
])

const historyColumns = computed<TableColumn<PayoutTransfer>[]>(() => [
  {
    accessorKey: 'id',
    header: t('payouts.colTransfer'),
    cell: ({ row }) => h('span', { class: 'font-medium text-highlighted tabular-nums' }, row.original.id)
  },
  { accessorKey: 'dateLabel', header: t('payouts.colSent') },
  { accessorKey: 'event', header: t('payouts.colEventHistory') },
  {
    accessorKey: 'amount',
    header: t('payouts.colAmount'),
    cell: ({ row }) => h('span', { class: 'block tabular-nums font-semibold text-highlighted' }, fmtKc(row.original.amount))
  },
  {
    id: 'status',
    header: t('payouts.colStatus'),
    cell: ({ row }) => h(UBadge, { label: t('payouts.paidBadge', { date: row.original.arrivedLabel }), color: 'success', variant: 'subtle', size: 'sm' })
  }
])
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
      :title="t('payouts.alertTitle')"
      :description="t('payouts.alertDesc')"
    />

    <!-- upcoming payouts -->
    <UPageCard
      variant="outline"
      :title="t('payouts.upcomingTitle')"
      :description="t('payouts.upcomingDesc', { bank: BANK_ACCOUNT.bank, last4: BANK_ACCOUNT.masked.slice(-4), date: NEXT_PAYOUT })"
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
      :title="t('payouts.historyTitle')"
      :description="t('payouts.historyDesc')"
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
