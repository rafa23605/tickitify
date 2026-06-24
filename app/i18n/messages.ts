/**
 * Prototype i18n dictionary. Drives the live CS/EN switch via useLang() + useT().
 * Keys are namespaced (common / nav / auth / events / ...). Proper nouns (event
 * titles, venues) and locale-formatted dates/numbers stay in the data layer.
 */
import sales from './ns/sales'
import workspace from './ns/workspace'
import campaign from './ns/campaign'
import wizard from './ns/wizard'
import edit from './ns/edit'
import payouts from './ns/payouts'
import preview from './ns/preview'
import overview from './ns/overview'
import funnel from './ns/funnel'
import settings from './ns/settings'
import account from './ns/account'
import invite from './ns/invite'
import forgot from './ns/forgot'
import reset from './ns/reset'
import store from './ns/store'

export type Lang = 'cs' | 'en'
type Dict = Record<string, any>

const en: Dict = {
  common: {
    federation: 'Czech Volleyball Federation',
    orgShort: 'Volleyball Federation'
  },
  nav: {
    accountSettings: 'Account settings',
    payouts: 'Payouts',
    signOut: 'Sign out',
    changeLanguage: 'Change language',
    accountMenu: 'Account menu'
  },
  auth: {
    signInTitle: 'Welcome back',
    signInDesc: 'Sign in to your organizer account.',
    email: 'Email',
    password: 'Password',
    signIn: 'Sign in',
    forgot: 'Forgot password?',
    noAccountPre: 'No account? Organizer accounts are created by invitation —',
    seeInvite: 'see how an invite looks',
    foot: 'Prototype — any credentials sign you in. Sessions use secure httpOnly cookies in production.',
    signedInTitle: 'Welcome back',
    signedInDesc: 'Signed in as Czech Volleyball Federation.'
  },
  events: {
    title: 'Events',
    thisWeek: 'This week: {n} events',
    newEvent: 'New event',
    tabs: { all: 'All', published: 'Published', drafts: 'Drafts', completed: 'Completed', cancelled: 'Cancelled' },
    status: { published: 'Published', draft: 'Draft', completed: 'Completed', cancelled: 'Cancelled' },
    continueSetup: 'Continue setup',
    updatedDaysAgo: 'Updated {n} days ago',
    ticketsRefunded: '{n} tickets refunded',
    emptyTitle: 'No events yet',
    emptyDesc: "Create your first event, assign seats and prices, and publish when you're ready — buyers get a clean mobile checkout from minute one.",
    createFirst: 'Create your first event',
    stepsTitle: 'From draft to on-sale in four steps',
    stepsDesc: 'You can save a draft at any point and come back later.',
    payoutNotePre: 'Publishing requires payout setup —',
    connectStripe: 'connect Stripe',
    payoutNotePost: 'anytime before going live.',
    steps: {
      detailsT: 'Details', detailsD: 'Title, dates and venue',
      venueT: 'Venue', venueD: 'Hall, seating and standing sectors',
      typesT: 'Ticket types', typesD: 'Price tiers — VIP, Standard',
      seatsT: 'Seats', seatsD: 'Assign types on the seat map',
      publishT: 'Publish', publishD: 'Preflight check, go live'
    },
    demoFirst: 'First login',
    demoActive: 'Active season'
  }
}

const cs: Dict = {
  common: {
    federation: 'Český volejbalový svaz',
    orgShort: 'Volejbalový svaz'
  },
  nav: {
    accountSettings: 'Nastavení účtu',
    payouts: 'Výplaty',
    signOut: 'Odhlásit se',
    changeLanguage: 'Změnit jazyk',
    accountMenu: 'Účet'
  },
  auth: {
    signInTitle: 'Vítejte zpět',
    signInDesc: 'Přihlaste se ke svému organizátorskému účtu.',
    email: 'E-mail',
    password: 'Heslo',
    signIn: 'Přihlásit se',
    forgot: 'Zapomněli jste heslo?',
    noAccountPre: 'Nemáte účet? Organizátorské účty se vytvářejí na pozvánku —',
    seeInvite: 'podívejte se, jak vypadá pozvánka',
    foot: 'Prototyp — přihlásí vás jakékoli údaje. V produkci se relace ukládají do zabezpečených httpOnly cookies.',
    signedInTitle: 'Vítejte zpět',
    signedInDesc: 'Přihlášeno jako Český volejbalový svaz.'
  },
  events: {
    title: 'Události',
    thisWeek: 'Tento týden: {n} události',
    newEvent: 'Nová událost',
    tabs: { all: 'Vše', published: 'Publikované', drafts: 'Koncepty', completed: 'Dokončené', cancelled: 'Zrušené' },
    status: { published: 'Publikováno', draft: 'Koncept', completed: 'Dokončeno', cancelled: 'Zrušeno' },
    continueSetup: 'Pokračovat v nastavení',
    updatedDaysAgo: 'Aktualizováno před {n} dny',
    ticketsRefunded: '{n} vstupenek vráceno',
    emptyTitle: 'Zatím žádné události',
    emptyDesc: 'Vytvořte svou první událost, přiřaďte místa a ceny a publikujte, až budete připraveni — kupující dostanou přehledný mobilní nákup hned od první chvíle.',
    createFirst: 'Vytvořit první událost',
    stepsTitle: 'Od konceptu k prodeji ve čtyřech krocích',
    stepsDesc: 'Koncept můžete kdykoli uložit a vrátit se k němu později.',
    payoutNotePre: 'Publikování vyžaduje nastavení výplat —',
    connectStripe: 'připojte Stripe',
    payoutNotePost: 'kdykoli před spuštěním prodeje.',
    steps: {
      detailsT: 'Detaily', detailsD: 'Název, termíny a místo konání',
      venueT: 'Místo konání', venueD: 'Hala, sedadlové a stojící sektory',
      typesT: 'Typy vstupenek', typesD: 'Cenové úrovně — VIP, Standard',
      seatsT: 'Sedadla', seatsD: 'Přiřaďte typy v mapě sedadel',
      publishT: 'Publikovat', publishD: 'Kontrola před spuštěním, spustit'
    },
    demoFirst: 'První přihlášení',
    demoActive: 'Aktivní sezóna'
  }
}

// Namespace dictionaries (one file per feature in ./ns). Each contributes its
// own top-level key(s) under the matching language and is merged in here.
const nsPacks = [
  sales, workspace, campaign, wizard, edit, payouts, preview,
  overview, funnel, settings, account, invite, forgot, reset, store
]
for (const pack of nsPacks) {
  Object.assign(en, pack.en)
  Object.assign(cs, pack.cs)
}

export const messages: Record<Lang, Dict> = { en, cs }
