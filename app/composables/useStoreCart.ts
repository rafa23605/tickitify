import { SERVICE_FEE_RATE } from '~/utils/storefront'

/** One ticket in the buyer's cart (a seat or a standing unit). */
export interface CartItem {
  uid: string
  tierId: string
  label: string      // e.g. "Tribuna A · ř. 3, m. 12" or "Místo k stání"
  sublabel?: string
  price: number
}

export interface Buyer {
  firstName: string
  lastName: string
  email: string
  phone: string
}

/** Session-scoped buyer cart — shared across select → checkout → done. */
export const useStoreCart = () => useState<CartItem[]>('store-cart', () => [])
export const useStoreBuyer = () =>
  useState<Buyer>('store-buyer', () => ({ firstName: '', lastName: '', email: '', phone: '' }))

export const cartSubtotal = (items: CartItem[]) => items.reduce((s, i) => s + i.price, 0)
export const cartFee = (items: CartItem[]) => Math.round(cartSubtotal(items) * SERVICE_FEE_RATE)
export const cartTotal = (items: CartItem[]) => cartSubtotal(items) + cartFee(items)
