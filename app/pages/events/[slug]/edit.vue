<script setup lang="ts">
import { fmtN, EVENTS_META } from '~/utils/campaignAnalytics'
import { LIVE_TYPES, STANDING_ZONE } from '~/utils/eventConfig'

const t = useT()
const route = useRoute()
const slug = computed(() => String(route.params.slug))
const meta = computed(() =>
  EVENTS_META[slug.value] ?? { title: slug.value, venue: '—', when: '—', status: 'published' as const }
)

useHead({ title: () => `${t('edit.docTitlePrefix')} · ${meta.value.title} · Tickitify` })

const toast = useToast()

/* ——— ticket types: existing names locked, prices editable ——— */
interface EditType {
  id: string
  name: string
  price: number | null
  locked: boolean
  assignedLabel?: string
}

const originalPrices: Record<string, number> = Object.fromEntries(LIVE_TYPES.map(t => [t.id, t.price]))
const types = ref<EditType[]>([
  ...LIVE_TYPES.map(t => ({ ...t, locked: true } as EditType))
])

const SEAT_PALETTE = [
  { bg: 'bg-indigo-500' },
  { bg: 'bg-amber-400' },
  { bg: 'bg-teal-500' },
  { bg: 'bg-rose-500' },
  { bg: 'bg-sky-500' }
]
const typeStyles = computed<Record<string, { bg: string }>>(() =>
  Object.fromEntries(types.value.map((t, i) => [t.id, SEAT_PALETTE[i % SEAT_PALETTE.length]!]))
)

/* ——— standing: type locked, capacity can only grow ——— */
const capacity = ref<number>(STANDING_ZONE.capacity)
const capacityChanged = computed(() => capacity.value > STANDING_ZONE.capacity)

/* ——— which fields differ from the live event (drives the soft highlight) ——— */
const priceChanged = (t: EditType) => t.locked && !!t.price && t.price !== originalPrices[t.id]

/* ——— change summary: price changes on existing types + standing capacity increase ——— */
const changes = computed(() => {
  const list: string[] = []
  for (const t of types.value) {
    if (priceChanged(t)) {
      list.push(`${t.name} ${fmtN(originalPrices[t.id]!)} → ${fmtN(t.price!)} Kč`)
    }
  }
  if (capacityChanged.value) list.push(`${t('edit.standingPrefix')} ${fmtN(STANDING_ZONE.capacity)} → ${fmtN(capacity.value)}`)
  return list
})

const priceChangeCount = computed(() => types.value.filter(priceChanged).length)
const canSave = computed(() => changes.value.length > 0)

/* ——— save confirmation ——— */
const confirmOpen = ref(false)

const confirmSummary = computed(() => {
  const parts: string[] = []
  if (priceChangeCount.value) {
    parts.push(
      priceChangeCount.value === 1
        ? t('edit.confirmSummaryPrice1')
        : t('edit.confirmSummaryPrices', { n: priceChangeCount.value })
    )
  }
  if (capacityChanged.value) parts.push(t('edit.confirmSummaryCapacity'))
  return parts.join(t('edit.confirmSummaryJoin'))
})

const save = () => {
  confirmOpen.value = false
  toast.add({
    title: t('edit.toastTitle'),
    description: changes.value.length === 1
      ? t('edit.toastDesc1')
      : t('edit.toastDescN', { n: changes.value.length }),
    icon: 'i-lucide-check-circle',
    color: 'success'
  })
  navigateTo(`/events/${slug.value}`)
}
</script>

<template>
  <div class="min-h-screen bg-muted">
    <AppHeader />

    <UContainer class="max-w-6xl pb-32">
      <UBreadcrumb
        :items="[
          { label: t('edit.breadcrumbEvents'), icon: 'i-lucide-ticket', to: '/' },
          { label: meta.title, to: `/events/${slug}` },
          { label: t('edit.breadcrumbEdit') }
        ]"
        class="pt-6"
      />

      <UPageHeader
        :description="t('edit.headerDescription')"
        :ui="{ root: 'border-none pt-4 pb-6' }"
      >
        <template #title>
          <span class="flex items-center gap-3">
            {{ t('edit.headerTitle') }}
            <UBadge :label="t('edit.badgeOnSale')" color="success" variant="subtle" />
          </span>
        </template>
      </UPageHeader>

      <div class="flex flex-col gap-6">
        <!-- locked details -->
        <UPageCard
          variant="outline"
          :title="t('edit.detailsTitle')"
          :description="t('edit.detailsDescription')"
        >
          <div class="mt-3">
            <dl class="flex flex-col gap-2 text-sm min-w-0">
              <div v-for="row in [
                { label: t('edit.rowTitle'), value: meta.title },
                { label: t('edit.rowSchedule'), value: `${meta.when}–22:00` },
                { label: t('edit.rowVenue'), value: meta.venue }
              ]" :key="row.label" class="flex items-center justify-between gap-4">
                <dt class="text-muted">{{ row.label }}</dt>
                <dd class="flex items-center gap-1.5 font-medium text-highlighted text-right truncate">
                  {{ row.value }}
                  <UIcon name="i-lucide-lock" class="size-3 shrink-0 text-dimmed" />
                </dd>
              </div>
            </dl>
          </div>
          <p class="text-xs text-dimmed mt-3">
            {{ t('edit.detailsLockedNote') }}
          </p>
        </UPageCard>

        <!-- ticket types -->
        <UPageCard
          variant="outline"
          :title="t('edit.typesTitle')"
          :description="t('edit.typesDescription')"
        >
          <div class="hidden sm:flex items-center gap-3 mt-3 mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted">
            <span class="w-2.5" />
            <span class="flex-1">{{ t('edit.colType') }}</span>
            <span class="w-36">{{ t('edit.colPrice') }}</span>
            <span class="w-36">{{ t('edit.colAssigned') }}</span>
          </div>

          <div class="flex flex-col divide-y divide-default">
            <div v-for="t in types" :key="t.id" class="flex flex-wrap sm:flex-nowrap items-center gap-3 py-3">
              <span class="size-2.5 rounded-full shrink-0" :class="typeStyles[t.id]?.bg" />
              <UInput
                v-model="t.name"
                disabled
                trailing-icon="i-lucide-lock"
                class="flex-1 min-w-36"
              />
              <UInputNumber
                v-model="t.price"
                :min="0"
                :step="50"
                :format-options="{ maximumFractionDigits: 0 }"
                placeholder="400"
                class="w-36"
                :color="priceChanged(t) ? 'primary' : undefined"
                :highlight="priceChanged(t)"
                :ui="{ base: priceChanged(t) ? 'pe-8 bg-primary/10' : 'pe-8' }"
              >
                <template #trailing>
                  <UIcon name="i-lucide-pencil" class="size-3.5 text-muted" />
                </template>
              </UInputNumber>
              <span class="w-36 text-sm tabular-nums" :class="t.assignedLabel ? 'text-default' : 'text-dimmed'">
                {{ t.assignedLabel ?? '—' }}
              </span>
            </div>
          </div>

          <p class="flex items-center gap-1.5 text-xs text-muted mt-2">
            <UIcon name="i-lucide-pencil" class="size-3.5 shrink-0" />
            {{ t('edit.typesPriceNote') }}
          </p>
        </UPageCard>

        <!-- standing zones — always visible; capacity is increase-only -->
        <UPageCard
          variant="outline"
          :title="t('edit.standingTitle')"
          :description="t('edit.standingDescription')"
        >
          <div class="flex flex-wrap items-end gap-x-8 gap-y-4 mt-3">
            <div class="min-w-44">
              <p class="text-sm font-medium text-highlighted">{{ STANDING_ZONE.name }}</p>
              <p class="text-xs text-muted mt-0.5">{{ t('edit.venueMax', { max: fmtN(STANDING_ZONE.max), current: fmtN(STANDING_ZONE.capacity) }) }}</p>
            </div>

            <UFormField :label="t('edit.soldAsLabel')" class="w-56">
              <UInput model-value="Standard · 400 CZK" disabled trailing-icon="i-lucide-lock" class="w-full" />
            </UFormField>

            <UFormField class="w-56">
              <template #label>
                <span class="flex items-center gap-2">
                  {{ t('edit.sellableLabel') }}
                  <UTooltip :text="t('edit.sellableTooltip')">
                    <UIcon name="i-lucide-circle-help" class="size-3.5 text-muted" />
                  </UTooltip>
                </span>
              </template>
              <UInputNumber
                v-model="capacity"
                :min="STANDING_ZONE.capacity"
                :max="STANDING_ZONE.max"
                :step="20"
                class="w-full"
                :color="capacityChanged ? 'primary' : undefined"
                :highlight="capacityChanged"
                :ui="{ base: capacityChanged ? 'bg-primary/10' : '' }"
              />
            </UFormField>
          </div>
        </UPageCard>
      </div>

      <!-- ════ sticky save bar ════ -->
      <div class="sticky bottom-4 z-40 mt-8">
        <div class="rounded-lg ring ring-default bg-default/90 backdrop-blur px-4 py-3 shadow-lg flex flex-wrap items-center gap-3">
          <template v-if="changes.length">
            <UBadge
              v-for="c in changes"
              :key="c"
              :label="c"
              color="primary"
              variant="subtle"
              size="sm"
            />
          </template>
          <span v-else class="text-sm text-dimmed">{{ t('edit.noChanges') }}</span>
          <span class="flex-1" />
          <UButton :label="t('edit.discard')" color="neutral" variant="ghost" :to="`/events/${slug}`" />
          <UButton
            :label="changes.length ? (changes.length === 1 ? t('edit.saveChange1') : t('edit.saveChangesN', { n: changes.length })) : t('edit.saveChanges')"
            icon="i-lucide-check"
            color="primary"
            :disabled="!canSave"
            @click="confirmOpen = true"
          />
        </div>
      </div>

      <!-- ════ save confirmation ════ -->
      <UModal
        v-model:open="confirmOpen"
        :title="t('edit.confirmTitle')"
        :description="t('edit.confirmDescription', { summary: confirmSummary })"
      >
        <template #body>
          <ul class="flex flex-col gap-2.5">
            <li
              v-for="c in changes"
              :key="c"
              class="flex items-center gap-2 text-sm font-medium text-highlighted"
            >
              <UIcon name="i-lucide-arrow-right" class="size-4 shrink-0 text-primary" />
              {{ c }}
            </li>
          </ul>
          <p class="text-sm text-muted mt-4">
            {{ t('edit.confirmBodyNote') }}
          </p>
        </template>
        <template #footer="{ close }">
          <div class="flex w-full justify-end gap-2">
            <UButton :label="t('edit.cancel')" color="neutral" variant="ghost" @click="close" />
            <UButton :label="t('edit.saveChanges')" icon="i-lucide-check" color="primary" @click="save" />
          </div>
        </template>
      </UModal>
    </UContainer>
  </div>
</template>
