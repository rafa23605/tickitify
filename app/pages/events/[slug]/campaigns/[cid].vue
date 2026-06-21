<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import {
  campaignTotals, groupLinks, uniqueId, trackingUrl,
  KNOWN_SOURCES, MEDIUMS, fmtN, EVENTS_META
} from '~/utils/campaignAnalytics'
import type { TrackedLink } from '~/utils/campaignAnalytics'

const t = useT()
const route = useRoute()
const slug = computed(() => String(route.params.slug))
const cid = computed(() => String(route.params.cid))

const eventMeta = computed(() =>
  EVENTS_META[slug.value] ?? { title: slug.value, venue: '—', when: '—', status: 'draft' as const }
)

const campaignList = useCampaigns()
const campaign = computed(() => campaignList.value.find(c => c.id === cid.value) ?? campaignList.value[0]!)
const totals = computed(() => campaignTotals(campaign.value))

useHead({ title: () => `${campaign.value.name} · ${eventMeta.value.title} · Tickitify` })

const toast = useToast()

const copyLink = async (l: { id: string, source: string, medium: string }) => {
  await navigator.clipboard.writeText(trackingUrl(slug.value, campaign.value.id, l))
  toast.add({ title: t('campaign.toastLinkCopiedTitle'), description: t('campaign.toastLinkCopiedDesc'), icon: 'i-lucide-clipboard-check', color: 'success' })
}

/* ——— link table ——— */
const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')

const sorting = ref([{ id: 'viewed', desc: true }])

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

const columns = computed<TableColumn<TrackedLink>[]>(() => [
  {
    accessorKey: 'label',
    header: t('campaign.colLink'),
    cell: ({ row }) => h('div', { class: 'flex flex-col gap-0.5 min-w-0' }, [
      h('span', { class: 'font-medium text-highlighted' }, row.original.label),
      h('span', { class: 'font-mono text-xs text-dimmed truncate max-w-[340px]' }, trackingUrl(slug.value, campaign.value.id, row.original).replace(/^https:\/\//, ''))
    ])
  },
  {
    accessorKey: 'source',
    header: t('campaign.colSource'),
    cell: ({ row }) => h(UBadge, { label: row.original.source, color: 'neutral', variant: 'outline', size: 'sm' })
  },
  {
    accessorKey: 'medium',
    header: t('campaign.colMedium'),
    cell: ({ row }) => h(UBadge, { label: row.original.medium, color: 'neutral', variant: 'subtle', size: 'sm' })
  },
  { accessorKey: 'viewed', header: sortHeader(t('campaign.colViewed')), cell: numCell('viewed') },
  { accessorKey: 'initiated', header: sortHeader(t('campaign.colInitiated')), cell: numCell('initiated') },
  { accessorKey: 'purchased', header: sortHeader(t('campaign.colPurchased')), cell: numCell('purchased') },
  {
    id: 'copy',
    header: () => h('span', { class: 'sr-only' }, t('campaign.colCopy')),
    cell: ({ row }) => h(UButton, {
      'label': t('campaign.copyLink'),
      'icon': 'i-lucide-copy',
      'color': 'neutral',
      'variant': 'subtle',
      'size': 'xs',
      'aria-label': t('campaign.copyLinkAria'),
      'onClick': (e: Event) => {
        e.stopPropagation()
        copyLink(row.original)
      }
    })
  }
])

/* ——— shared source/medium toggle for both pies ——— */
const groupBy = ref<'source' | 'medium'>('source')
const groupTabs = computed(() => [
  { label: t('campaign.tabBySource'), value: 'source' },
  { label: t('campaign.tabByMedium'), value: 'medium' }
])

const grouped = computed(() => groupLinks(campaign.value.links, groupBy.value))
const trafficItems = computed(() => grouped.value.map(g => ({ label: g.key, value: g.viewed, color: g.color.cssVar, dot: g.color.dot })))
const salesItems = computed(() => grouped.value.map(g => ({ label: g.key, value: g.purchased, color: g.color.cssVar, dot: g.color.dot })))

/* ——— new link modal ——— */
const linkModal = ref(false)
const sourceItems = ref([...KNOWN_SOURCES])
const linkForm = reactive({ label: '', source: '', medium: '' })

const onCreateSource = (item: string) => {
  sourceItems.value.push(item)
  linkForm.source = item
}

const previewUrl = computed(() => trackingUrl(slug.value, campaign.value.id, {
  id: linkForm.label ? uniqueId(linkForm.label, []) : '',
  source: linkForm.source,
  medium: linkForm.medium
}))

const linkValid = computed(() => !!(linkForm.label.trim() && linkForm.source && linkForm.medium))

const createLink = () => {
  if (!linkValid.value) return
  const id = uniqueId(linkForm.label, campaign.value.links.map(l => l.id))
  campaign.value.links.unshift({
    id,
    label: linkForm.label.trim(),
    source: linkForm.source,
    medium: linkForm.medium,
    viewed: 0,
    initiated: 0,
    purchased: 0
  })
  linkModal.value = false
  linkForm.label = ''
  linkForm.source = ''
  linkForm.medium = ''
  toast.add({ title: t('campaign.toastLinkCreatedTitle'), description: t('campaign.toastLinkCreatedDesc'), icon: 'i-lucide-link', color: 'success' })
}

const copyPreview = async () => {
  await navigator.clipboard.writeText(previewUrl.value)
  toast.add({ title: t('campaign.toastCopiedTitle'), icon: 'i-lucide-clipboard-check', color: 'success' })
}
</script>

<template>
  <div class="min-h-screen bg-muted">
    <AppHeader />

    <UContainer class="max-w-6xl pb-24">
      <UBreadcrumb
        :items="[
          { label: t('campaign.breadcrumbEvents'), icon: 'i-lucide-ticket', to: '/' },
          { label: eventMeta.title, to: `/events/${slug}` },
          { label: campaign.name }
        ]"
        class="pt-6"
      />

      <UPageHeader
        :title="campaign.name"
        :description="t('campaign.headerDesc', { n: campaign.links.length, links: campaign.links.length === 1 ? t('campaign.linkSingular') : t('campaign.linkPlural'), event: eventMeta.title })"
        :ui="{ root: 'border-none pt-4 pb-6' }"
      />

      <div class="flex flex-col gap-6">
        <FunnelStats :viewed="totals.viewed" :initiated="totals.initiated" :purchased="totals.purchased" />

        <UPageCard variant="outline">
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p class="text-base font-semibold text-highlighted">{{ t('campaign.linksTitle') }}</p>
              <p class="text-[15px] text-muted mt-1">{{ t('campaign.linksDesc') }}</p>
            </div>
            <UButton :label="t('campaign.newLink')" icon="i-lucide-plus" size="sm" @click="linkModal = true" />
          </div>

          <UTable
            v-if="campaign.links.length"
            v-model:sorting="sorting"
            :data="campaign.links"
            :columns="columns"
            class="mt-3"
            :ui="{ td: 'py-3', th: 'py-2.5' }"
          />
          <UEmpty
            v-else
            icon="i-lucide-link"
            :title="t('campaign.emptyTitle')"
            :description="t('campaign.emptyDesc')"
            :actions="[{ label: t('campaign.newLink'), icon: 'i-lucide-plus', onClick: () => { linkModal = true } }]"
            class="py-10"
          />
        </UPageCard>

        <template v-if="campaign.links.length">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 class="text-lg font-semibold text-highlighted">{{ t('campaign.breakdownTitle') }}</h2>
              <p class="text-sm text-muted mt-0.5">{{ t('campaign.breakdownDesc') }}</p>
            </div>
            <UTabs
              v-model="groupBy"
              :items="groupTabs"
              :content="false"
              color="neutral"
              size="sm"
              class="w-56"
            />
          </div>

          <div class="grid sm:grid-cols-2 gap-6">
            <UPageCard variant="outline" :title="t('campaign.trafficTitle')" :description="t('campaign.trafficDesc', { by: groupBy === 'source' ? t('campaign.groupSource') : t('campaign.groupMedium') })">
              <DonutChart :items="trafficItems" :center-label="t('campaign.trafficCenter')" class="mt-3" />
            </UPageCard>
            <UPageCard variant="outline" :title="t('campaign.salesTitle')" :description="t('campaign.salesDesc', { by: groupBy === 'source' ? t('campaign.groupSource') : t('campaign.groupMedium') })">
              <DonutChart :items="salesItems" :center-label="t('campaign.salesCenter')" class="mt-3" />
            </UPageCard>
          </div>
        </template>
      </div>
    </UContainer>

    <!-- ════ new tracking link modal ════ -->
    <UModal
      v-model:open="linkModal"
      :title="t('campaign.modalTitle')"
      :description="t('campaign.modalDesc')"
    >
      <template #body>
        <div class="flex flex-col gap-4">
          <UFormField :label="t('campaign.labelField')" required :help="t('campaign.labelHelp')">
            <UInput v-model="linkForm.label" :placeholder="t('campaign.labelPlaceholder')" class="w-full" autofocus />
          </UFormField>

          <div class="grid grid-cols-2 gap-4">
            <UFormField :label="t('campaign.sourceField')" required :help="t('campaign.sourceHelp')">
              <UInputMenu
                v-model="linkForm.source"
                :items="sourceItems"
                create-item
                :placeholder="t('campaign.sourcePlaceholder')"
                class="w-full"
                @create="onCreateSource"
              />
            </UFormField>
            <UFormField :label="t('campaign.mediumField')" required :help="t('campaign.mediumHelp')">
              <USelect v-model="linkForm.medium" :items="MEDIUMS" :placeholder="t('campaign.mediumPlaceholder')" class="w-full" />
            </UFormField>
          </div>

          <UFormField :label="t('campaign.urlField')" :help="t('campaign.urlHelp')">
            <div class="flex items-start gap-2">
              <div class="flex-1 rounded-md bg-elevated px-3 py-2.5 font-mono text-xs text-muted break-all">
                {{ previewUrl }}
              </div>
              <UButton
                icon="i-lucide-copy"
                color="neutral"
                variant="subtle"
                :aria-label="t('campaign.copyUrlAria')"
                :disabled="!linkValid"
                @click="copyPreview"
              />
            </div>
          </UFormField>
        </div>
      </template>
      <template #footer="{ close }">
        <div class="flex w-full justify-end gap-2">
          <UButton :label="t('campaign.cancel')" color="neutral" variant="ghost" @click="close" />
          <UButton :label="t('campaign.createLink')" color="primary" :disabled="!linkValid" @click="createLink" />
        </div>
      </template>
    </UModal>
  </div>
</template>
