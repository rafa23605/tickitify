import { initialOrders } from '~/utils/salesOrders'
import type { Order } from '~/utils/salesOrders'

/** Session-scoped order state — refunds issued in the prototype persist across client-side navigation. */
export const useOrders = () =>
  useState<Order[]>('orders', () =>
    initialOrders.map(o => ({ ...o, tickets: o.tickets.map(t => ({ ...t })) }))
  )
