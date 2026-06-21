/**
 * i18n namespace: funnel — conversion funnel stats card (FunnelStats.vue).
 * Czech default, English fallback. Keys mirror the t('funnel.*') calls in the
 * component. Formatted percentages/numbers stay in the data layer and are
 * interpolated via the {p} placeholder.
 */
export default {
  en: {
    funnel: {
      viewed: 'Viewed',
      viewedSub: 'unique visitors',
      initiated: 'Initiated checkout',
      initiatedSub: 'started buying',
      purchased: 'Purchased',
      ofViewed: '{p} of viewed',
      ofInitiated: '{p} of initiated'
    }
  },
  cs: {
    funnel: {
      viewed: 'Zobrazení',
      viewedSub: 'unikátní návštěvníci',
      initiated: 'Zahájené nákupy',
      initiatedSub: 'začali nakupovat',
      purchased: 'Nákupy',
      ofViewed: '{p} ze zobrazení',
      ofInitiated: '{p} ze zahájených'
    }
  }
}
