import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, ShoppingBag, Truck, X } from 'lucide-react'
import { useCart } from '../../../context/cart/CartContext'
import { AccountMenu } from '../../../features/account/AccountMenu/AccountMenu'
import { shopSearchHref } from '../../../features/catalog/useShopSearch'
import styles from './SiteHeader.module.css'

const LINKS = [
  { to: '/#shop', label: 'Shop' },
  { to: '/#faq', label: 'FAQs' },
]

/** Search box that sends shoppers to the shop filtered by what they typed. */
function HeaderSearch({ onDone }) {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [value, setValue] = useState(params.get('q') || '')
  const input = useRef(null)
  useEffect(() => { input.current?.focus() }, [])

  const submit = (e) => {
    e.preventDefault()
    navigate(shopSearchHref(value))
    onDone()
  }
  return (
    <motion.form role="search" className={styles.searchBar} onSubmit={submit}
      initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
      <Search size={18} aria-hidden="true" />
      <input ref={input} type="search" value={value} onChange={(e) => setValue(e.target.value)} placeholder="Search for a piece, e.g. pearl earrings"
        aria-label="Search jewellery" onKeyDown={(e) => e.key === 'Escape' && onDone()} />
      <button type="submit" className={styles.searchGo}>Search</button>
      <button type="button" className={styles.icon} onClick={onDone} aria-label="Close search"><X size={18} /></button>
    </motion.form>
  )
}

export function SiteHeader() {
  const { count, open } = useCart()
  const [searching, setSearching] = useState(false)
  const { pathname } = useLocation()
  useEffect(() => setSearching(false), [pathname])

  return (
    <header className={styles.header}>
      <div className={styles.bar}>
        <nav className={styles.nav} aria-label="Main">
          {LINKS.map((l) => <Link key={l.to} to={l.to} className={styles.link}>{l.label}</Link>)}
        </nav>

        <Link to="/" className={styles.brand} aria-label="The Excessory Studio — home"><img src="/logo-circle.png" alt="" /></Link>

        <div className={styles.actions}>
          <button type="button" className={styles.icon} onClick={() => setSearching((s) => !s)} aria-label="Search" aria-expanded={searching}>
            <Search size={20} />
          </button>
          <Link to="/track-order" className={styles.track}><Truck size={19} /><span>Track order</span></Link>
          <AccountMenu />
          <button type="button" className={styles.cart} onClick={open} aria-label={`Open cart, ${count} items`}>
            <ShoppingBag size={20} />
            {count > 0 && (
              <motion.span key={count} className={styles.badge} initial={{ scale: 0.4 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 18 }}>
                {count}
              </motion.span>
            )}
          </button>
        </div>
      </div>
      <AnimatePresence>{searching && <HeaderSearch onDone={() => setSearching(false)} />}</AnimatePresence>
    </header>
  )
}
