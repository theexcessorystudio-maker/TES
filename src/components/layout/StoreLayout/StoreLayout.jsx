import { useEffect } from 'react'
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

/** Scroll to #hash targets across routes (react-router does not do this by itself). */
function useScrollManagement() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (!hash) { window.scrollTo({ top: 0 }); return }
    const t = setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' }), 60)
    return () => clearTimeout(t)
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
      <main><Outlet /></main>
      <SiteFooter />
      <WhatsAppFab />
      <AnimatePresence>{product && <ProductModal key={product.id} product={product} onClose={closeProduct} />}</AnimatePresence>
      <AnimatePresence>{isOpen && <CartDrawer onClose={close} />}</AnimatePresence>
    </>
  )
}
