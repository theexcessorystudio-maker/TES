import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShoppingBag } from 'lucide-react'
import { useCart } from '../../../context/cart/CartContext'
import { AccountMenu } from '../../../features/account/AccountMenu/AccountMenu'
import styles from './SiteHeader.module.css'

const LINKS = [
  { to: '/#shop', label: 'Shop' },
  { to: '/#how', label: 'How it works' },
  { to: '/#faq', label: 'Questions' },
]

export function SiteHeader() {
  const { count, open } = useCart()
  return (
    <header className={styles.header}>
      <Link to="/" className={styles.brand} aria-label="The Excessory Studio — home"><img src="/logo-circle.png" alt="" /></Link>
      <nav className={styles.nav} aria-label="Main">
        {LINKS.map((l) => <Link key={l.to} to={l.to} className={styles.link}>{l.label}</Link>)}
        <AccountMenu />
        <button type="button" className={styles.cart} onClick={open} aria-label={`Open cart, ${count} items`}>
          <ShoppingBag size={20} />
          {count > 0 && (
            <motion.span key={count} className={styles.badge} initial={{ scale: 0.4 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 18 }}>
              {count}
            </motion.span>
          )}
        </button>
      </nav>
    </header>
  )
}
