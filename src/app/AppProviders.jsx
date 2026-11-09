import { ToastProvider } from '../context/ToastContext'
import { AuthProvider } from '../context/AuthContext'
import { CatalogProvider } from '../context/CatalogContext'
import { CartProvider } from '../context/cart/CartContext'

/** Provider order matters: Cart depends on Catalog; everything may raise toasts. */
export function AppProviders({ children }) {
  return (
    <ToastProvider>
      <AuthProvider>
        <CatalogProvider>
          <CartProvider>{children}</CartProvider>
        </CatalogProvider>
      </AuthProvider>
    </ToastProvider>
  )
}
