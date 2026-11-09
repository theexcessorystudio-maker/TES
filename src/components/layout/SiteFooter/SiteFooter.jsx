import { Link } from 'react-router-dom'
import { Instagram, Lock, MessageCircle } from 'lucide-react'
import { BUSINESS, INSTAGRAM } from '../../../config/site'
import { POLICY } from '../../../config/policies'
import { waLink } from '../../../config/whatsapp'
import { formatMoney } from '../../../lib/format'
import { POLICIES, POLICY_GROUPS } from '../../../features/legal/policies'
import styles from './SiteFooter.module.css'

const SHOP_LINKS = [
  { to: '/#shop', label: 'Shop the collection' },
  { to: '/#how', label: 'How it works' },
  { to: '/#faq', label: 'FAQs' },
  { to: '/account', label: 'My orders' },
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
            Curated accessories, quality checked and packed with care. {formatMoney(POLICY.deliveryFee)} flat delivery across India.
          </p>
          <div className={styles.social}>
            <a href={waLink()} target="_blank" rel="noreferrer" aria-label="Message us on WhatsApp"><MessageCircle size={18} /></a>
            {INSTAGRAM && <a href={`https://instagram.com/${INSTAGRAM}`} target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={18} /></a>}
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
