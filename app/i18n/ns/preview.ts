/**
 * i18n namespace: preview — storefront preview card (EventPreviewCard.vue).
 * Czech default, English fallback. Keys mirror the t('preview.*') calls in the
 * component. The minimum-price amount stays locale-formatted in the component
 * and is interpolated via the {n} placeholder; the "Kč" currency suffix is part
 * of the formatted value, not this dictionary.
 */
export default {
  en: {
    preview: {
      ariaLabel: 'Storefront preview',
      heading: 'Storefront preview',
      tickets: 'Tickets',
      from: 'from {n}',
      buyTickets: 'Buy tickets',
      helper: 'Approximate look of your event card for buyers. The final storefront design is a separate screen.'
    }
  },
  cs: {
    preview: {
      ariaLabel: 'Náhled prodejní stránky',
      heading: 'Náhled prodejní stránky',
      tickets: 'Vstupenky',
      from: 'od {n}',
      buyTickets: 'Koupit vstupenky',
      helper: 'Přibližný vzhled karty vaší události pro kupující. Finální design prodejní stránky je samostatná obrazovka.'
    }
  }
}
