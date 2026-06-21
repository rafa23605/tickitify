/** Account-level payout & verification mock data — consistent with the dashboard ticker and event Overview. */

/** The next weekly automatic payout runs on this Monday (today is 18 Jun 2026). */
export const NEXT_PAYOUT = 'Mon 22 Jun'

export interface UpcomingPayout {
  event: string
  /** sale window context for the row */
  onSaleLabel: string
  /** net accrued this week, due to transfer on the next weekly run */
  thisWeek: number
  /** total net accrued so far across the sale, still pending */
  net: number
}

/**
 * Each on-sale event accrues a balance that pays out automatically with the weekly run.
 * pending = sum of nets below = 2 024 583 Kč (matches the Events dashboard ticker)
 */
export const UPCOMING_PAYOUTS: UpcomingPayout[] = [
  { event: 'CZE × POL — VNL Qualifier', onSaleLabel: 'On sale · ends 20 Jun', thisWeek: 357447, net: 357447 },
  { event: 'Czech Cup — Final Four', onSaleLabel: 'On sale · ends 27 Jun', thisWeek: 926633, net: 1667136 }
]

export const PENDING_TOTAL = UPCOMING_PAYOUTS.reduce((s, p) => s + p.net, 0)

/** total accruing toward the next weekly payout (Mon 22 Jun) */
export const THIS_WEEK_TOTAL = UPCOMING_PAYOUTS.reduce((s, p) => s + p.thisWeek, 0)

export interface PayoutTransfer {
  id: string
  dateLabel: string
  event: string
  amount: number
  arrivedLabel: string
  status: 'paid'
}

/** Recent weekly transfers — the platform sends one automatic run every Monday. */
export const PAYOUT_HISTORY: PayoutTransfer[] = [
  { id: 'tr_2606_0042', dateLabel: 'Mon 15 Jun', event: 'Weekly run · 2 events on sale', amount: 612904, arrivedLabel: '17 Jun', status: 'paid' },
  { id: 'tr_2606_0038', dateLabel: 'Mon 8 Jun', event: 'Weekly run · 2 events on sale', amount: 481250, arrivedLabel: '10 Jun', status: 'paid' },
  { id: 'tr_2405_0019', dateLabel: 'Mon 1 Jun', event: 'Weekly run · CZE × SVK on sale', amount: 798196, arrivedLabel: '3 Jun', status: 'paid' }
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
