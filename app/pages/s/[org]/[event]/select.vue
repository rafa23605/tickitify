<script setup lang="ts">
definePageMeta({ layout: 'storefront' })

const route = useRoute()
const t = useT()
const org = computed(() => String(route.params.org))
const slug = computed(() => String(route.params.event))
const event = computed(() => STORE_EVENTS[slug.value] ?? null)
const eventLink = computed(() => `/s/${org.value}/${slug.value}`)

useHead({ title: () => 'Výběr míst · Tickitify' })

interface SeatVM { key: string, taken: boolean, tierId: string, price: number, dot: string, label: string }

const blocks = computed(() =>
  SECTORS.map((sector, idx) => {
    const tier = tierById(sector.tierId)!
    const rows: SeatVM[][] = []
    for (let r = 1; r <= sector.rows; r++) {
      const row: SeatVM[] = []
      for (let c = 1; c <= sector.cols; c++) {
        row.push({
          key: `${sector.id}-${r}-${c}`,
          taken: isSeatTaken(idx, r, c),
          tierId: sector.tierId,
          price: tier.price,
          dot: tier.dot,
          label: `${sector.name} · ř. ${r}, m. ${c}`
        })
      }
      rows.push(row)
    }
    return { sector, tier, rows }
  })
)
const bySide = (side: 'N' | 'S' | 'W' | 'E') => blocks.value.find(b => b.sector.side === side)

const activeTier = ref<string | null>(null)
const toggleTier = (id: string) => { activeTier.value = activeTier.value === id ? null : id }
const dimmed = (seat: SeatVM) => !!activeTier.value && seat.tierId !== activeTier.value

const selected = ref<SeatVM[]>([])
const isSelected = (key: string) => selected.value.some(s => s.key === key)
const toggleSeat = (seat: SeatVM) => {
  if (seat.taken || dimmed(seat)) return
  const i = selected.value.findIndex(s => s.key === seat.key)
  if (i >= 0) selected.value.splice(i, 1)
  else selected.value.push(seat)
}

const count = computed(() => selected.value.length)
const total = computed(() => selected.value.reduce((s, x) => s + x.price, 0))

const confirm = () => {
  if (!count.value) return
  useStoreCart().value = selected.value.map(s => ({ uid: s.key, tierId: s.tierId, label: s.label, price: s.price }))
  navigateTo(`/s/${org.value}/${slug.value}/checkout`)
}

const seatClass = (seat: SeatVM) => [
  seat.taken ? 'bg-muted cursor-not-allowed' : seat.dot,
  isSelected(seat.key) ? 'ring-2 ring-offset-2 ring-offset-default ring-inverted scale-110 z-10' : '',
  (!seat.taken && dimmed(seat)) ? 'opacity-20' : ''
]
</script>

<template>
  <div v-if="event" class="pb-24">
    <!-- back + interactive price legend -->
    <div class="sticky top-14 z-30 bg-default/90 backdrop-blur border-b border-default">
      <div class="px-4 py-2.5 flex items-center gap-2">
        <UButton :to="eventLink" icon="i-lucide-chevron-left" color="neutral" variant="ghost" size="sm" square :aria-label="t('store.back')" class="shrink-0" />
        <div class="overflow-x-auto -my-1 py-1">
          <div class="flex items-center gap-2 w-max">
            <button
              v-for="ti in SEAT_TIERS"
              :key="ti.id"
              class="flex items-center gap-1.5 shrink-0 rounded-full px-2.5 py-1 ring transition-colors"
              :class="activeTier === ti.id ? 'ring-primary bg-primary/10' : 'ring-default bg-elevated/60'"
              @click="toggleTier(ti.id)"
            >
              <span class="size-2 rounded-full shrink-0" :class="ti.dot" />
              <span class="text-xs font-medium text-toned">{{ ti.name }}</span>
              <span class="text-xs text-muted tabular-nums">{{ fmtCzk(ti.price) }}</span>
            </button>
            <button v-if="activeTier" class="text-xs text-primary shrink-0 px-1" @click="activeTier = null">{{ t('store.select.clearFilter') }}</button>
          </div>
        </div>
      </div>
    </div>

    <p class="px-4 pt-4 text-xs text-muted text-center">{{ t('store.select.hint') }}</p>

    <!-- arena: court in the centre, stands on all four sides -->
    <div class="px-4 pt-4 flex flex-col items-center gap-3">
      <!-- North -->
      <div v-if="bySide('N')" class="w-full">
        <p class="text-center text-[11px] font-semibold uppercase tracking-wide text-muted mb-1.5">
          {{ bySide('N')!.sector.name }} · {{ fmtCzk(bySide('N')!.tier.price) }}
        </p>
        <div class="flex flex-col items-center gap-1">
          <div v-for="(row, ri) in bySide('N')!.rows" :key="ri" class="flex gap-1">
            <button v-for="seat in row" :key="seat.key" :disabled="seat.taken || dimmed(seat)" class="size-3 rounded-full transition" :class="seatClass(seat)" @click="toggleSeat(seat)" />
          </div>
        </div>
      </div>

      <!-- middle: West | COURT | East -->
      <div class="w-full flex items-stretch justify-center gap-3">
        <div v-if="bySide('W')" class="flex flex-col">
          <p class="text-[11px] font-semibold uppercase tracking-wide text-muted mb-1.5 text-center">{{ bySide('W')!.sector.name }}</p>
          <div class="flex flex-col items-center gap-1 flex-1 justify-center">
            <div v-for="(row, ri) in bySide('W')!.rows" :key="ri" class="flex gap-1">
              <button v-for="seat in row" :key="seat.key" :disabled="seat.taken || dimmed(seat)" class="size-3 rounded-full transition" :class="seatClass(seat)" @click="toggleSeat(seat)" />
            </div>
          </div>
        </div>

        <div class="flex-1 min-w-16 rounded-lg bg-elevated ring ring-default flex items-center justify-center self-stretch">
          <span class="text-[11px] font-semibold uppercase tracking-widest text-muted">{{ t('store.select.court') }}</span>
        </div>

        <div v-if="bySide('E')" class="flex flex-col">
          <p class="text-[11px] font-semibold uppercase tracking-wide text-muted mb-1.5 text-center">{{ bySide('E')!.sector.name }}</p>
          <div class="flex flex-col items-center gap-1 flex-1 justify-center">
            <div v-for="(row, ri) in bySide('E')!.rows" :key="ri" class="flex gap-1">
              <button v-for="seat in row" :key="seat.key" :disabled="seat.taken || dimmed(seat)" class="size-3 rounded-full transition" :class="seatClass(seat)" @click="toggleSeat(seat)" />
            </div>
          </div>
        </div>
      </div>

      <!-- South -->
      <div v-if="bySide('S')" class="w-full">
        <div class="flex flex-col items-center gap-1">
          <div v-for="(row, ri) in bySide('S')!.rows" :key="ri" class="flex gap-1">
            <button v-for="seat in row" :key="seat.key" :disabled="seat.taken || dimmed(seat)" class="size-3 rounded-full transition" :class="seatClass(seat)" @click="toggleSeat(seat)" />
          </div>
        </div>
        <p class="text-center text-[11px] font-semibold uppercase tracking-wide text-muted mt-1.5">
          {{ bySide('S')!.sector.name }} · {{ fmtCzk(bySide('S')!.tier.price) }}
        </p>
      </div>
    </div>

    <!-- selected seats chips -->
    <div v-if="count" class="px-4 pt-5 flex flex-wrap gap-2">
      <span v-for="s in selected" :key="s.key" class="inline-flex items-center gap-1.5 rounded-full bg-elevated ring ring-default pl-2.5 pr-1.5 py-1 text-xs text-toned">
        {{ s.label }}
        <button class="text-dimmed hover:text-default" @click="toggleSeat(s)"><UIcon name="i-lucide-x" class="size-3.5" /></button>
      </span>
    </div>

    <!-- sticky bottom bar -->
    <div class="fixed bottom-0 inset-x-0 z-40 border-t border-default bg-default/90 backdrop-blur">
      <div class="mx-auto max-w-md px-4 py-3 flex items-center gap-3">
        <div class="shrink-0">
          <p class="text-[11px] text-muted leading-none">{{ count }} {{ t('store.select.pcs') }}</p>
          <p class="text-base font-bold text-highlighted tabular-nums mt-0.5">{{ fmtCzk(total) }}</p>
        </div>
        <UButton class="flex-1 justify-center" size="lg" color="primary" :label="t('store.select.continue')" :disabled="!count" @click="confirm" />
      </div>
    </div>
  </div>

  <div v-else class="px-6 py-24 text-center">
    <UIcon name="i-lucide-ticket-x" class="size-10 text-dimmed mx-auto" />
    <h1 class="text-lg font-semibold text-highlighted mt-4">{{ t('store.select.naTitle') }}</h1>
  </div>
</template>
