/** B2C storefront UI strings (chrome). Data content (event titles, descriptions,
 * dates, sector names, seat labels) stays in the data layer — same approach as B2B. */
export default {
  en: {
    store: {
      myAccount: 'My account',
      back: 'Back',
      event: {
        about: 'About the event', readMore: 'Read more', organizer: 'Organizer',
        buy: 'Buy tickets', from: 'from',
        naTitle: 'Event unavailable', naDesc: "This event doesn't exist or is no longer on sale."
      },
      select: {
        hint: 'Tap to choose seats. Grey = taken.', court: 'Court', clearFilter: 'Clear filter',
        continue: 'Continue', pcs: 'pcs', naTitle: 'Event unavailable'
      },
      checkout: {
        title: 'Checkout', emptyTitle: 'Your cart is empty', emptyDesc: "You haven't selected any tickets yet.",
        backToEvent: 'Back to event', subtotal: 'Subtotal', fee: 'Service fee', total: 'Total',
        buyer: 'Buyer', firstName: 'First name', lastName: 'Last name', email: 'E-mail', phone: 'Phone',
        emailErr: 'Enter a valid e-mail.',
        accountNote: "We'll create an account automatically — you sign in with a link sent to your e-mail.",
        consent: 'I agree to the terms and the processing of personal data.',
        pay: 'Pay', stripeNote: 'Payment processed by Stripe.',
        payToastTitle: 'Redirecting to payment', payToastDesc: 'Stripe handles the secure payment.'
      },
      done: {
        confirmed: 'Order confirmed', emailedTo: "We've sent your tickets to", total: 'Total paid',
        mailAlert: 'To manage your tickets, sign in with the link we e-mailed you.',
        backToEvent: 'Back to event', organizerPage: 'Organizer page',
        noTitle: 'No order', noDesc: 'You have no completed order.'
      },
      organizer: { upcoming: 'Upcoming events', nearest: 'Soonest', buy: 'Buy', eventsCount: '{n} events' },
      login: {
        title: 'Sign in to your account',
        desc: "Enter your e-mail and we'll send you a sign-in link. No password needed.",
        email: 'E-mail', submit: 'Send sign-in link',
        accountNote: 'Your account is created automatically on first purchase — you sign in with the same e-mail.',
        sentTitle: 'Check your e-mail', sentDesc: 'We sent a sign-in link to', validity: 'Valid for 15 minutes.',
        openAccount: 'Open account (demo)', changeEmail: 'Change e-mail',
        protoNote: 'Prototype — the link is e-mailed for real. The button above simulates it.'
      },
      account: {
        tickets: 'My tickets', tabUpcoming: 'Upcoming', tabPast: 'Past', showTickets: 'Show tickets',
        emptyUpcoming: 'No upcoming tickets.', emptyPast: 'No past events.',
        personal: 'Personal details', edit: 'Edit', save: 'Save', cancel: 'Cancel',
        firstName: 'First name', lastName: 'Last name', email: 'E-mail', phone: 'Phone',
        consents: 'Consents', marketingTitle: 'News and offers',
        marketingDesc: 'E-mails about matches and presales. You can opt out anytime.',
        privacy: 'Privacy', exportData: 'Download my data', deleteAccount: 'Delete account',
        signOut: 'Sign out', savedToast: 'Details saved',
        modalTitle: 'Your tickets', qrNote: 'Your tickets are also in your e-mail. The QR code is enough at the entrance.'
      }
    }
  },
  cs: {
    store: {
      myAccount: 'Můj účet',
      back: 'Zpět',
      event: {
        about: 'O události', readMore: 'Číst více', organizer: 'Pořadatel',
        buy: 'Koupit vstupenky', from: 'od',
        naTitle: 'Událost není dostupná', naDesc: 'Tato událost neexistuje nebo už není v prodeji.'
      },
      select: {
        hint: 'Vyberte místa klepnutím. Šedá = obsazeno.', court: 'Kurt', clearFilter: 'Zrušit filtr',
        continue: 'Pokračovat', pcs: 'ks', naTitle: 'Událost není dostupná'
      },
      checkout: {
        title: 'Pokladna', emptyTitle: 'Košík je prázdný', emptyDesc: 'Zatím nemáte vybrané žádné vstupenky.',
        backToEvent: 'Zpět na událost', subtotal: 'Mezisoučet', fee: 'Servisní poplatek', total: 'Celkem',
        buyer: 'Kupující', firstName: 'Jméno', lastName: 'Příjmení', email: 'E-mail', phone: 'Telefon',
        emailErr: 'Zadejte platný e-mail.',
        accountNote: 'Po nákupu vám automaticky vytvoříme účet — přihlášení proběhne odkazem zaslaným na e-mail.',
        consent: 'Souhlasím s obchodními podmínkami a zpracováním osobních údajů.',
        pay: 'Zaplatit', stripeNote: 'Platbu zpracovává Stripe.',
        payToastTitle: 'Přesměrování na platbu', payToastDesc: 'Bezpečnou platbu zpracuje Stripe.'
      },
      done: {
        confirmed: 'Objednávka potvrzena', emailedTo: 'Vstupenky jsme poslali na', total: 'Celkem zaplaceno',
        mailAlert: 'Pro správu vstupenek se přihlaste odkazem, který jsme poslali na váš e-mail.',
        backToEvent: 'Zpět na událost', organizerPage: 'Stránka pořadatele',
        noTitle: 'Žádná objednávka', noDesc: 'Nemáte žádnou dokončenou objednávku.'
      },
      organizer: { upcoming: 'Nadcházející události', nearest: 'Nejbližší', buy: 'Koupit', eventsCount: '{n} události' },
      login: {
        title: 'Přihlášení k účtu',
        desc: 'Zadejte e-mail a pošleme vám přihlašovací odkaz. Žádné heslo nepotřebujete.',
        email: 'E-mail', submit: 'Poslat přihlašovací odkaz',
        accountNote: 'Účet se vytvoří automaticky při prvním nákupu — přihlašujete se stejným e-mailem.',
        sentTitle: 'Zkontrolujte e-mail', sentDesc: 'Přihlašovací odkaz jsme poslali na', validity: 'Platí 15 minut.',
        openAccount: 'Otevřít účet (demo)', changeEmail: 'Změnit e-mail',
        protoNote: 'Prototyp — odkaz se v reálu doručí e-mailem. Tlačítko výše ho simuluje.'
      },
      account: {
        tickets: 'Moje vstupenky', tabUpcoming: 'Nadcházející', tabPast: 'Proběhlé', showTickets: 'Zobrazit vstupenky',
        emptyUpcoming: 'Žádné nadcházející vstupenky.', emptyPast: 'Žádné proběhlé události.',
        personal: 'Osobní údaje', edit: 'Upravit', save: 'Uložit', cancel: 'Zrušit',
        firstName: 'Jméno', lastName: 'Příjmení', email: 'E-mail', phone: 'Telefon',
        consents: 'Souhlasy', marketingTitle: 'Novinky a nabídky',
        marketingDesc: 'E-maily o zápasech a předprodejích. Můžete kdykoli odvolat.',
        privacy: 'Soukromí', exportData: 'Stáhnout moje data', deleteAccount: 'Smazat účet',
        signOut: 'Odhlásit se', savedToast: 'Údaje uloženy',
        modalTitle: 'Vaše vstupenky', qrNote: 'Vstupenky máte i v e-mailu. Na vstupu stačí QR kód.'
      }
    }
  }
}
