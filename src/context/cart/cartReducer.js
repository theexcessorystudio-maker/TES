import { lineKey, requiresSize } from '../../../shared/commerce'

/** Pure cart state machine. Stock limits are resolved by the provider and passed in as `max`. */
export const initialCart = { items: [], isOpen: false }

export function cartReducer(state, action) {
  switch (action.type) {
    case 'add': {
      const { id, size = null, qty, max } = action
      const key = lineKey(id, size)
      const otherSizes = state.items.filter((i) => i.id === id && i.key !== key).reduce((n, i) => n + i.qty, 0)
      const existing = state.items.find((i) => i.key === key)
      const next = Math.min((existing?.qty || 0) + qty, max - otherSizes)
      if (next <= 0) return state
      return {
        ...state,
        items: existing ? state.items.map((i) => (i.key === key ? { ...i, qty: next } : i)) : [...state.items, { key, id, size, qty: next }],
      }
    }
    case 'setQty': {
      if (action.qty <= 0) return { ...state, items: state.items.filter((i) => i.key !== action.key) }
      return { ...state, items: state.items.map((i) => (i.key === action.key ? { ...i, qty: Math.min(action.qty, action.max) } : i)) }
    }
    case 'remove':
      return { ...state, items: state.items.filter((i) => i.key !== action.key) }
    case 'clear':
      return { ...state, items: [] }
    case 'open':
      return { ...state, isOpen: true }
    case 'close':
      return { ...state, isOpen: false }
    case 'reconcile': {
      // Drop deleted products and sizes that are no longer offered.
      const items = state.items.filter((i) => {
        const p = action.products.find((x) => x.id === i.id)
        if (!p) return false
        return requiresSize(p) ? p.sizes.includes(i.size) : !i.size
      })
      return items.length === state.items.length ? state : { ...state, items }
    }
    default:
      return state
  }
}

const STORAGE_KEY = 'tes_cart_v2'

export function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if (Array.isArray(saved)) return { ...initialCart, items: saved }
    // Migrate the v1 shape: [{ id, qty }]
    const legacy = JSON.parse(localStorage.getItem('tes_cart'))
    if (Array.isArray(legacy)) return { ...initialCart, items: legacy.map((l) => ({ key: l.id, id: l.id, size: null, qty: l.qty })) }
  } catch { /* corrupted storage — start fresh */ }
  return initialCart
}

export const saveCart = (items) => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)) } catch { /* private mode */ } }
