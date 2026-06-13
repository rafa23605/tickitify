import { initialCampaigns } from '~/utils/campaignAnalytics'
import type { Campaign } from '~/utils/campaignAnalytics'

/** Session-scoped campaign state: the mock dataset plus anything created in the builder. */
export const useCampaigns = () =>
  useState<Campaign[]>('campaigns', () =>
    initialCampaigns.map(c => ({ ...c, links: c.links.map(l => ({ ...l })) }))
  )
