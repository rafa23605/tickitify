<script setup lang="ts">
/** Volleyball arena seat picker — court in the centre, stands on all four sides.
 *  Shared by the mobile /select page and the desktop event-page embed. Seats scale up on lg. */
const selected = defineModel<SeatVM[]>({ default: () => [] })
const t = useT()

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

const isSelected = (key: string) => selected.value.some(s => s.key === key)
const toggleSeat = (seat: SeatVM) => {
  if (seat.taken || dimmed(seat)) return
  const i = selected.value.findIndex(s => s.key === seat.key)
  const next = [...selected.value]
  if (i >= 0) next.splice(i, 1)
  else next.push(seat)
  selected.value = next
}

const seatClass = (seat: SeatVM) => [
  seat.taken ? 'bg-muted cursor-not-allowed' : seat.dot,
  isSelected(seat.key) ? 'ring-2 ring-offset-2 ring-offset-default ring-inverted scale-110 z-10' : '',
  (!seat.taken && dimmed(seat)) ? 'opacity-20' : ''
]
</script>

<template>
  <div>
    <!-- interactive price legend / filter -->
    <div class="overflow-x-auto -mx-1 px-1 py-1">
      <div class="flex items-center justify-start lg:justify-center gap-2 w-max lg:w-auto lg:flex-wrap">
        <button
          v-for="ti in SEAT_TIERS"
          :key="ti.id"
          class="flex items-center gap-1.5 shrink-0 rounded-full px-2.5 py-1 ring transition-colors"
          :class="activeTier === ti.id ? 'ring-primary bg-primary/10' : 'ring-default bg-elevated/60 hover:bg-elevated'"
          @click="toggleTier(ti.id)"
        >
          <span class="size-2 rounded-full shrink-0" :class="ti.dot" />
          <span class="text-xs font-medium text-toned">{{ ti.name }}</span>
          <span class="text-xs text-muted tabular-nums">{{ fmtCzk(ti.price) }}</span>
        </button>
        <button v-if="activeTier" class="text-xs text-primary shrink-0 px-1" @click="activeTier = null">{{ t('store.select.clearFilter') }}</button>
      </div>
    </div>

    <!-- arena: court in the centre, stands on all four sides -->
    <div class="pt-5 flex flex-col items-center gap-3 lg:gap-4">
      <!-- North -->
      <div v-if="bySide('N')" class="w-full">
        <p class="text-center text-[11px] font-semibold uppercase tracking-wide text-muted mb-1.5">
          {{ bySide('N')!.sector.name }} · {{ fmtCzk(bySide('N')!.tier.price) }}
        </p>
        <div class="flex flex-col items-center gap-1 lg:gap-1.5">
          <div v-for="(row, ri) in bySide('N')!.rows" :key="ri" class="flex gap-1 lg:gap-1.5">
            <button v-for="seat in row" :key="seat.key" :disabled="seat.taken || dimmed(seat)" class="size-3 lg:size-4 rounded-full transition" :class="seatClass(seat)" :title="seat.label" @click="toggleSeat(seat)" />
          </div>
        </div>
      </div>

      <!-- middle: West | COURT | East -->
      <div class="w-full flex items-stretch justify-center gap-3 lg:gap-4">
        <div v-if="bySide('W')" class="flex flex-col">
          <p class="text-[11px] font-semibold uppercase tracking-wide text-muted mb-1.5 text-center">{{ bySide('W')!.sector.name }}</p>
          <div class="flex flex-col items-center gap-1 lg:gap-1.5 flex-1 justify-center">
            <div v-for="(row, ri) in bySide('W')!.rows" :key="ri" class="flex gap-1 lg:gap-1.5">
              <button v-for="seat in row" :key="seat.key" :disabled="seat.taken || dimmed(seat)" class="size-3 lg:size-4 rounded-full transition" :class="seatClass(seat)" :title="seat.label" @click="toggleSeat(seat)" />
            </div>
          </div>
        </div>

        <div class="flex-1 min-w-16 max-w-xs rounded-lg bg-elevated ring ring-default flex items-center justify-center self-stretch py-6">
          <span class="text-[11px] lg:text-xs font-semibold uppercase tracking-widest text-muted">{{ t('store.select.court') }}</span>
        </div>

        <div v-if="bySide('E')" class="flex flex-col">
          <p class="text-[11px] font-semibold uppercase tracking-wide text-muted mb-1.5 text-center">{{ bySide('E')!.sector.name }}</p>
          <div class="flex flex-col items-center gap-1 lg:gap-1.5 flex-1 justify-center">
            <div v-for="(row, ri) in bySide('E')!.rows" :key="ri" class="flex gap-1 lg:gap-1.5">
              <button v-for="seat in row" :key="seat.key" :disabled="seat.taken || dimmed(seat)" class="size-3 lg:size-4 rounded-full transition" :class="seatClass(seat)" :title="seat.label" @click="toggleSeat(seat)" />
            </div>
          </div>
        </div>
      </div>

      <!-- South -->
      <div v-if="bySide('S')" class="w-full">
        <div class="flex flex-col items-center gap-1 lg:gap-1.5">
          <div v-for="(row, ri) in bySide('S')!.rows" :key="ri" class="flex gap-1 lg:gap-1.5">
            <button v-for="seat in row" :key="seat.key" :disabled="seat.taken || dimmed(seat)" class="size-3 lg:size-4 rounded-full transition" :class="seatClass(seat)" :title="seat.label" @click="toggleSeat(seat)" />
          </div>
        </div>
        <p class="text-center text-[11px] font-semibold uppercase tracking-wide text-muted mt-1.5">
          {{ bySide('S')!.sector.name }} · {{ fmtCzk(bySide('S')!.tier.price) }}
        </p>
      </div>
    </div>

    <!-- selected seats chips -->
    <div v-if="selected.length" class="pt-5 flex flex-wrap gap-2 justify-center lg:justify-start">
      <span v-for="s in selected" :key="s.key" class="inline-flex items-center gap-1.5 rounded-full bg-elevated ring ring-default pl-2.5 pr-1.5 py-1 text-xs text-toned">
        {{ s.label }}
        <button class="text-dimmed hover:text-default" @click="toggleSeat(s)"><UIcon name="i-lucide-x" class="size-3.5" /></button>
      </span>
    </div>
  </div>
</template>
