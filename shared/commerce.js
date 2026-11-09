/**
 * Commerce rules shared by the browser (display) and the API (source of truth).
 * Keep this file dependency-free so both Vite and Vercel functions can import it.
 */

export const CURRENCY_CODE = 'INR'
export const MAX_QTY_PER_LINE = 10

/**
 * ✏️ Shipping policy. `flatFee` is charged when the subtotal is below `freeAbove`.
 * Set `flatFee: 0` for always-free shipping. Set `freeAbove: 0` to always charge the fee.
 */
export const SHIPPING = { flatFee: 100, freeAbove: 0 }

export function shippingFor(subtotal) {
  if (!SHIPPING.flatFee) return 0
  if (SHIPPING.freeAbove && subtotal >= SHIPPING.freeAbove) return 0
  return SHIPPING.flatFee
}

/** US ring sizes from the studio's ring size guide. Offered as presets in the admin panel. */
export const RING_SIZES = ['4', '5', '6', '7', '8', '9', '10', '11', '12']

/** A cart line is unique per product + size. */
export const lineKey = (productId, size) => (size ? `${productId}::${size}` : productId)

/** Products saved before stock tracking (no `stock` number) fall back to the legacy inStock flag. */
export const stockOf = (p) => (typeof p?.stock === 'number' ? p.stock : p?.inStock === false ? 0 : Infinity)
export const requiresSize = (p) => Array.isArray(p?.sizes) && p.sizes.length > 0

export const PHONE_RE = /^[6-9]\d{9}$/
export const PINCODE_RE = /^[1-9]\d{5}$/
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const ORDER_STATUS = { PENDING: 'PENDING', PAID: 'PAID', FAILED: 'FAILED' }
export const FULFILMENT = ['New', 'Packed', 'Shipped', 'Delivered', 'Cancelled']
