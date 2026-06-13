<script setup lang="ts">
import type { SeatingSector } from '~/components/SeatMapEditor.vue'

interface StandingSector { id: string, name: string, max: number }

const props = defineProps<{
  seating: SeatingSector[]
  standing: StandingSector[]
  selected: string[]
}>()

const emit = defineEmits<{ toggle: [id: string] }>()

/* slot sectors by their map position; sectors without one fill free slots in order */
const layout = computed(() => {
  const slots: { balcony: SeatingSector[], north?: SeatingSector, west?: SeatingSector, east?: SeatingSector, south?: SeatingSector, extra: SeatingSector[] } = { balcony: [], extra: [] }
  const free: Array<'west' | 'east' | 'north' | 'south'> = []

  for (const s of props.seating) {
    if (s.pos === 'balcony') slots.balcony.push(s)
    else if (s.pos && !slots[s.pos]) slots[s.pos] = s
    else if (s.pos) slots.extra.push(s)
  }
  for (const p of ['west', 'east', 'north', 'south'] as const) {
    if (!slots[p]) free.push(p)
  }
  for (const s of props.seating) {
    if (s.pos) continue
    const p = free.shift()
    if (p) slots[p] = s
    else slots.extra.push(s)
  }
  return slots
})

const cls = (id: string) => props.selected.includes(id)
  ? 'bg-primary/10 ring-primary text-primary'
  : 'bg-elevated/60 ring-default text-muted hover:bg-elevated hover:ring-accented'

const seatLabel = (s: SeatingSector) => `${s.name} · ${s.rows * s.seats}`
</script>

<template>
  <div class="flex flex-col gap-2.5">
    <!-- upper tier -->
    <template v-if="layout.balcony.length">
      <p class="text-[9px] font-semibold uppercase tracking-[0.18em] text-dimmed">Upper tier</p>
      <button
        v-for="b in layout.balcony"
        :key="b.id"
        type="button"
        class="h-11 rounded-lg ring text-xs font-medium transition"
        :class="cls(b.id)"
        @click="emit('toggle', b.id)"
      >
        {{ seatLabel(b) }}
      </button>
      <USeparator class="my-0.5" />
    </template>

    <!-- north stand -->
    <button
      v-if="layout.north"
      type="button"
      class="h-11 rounded-lg ring text-xs font-medium transition"
      :class="cls(layout.north.id)"
      @click="emit('toggle', layout.north.id)"
    >
      {{ seatLabel(layout.north) }}
    </button>

    <!-- sides around the court -->
    <div class="grid grid-cols-[1fr_auto_1fr] gap-2.5 items-stretch">
      <button
        v-if="layout.west"
        type="button"
        class="min-h-24 rounded-lg ring text-xs font-medium transition px-2"
        :class="cls(layout.west.id)"
        @click="emit('toggle', layout.west.id)"
      >
        {{ seatLabel(layout.west) }}
      </button>
      <span v-else />

      <div class="w-24 min-h-24 rounded-lg border-2 border-dashed border-accented flex items-center justify-center text-[10px] font-medium tracking-[0.2em] text-dimmed select-none">
        COURT
      </div>

      <button
        v-if="layout.east"
        type="button"
        class="min-h-24 rounded-lg ring text-xs font-medium transition px-2"
        :class="cls(layout.east.id)"
        @click="emit('toggle', layout.east.id)"
      >
        {{ seatLabel(layout.east) }}
      </button>
      <span v-else />
    </div>

    <!-- south stand -->
    <button
      v-if="layout.south"
      type="button"
      class="h-11 rounded-lg ring text-xs font-medium transition"
      :class="cls(layout.south.id)"
      @click="emit('toggle', layout.south.id)"
    >
      {{ seatLabel(layout.south) }}
    </button>

    <!-- anything that didn't fit the schematic -->
    <button
      v-for="s in layout.extra"
      :key="s.id"
      type="button"
      class="h-11 rounded-lg ring text-xs font-medium transition"
      :class="cls(s.id)"
      @click="emit('toggle', s.id)"
    >
      {{ seatLabel(s) }}
    </button>

    <!-- standing zones along the bottom -->
    <button
      v-for="z in standing"
      :key="z.id"
      type="button"
      class="h-11 rounded-lg ring text-xs font-medium transition"
      :class="cls(z.id)"
      @click="emit('toggle', z.id)"
    >
      {{ z.name }} · max {{ z.max.toLocaleString('cs-CZ') }}
    </button>
  </div>
</template>
