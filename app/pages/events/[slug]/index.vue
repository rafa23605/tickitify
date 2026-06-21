<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import {
  campaignTotals, eventTotals, chartColor, uniqueId,
  fmtN, pct, EVENTS_META
} from '~/utils/campaignAnalytics'

const route = useRoute()
const slug = computed(() => String(route.params.slug))

const meta = computed(() =>
  EVENTS_META[slug.value]
  ?? { title: slug.value, venue: '—', when: '—', status: 'draft' as const }
)

useHead({ title: () => `${meta.value.title} · Tickitify` })

/* a draft is an unfinished event — it has no workspace; resume it in the wizard */
if (meta.value.status === 'draft') {
  await navigateTo(`/events/new?draft=${slug.value}`, { replace: true })
}

const statusBadge = computed(() => {
  switch (meta.value.status) {
    case 'published': return { label: 'On sale', color: 'success' as const, variant: 'subtle' as const }
    case 'draft': return { label: 'Draft', color: 'neutral' as const, variant: 'subtle' as const }
    case 'completed': return { label: 'Completed', color: 'neutral' as const, variant: 'outline' as const }
    case 'cancelled': return { label: 'Cancelled', color: 'error' as const, variant: 'subtle' as const }
  }
})

/* ——— workspace nav ——— */
const tab = ref('overview')
const tabs = [
  { label: 'Overview', value: 'overview' },
  { label: 'Sales', value: 'sales' },
  { label: 'Marketing', value: 'marketing' }
]

/* ——— analytics data ——— */
const campaignList = useCampaigns()

const totals = computed(() => eventTotals(campaignList.value))

interface CampaignRow {
  id: string
  name: string
  colorIdx: number
  viewed: number
  initiated: number
  purchased: number
}

const rows = computed<CampaignRow[]>(() => campaignList.value.map((c, i) => ({
  id: c.id,
  name: c.name,
  colorIdx: i,
  ...campaignTotals(c)
})))

const coverage = computed(() => {
  const sold = meta.value.sold
  if (!sold) return null
  return { attributed: totals.value.purchased, sold, pct: pct(totals.value.purchased, sold) }
})

/* period filter — placement per the PoC doc; static data in the prototype */
const period = ref('all')
const periodItems = [
  { label: 'All time', value: 'all' },
  { label: 'Last 30 days', value: '30d' },
  { label: 'Last 7 days', value: '7d' }
]

/* ——— sortable campaign table ——— */
const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')
const UIcon = resolveComponent('UIcon')

const sorting = ref([{ id: 'purchased', desc: true }])

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

const numCell = (key: 'viewed' | 'initiated' | 'purchased') => ({ row }: any) =>
  h('span', { class: 'block tabular-nums ' + (row.original[key] === 0 ? 'text-dimmed' : 'text-default') }, fmtN(row.original[key]))

const columns: TableColumn<CampaignRow>[] = [
  {
    accessorKey: 'name',
    header: 'Campaign',
    cell: ({ row }) => h('span', { class: 'flex items-center gap-2.5 font-medium text-highlighted' }, [
      h('span', { class: `size-2.5 rounded-full shrink-0 ${chartColor(row.original.colorIdx).dot}` }),
      row.original.name
    ])
  },
  { accessorKey: 'viewed', header: sortHeader('Viewed'), cell: numCell('viewed') },
  { accessorKey: 'initiated', header: sortHeader('Initiated checkout'), cell: numCell('initiated') },
  { accessorKey: 'purchased', header: sortHeader('Purchased'), cell: numCell('purchased') },
  {
    id: 'conversion',
    accessorFn: (r: CampaignRow) => r.viewed ? r.purchased / r.viewed : 0,
    header: sortHeader('Conv.'),
    cell: ({ row }) => h(UBadge, {
      label: pct(row.original.purchased, row.original.viewed),
      color: 'neutral',
      variant: 'subtle',
      size: 'sm'
    })
  },
  {
    id: 'open',
    header: () => h('span', { class: 'sr-only' }, 'Open'),
    cell: () => h(UIcon, { name: 'i-lucide-chevron-right', class: 'size-4 text-dimmed block' })
  }
]

const openCampaign = (_e: Event, row: any) => {
  navigateTo(`/events/${slug.value}/campaigns/${row.original.id}`)
}

/* ——— pies ——— */
const trafficItems = computed(() => rows.value.map(r => ({ label: r.name, value: r.viewed, dot: chartColor(r.colorIdx).dot, color: chartColor(r.colorIdx).cssVar })))
const salesItems = computed(() => rows.value.map(r => ({ label: r.name, value: r.purchased, dot: chartColor(r.colorIdx).dot, color: chartColor(r.colorIdx).cssVar })))

/* ——— new campaign modal ——— */
const toast = useToast()
const campaignModal = ref(false)
const newCampaignName = ref('')

const createCampaign = () => {
  const name = newCampaignName.value.trim()
  if (!name) return
  const id = uniqueId(name, campaignList.value.map(c => c.id))
  campaignList.value.push({ id, name, links: [] })
  campaignModal.value = false
  newCampaignName.value = ''
  toast.add({
    title: 'Campaign created',
    description: 'Now add tracking links and share them.',
    icon: 'i-lucide-megaphone',
    color: 'success'
  })
  navigateTo(`/events/${slug.value}/campaigns/${id}`)
}
</script>

<template>
  <div class="min-h-screen bg-muted">
    <AppHeader />

    <UContainer class="max-w-6xl pb-24">
      <UBreadcrumb
        :items="[
          { label: 'Events', icon: 'i-lucide-ticket', to: '/' },
          { label: meta.title }
        ]"
        class="pt-6"
      />

      <UPageHeader :description="`${meta.venue} · ${meta.when}`" :ui="{ root: 'border-none pt-4 pb-6' }">
        <template #title>
          <span class="flex items-center gap-3">
            {{ meta.title }}
            <UBadge v-bind="statusBadge" />
          </span>
        </template>
      </UPageHeader>

      <UTabs
        v-model="tab"
        :items="tabs"
        :content="false"
        color="primary"
        variant="link"
        class="mb-8"
      />

      <!-- ════ Marketing · campaign analytics ════ -->
      <div v-if="tab === 'marketing'" class="flex flex-col gap-6">
        <div class="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 class="text-lg font-semibold text-highlighted">Campaign analytics</h2>
            <p class="text-sm text-muted mt-0.5">Where your buyers came from — every tracked link, rolled up.</p>
          </div>
          <div class="flex items-center gap-4">
            <p v-if="coverage" class="text-sm text-muted">
              <span class="font-semibold text-highlighted tabular-nums">{{ fmtN(coverage.attributed) }}</span>
              of {{ fmtN(coverage.sold) }} sales attributed ·
              <UBadge :label="coverage.pct" color="success" variant="subtle" size="sm" />
            </p>
            <USelect v-model="period" :items="periodItems" size="sm" class="w-36" />
          </div>
        </div>

        <FunnelStats :viewed="totals.viewed" :initiated="totals.initiated" :purchased="totals.purchased" />

        <UPageCard variant="outline">
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p class="text-base font-semibold text-highlighted">Campaigns</p>
              <p class="text-[15px] text-muted mt-1">Click a column to sort, click a campaign to drill into its links.</p>
            </div>
            <UButton label="New campaign" icon="i-lucide-plus" size="sm" @click="campaignModal = true" />
          </div>

          <UTable
            v-model:sorting="sorting"
            :data="rows"
            :columns="columns"
            class="mt-3"
            :ui="{ td: 'py-3', th: 'py-2.5' }"
            @select="openCampaign"
          />
        </UPageCard>

        <div class="grid sm:grid-cols-2 gap-6">
          <UPageCard variant="outline" title="Traffic by campaign" description="Where your audience's attention comes from.">
            <DonutChart :items="trafficItems" center-label="Viewed" class="mt-3" />
          </UPageCard>
          <UPageCard variant="outline" title="Sales by campaign" description="Where your actual ticket sales come from.">
            <DonutChart :items="salesItems" center-label="Purchased" class="mt-3" />
          </UPageCard>
        </div>
      </div>

      <EventOverview
        v-else-if="tab === 'overview'"
        :slug="slug"
        :title="meta.title"
        @open-tab="t => tab = t"
      />
      <EventSales v-else-if="tab === 'sales'" />
    </UContainer>

    <!-- ════ new campaign modal ════ -->
    <UModal
      v-model:open="campaignModal"
      title="New campaign"
      description="A named bucket that groups tracking links — one promotional effort."
    >
      <template #body>
        <UFormField label="Campaign name" required help="Shown in reports exactly as typed.">
          <UInput
            v-model="newCampaignName"
            placeholder="Instagram — May post"
            class="w-full"
            autofocus
            @keyup.enter="createCampaign"
          />
        </UFormField>
      </template>
      <template #footer="{ close }">
        <div class="flex w-full justify-end gap-2">
          <UButton label="Cancel" color="neutral" variant="ghost" @click="close" />
          <UButton
            label="Create campaign"
            color="primary"
            :disabled="!newCampaignName.trim()"
            @click="createCampaign"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>
