/**
 * Workspace namespace — event workspace page (overview / sales / marketing tabs,
 * campaign analytics, new-campaign modal). Merged into the i18n dictionary in
 * messages.ts. Proper nouns (event titles, venues, "Tickitify", tier names) and
 * locale-formatted dates/numbers stay in the data layer.
 */
export default {
  en: {
    workspace: {
      status: {
        onSale: 'On sale',
        draft: 'Draft',
        completed: 'Completed',
        cancelled: 'Cancelled'
      },
      tabs: {
        overview: 'Overview',
        sales: 'Sales',
        marketing: 'Marketing'
      },
      period: {
        all: 'All time',
        last30: 'Last 30 days',
        last7: 'Last 7 days'
      },
      breadcrumbEvents: 'Events',
      analyticsTitle: 'Campaign analytics',
      analyticsDesc: 'Where your buyers came from — every tracked link, rolled up.',
      coverageSuffix: 'of {sold} sales attributed ·',
      campaignsTitle: 'Campaigns',
      campaignsHint: 'Click a column to sort, click a campaign to drill into its links.',
      newCampaign: 'New campaign',
      colName: 'Campaign',
      colViewed: 'Viewed',
      colInitiated: 'Initiated checkout',
      colPurchased: 'Purchased',
      colConversion: 'Conv.',
      colOpen: 'Open',
      trafficTitle: 'Traffic by campaign',
      trafficDesc: "Where your audience's attention comes from.",
      trafficCenter: 'Viewed',
      salesTitle: 'Sales by campaign',
      salesDesc: 'Where your actual ticket sales come from.',
      salesCenter: 'Purchased',
      modalTitle: 'New campaign',
      modalDesc: 'A named bucket that groups tracking links — one promotional effort.',
      nameLabel: 'Campaign name',
      nameHelp: 'Shown in reports exactly as typed.',
      namePlaceholder: 'Instagram — May post',
      cancel: 'Cancel',
      createCampaign: 'Create campaign',
      toastCreatedTitle: 'Campaign created',
      toastCreatedDesc: 'Now add tracking links and share them.'
    }
  },
  cs: {
    workspace: {
      status: {
        onSale: 'V prodeji',
        draft: 'Koncept',
        completed: 'Dokončeno',
        cancelled: 'Zrušeno'
      },
      tabs: {
        overview: 'Přehled',
        sales: 'Prodej',
        marketing: 'Marketing'
      },
      period: {
        all: 'Za celou dobu',
        last30: 'Posledních 30 dní',
        last7: 'Posledních 7 dní'
      },
      breadcrumbEvents: 'Události',
      analyticsTitle: 'Analytika kampaní',
      analyticsDesc: 'Odkud vaši kupující přišli — každý sledovaný odkaz, sečteno dohromady.',
      coverageSuffix: 'z {sold} prodejů přiřazeno ·',
      campaignsTitle: 'Kampaně',
      campaignsHint: 'Kliknutím na sloupec seřadíte, kliknutím na kampaň zobrazíte její odkazy.',
      newCampaign: 'Nová kampaň',
      colName: 'Kampaň',
      colViewed: 'Zobrazení',
      colInitiated: 'Zahájené nákupy',
      colPurchased: 'Nákupy',
      colConversion: 'Konv.',
      colOpen: 'Otevřít',
      trafficTitle: 'Návštěvnost podle kampaně',
      trafficDesc: 'Odkud přichází pozornost vašeho publika.',
      trafficCenter: 'Zobrazení',
      salesTitle: 'Prodej podle kampaně',
      salesDesc: 'Odkud pochází vaše skutečné prodeje vstupenek.',
      salesCenter: 'Nákupy',
      modalTitle: 'Nová kampaň',
      modalDesc: 'Pojmenovaná skupina, která sdružuje sledovací odkazy — jedna propagační aktivita.',
      nameLabel: 'Název kampaně',
      nameHelp: 'V reportech se zobrazí přesně tak, jak ji napíšete.',
      namePlaceholder: 'Instagram — květnový příspěvek',
      cancel: 'Zrušit',
      createCampaign: 'Vytvořit kampaň',
      toastCreatedTitle: 'Kampaň vytvořena',
      toastCreatedDesc: 'Nyní přidejte sledovací odkazy a sdílejte je.'
    }
  }
}
