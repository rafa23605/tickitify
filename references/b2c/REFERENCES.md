# Tickitify B2C — flow & design references

Build target: **kit-native** (same Nuxt UI v4 components + tokens as the B2B admin),
mobile-first, federation-branded (CVF), CZK with buyer service fee, Czech locale (i18n CS/EN).
Visual reference: **Yandex Afisha** (afisha.yandex.ru) — mirror its layout/UX, rebuilt with the kit.

> Drop the actual reference PNGs into this folder if you want them versioned.
> (Agent receives pasted images as vision input only and can't write their bytes to disk.)

## Buyer flow (PoC)

No recommendations / catalog page. Buyers arrive via **links organizers share on social** →
land directly on the **Event page**.

```
[Event page]  ──▶ [Organizer page]   (view organizer info + their events)
     │
     └────────▶ [Checkout page (or sub-page)]
```

- **Event page** — Name, Description, Dates (sessions), Seat map (schema), Organizer (who), Buy CTA.
- **Organizer page** — Avatar, Cover, Name, Country, Events (their events), Nearest (upcoming).
- **Checkout page** — Seats, Tickets, Name, Email, Phone, Checkout (pay).

## Reference 0 — user flow diagram
Recommendations page is drawn but **greyed out = NOT in PoC**. Event page is the entry point;
it branches up to Organizer page and right to Checkout.

## Reference 1 — Yandex Afisha event detail page ("Чайка")
- Top nav: logo, search, city, "My tickets", account.
- Hero: wide cover image; title; genre/subtitle; venue · dates · age; rating chip (8.2);
  primary CTA "Buy tickets" + favorite + discount badges.
- **Session date chips** (5 Jul / 22 Sep / 25 Oct), one active/highlighted.
- **Embedded seat map**: price legend (color = price tier), zoom +/−, minimap, hover tooltip.
- "About the event": description + "Read more", cast photos, details table (theatre/cast/director/duration), source.
- "Reviews & ratings" — likely SKIP for PoC.
- "Address" + map.
- "Popular this week" / "You viewed" → **SKIP** (no recommendations in PoC).
- Footer: subscribe, partners, app download.

## Reference 2 & 3 — seat map (selection)
- Price legend chips: 1000 / 1300 / 1500 / 2000 / 2500 / 3000 / 3500 / 4000 / 4500 ₽ + "All prices".
- Sectors labelled (Amphitheatre, Stalls, Boxes).
- Color dots = available seats by price tier; grey = taken.
- Hover tooltip: price / sector / row + seat (e.g. "3500 ₽ · Amphitheatre · row 5, seat 16").
- Selected seat = ring highlight.
- Zoom +/− controls, minimap (top-right), info button (bottom-left).
- Bottom action bar: selected "row 5, seat 18 · Amphitheatre · 3500 ₽" + "1 ticket: 3500 ₽" + "Continue" CTA.

## Reference 4 — checkout ("Enter your details")
- Session chips persist at top.
- Back arrow + "Checkout" title.
- "Enter your details" heading + legal note (ID/document required — RU-specific; adapt to CZ).
- Fields: full name (validated ✓), email (✓), phone.
- Selected seat recap ("row 5, seat 18").
- "Continue" CTA (disabled until valid) + terms note.

## Kit-native adaptation notes
- Header: federation brand (CVF) instead of Afisha nav.
- Seat map: buyer variant of our venue/seat-map component — color by **price tier**, hover/select,
  legend, zoom, bottom action bar. Volleyball venues (seated + standing).
- Session chips: UTabs (pill) or UFieldGroup.
- Checkout: UForm + UInput (name/email/phone), guest email, 15-min cart timer, CZK + service fee, magic-link retrieval.
- Czech copy; adapt RU legal note to a CZ/GDPR-appropriate one.

## Reference 5 — checkout details (continued)
- Selected seat recap ("row 5, seat 18").
- Child-ticket checkbox ("ticket for child under 14") — RU-specific, **SKIP**.
- Fields: Surname / Name / Patronymic (optional) / document type select / document series+number — **RU legal (Moscow culture dept), SKIP**. We keep only **name / email / phone** per our flow.
- "Continue" CTA (disabled until valid) + terms note.

## Reference 6 & 7 — order confirmation / summary
- Event recap: title + age, date, venue.
- Selected seat card ("row 5, seat 18 · Amphitheatre").
- "Refund guarantee" toggle (+385 ₽ upsell) — **SKIP for PoC** (optional add-on).
- **Price breakdown** (KEEP — matches our buyer-service-fee model):
  - Ticket price 3500 ₽
  - Service fee +350 ₽
  - **Total 3850 ₽**
- "Payment methods" (SBP / bank card / Pushkin card) — **handled by Stripe, SKIP** our own picker.
- Promo code row — optional (Stripe Checkout supports it); skip for PoC unless wanted.
- "Organizer & seller info" link → our Organizer page.
- "Pay 3850 ₽" CTA.

## Payment boundary (Stripe) — IMPORTANT
The **actual payment screen is Stripe-hosted** → we do NOT design card entry. Our last designed
screen is the **order summary** (seats/tickets + price breakdown with service fee + total) whose
**"Pay" button hands off to Stripe Checkout**. After payment, Stripe redirects back to our
**confirmation / tickets** screen (QR + magic-link) — that one is ours to design.

### Resulting B2C flow we design (kit-native)
1. **Event page** (entry via shared link) — info + seat map + organizer + Buy CTA.
2. **Organizer page** — avatar/cover, name, country, their events, nearest.
3. **Checkout** — selected seats/tickets + buyer details (name/email/phone) + price breakdown
   (ticket + service fee = total) + **Pay → Stripe**.
4. **Stripe Checkout** — hosted, OUT OF SCOPE.
5. **Confirmation / tickets** — success recap + QR + magic-link (ours; confirm if in PoC).

## Full buyer flow (FigJam — authoritative)

1. **Entry** — Open event link → Event page → `On sale?` → No: **Event not available** / Yes → Ticket selection.
2. **Ticket selection** — `Sector type?` → **Standing**: Quantity picker → Select quantity → Confirm. **Seating**: Seat map → Select seat(s) → Confirm.
3. **Order summary** → Proceed to checkout.
4. **Checkout** — Enter email → Consent + order review → Payment. (Cart timer; `Timer expires` → **Session expired** — Stripe side.)
5. **Payment** — Pay → Processing → `Result?` → Error: Payment failed → Retry / Conflict: Seat no longer available / Success: Order confirmed. **(Stripe-hosted)**
6. **Post-purchase** — Done → emails: *tickets + download link*, *order confirmation*.
7. **My account (via magic link in email)** — Click account link → Sign-in link sent → My account → Change personal data / Privacy: export or delete / Purchase history / Manage consents. **(account mechanics — LATER)**
8. **Notifications (emails)** — cancelled + refund (if cancelled) / event reminder (before) / post-event follow-up (after).

## Scope boundaries
- **We design (kit-native):** Event page (+ "Event not available" state) · Ticket selection (standing quantity / seating seat map → confirm) · Order summary · Checkout (email + name + surname + consent + order review → "Pay") · "Done" / order-confirmed screen · Organizer page.
- **Stripe (NOT ours):** the Payment stage — Pay / Processing / Result / Payment failed / Retry / Seat-no-longer-available, **and Session expired (cart timer)**. We hand off at "Pay" and get redirected back.
- **Later (not now):** My account screens (magic-link login, personal data, privacy, purchase history, consents) — account mechanics TBD. Notification **emails** are backend templates, not app screens.

## Identity / accounts (user note)
- Checkout collects **name + surname + email** (+ phone). No separate registration: **first purchase auto-creates an account**. Login = **email magic link** (sign-in link emailed). Account mechanics handled later.

## Open / flexible
- **Ticket selection** has open questions (user): for now mirror **Yandex Afisha**; our seat map is the **volleyball** variant (seated sectors + standing), colored by ticket type / price tier.

## Mobile event page (Yandex mobile refs) — CONFIRMED structure

**B2C is mobile-first** (unlike the desktop B2B admin). The event page is a vertical stack;
the primary CTA **"Koupit vstupenky od X Kč" → a SEPARATE seat-selection screen** (not inline).

Sections (top→bottom):
1. **Hero** — cover (carousel if multiple images), title, subtitle/teams, genre·type·age chips, optional discount badge, big primary CTA **"Tickets from X"**, secondary row (rating/reviews · "Want to go" · "Been there"). *(rating/want/been → optional for PoC)*
2. **Schedule / sessions** — month filter chip + date rows (day-number + weekday·time + venue + per-session CTA "Tickets from X") + "Show more". For volleyball usually **one session/date** per match; support multiple if needed.
3. **About** — venue link, description + "Read more", duration, cast/photos carousel *(theatre-specific; for us: teams/lineup optional)*, details (age, organizer…).
4. **Reviews & ratings** — **SKIP for PoC**.
5. **Organizer / venue** link → Organizer page.

### Resolved decisions
- Event page → **separate** seat-selection screen (mobile-first). [Q1 resolved]
- Post-purchase: "Order confirmed" screen + tickets by **email** (download link); no on-screen QR. [pending final confirm]
- Checkout fields: **name + surname + email** (+phone TBD). [confirmed name/surname for auto-account]

## Mobile seat-selection screen (Yandex mobile refs)

- **Sticky header**: event title + date·venue line.
- **Price legend**: horizontally-scrollable chips (1000 / 1300 / 1500 / 2000 … ₽), color = price tier.
- **Seat map**: sectors labelled (Balcony / Boxes / Amphitheatre / Stalls), color dots = available by tier, grey = taken; "Stage" label at the bottom orienting the map; **zoom +/−** floating controls; info button.
- **Bottom sheet (sticky)**: "1 ticket: 3500 ₽" + selected-seat chip "row 5, seat 16 ✕" (removable) + big primary **"Continue"** CTA.
- Promo card ("refund guarantee") below the map — SKIP for PoC.

Mobile checkout & confirmation = same as desktop refs (single-column): details (name/email/phone ✓) → confirmation (price breakdown + Pay). Stripe owns payment.

### Volleyball adaptation
- Map = our venue model (seated sectors + standing zones), oriented to the **COURT** (not "Stage").
- Color by **ticket type / price tier**; legend chips per tier in CZK.
- Standing → quantity picker (no map); seating → seat map + bottom sheet.

## Reference set: COMPLETE ✅
Event page (mobile) · seat selection (mobile) · checkout · order confirmation — all captured.
Flow + scope in sections above. Ready to build, starting with the **Event page**.
