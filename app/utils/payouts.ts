/** Account-level payout & verification mock data — consistent with the dashboard ticker and event Overview. */

export interface UpcomingPayout {
  event: string
  endsLabel: string
  unlockLabel: string
  /** days until unlock from today (12 Jun 2026) */
  unlockInDays: number
  net: number
}

/** pending = sum of nets below = 2 024 583 Kč (matches the Events dashboard ticker) */
export const UPCOMING_PAYOUTS: UpcomingPayout[] = [
  { event: 'CZE × POL — VNL Qualifier', endsLabel: '20 Jun · 22:00', unlockLabel: '22 Jun', unlockInDays: 10, net: 357447 },
  { event: 'Czech Cup — Final Four', endsLabel: '27 Jun · 21:00', unlockLabel: '29 Jun', unlockInDays: 17, net: 1667136 }
]

export const PENDING_TOTAL = UPCOMING_PAYOUTS.reduce((s, p) => s + p.net, 0)

export interface PayoutTransfer {
  id: string
  dateLabel: string
  event: string
  amount: number
  arrivedLabel: string
  status: 'paid'
}

export const PAYOUT_HISTORY: PayoutTransfer[] = [
  { id: 'tr_2405_0019', dateLabel: '19 May 2026', event: 'CZE × SVK — Friendly', amount: 798196, arrivedLabel: '21 May', status: 'paid' }
]

export const PAID_TOTAL = PAYOUT_HISTORY.reduce((s, t) => s + t.amount, 0)

export const BANK_ACCOUNT = {
  bank: 'Fio banka a.s.',
  masked: 'CZ•• •••• •••• 7842',
  currency: 'CZK'
}

/** organizer lifecycle per the PoC doc: invited → onboarding → verifying → verified */
export const KYC = {
  status: 'verified' as const,
  verifiedLabel: '12 May 2026',
  steps: [
    { title: 'Invited', description: '5 May' },
    { title: 'Onboarding', description: 'bank & company details' },
    { title: 'Verifying', description: 'Stripe checks' },
    { title: 'Verified', description: '12 May' }
  ]
}

export const fmtKc = (n: number) => `${n.toLocaleString('cs-CZ')} Kč`
