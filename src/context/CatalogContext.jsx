import { createContext, useContext, useMemo } from 'react'
import { useSubscription } from '../hooks/useSubscription'
import { subscribeProducts } from '../services/products'

const CatalogContext = createContext(null)

/** One live product subscription for the whole app, instead of one per component. */
export function CatalogProvider({ children }) {
  const { data: products, loading, error } = useSubscription(subscribeProducts, [])
  const value = useMemo(() => ({
    products, loading, error,
    byId: (id) => products.find((p) => p.id === id),
  }), [products, loading, error])
  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
}

export function useCatalog() {
  const ctx = useContext(CatalogContext)
  if (!ctx) throw new Error('useCatalog must be used inside <CatalogProvider>')
  return ctx
}
