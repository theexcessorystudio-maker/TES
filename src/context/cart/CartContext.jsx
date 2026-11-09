import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react'
import { cartReducer, loadCart, saveCart } from './cartReducer'
import { useCatalog } from '../CatalogContext'
import { shippingFor } from '../../../shared/commerce'
import { isSoldOut, maxOrderable, hasOffer } from '../../lib/product'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { products, loading } = useCatalog()
  const [state, dispatch] = useReducer(cartReducer, undefined, loadCart)

  useEffect(() => saveCart(state.items), [state.items])
  useEffect(() => { if (!loading) dispatch({ type: 'reconcile', products }) }, [loading, products])

  const lines = useMemo(() => state.items
    .map((i) => ({ ...i, product: products.find((p) => p.id === i.id) }))
    .filter((l) => l.product), [state.items, products])

  const totals = useMemo(() => {
    const live = lines.filter((l) => !isSoldOut(l.product))
    const subtotal = live.reduce((n, l) => n + l.product.price * l.qty, 0)
    const savings = live.reduce((n, l) => n + (hasOffer(l.product) ? (l.product.oldPrice - l.product.price) * l.qty : 0), 0)
    const shipping = live.length ? shippingFor(subtotal) : 0
    return { subtotal, savings, shipping, total: subtotal + shipping, count: state.items.reduce((n, i) => n + i.qty, 0), liveLines: live }
  }, [lines, state.items])

  const qtyInCart = useCallback((id) => state.items.filter((i) => i.id === id).reduce((n, i) => n + i.qty, 0), [state.items])

  /** Returns { ok, message } so callers can show feedback without knowing the stock rules. */
  const add = useCallback((product, { size = null, qty = 1 } = {}) => {
    const max = maxOrderable(product)
    if (qtyInCart(product.id) + qty > max) return { ok: false, message: max <= 0 ? `${product.name} is sold out` : `Only ${max} available` }
    dispatch({ type: 'add', id: product.id, size, qty, max })
    return { ok: true, message: `${product.name}${size ? ` (size ${size})` : ''} added to cart` }
  }, [qtyInCart])

  const setQty = useCallback((key, qty) => {
    const line = state.items.find((i) => i.key === key)
    const product = line && products.find((p) => p.id === line.id)
    if (!product) return
    const otherSizes = qtyInCart(product.id) - line.qty
    dispatch({ type: 'setQty', key, qty, max: Math.max(0, maxOrderable(product) - otherSizes) })
  }, [state.items, products, qtyInCart])

  const value = useMemo(() => ({
    lines, ...totals, isOpen: state.isOpen,
    add, setQty, qtyInCart,
    remove: (key) => dispatch({ type: 'remove', key }),
    clear: () => dispatch({ type: 'clear' }),
    open: () => dispatch({ type: 'open' }),
    close: () => dispatch({ type: 'close' }),
  }), [lines, totals, state.isOpen, add, setQty, qtyInCart])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>')
  return ctx
}
