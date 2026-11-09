import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { PageSpinner } from '../components/ui'
import { StoreLayout } from '../components/layout/StoreLayout/StoreLayout'
import HomePage from '../features/home/HomePage/HomePage'
import { AppProviders } from './AppProviders'
import { POLICIES } from '../features/legal/policies'

// Route-level code splitting: shoppers never download the admin bundle.
const CheckoutPage = lazy(() => import('../features/checkout/CheckoutPage/CheckoutPage'))
const OrderStatusPage = lazy(() => import('../features/checkout/OrderStatusPage/OrderStatusPage'))
const AccountPage = lazy(() => import('../features/account/AccountPage/AccountPage'))
const AdminPage = lazy(() => import('../features/admin/AdminPage/AdminPage'))
const LegalPage = lazy(() => import('../features/legal/LegalPage/LegalPage'))
const NotFoundPage = lazy(() => import('../features/notFound/NotFoundPage'))

export function App() {
  return (
    <BrowserRouter>
      <AppProviders>
        <Suspense fallback={<PageSpinner />}>
          <Routes>
            <Route element={<StoreLayout />}>
              <Route index element={<HomePage />} />
              <Route path="checkout" element={<CheckoutPage />} />
              <Route path="order/:orderId" element={<OrderStatusPage />} />
              <Route path="account" element={<AccountPage />} />
              {POLICIES.map((p) => <Route key={p.slug} path={p.path.slice(1)} element={<LegalPage slug={p.slug} />} />)}
              <Route path="*" element={<NotFoundPage />} />
            </Route>
            <Route path="admin" element={<AdminPage />} />
          </Routes>
        </Suspense>
      </AppProviders>
    </BrowserRouter>
  )
}
