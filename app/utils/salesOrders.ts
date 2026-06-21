/** Mock orders dataset for the Sales tab — one order per checkout session (per PoC doc). */

export type OrderStatus = 'paid' | 'failed' | 'disputed'

export interface OrderTicket {
  /** e.g. "Court Side A · B-07" or "Standing Floor · GA" */
  seat: string
  type: string
  price: number
  standing?: boolean
}

export interface Order {
  id: string
  email: string
  /** data-sharing consent → controls PII visibility (GDPR, per PoC doc) */
  consent: boolean
  marketingConsent: boolean
  status: OrderStatus
  tickets: OrderTicket[]
  /** unix ms, fixed mock values */
  ts: number
  dateLabel: string
}

/** event-level totals (whole sales history, not just the visible page) */
export const EVENT_SALES_TOTALS = {
  tickets: 1284,
  capacity: 3200,
  revenue: 391080
}

const T = (d: number, h: number, m: number) => Date.UTC(2026, 5, d, h - 2, m) // CEST

export const initialOrders: Order[] = [
  { id: '2406-1099', email: 'lucie.cerna@gmail.com', consent: true, marketingConsent: true, status: 'paid', ts: T(12, 10, 5), dateLabel: '12 Jun · 10:05', tickets: [{ seat: 'Court Side A · C-04', type: 'Standard', price: 400 }] },
  { id: '2406-1098', email: 'jana.kralova@seznam.cz', consent: true, marketingConsent: true, status: 'paid', ts: T(12, 9, 21), dateLabel: '12 Jun · 09:21', tickets: [{ seat: 'Standing Floor · GA', type: 'Standard', price: 400, standing: true }, { seat: 'Standing Floor · GA', type: 'Standard', price: 400, standing: true }] },
  { id: '2406-1097', email: 'jana.kralova@seznam.cz', consent: true, marketingConsent: true, status: 'paid', ts: T(11, 21, 14), dateLabel: '11 Jun · 21:14', tickets: [{ seat: 'Court Side A · A-03', type: 'VIP', price: 800 }, { seat: 'Court Side A · A-04', type: 'VIP', price: 800 }] },
  { id: '2406-1096', email: 'petr.novak@gmail.com', consent: false, marketingConsent: false, status: 'paid', ts: T(11, 20, 48), dateLabel: '11 Jun · 20:48', tickets: [{ seat: 'Court Side A · C-11', type: 'Standard', price: 400 }] },
  { id: '2406-1095', email: 'marek.svoboda@email.cz', consent: true, marketingConsent: false, status: 'paid', ts: T(11, 19, 2), dateLabel: '11 Jun · 19:02', tickets: [{ seat: 'Court Side A · D-05', type: 'Standard', price: 400 }, { seat: 'Court Side A · D-06', type: 'Standard', price: 400 }] },
  { id: '2406-1094', email: 'lenka.maresova@seznam.cz', consent: false, marketingConsent: false, status: 'paid', ts: T(11, 17, 30), dateLabel: '11 Jun · 17:30', tickets: [{ seat: 'Court Side A · E-09', type: 'Standard', price: 400 }] },
  { id: '2406-1093', email: 'tereza.dvorakova@gmail.com', consent: true, marketingConsent: true, status: 'paid', ts: T(11, 16, 55), dateLabel: '11 Jun · 16:55', tickets: [{ seat: 'Court Side B · B-01', type: 'VIP', price: 800 }, { seat: 'Court Side B · F-02', type: 'Standard', price: 400 }] },
  { id: '2406-1092', email: 'ondrej.fiala@centrum.cz', consent: false, marketingConsent: false, status: 'failed', ts: T(11, 16, 40), dateLabel: '11 Jun · 16:40', tickets: [{ seat: 'Court Side B · C-08', type: 'Standard', price: 400 }] },
  { id: '2406-1091', email: 'lucie.cerna@gmail.com', consent: true, marketingConsent: true, status: 'paid', ts: T(11, 15, 12), dateLabel: '11 Jun · 15:12', tickets: [{ seat: 'Standing Floor · GA', type: 'Standard', price: 400, standing: true }, { seat: 'Standing Floor · GA', type: 'Standard', price: 400, standing: true }] },
  { id: '2406-1090', email: 'jakub.prochazka@seznam.cz', consent: true, marketingConsent: false, status: 'disputed', ts: T(10, 22, 19), dateLabel: '10 Jun · 22:19', tickets: [{ seat: 'Court Side A · A-09', type: 'VIP', price: 800 }] },
  { id: '2406-1089', email: 'anna.vesela@email.cz', consent: true, marketingConsent: true, status: 'paid', ts: T(10, 21, 3), dateLabel: '10 Jun · 21:03', tickets: [{ seat: 'Court Side B · G-04', type: 'Standard', price: 400 }] },
  { id: '2406-1088', email: 'michal.zeman@gmail.com', consent: false, marketingConsent: false, status: 'paid', ts: T(10, 19, 44), dateLabel: '10 Jun · 19:44', tickets: [{ seat: 'Court Side B · H-01', type: 'Standard', price: 400 }, { seat: 'Court Side B · H-02', type: 'Standard', price: 400 }, { seat: 'Court Side B · H-03', type: 'Standard', price: 400 }] },
  { id: '2406-1087', email: 'eva.horakova@seznam.cz', consent: true, marketingConsent: true, status: 'paid', ts: T(10, 18, 31), dateLabel: '10 Jun · 18:31', tickets: [{ seat: 'Court Side A · A-12', type: 'VIP', price: 800 }] },
  { id: '2406-1086', email: 'david.kolar@email.cz', consent: false, marketingConsent: false, status: 'paid', ts: T(10, 17, 9), dateLabel: '10 Jun · 17:09', tickets: [{ seat: 'Standing Floor · GA', type: 'Standard', price: 400, standing: true }] },
  { id: '2406-1085', email: 'tomas.benes@gmail.com', consent: true, marketingConsent: false, status: 'paid', ts: T(10, 16, 2), dateLabel: '10 Jun · 16:02', tickets: [{ seat: 'Court Side B · B-07', type: 'VIP', price: 800 }] },
  { id: '2406-1084', email: 'katerina.simkova@seznam.cz', consent: false, marketingConsent: false, status: 'paid', ts: T(10, 14, 58), dateLabel: '10 Jun · 14:58', tickets: [{ seat: 'Court Side A · C-02', type: 'Standard', price: 400 }] },
  { id: '2406-1083', email: 'filip.urban@email.cz', consent: true, marketingConsent: true, status: 'paid', ts: T(10, 13, 26), dateLabel: '10 Jun · 13:26', tickets: [{ seat: 'Court Side A · D-11', type: 'Standard', price: 400 }, { seat: 'Court Side A · D-12', type: 'Standard', price: 400 }] },
  { id: '2406-1082', email: 'veronika.kucerova@gmail.com', consent: true, marketingConsent: true, status: 'paid', ts: T(10, 11, 47), dateLabel: '10 Jun · 11:47', tickets: [{ seat: 'Standing Floor · GA', type: 'Standard', price: 400, standing: true }] }
]

export const orderTotal = (o: Order) => o.tickets.reduce((s, t) => s + t.price, 0)

/** "2× Standard" / "1× VIP + 1× Standard" */
export const itemsLabel = (o: Order) => {
  const byType = new Map<string, number>()
  for (const t of o.tickets) byType.set(t.type, (byType.get(t.type) ?? 0) + 1)
  return [...byType.entries()].map(([type, n]) => `${n}× ${type}`).join(' + ')
}

export const maskEmail = (email: string) => {
  const [user, domain] = email.split('@')
  return `${user?.[0] ?? ''}•••@${domain}`
}

export const displayEmail = (o: Order) => o.consent ? o.email : maskEmail(o.email)

/** ledger-style money breakdown (per PoC doc: total / platform fee / provider fee / organizer share) */
export const orderBreakdown = (o: Order) => {
  const total = orderTotal(o)
  const platformFee = Math.round(total * 0.07)
  const providerFee = Math.round(total * 0.014 + 6.5)
  return { total, platformFee, providerFee, net: total - platformFee - providerFee }
}

/** shared status badge config for tables and detail views */
export const STATUS_BADGE: Record<OrderStatus, { label: string, color: 'success' | 'error', variant: 'subtle' | 'outline' }> = {
  paid: { label: 'Paid', color: 'success', variant: 'subtle' },
  failed: { label: 'Failed', color: 'error', variant: 'subtle' },
  disputed: { label: 'Disputed', color: 'error', variant: 'outline' }
}

/* ——— customers, derived from orders (one buyer profile per email, per PoC doc 3.5) ——— */

/** cross-event purchase history — the "single profile across all events" demo */
export const PAST_EVENTS: Record<string, string[]> = {
  'jana.kralova@seznam.cz': ['CZE × SVK — Friendly'],
  'marek.svoboda@email.cz': ['CZE × SVK — Friendly', 'Legends Night — Exhibition'],
  'eva.horakova@seznam.cz': ['CZE × SVK — Friendly']
}

export interface CustomerProfile {
  email: string
  consent: boolean
  marketingConsent: boolean
  orders: Order[]
  ordersCount: number
  tickets: number
  /** money currently captured (paid + disputed; refunds excluded) */
  spent: number
  firstLabel: string
  lastLabel: string
  lastTs: number
  pastEvents: string[]
}

/** a customer record exists only after a successful purchase — failed-only emails are not buyers */
export const deriveCustomers = (orders: Order[]): CustomerProfile[] => {
  const byEmail = new Map<string, Order[]>()
  for (const o of orders) {
    if (o.status === 'failed') continue
    const list = byEmail.get(o.email) ?? []
    list.push(o)
    byEmail.set(o.email, list)
  }
  return [...byEmail.entries()].map(([email, list]) => {
    const sorted = [...list].sort((a, b) => a.ts - b.ts)
    const latest = sorted[sorted.length - 1]!
    return {
      email,
      consent: latest.consent,
      marketingConsent: latest.marketingConsent,
      orders: [...sorted].reverse(),
      ordersCount: sorted.length,
      tickets: sorted.reduce((s, o) => s + o.tickets.length, 0),
      spent: sorted.filter(o => o.status === 'paid' || o.status === 'disputed').reduce((s, o) => s + orderTotal(o), 0),
      firstLabel: sorted[0]!.dateLabel,
      lastLabel: latest.dateLabel,
      lastTs: latest.ts,
      pastEvents: PAST_EVENTS[email] ?? []
    }
  })
}
