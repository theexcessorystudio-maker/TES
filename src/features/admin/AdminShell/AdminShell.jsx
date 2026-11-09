import { useState } from 'react'
import { ExternalLink, LogOut, Package, Receipt, ShoppingCart } from 'lucide-react'
import { useAuth } from '../../../context/AuthContext'
import { cx } from '../../../lib/format'
import { ProductsPanel } from '../products/ProductsPanel/ProductsPanel'
import { OrdersPanel } from '../orders/OrdersPanel/OrdersPanel'
import { InvoicesPanel } from '../invoices/InvoicesPanel/InvoicesPanel'
import styles from './AdminShell.module.css'

/** Tab registry — add a panel here and it appears in the sidebar. */
const PANELS = [
  { id: 'orders', label: 'Orders', icon: ShoppingCart, Component: OrdersPanel },
  { id: 'products', label: 'Products', icon: Package, Component: ProductsPanel },
  { id: 'invoices', label: 'Invoices', icon: Receipt, Component: InvoicesPanel },
]

export function AdminShell() {
  const { user, signOut } = useAuth()
  const [active, setActive] = useState('orders')
  const { Component } = PANELS.find((p) => p.id === active)

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <img src="/logo-circle.png" alt="" className={styles.logo} />
        <p className={styles.who}>Signed in as<br /><b>{user.email}</b></p>
        <nav className={styles.tabs} aria-label="Admin sections">
          {PANELS.map((p) => (
            <button key={p.id} type="button" className={cx(styles.link, active === p.id && styles.active)} onClick={() => setActive(p.id)} aria-current={active === p.id ? 'page' : undefined}>
              <p.icon size={16} /> {p.label}
            </button>
          ))}
        </nav>
        <a href="/" target="_blank" rel="noreferrer" className={styles.link}><ExternalLink size={16} /> View store</a>
        <button type="button" className={cx(styles.link, styles.signOut)} onClick={signOut}><LogOut size={16} /> Sign out</button>
      </aside>
      <main className={styles.main}><Component /></main>
    </div>
  )
}
