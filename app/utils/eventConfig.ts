/** Current commerce configuration of the live event — what the edit screen starts from. */
import type { SeatingSector } from '~/components/SeatMapEditor.vue'

export interface LiveTicketType {
  id: string
  name: string
  price: number
  /** static rollup for the Assigned column */
  assignedLabel: string
}

export const LIVE_TYPES: LiveTicketType[] = [
  { id: 'vip', name: 'VIP', price: 800, assignedLabel: '224 seats' },
  { id: 'standard', name: 'Standard', price: 400, assignedLabel: '2 336 seats · 640 standing' }
]

/** the event's seating sectors (matches the creation demo at Královka Arena) */
export const EDIT_SECTORS: SeatingSector[] = [
  { id: 'kr-a', name: 'Court Side A', rows: 8, seats: 14 },
  { id: 'kr-b', name: 'Court Side B', rows: 8, seats: 14 },
  { id: 'kr-south', name: 'South Stand', rows: 6, seats: 14 },
  { id: 'kr-balc', name: 'Balcony', rows: 6, seats: 12 }
]

/**
 * seatKey -> typeId for assignments made before publishing (locked now).
 * Court Side A rows G–H and Balcony rows E–F were left out at creation —
 * that's the free inventory the organizer can put on sale in edit mode.
 */
export const existingAssignments = (): Record<string, string> => {
  const map: Record<string, string> = {}
  const paint = (sectorId: string, rows: number, seats: number, pick: (r: number) => string | null) => {
    for (let r = 0; r < rows; r++) {
      const t = pick(r)
      if (!t) continue
      for (let s = 0; s < seats; s++) map[`${sectorId}:${r}:${s}`] = t
    }
  }
  paint('kr-a', 8, 14, r => (r < 2 ? 'vip' : r < 6 ? 'standard' : null))
  paint('kr-b', 8, 14, r => (r < 2 ? 'vip' : 'standard'))
  paint('kr-south', 6, 14, () => 'standard')
  paint('kr-balc', 6, 12, r => (r < 4 ? 'standard' : null))
  return map
}

/** deterministic ~40% of assigned seats are sold (matches the 1 284 / 3 200 event pace) */
export const isSold = (row: number, seat: number) => ((row * 31 + seat * 17) % 100) < 40

export const STANDING_ZONE = { id: 'kr-floor', name: 'Standing Floor', typeId: 'standard', capacity: 640, max: 800 }
