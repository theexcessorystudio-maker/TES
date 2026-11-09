import { stockOf, requiresSize, MAX_QTY_PER_LINE } from '../../shared/commerce'
import { OFFER_LABEL } from '../config/site'

export { stockOf, requiresSize }
export const isSoldOut = (p) => stockOf(p) <= 0
export const isLowStock = (p) => { const s = stockOf(p); return s > 0 && s <= 3 }
export const maxOrderable = (p) => Math.min(MAX_QTY_PER_LINE, stockOf(p))
export const hasOffer = (p) => Number(p.oldPrice) > Number(p.price)
export const offerLabelOf = (p) => p.offerLabel || OFFER_LABEL
export const discountPercent = (p) => (hasOffer(p) ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100) : 0)
