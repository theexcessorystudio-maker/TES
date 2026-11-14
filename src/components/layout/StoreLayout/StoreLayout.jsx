import { Suspense, useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { SiteHeader } from '../SiteHeader/SiteHeader'
import { SiteFooter } from '../SiteFooter/SiteFooter'
import { WhatsAppFab } from '../WhatsAppFab/WhatsAppFab'
import { CartDrawer } from '../../../features/cart/CartDrawer/CartDrawer'
import { ProductModal } from '../../../features/catalog/ProductModal/ProductModal'
import { useCart } from '../../../context/cart/CartContext'
import { useCatalog } from '../../../context/CatalogContext'
import { useProductViewer } from '../../../hooks/useProductViewer'
import { PageSpinner } from '../../ui'

/**
 * Scroll to #hash targets across routes (react-router does not do this by itself), and reset to the
 * top only when the page itself changes. Query-only updates (?p= product viewer, ?c= category) keep
 * the reader where they are, even though setSearchParams drops the hash.
 */
function useScrollManagement() {
  const { pathname, hash } = useLocation()
  const lastPath = useRef(pathname)
  useEffect(() => {
    const pageChanged = lastPath.current !== pathname
    lastPath.current = pathname
    if (hash) {
      const t = setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' }), 60)
      return () => clearTimeout(t)
    }
    if (pageChanged) window.scrollTo({ top: 0 })
  }, [pathname, hash])
}

export function StoreLayout() {
  useScrollManagement()
  const { isOpen, close } = useCart()
  const { byId } = useCatalog()
  const { productId, close: closeProduct } = useProductViewer()
  const product = productId && byId(productId)

  return (
    <>
      <SiteHeader />
      {/* Suspend only the page, never the layout: if the layout suspended while the cart drawer was
          animating out (e.g. "Checkout" → lazy /checkout), the exit animation froze and the drawer stuck. */}
      <main><Suspense fallback={<PageSpinner />}><Outlet /></Suspense></main>
      <SiteFooter />
      <WhatsAppFab />
      <AnimatePresence>{product && <ProductModal key={product.id} product={product} onClose={closeProduct} />}</AnimatePresence>
      <AnimatePresence>{isOpen && <CartDrawer onClose={close} />}</AnimatePresence>
    </>
  )
}
