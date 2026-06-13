<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import {
  campaignTotals, groupLinks, uniqueId, trackingUrl,
  KNOWN_SOURCES, MEDIUMS, fmtN, EVENTS_META
} from '~/utils/campaignAnalytics'
import type { TrackedLink } from '~/utils/campaignAnalytics'

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
  toast.add({ title: 'Tracking link copied', description: 'Paste it wherever this promo goes live.', icon: 'i-lucide-clipboard-check', color: 'success' })
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

const columns: TableColumn<TrackedLink>[] = [
  {
    accessorKey: 'label',
    header: 'Link',
    cell: ({ row }) => h('span', { class: 'font-medium text-highlighted' }, row.original.label)
  },
  {
    accessorKey: 'source',
    header: 'Source',
    cell: ({ row }) => h(UBadge, { label: row.original.source, color: 'neutral', variant: 'outline', size: 'sm' })
  },
  {
    accessorKey: 'medium',
    header: 'Medium',
    cell: ({ row }) => h(UBadge, { label: row.original.medium, color: 'neutral', variant: 'subtle', size: 'sm' })
  },
  { accessorKey: 'viewed', header: sortHeader('Viewed'), cell: numCell('viewed') },
  { accessorKey: 'initiated', header: sortHeader('Initiated checkout'), cell: numCell('initiated') },
  { accessorKey: 'purchased', header: sortHeader('Purchased'), cell: numCell('purchased') },
  {
    id: 'copy',
    header: () => h('span', { class: 'sr-only' }, 'Copy'),
    cell: ({ row }) => h(UButton, {
      'icon': 'i-lucide-copy',
      'color': 'neutral',
      'variant': 'ghost',
      'size': 'xs',
      'aria-label': 'Copy tracking link',
      'onClick': (e: Event) => {
        e.stopPropagation()
        copyLink(row.original)
      }
    })
  }
]

/* ——— shared source/medium toggle for both pies ——— */
const groupBy = ref<'source' | 'medium'>('source')
const groupTabs = [
  { label: 'By source', value: 'source' },
  { label: 'By medium', value: 'medium' }
]

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
  toast.add({ title: 'Tracking link created', description: 'Copy it from the list and share — numbers start at zero.', icon: 'i-lucide-link', color: 'success' })
}

const copyPreview = async () => {
  await navigator.clipboard.writeText(previewUrl.value)
  toast.add({ title: 'Link copied', icon: 'i-lucide-clipboard-check', color: 'success' })
}
</script>

<template>
  <div class="min-h-screen bg-muted">
    <AppHeader />

    <UContainer class="max-w-6xl pb-24">
      <UBreadcrumb
        :items="[
          { label: 'Events', icon: 'i-lucide-ticket', to: '/' },
          { label: eventMeta.title, to: `/events/${slug}` },
          { label: campaign.name }
        ]"
        class="pt-6"
      />

      <UPageHeader
        :title="campaign.name"
        :description="`Campaign · ${campaign.links.length} tracked ${campaign.links.length === 1 ? 'link' : 'links'} · ${eventMeta.title}`"
        :ui="{ root: 'border-none pt-4 pb-6' }"
      />

      <div class="flex flex-col gap-6">
        <FunnelStats :viewed="totals.viewed" :initiated="totals.initiated" :purchased="totals.purchased" />

        <UPageCard variant="outline">
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p class="text-base font-semibold text-highlighted">Links</p>
              <p class="text-[15px] text-muted mt-1">Every tracked URL in this campaign — copy one and share it.</p>
            </div>
            <UButton label="New tracking link" icon="i-lucide-plus" size="sm" @click="linkModal = true" />
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
            title="No links yet"
            description="Create your first tracking link, share it in a post or email, and the funnel starts counting."
            :actions="[{ label: 'New tracking link', icon: 'i-lucide-plus', onClick: () => { linkModal = true } }]"
            class="py-10"
          />
        </UPageCard>

        <template v-if="campaign.links.length">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 class="text-lg font-semibold text-highlighted">Breakdown</h2>
              <p class="text-sm text-muted mt-0.5">Same visitors, sliced two ways — both charts follow one toggle.</p>
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
            <UPageCard variant="outline" title="Traffic" :description="`Viewed users by ${groupBy}.`">
              <DonutChart :items="trafficItems" center-label="Viewed" class="mt-3" />
            </UPageCard>
            <UPageCard variant="outline" title="Sales" :description="`Purchased users by ${groupBy}.`">
              <DonutChart :items="salesItems" center-label="Purchased" class="mt-3" />
            </UPageCard>
          </div>
        </template>
      </div>
    </UContainer>

    <!-- ════ new tracking link modal ════ -->
    <UModal
      v-model:open="linkModal"
      title="New tracking link"
      description="One trackable URL — tagged with a source and a medium."
    >
      <template #body>
        <div class="flex flex-col gap-4">
          <UFormField label="Label" required help="For your eyes only — name the placement.">
            <UInput v-model="linkForm.label" placeholder="Story · countdown sticker" class="w-full" autofocus />
          </UFormField>

          <div class="grid grid-cols-2 gap-4">
            <UFormField label="Source" required help="The named place — type your own if missing.">
              <UInputMenu
                v-model="linkForm.source"
                :items="sourceItems"
                create-item
                placeholder="instagram"
                class="w-full"
                @create="onCreateSource"
              />
            </UFormField>
            <UFormField label="Medium" required help="The channel category.">
              <USelect v-model="linkForm.medium" :items="MEDIUMS" placeholder="social" class="w-full" />
            </UFormField>
          </div>

          <UFormField label="Your trackable URL" help="Generated automatically — this is what you share.">
            <div class="flex items-start gap-2">
              <div class="flex-1 rounded-md bg-elevated px-3 py-2.5 font-mono text-xs text-muted break-all">
                {{ previewUrl }}
              </div>
              <UButton
                icon="i-lucide-copy"
                color="neutral"
                variant="subtle"
                aria-label="Copy URL"
                :disabled="!linkValid"
                @click="copyPreview"
              />
            </div>
          </UFormField>
        </div>
      </template>
      <template #footer="{ close }">
        <div class="flex w-full justify-end gap-2">
          <UButton label="Cancel" color="neutral" variant="ghost" @click="close" />
          <UButton label="Create link" color="primary" :disabled="!linkValid" @click="createLink" />
        </div>
      </template>
    </UModal>
  </div>
</template>
