<script setup lang="ts">
export interface SeatingSector {
  id: string
  name: string
  rows: number
  seats: number
  /** placement on the schematic venue map */
  pos?: 'north' | 'south' | 'west' | 'east' | 'balcony'
}

export interface SeatStyle {
  bg: string
  text: string
  letter: string
}

/** edit-mode lock states; create mode never sets them */
export type SeatLock = 'sold' | 'existing' | null

const props = defineProps<{
  sector: SeatingSector
  /** seatKey -> ticketTypeId */
  assignments: Record<string, string>
  /** ticketTypeId -> visual style */
  styles: Record<string, SeatStyle>
  /** seatKey -> true while selected */
  selected: Record<string, true>
  /** optional: marks seats locked in edit mode */
  isLocked?: (seatKey: string, row: number, seat: number) => SeatLock
}>()

const emit = defineEmits<{
  toggleSeat: [seatKey: string]
  toggleRow: [rowIndex: number]
  lockedClick: [kind: Exclude<SeatLock, null>]
}>()

const rowLabel = (i: number) => String.fromCharCode(65 + i)
const seatKey = (row: number, seat: number) => `${props.sector.id}:${row}:${seat}`

const lockOf = (r: number, s: number): SeatLock => props.isLocked?.(seatKey(r, s), r, s) ?? null

const onSeatClick = (r: number, s: number) => {
  const lock = lockOf(r, s)
  if (lock) emit('lockedClick', lock)
  else emit('toggleSeat', seatKey(r, s))
}

const seatClass = (r: number, s: number) => {
  const k = seatKey(r, s)
  const lock = lockOf(r, s)
  if (lock === 'sold') return 'bg-accented text-muted cursor-not-allowed'
  if (lock === 'existing') {
    const t = props.assignments[k]
    return [props.styles[t ?? '']?.bg, props.styles[t ?? '']?.text, 'opacity-85 cursor-not-allowed']
  }
  return [
    props.assignments[k]
      ? [props.styles[props.assignments[k]!]?.bg, props.styles[props.assignments[k]!]?.text]
      : 'bg-elevated hover:bg-accented text-transparent',
    props.selected[k] ? 'ring-2 ring-primary ring-offset-1 ring-offset-(--ui-bg)' : ''
  ]
}

const seatLetter = (r: number, s: number) => {
  if (lockOf(r, s) === 'sold') return '·'
  const t = props.assignments[seatKey(r, s)]
  return t ? (props.styles[t]?.letter ?? '') : ''
}
</script>

<template>
  <div class="inline-flex flex-col gap-1.5 max-w-full overflow-x-auto pb-1">
    <!-- court orientation hint -->
    <div class="ml-7.5 rounded bg-elevated text-dimmed text-[10px] font-medium tracking-[0.2em] text-center py-1 mb-1.5 select-none">
      COURT / STAGE
    </div>

    <div v-for="r in sector.rows" :key="r" class="flex items-center gap-1.5">
      <UTooltip :text="`Select row ${rowLabel(r - 1)}`">
        <button
          type="button"
          class="w-6 shrink-0 text-xs font-medium text-muted hover:text-primary text-center"
          @click="emit('toggleRow', r - 1)"
        >
          {{ rowLabel(r - 1) }}
        </button>
      </UTooltip>

      <button
        v-for="s in sector.seats"
        :key="s"
        type="button"
        class="size-6 shrink-0 rounded flex items-center justify-center text-[10px] font-semibold transition-all"
        :class="seatClass(r - 1, s - 1)"
        :aria-label="`Seat ${rowLabel(r - 1)}-${s}`"
        :aria-pressed="!!selected[seatKey(r - 1, s - 1)]"
        @click="onSeatClick(r - 1, s - 1)"
      >
        {{ seatLetter(r - 1, s - 1) }}
      </button>
    </div>
  </div>
</template>
