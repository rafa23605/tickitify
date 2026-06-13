/** Mock analytics dataset for the PoC — one dataset, filtered and grouped per screen. */

export interface TrackedLink {
  id: string
  label: string
  source: string
  medium: string
  viewed: number
  initiated: number
  purchased: number
}

export interface Campaign {
  id: string
  name: string
  links: TrackedLink[]
}

export interface FunnelTotals {
  viewed: number
  initiated: number
  purchased: number
}

/** Chart palette — same order everywhere so a campaign keeps its color across charts. */
export const CHART_COLORS = [
  { dot: 'bg-indigo-500', cssVar: 'var(--color-indigo-500)' },
  { dot: 'bg-amber-400', cssVar: 'var(--color-amber-400)' },
  { dot: 'bg-teal-500', cssVar: 'var(--color-teal-500)' },
  { dot: 'bg-rose-500', cssVar: 'var(--color-rose-500)' },
  { dot: 'bg-sky-500', cssVar: 'var(--color-sky-500)' },
  { dot: 'bg-emerald-500', cssVar: 'var(--color-emerald-500)' }
]

export const chartColor = (i: number) => CHART_COLORS[i % CHART_COLORS.length]!

export const initialCampaigns: Campaign[] = [
  {
    id: 'instagram-announce',
    name: 'Instagram — Match Announce',
    links: [
      { id: 'ig-story', label: 'Story · countdown sticker', source: 'instagram', medium: 'social', viewed: 2480, initiated: 460, purchased: 148 },
      { id: 'ig-post', label: 'Feed post · lineup reveal', source: 'instagram', medium: 'social', viewed: 1890, initiated: 370, purchased: 121 },
      { id: 'ig-reels', label: 'Reels · training highlights', source: 'instagram', medium: 'social', viewed: 850, initiated: 180, purchased: 73 }
    ]
  },
  {
    id: 'newsletter-may',
    name: 'Newsletter May',
    links: [
      { id: 'nl-main', label: 'Main blast · members list', source: 'newsletter', medium: 'email', viewed: 980, initiated: 470, purchased: 256 },
      { id: 'nl-reminder', label: 'Reminder · 7 days before', source: 'newsletter', medium: 'email', viewed: 500, initiated: 250, purchased: 135 }
    ]
  },
  {
    id: 'google-brand',
    name: 'Google Ads — Brand',
    links: [
      { id: 'g-search', label: 'Search · brand keywords', source: 'google', medium: 'cpc', viewed: 1240, initiated: 310, purchased: 117 },
      { id: 'g-display', label: 'Display · sport sites', source: 'google', medium: 'display', viewed: 800, initiated: 200, purchased: 70 }
    ]
  },
  {
    id: 'partner-sites',
    name: 'Partner Sites',
    links: [
      { id: 'p-volejbal', label: 'volejbal.cz · article embed', source: 'volejbal.cz', medium: 'referral', viewed: 420, initiated: 96, purchased: 41 },
      { id: 'p-denik', label: 'denik.cz · sport section', source: 'denik.cz', medium: 'referral', viewed: 240, initiated: 54, purchased: 23 }
    ]
  },
  {
    id: 'influencer-push',
    name: 'Influencer Push',
    links: [
      { id: 'inf-yt', label: 'YouTube · Novák vlog', source: 'youtube', medium: 'social', viewed: 1850, initiated: 240, purchased: 52 },
      { id: 'inf-tt', label: 'TikTok · spike challenge', source: 'tiktok', medium: 'social', viewed: 1450, initiated: 190, purchased: 38 },
      { id: 'inf-ig', label: 'Instagram · Anna takeover', source: 'instagram', medium: 'social', viewed: 650, initiated: 110, purchased: 28 }
    ]
  },
  {
    id: 'tiktok-teaser',
    name: 'TikTok Teaser',
    links: [
      { id: 'tt-teaser', label: 'Teaser clip · just published', source: 'tiktok', medium: 'social', viewed: 0, initiated: 0, purchased: 0 }
    ]
  }
]

export const sumLinks = (links: TrackedLink[]): FunnelTotals => ({
  viewed: links.reduce((s, l) => s + l.viewed, 0),
  initiated: links.reduce((s, l) => s + l.initiated, 0),
  purchased: links.reduce((s, l) => s + l.purchased, 0)
})

export const campaignTotals = (c: Campaign) => sumLinks(c.links)

export const eventTotals = (list: Campaign[]): FunnelTotals => sumLinks(list.flatMap(c => c.links))

/* ——— campaign builder helpers ——— */

export const KNOWN_SOURCES = ['instagram', 'facebook', 'tiktok', 'youtube', 'google', 'newsletter', 'volejbal.cz', 'denik.cz', 'partner-site']
export const MEDIUMS = ['social', 'email', 'cpc', 'display', 'referral', 'other']

export const slugify = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

export const uniqueId = (base: string, taken: string[]) => {
  const root = slugify(base) || 'item'
  if (!taken.includes(root)) return root
  let n = 2
  while (taken.includes(`${root}-${n}`)) n++
  return `${root}-${n}`
}

/** the trackable URL organizers copy and share */
export const trackingUrl = (eventSlug: string, campaignId: string, link: { id: string, source: string, medium: string }) =>
  `https://ticketify.cz/cvf/${eventSlug}`
  + `?utm_source=${link.source || 'source'}`
  + `&utm_medium=${link.medium || 'medium'}`
  + `&utm_campaign=${campaignId}`
  + `&utm_content=${link.id || 'link'}`

/** group a campaign's links by source or medium, keeping a stable color per key */
export const groupLinks = (links: TrackedLink[], by: 'source' | 'medium') => {
  const map = new Map<string, FunnelTotals>()
  for (const l of links) {
    const key = l[by]
    const cur = map.get(key) ?? { viewed: 0, initiated: 0, purchased: 0 }
    cur.viewed += l.viewed
    cur.initiated += l.initiated
    cur.purchased += l.purchased
    map.set(key, cur)
  }
  return [...map.entries()]
    .sort((a, b) => b[1].viewed - a[1].viewed)
    .map(([key, totals], i) => ({ key, ...totals, color: chartColor(i) }))
}

export const fmtN = (n: number) => n.toLocaleString('cs-CZ')

export const pct = (part: number, whole: number) =>
  whole > 0 ? `${((part / whole) * 100).toFixed(1)}%` : '—'

/** event meta for the workspace header (mirrors the Events list mock) */
export const EVENTS_META: Record<string, { title: string, venue: string, when: string, status: 'published' | 'draft' | 'completed' | 'cancelled', sold?: number }> = {
  'vnl-cze-pol': { title: 'CZE × POL — VNL Qualifier', venue: 'Královka Arena · Praha', when: 'Sat 20 Jun · 19:00', status: 'published', sold: 1284 },
  'cup-final-four': { title: 'Czech Cup — Final Four', venue: 'Ostravar Aréna · Ostrava', when: 'Sat 27 Jun · 17:30', status: 'published', sold: 4800 },
  'u20-championship': { title: 'U20 Youth Championship', venue: 'Hala Vodova · Brno', when: 'Sun 12 Jul · 14:00', status: 'draft' },
  'beach-open-smichov': { title: 'Beach Volleyball Open', venue: 'Smíchovská pláž · Praha', when: 'Sat 1 Aug · 10:00', status: 'draft' },
  'cze-svk-friendly': { title: 'CZE × SVK — Friendly', venue: 'Královka Arena · Praha', when: 'Fri 15 May · 18:00', status: 'completed', sold: 2911 },
  'legends-night': { title: 'Legends Night — Exhibition', venue: 'Tipsport Arena · Praha', when: 'Fri 5 Jun · 20:00', status: 'cancelled' }
}
