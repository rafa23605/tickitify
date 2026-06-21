export default {
  en: {
    payouts: {
      // balance tiles
      pendingLabel: 'Pending balance',
      pendingSub: '{n} events on sale',
      nextLabel: 'Next payout',
      nextSub: '{kc} this week',
      paidLabel: 'Paid out to date',
      paidSub: '{n} weekly transfers · last {date}',

      // how payouts work alert
      alertTitle: 'Weekly automatic payouts',
      alertDesc: 'Payouts run automatically every week while your event is on sale — use ticket revenue as it comes in.',

      // upcoming payouts card
      upcomingTitle: 'Upcoming payouts',
      upcomingDesc: 'What each event on sale is accruing for {bank} {last4} — paid out with the weekly run on {date}.',

      // upcoming table columns
      colEvent: 'Event',
      colSale: 'Sale',
      colThisWeek: 'This week',
      colPending: 'Pending balance',
      colStatus: 'Status',
      nextPayoutBadge: 'Next payout {date}',

      // payout history card
      historyTitle: 'Payout history',
      historyDesc: "Every weekly transfer we've sent you, with its Stripe status.",

      // history table columns
      colTransfer: 'Transfer',
      colSent: 'Sent',
      colEventHistory: 'Event',
      colAmount: 'Amount',
      paidBadge: 'Paid · arrived {date}'
    }
  },
  cs: {
    payouts: {
      // balance tiles
      pendingLabel: 'Čekající zůstatek',
      pendingSub: '{n} události v prodeji',
      nextLabel: 'Příští výplata',
      nextSub: '{kc} tento týden',
      paidLabel: 'Vyplaceno celkem',
      paidSub: '{n} týdenních převodů · poslední {date}',

      // how payouts work alert
      alertTitle: 'Týdenní automatické výplaty',
      alertDesc: 'Výplaty probíhají automaticky každý týden, dokud je vaše událost v prodeji — využívejte tržby z prodeje vstupenek, jak přibývají.',

      // upcoming payouts card
      upcomingTitle: 'Nadcházející výplaty',
      upcomingDesc: 'Kolik každá událost v prodeji načítá pro {bank} {last4} — vyplaceno týdenním převodem dne {date}.',

      // upcoming table columns
      colEvent: 'Událost',
      colSale: 'Prodej',
      colThisWeek: 'Tento týden',
      colPending: 'Čekající zůstatek',
      colStatus: 'Stav',
      nextPayoutBadge: 'Příští výplata {date}',

      // payout history card
      historyTitle: 'Historie výplat',
      historyDesc: 'Každý týdenní převod, který jsme vám poslali, včetně jeho stavu ve Stripe.',

      // history table columns
      colTransfer: 'Převod',
      colSent: 'Odesláno',
      colEventHistory: 'Událost',
      colAmount: 'Částka',
      paidBadge: 'Zaplaceno · doručeno {date}'
    }
  }
}
