# Tickitify — B2B Admin Prototype

A **kit-native Nuxt UI v4 prototype** of the organizer-facing admin for Tickitify
(white-label ticketing for sports federations, CZ market). Built to hand off to
the frontend developer as a runnable reference in the exact stack the project uses.

> ⚠️ **This is a prototype, not production code.**
> - All data is **mocked** (`app/utils/*`, `app/composables/*`) — there is no backend wiring, auth, Stripe or email here.
> - It contains **demo-only scaffolding** (state switchers, "Prefill demo data") meant for walkthroughs — see [Remove before production](#remove-before-production).
> - Treat it as a **spec + reference implementation**: the real backend API is the source of truth for data shapes.

The **visual source of truth** is the Figma file (all screens, all states, built from the same Nuxt UI kit):
**https://www.figma.com/design/kWdDSsjnrCrhW7nvDhbeZR**

---

## Run it

```bash
npm install
npm run dev      # → http://localhost:3000
```

Nuxt 4 · Nuxt UI v4 · Tailwind CSS 4 · Node 22.

## Theming

Theme lives in [`app/app.config.ts`](app/app.config.ts): `primary: 'indigo'`, `neutral: 'slate'`.
Everything is **kit-native** — stock Nuxt UI components, semantic tokens and the default
type scale — so it maps 1:1 onto the Figma kit and onto your own Nuxt UI usage. Rebranding is
a one-line change here.

---

## Screen map

| Route | File | Screen |
|---|---|---|
| `/` | [`pages/index.vue`](app/pages/index.vue) | Events dashboard — two states (first-login empty / active season) |
| `/events/new` | [`pages/events/new.vue`](app/pages/events/new.vue) | Create-event wizard (5 steps: Details · Venue+Sectors · Ticket Types · Seat Assignment · Publish) |
| `/events/:slug` | [`pages/events/[slug]/index.vue`](app/pages/events/[slug]/index.vue) | Event workspace — tabs **Overview · Sales · Marketing · Customers** |
| `/events/:slug/campaigns/:cid` | [`pages/events/[slug]/campaigns/[cid].vue`](app/pages/events/[slug]/campaigns/[cid].vue) | Campaign detail — attribution drill-down (source/medium toggle) |
| `/events/:slug/edit` | [`pages/events/[slug]/edit.vue`](app/pages/events/[slug]/edit.vue) | Live-event editor (locked vs editable fields, sold/assigned seats) |
| `/settings` | [`pages/settings.vue`](app/pages/settings.vue) | Account — tabs **Payouts · Account settings** (`?tab=payouts\|account`) |
| `/login` · `/invite` · `/forgot-password` · `/reset-password` | `pages/*.vue` | Organizer auth flow (invite-only, no public sign-up) |

### Components

Stock Nuxt UI everywhere **except** three bespoke pieces you'll productionize:

| Component | Notes |
|---|---|
| [`SeatMapEditor.vue`](app/components/SeatMapEditor.vue) | **Custom.** Seat grid with select-then-apply; shared by wizard step 4 and the editor (lock/sold states via an optional prop). |
| [`VenueMap.vue`](app/components/VenueMap.vue) | **Custom.** Schematic venue map (balcony / sides-around-court / standing). |
| [`DonutChart.vue`](app/components/DonutChart.vue) | **Custom.** Pure-SVG donut for attribution charts (no chart lib). |
| `FunnelStats` · `EventPreviewCard` · `EventRow` | Composed from kit primitives. |
| `EventOverview` · `EventSales` · `EventCustomers` | Workspace tab bodies (Marketing analytics lives in the page). |
| `AccountPayouts` · `AccountSettings` · `AppHeader` · `AuthShell` | Account + chrome. |

---

## Wiring the real backend

The prototype's mock data stands in for your existing backend modules. Swap each mock
source for real API calls — the shapes were derived from the PoC doc, so they're close,
but **your API is authoritative**:

| Mock source | Replaces (backend domain) |
|---|---|
| [`utils/campaignAnalytics.ts`](app/utils/campaignAnalytics.ts) + [`composables/useCampaigns.ts`](app/composables/useCampaigns.ts) | **Attribution & Marketing** — campaigns → tracked links (`source`/`medium`) → funnel counts (Viewed / Initiated checkout / Purchased) |
| [`utils/salesOrders.ts`](app/utils/salesOrders.ts) + [`composables/useOrders.ts`](app/composables/useOrders.ts) | **Checkout & Orders** + **Customer DB** — orders, items, status, buyer profiles, consents (PII masked without data-sharing consent) |
| [`utils/payouts.ts`](app/utils/payouts.ts) | **Payments & Payouts** — pending balance, unlock dates (event end + 48h), transfer history, Stripe Connect KYC status |
| [`utils/eventConfig.ts`](app/utils/eventConfig.ts) | **Ticketing/Catalog** + **Inventory** — live event config, ticket types, seat assignments, sold seats (the editor reads these) |

Domain rules already encoded in the UI (immutable ticket-type names, KYC gate before
publish, locked fields after publish, anti-enumeration seat states, last-touch attribution)
match the PoC doc you already have — keep that as the rules reference.

## Remove before production

- **Demo state switchers** — `demoState` toggle in [`index.vue`](app/pages/index.vue) (First login / Active season) and [`invite.vue`](app/pages/invite.vue) (valid / expired link).
- **"Prefill demo data"** button in [`events/new.vue`](app/pages/events/new.vue).
- **Simulated toasts** — `useToast()` success messages that fake publish / refund / save / copy; wire them to real mutation results.
- **Hardcoded identity** — "Czech Volleyball Federation" / organizer email in `AppHeader` and `settings`; comes from the session in production.
