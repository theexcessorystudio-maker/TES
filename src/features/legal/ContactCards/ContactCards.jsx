import { Clock, Instagram, Mail, MapPin, MessageCircle } from 'lucide-react'
import { BUSINESS, INSTAGRAM, WHATSAPP } from '../../../config/site'
import { waLink } from '../../../config/whatsapp'
import styles from './ContactCards.module.css'

/** Contact channels built from config/site.js — a channel without a value is simply not shown. */
function channels() {
  return [
    WHATSAPP && { icon: MessageCircle, title: 'WhatsApp', value: `+${WHATSAPP}`, href: waLink(), note: 'Fastest way to reach us', external: true },
    BUSINESS.email && { icon: Mail, title: 'Email', value: BUSINESS.email, href: `mailto:${BUSINESS.email}`, note: 'We reply within one business day' },
    INSTAGRAM && { icon: Instagram, title: 'Instagram', value: `@${INSTAGRAM}`, href: `https://instagram.com/${INSTAGRAM}`, note: 'New drops and styling ideas', external: true },
    BUSINESS.address && { icon: MapPin, title: 'Registered address', value: BUSINESS.address },
    { icon: Clock, title: 'Support hours', value: 'Mon – Sat, 10 am – 7 pm IST', note: 'Messages after hours are answered the next working day' },
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
