import { Instagram, Mail, MapPin, MessageCircle } from 'lucide-react'
import { BUSINESS, INSTAGRAM, INSTAGRAM_URL, WHATSAPP } from '../../../config/site'
import { waLink } from '../../../config/whatsapp'
import styles from './ContactCards.module.css'

/** Contact channels built from config/site.js — a channel without a value is simply not shown. */
function channels() {
  // Show Indian numbers as a local 10-digit number (8376974906), others with their country code.
  const phone = /^91\d{10}$/.test(WHATSAPP) ? WHATSAPP.slice(2) : `+${WHATSAPP}`
  return [
    BUSINESS.email && { icon: Mail, title: 'Email', value: BUSINESS.email, href: `mailto:${BUSINESS.email}` },
    WHATSAPP && { icon: MessageCircle, title: 'WhatsApp', value: phone, href: waLink(), external: true },
    INSTAGRAM && { icon: Instagram, title: 'Instagram', value: `@${INSTAGRAM}`, href: INSTAGRAM_URL, external: true },
    BUSINESS.address && { icon: MapPin, title: 'Registered address', value: BUSINESS.address },
  ].filter(Boolean)
}

export function ContactCards() {
  return (
    <ul className={styles.grid}>
      {channels().map(({ icon: Icon, title, value, href, note, external }) => {
        const body = (
          <>
            <span className={styles.icon}><Icon size={20} aria-hidden="true" /></span>
            <span className={styles.title}>{title}</span>
            <span className={styles.value}>{value}</span>
            {note && <span className={styles.note}>{note}</span>}
          </>
        )
        return (
          <li key={title}>
            {href
              ? <a className={styles.card} href={href} {...(external && { target: '_blank', rel: 'noreferrer' })}>{body}</a>
              : <div className={styles.card}>{body}</div>}
          </li>
        )
      })}
    </ul>
  )
}
