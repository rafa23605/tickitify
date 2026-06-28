/** Buyer-facing storefront mock data (B2C). White-label, federation-branded, CZK. */

export interface StoreTier {
  id: string
  name: string
  price: number
  kind: 'seated'
}

export interface StoreOrganizer {
  slug: string
  name: string
  country: string
  avatar: string
}

export interface StoreEvent {
  slug: string
  org: string
  title: string
  subtitle: string
  sport: string
  ageLimit: string
  description: string
  durationLabel: string
  venue: string
  address: string
  city: string
  weekday: string
  day: string
  month: string
  time: string
  dateFull: string
  organizer: StoreOrganizer
  tiers: StoreTier[]
  onSale: boolean
}

export const STORE_EVENTS: Record<string, StoreEvent> = {
  'vnl-cze-pol': {
    slug: 'vnl-cze-pol',
    org: 'cvf',
    title: 'Česko — Polsko',
    subtitle: 'Volleyball Nations League · kvalifikace',
    sport: 'Volejbal',
    ageLimit: '0+',
    description:
      'Reprezentace České republiky nastoupí proti Polsku v klíčovém kvalifikačním zápase Volleyball Nations League. Přijďte podpořit národní tým do zaplněné Královky — atmosféru, jakou zažijete jen naživo, žádný přenos nenahradí. Brány se otevírají v 18:00, výkop v 19:00. Po zápase autogramiáda s hráči na centrálním kurtu.',
    durationLabel: '≈ 2 hodiny',
    venue: 'Královka Aréna',
    address: 'Nad Královskou oborou 51, Praha 7',
    city: 'Praha',
    weekday: 'So',
    day: '20',
    month: 'června',
    time: '19:00',
    dateFull: 'Sobota 20. června 2026',
    organizer: { slug: 'cvf', name: 'Český volejbalový svaz', country: 'Česko', avatar: 'VF' },
    tiers: [
      { id: 'vip', name: 'VIP', price: 800, kind: 'seated' },
      { id: 'standard', name: 'Standard', price: 400, kind: 'seated' },
      { id: 'student', name: 'Student', price: 250, kind: 'seated' }
    ],
    onSale: true
  }
}

export const priceFrom = (e: StoreEvent) => Math.min(...e.tiers.map(t => t.price))
export const fmtCzk = (n: number) => `${n.toLocaleString('cs-CZ')} Kč`

/* ——— seat map: volleyball arena, COURT in the centre, stands on all 4 sides ——— */
export interface SeatTier { id: string, name: string, price: number, dot: string }
export const SEAT_TIERS: SeatTier[] = [
  { id: 'vip', name: 'VIP', price: 800, dot: 'bg-indigo-500' },
  { id: 'standard', name: 'Standard', price: 400, dot: 'bg-sky-500' },
  { id: 'student', name: 'Student', price: 250, dot: 'bg-emerald-500' }
]
export const tierById = (id: string) => SEAT_TIERS.find(t => t.id === id)

/** A single rendered seat in the arena (shared by the mobile /select page and the desktop event embed). */
export interface SeatVM { key: string, taken: boolean, tierId: string, price: number, dot: string, label: string }

/** A stand on one side of the court. N/S run along the top/bottom (wide), W/E down the sides (tall). */
export interface Sector { id: string, name: string, tierId: string, side: 'N' | 'S' | 'W' | 'E', rows: number, cols: number }
export const SECTORS: Sector[] = [
  { id: 'N', name: 'Sever', tierId: 'standard', side: 'N', rows: 3, cols: 9 },
  { id: 'W', name: 'Západ', tierId: 'vip', side: 'W', rows: 6, cols: 3 },
  { id: 'E', name: 'Východ', tierId: 'vip', side: 'E', rows: 6, cols: 3 },
  { id: 'S', name: 'Jih', tierId: 'student', side: 'S', rows: 3, cols: 9 }
]

/** deterministic ~28% of seats already taken */
export const isSeatTaken = (sectorIdx: number, row: number, seat: number) =>
  (((sectorIdx + 1) * 7 + row * 13 + seat * 17) % 10) < 3

export const SERVICE_FEE_RATE = 0.10

/* ——— organizer (federation) ——— */
export interface OrgEventCard {
  slug: string, title: string, day: string, month: string, weekday: string, time: string, dateFull: string, venue: string, city: string, priceFrom: number
}
export const ORGANIZER = {
  slug: 'cvf',
  name: 'Český volejbalový svaz',
  country: 'Česko',
  city: 'Praha',
  avatar: 'VF',
  cover: 'https://picsum.photos/seed/cvf-cover/1200/420',
  bio: 'Národní řídicí orgán českého volejbalu. Pořádáme reprezentační zápasy, domácí poháry a mládežnické turnaje po celé republice.',
  eventsCount: 3
}
export const ORG_EVENTS: OrgEventCard[] = [
  { slug: 'vnl-cze-pol', title: 'Česko — Polsko', day: '20', month: 'čvn', weekday: 'So', time: '19:00', dateFull: 'So 20. června 2026', venue: 'Královka Aréna', city: 'Praha', priceFrom: 250 },
  { slug: 'cup-final-four', title: 'Český pohár — Final Four', day: '27', month: 'čvn', weekday: 'So', time: '17:30', dateFull: 'So 27. června 2026', venue: 'Ostravar Aréna', city: 'Ostrava', priceFrom: 300 },
  { slug: 'u20-championship', title: 'Mistrovství ČR U20', day: '12', month: 'čvc', weekday: 'Ne', time: '14:00', dateFull: 'Ne 12. července 2026', venue: 'Hala Vodova', city: 'Brno', priceFrom: 200 }
]

/* ——— buyer account (passwordless, magic-link) ——— */
export const STORE_USER = {
  firstName: 'Jan',
  lastName: 'Novák',
  email: 'jan.novak@email.cz',
  phone: '+420 777 123 456',
  avatar: 'JN'
}
export interface UserOrder {
  id: string
  eventSlug: string
  eventTitle: string
  dateFull: string
  time: string
  venue: string
  city: string
  seats: string[]
  total: number
  status: 'upcoming' | 'past'
}
export const USER_ORDERS: UserOrder[] = [
  { id: 'TKT-2406-1042', eventSlug: 'vnl-cze-pol', eventTitle: 'Česko — Polsko', dateFull: 'So 20. června 2026', time: '19:00', venue: 'Královka Aréna', city: 'Praha', seats: ['Západ · ř. 1, m. 1', 'Západ · ř. 1, m. 3'], total: 1760, status: 'upcoming' },
  { id: 'TKT-2406-0977', eventSlug: 'cup-final-four', eventTitle: 'Český pohár — Final Four', dateFull: 'So 27. června 2026', time: '17:30', venue: 'Ostravar Aréna', city: 'Ostrava', seats: ['Sever · ř. 4, m. 8'], total: 660, status: 'upcoming' },
  { id: 'TKT-2405-0318', eventSlug: 'cze-svk', eventTitle: 'Česko — Slovensko', dateFull: 'Pá 15. května 2026', time: '18:00', venue: 'Královka Aréna', city: 'Praha', seats: ['Sever · ř. 2, m. 5'], total: 440, status: 'past' }
]
