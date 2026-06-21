<script setup lang="ts">
import { fmtN, pct, campaignTotals, eventTotals } from '~/utils/campaignAnalytics'
import { EVENT_SALES_TOTALS, STATUS_BADGE, orderTotal, itemsLabel, displayEmail } from '~/utils/salesOrders'

const props = defineProps<{
  slug: string
  title: string
}>()

const emit = defineEmits<{ openTab: [tab: string] }>()

const toast = useToast()
const orders = useOrders()
const campaignList = useCampaigns()

/* ——— tiles ——— */
const tiles = computed(() => [
  {
    label: 'Tickets sold',
    value: fmtN(EVENT_SALES_TOTALS.tickets),
    sub: `of ${fmtN(EVENT_SALES_TOTALS.capacity)} capacity`,
    bar: (EVENT_SALES_TOTALS.tickets / EVENT_SALES_TOTALS.capacity) * 100
  },
  { label: 'Revenue', value: `${fmtN(EVENT_SALES_TOTALS.revenue)} Kč`, sub: 'gross, before fees' },
  { label: 'Event starts', value: 'in 9 days', sub: 'Sat 20 Jun · 19:00' }
])

/* ——— sales by ticket type ——— */
const typeSales = [
  { name: 'VIP', sold: 96, allocated: 224, dot: 'bg-indigo-500' },
  { name: 'Standard', sold: 1188, allocated: 2976, dot: 'bg-amber-400' }
]

/* ——— top campaign insight ——— */
const topCampaign = computed(() => {
  const totals = eventTotals(campaignList.value)
  let best: { name: string, purchased: number } | null = null
  for (const c of campaignList.value) {
    const t = campaignTotals(c)
    if (!best || t.purchased > best.purchased) best = { name: c.name, purchased: t.purchased }
  }
  return best ? { ...best, share: pct(best.purchased, totals.purchased) } : null
})

/* ——— recent orders ——— */
const salesSearch = useState('sales-search', () => '')
const recent = computed(() => [...orders.value].sort((a, b) => b.ts - a.ts).slice(0, 5))

const openOrder = (email: string, consent: boolean) => {
  salesSearch.value = consent ? email : displayEmail(recent.value.find(o => o.email === email)!)
  emit('openTab', 'sales')
}

/* ——— storefront link ——— */
const storefrontUrl = computed(() => `ticketify.cz/cvf/${props.slug}`)
const copyUrl = async () => {
  await navigator.clipboard.writeText(`https://${storefrontUrl.value}`)
  toast.add({ title: 'Link copied', icon: 'i-lucide-clipboard-check', color: 'success' })
}

/* ——— cancel event (doc: triggers bulk refunds for all sold tickets) ——— */
const cancelModal = ref(false)
const confirmCancel = () => {
  cancelModal.value = false
  toast.add({
    title: 'Event cancelled',
    description: `${fmtN(EVENT_SALES_TOTALS.tickets)} tickets are being refunded automatically. Buyers get a cancellation email with the refund amount.`,
    icon: 'i-lucide-calendar-x',
    color: 'warning'
  })
  navigateTo('/')
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- tiles -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <div v-for="t in tiles" :key="t.label" class="rounded-lg ring ring-default bg-default p-4">
        <p class="text-[11px] font-semibold uppercase tracking-wide text-muted">{{ t.label }}</p>
        <p class="text-2xl font-semibold text-highlighted tabular-nums mt-2">{{ t.value }}</p>
        <p class="text-xs text-muted mt-0.5">{{ t.sub }}</p>
        <div v-if="t.bar !== undefined" class="h-1 rounded-full bg-elevated mt-3 overflow-hidden">
          <div class="h-full rounded-full bg-primary" :style="{ width: t.bar + '%' }" />
        </div>
      </div>
    </div>

    <div class="grid lg:grid-cols-[2fr_1fr] gap-6 items-start">
      <!-- left column -->
      <div class="flex flex-col gap-6 min-w-0">
        <!-- sales by ticket type -->
        <UPageCard variant="outline" title="Sales by ticket type" description="How each tier is selling against its allocation.">
          <div class="flex flex-col gap-4 mt-3">
            <div v-for="t in typeSales" :key="t.name">
              <div class="flex items-center justify-between gap-3 text-sm">
                <span class="flex items-center gap-2 font-medium text-highlighted">
                  <span class="size-2.5 rounded-full" :class="t.dot" />
                  {{ t.name }}
                </span>
                <span class="tabular-nums text-muted">
                  <span class="font-semibold text-highlighted">{{ fmtN(t.sold) }}</span>
                  / {{ fmtN(t.allocated) }} · {{ pct(t.sold, t.allocated) }}
                </span>
              </div>
              <UProgress :model-value="t.sold" :max="t.allocated" size="sm" class="mt-2" />
            </div>
          </div>
        </UPageCard>

        <!-- recent orders -->
        <UPageCard variant="outline">
          <div class="flex items-center justify-between gap-3">
            <div>
              <p class="text-base font-semibold text-highlighted">Recent orders</p>
              <p class="text-[15px] text-muted mt-1">The last five — click one to find it in Sales.</p>
            </div>
            <UButton
              label="Open Sales"
              trailing-icon="i-lucide-arrow-right"
              color="neutral"
              variant="ghost"
              size="sm"
              @click="emit('openTab', 'sales')"
            />
          </div>
          <ul class="flex flex-col divide-y divide-default mt-3">
            <li v-for="o in recent" :key="o.id">
              <button
                type="button"
                class="w-full flex items-center gap-3 py-2.5 text-left hover:bg-elevated/50 rounded-md px-2 -mx-2 transition-colors"
                @click="openOrder(o.email, o.consent)"
              >
                <span class="text-sm font-medium text-highlighted tabular-nums">#{{ o.id }}</span>
                <span class="flex-1 text-sm text-muted truncate">{{ displayEmail(o) }} · {{ itemsLabel(o) }}</span>
                <UBadge v-bind="STATUS_BADGE[o.status]" size="sm" />
                <span class="text-sm tabular-nums font-medium text-highlighted w-20 text-right">{{ fmtN(orderTotal(o)) }} Kč</span>
              </button>
            </li>
          </ul>
        </UPageCard>

        <!-- editing rules while on sale (Flow 3 in the PoC doc) -->
        <UPageCard
          variant="outline"
          title="Editing while on sale"
          description="Until the event starts — Sat 20 Jun · 19:00 — some things stay flexible, the rest locked at publishing."
        >
          <div class="grid sm:grid-cols-2 gap-x-8 gap-y-4 mt-3">
            <div>
              <p class="text-[11px] font-semibold uppercase tracking-wide text-muted mb-2">Still editable</p>
              <ul class="flex flex-col gap-2 text-sm text-default">
                <li v-for="item in ['Change prices on existing types', 'Increase standing capacity']" :key="item" class="flex gap-2.5">
                  <UIcon name="i-lucide-circle-plus" class="size-4 shrink-0 text-success mt-0.5" />
                  {{ item }}
                </li>
              </ul>
            </div>
            <div>
              <p class="text-[11px] font-semibold uppercase tracking-wide text-muted mb-2">Locked since publishing</p>
              <ul class="flex flex-col gap-2 text-sm text-muted">
                <li v-for="item in ['Title, description & cover', 'Event dates', 'Type names & existing assignments', 'Capacity decreases']" :key="item" class="flex gap-2.5">
                  <UIcon name="i-lucide-lock" class="size-4 shrink-0 text-dimmed mt-0.5" />
                  {{ item }}
                </li>
              </ul>
            </div>
          </div>

          <USeparator class="my-4" />

          <div class="flex flex-wrap items-center justify-between gap-3">
            <p class="text-xs text-dimmed">
              Need a locked change? Cancel the event below or contact the Tickitify team.
            </p>
            <UButton
              label="Edit event"
              icon="i-lucide-pencil"
              color="neutral"
              variant="subtle"
              :to="`/events/${slug}/edit`"
            />
          </div>
        </UPageCard>

        <!-- danger zone -->
        <UPageCard variant="outline" :ui="{ root: 'ring-error/30' }">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p class="text-base font-semibold text-highlighted">Cancel event</p>
              <p class="text-[15px] text-muted mt-1">
                Stops sales and automatically refunds every sold ticket. This can't be undone.
              </p>
            </div>
            <UButton
              label="Cancel event"
              icon="i-lucide-calendar-x"
              color="error"
              variant="subtle"
              @click="cancelModal = true"
            />
          </div>
        </UPageCard>
      </div>

      <!-- right column -->
      <div class="flex flex-col gap-6">
        <!-- event card -->
        <UPageCard variant="outline">
          <div class="flex flex-col gap-3">
            <div>
              <p class="font-semibold text-highlighted">{{ title }}</p>
              <p class="flex items-center gap-1.5 text-sm text-muted mt-1">
                <UIcon name="i-lucide-map-pin" class="size-3.5 shrink-0" />
                Královka Arena · Praha
              </p>
              <p class="flex items-center gap-1.5 text-sm text-muted mt-0.5">
                <UIcon name="i-lucide-calendar" class="size-3.5 shrink-0" />
                Sat 20 Jun · 19:00–22:00
              </p>
            </div>
            <USeparator />
            <div>
              <p class="text-[11px] font-semibold uppercase tracking-wide text-muted mb-1.5">Storefront link</p>
              <UFieldGroup class="w-full">
                <UInput :model-value="storefrontUrl" readonly class="flex-1" size="sm" />
                <UButton icon="i-lucide-copy" color="neutral" variant="subtle" size="sm" aria-label="Copy link" @click="copyUrl" />
              </UFieldGroup>
            </div>
          </div>
        </UPageCard>

        <!-- top campaign insight -->
        <UPageCard v-if="topCampaign" variant="outline" title="Best-selling campaign">
          <div class="flex items-center justify-between gap-3 mt-2">
            <div class="min-w-0">
              <p class="font-medium text-highlighted truncate">{{ topCampaign.name }}</p>
              <p class="text-sm text-muted mt-0.5 tabular-nums">
                {{ fmtN(topCampaign.purchased) }} purchases · {{ topCampaign.share }} of attributed sales
              </p>
            </div>
            <UIcon name="i-lucide-trophy" class="size-5 shrink-0 text-amber-400" />
          </div>
          <UButton
            label="Open Marketing"
            trailing-icon="i-lucide-arrow-right"
            color="neutral"
            variant="ghost"
            size="sm"
            class="mt-3 -ml-2.5"
            @click="emit('openTab', 'marketing')"
          />
        </UPageCard>
      </div>
    </div>

    <!-- ════ cancel confirmation ════ -->
    <UModal
      v-model:open="cancelModal"
      :title="`Cancel ${title}?`"
      description="This stops sales immediately and can't be undone."
    >
      <template #body>
        <ul class="flex flex-col gap-2.5 text-sm text-default">
          <li class="flex gap-2.5">
            <UIcon name="i-lucide-undo-2" class="size-4 shrink-0 text-dimmed mt-0.5" />
            All {{ fmtN(EVENT_SALES_TOTALS.tickets) }} sold tickets are refunded automatically via Stripe.
          </li>
          <li class="flex gap-2.5">
            <UIcon name="i-lucide-mail" class="size-4 shrink-0 text-dimmed mt-0.5" />
            Every buyer gets a cancellation email with their refund amount.
          </li>
          <li class="flex gap-2.5">
            <UIcon name="i-lucide-eye-off" class="size-4 shrink-0 text-dimmed mt-0.5" />
            The event disappears from your storefront; the pending payout is reduced to zero.
          </li>
        </ul>
      </template>
      <template #footer="{ close }">
        <div class="flex w-full justify-end gap-2">
          <UButton label="Keep selling" color="neutral" variant="ghost" @click="close" />
          <UButton
            :label="`Cancel & refund ${fmtN(EVENT_SALES_TOTALS.tickets)} tickets`"
            icon="i-lucide-calendar-x"
            color="error"
            @click="confirmCancel"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>
