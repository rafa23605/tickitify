/**
 * Campaign detail namespace — drives the live CS/EN switch via useT().
 * Proper nouns (event titles, venues, source/medium values entered as data)
 * and locale-formatted numbers stay in the data layer.
 */
export default {
  en: {
    campaign: {
      breadcrumbEvents: 'Events',
      headerDesc: 'Campaign · {n} tracked {links} · {event}',
      linkSingular: 'link',
      linkPlural: 'links',

      toastLinkCopiedTitle: 'Tracking link copied',
      toastLinkCopiedDesc: 'Paste it wherever this promo goes live.',
      toastLinkCreatedTitle: 'Tracking link created',
      toastLinkCreatedDesc: 'Copy it from the list and share — numbers start at zero.',
      toastCopiedTitle: 'Link copied',

      colLink: 'Tracking link',
      colSource: 'Source',
      colMedium: 'Medium',
      colViewed: 'Viewed',
      colInitiated: 'Initiated checkout',
      colPurchased: 'Purchased',
      colCopy: 'Copy',
      copyLink: 'Copy link',
      copyLinkAria: 'Copy tracking link',

      tabBySource: 'By source',
      tabByMedium: 'By medium',

      linksTitle: 'Links',
      linksDesc: 'Every tracked URL in this campaign — copy one and share it.',
      newLink: 'New tracking link',

      emptyTitle: 'No links yet',
      emptyDesc: 'Create your first tracking link, share it in a post or email, and the funnel starts counting.',

      breakdownTitle: 'Breakdown',
      breakdownDesc: 'Same visitors, sliced two ways — both charts follow one toggle.',

      trafficTitle: 'Traffic',
      trafficDesc: 'Viewed users by {by}.',
      trafficCenter: 'Viewed',
      salesTitle: 'Sales',
      salesDesc: 'Purchased users by {by}.',
      salesCenter: 'Purchased',
      groupSource: 'source',
      groupMedium: 'medium',

      modalTitle: 'New tracking link',
      modalDesc: 'One trackable URL — tagged with a source and a medium.',

      labelField: 'Label',
      labelHelp: 'For your eyes only — name the placement.',
      labelPlaceholder: 'Story · countdown sticker',
      sourceField: 'Source',
      sourceHelp: 'The named place — type your own if missing.',
      sourcePlaceholder: 'instagram',
      mediumField: 'Medium',
      mediumHelp: 'The channel category.',
      mediumPlaceholder: 'social',
      urlField: 'Your trackable URL',
      urlHelp: 'Generated automatically — this is what you share.',
      copyUrlAria: 'Copy URL',

      cancel: 'Cancel',
      createLink: 'Create link'
    }
  },
  cs: {
    campaign: {
      breadcrumbEvents: 'Události',
      headerDesc: 'Kampaň · {n} sledovaných {links} · {event}',
      linkSingular: 'odkaz',
      linkPlural: 'odkazů',

      toastLinkCopiedTitle: 'Sledovací odkaz zkopírován',
      toastLinkCopiedDesc: 'Vložte ho všude, kde tato propagace poběží.',
      toastLinkCreatedTitle: 'Sledovací odkaz vytvořen',
      toastLinkCreatedDesc: 'Zkopírujte ho ze seznamu a sdílejte — čísla začínají na nule.',
      toastCopiedTitle: 'Odkaz zkopírován',

      colLink: 'Sledovací odkaz',
      colSource: 'Zdroj',
      colMedium: 'Médium',
      colViewed: 'Zobrazení',
      colInitiated: 'Zahájené nákupy',
      colPurchased: 'Nákupy',
      colCopy: 'Kopírovat',
      copyLink: 'Kopírovat odkaz',
      copyLinkAria: 'Kopírovat sledovací odkaz',

      tabBySource: 'Podle zdroje',
      tabByMedium: 'Podle média',

      linksTitle: 'Odkazy',
      linksDesc: 'Každá sledovaná URL v této kampani — jednu zkopírujte a sdílejte.',
      newLink: 'Nový sledovací odkaz',

      emptyTitle: 'Zatím žádné odkazy',
      emptyDesc: 'Vytvořte svůj první sledovací odkaz, sdílejte ho v příspěvku nebo e-mailu a trychtýř začne počítat.',

      breakdownTitle: 'Rozdělení',
      breakdownDesc: 'Stejní návštěvníci nakrájení dvěma způsoby — oba grafy řídí jeden přepínač.',

      trafficTitle: 'Návštěvnost',
      trafficDesc: 'Uživatelé se zobrazením podle {by}.',
      trafficCenter: 'Zobrazení',
      salesTitle: 'Prodej',
      salesDesc: 'Uživatelé s nákupem podle {by}.',
      salesCenter: 'Nákupy',
      groupSource: 'zdroje',
      groupMedium: 'média',

      modalTitle: 'Nový sledovací odkaz',
      modalDesc: 'Jedna sledovatelná URL — označená zdrojem a médiem.',

      labelField: 'Štítek',
      labelHelp: 'Jen pro vás — pojmenujte umístění.',
      labelPlaceholder: 'Story · odpočítávací samolepka',
      sourceField: 'Zdroj',
      sourceHelp: 'Konkrétní místo — pokud chybí, napište vlastní.',
      sourcePlaceholder: 'instagram',
      mediumField: 'Médium',
      mediumHelp: 'Kategorie kanálu.',
      mediumPlaceholder: 'social',
      urlField: 'Vaše sledovatelná URL',
      urlHelp: 'Vygenerováno automaticky — toto sdílíte.',
      copyUrlAria: 'Kopírovat URL',

      cancel: 'Zrušit',
      createLink: 'Vytvořit odkaz'
    }
  }
}
