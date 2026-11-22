import { Link } from 'react-router-dom'
import { Instagram, Lock, Mail } from 'lucide-react'
import { BUSINESS, INSTAGRAM_URL } from '../../../config/site'
import { POLICY } from '../../../config/policies'
import { formatMoney } from '../../../lib/format'
import { POLICIES, POLICY_GROUPS } from '../../../features/legal/policies'
import styles from './SiteFooter.module.css'

const SHOP_LINKS = [
  { to: '/#shop', label: 'Shop the collection' },
  { to: '/#faq', label: 'FAQs' },
  { to: '/track-order', label: 'Track order' },
  { to: '/account', label: 'My account' },
]

/** Link columns: a fixed “Shop” column plus one column per policy group from the registry. */
const COLUMNS = [
  { title: 'Shop', links: SHOP_LINKS },
  ...Object.entries(POLICY_GROUPS).map(([group, title]) => ({
    title,
    links: POLICIES.filter((p) => p.group === group).map((p) => ({ to: p.path, label: p.navLabel })),
  })),
]

const PAYMENT_METHODS = ['UPI', 'Visa', 'Mastercard', 'RuPay', 'Netbanking']

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div className={styles.brand}>
          <div className={styles.identity}>
            <img src="/logo-circle.png" alt="" />
            <b>{BUSINESS.name}</b>
          </div>
          <p className={styles.blurb}>
            Demi-fine jewellery, made to last and made to love. Free shipping on orders above {formatMoney(POLICY.freeShippingAbove)}.
          </p>
          <div className={styles.social}>
            {INSTAGRAM_URL && <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={18} /></a>}
            {BUSINESS.email && <a href={`mailto:${BUSINESS.email}`} aria-label="Email us"><Mail size={18} /></a>}
          </div>
        </div>

        {COLUMNS.map((col) => (
          <nav key={col.title} className={styles.column} aria-label={col.title}>
            <p className={styles.heading}>{col.title}</p>
            <ul>
              {col.links.map((l) => <li key={l.to}><Link to={l.to}>{l.label}</Link></li>)}
            </ul>
          </nav>
        ))}
      </div>

      <div className={styles.bottom}>
        <small>© {new Date().getFullYear()} {BUSINESS.name}. All rights reserved.</small>
        <div className={styles.payments}>
          <span className={styles.secure}><Lock size={13} /> Secure payments by Cashfree</span>
          <ul aria-label="Accepted payment methods">
            {PAYMENT_METHODS.map((m) => <li key={m}>{m}</li>)}
          </ul>
        </div>
      </div>
    </footer>
  )
}
