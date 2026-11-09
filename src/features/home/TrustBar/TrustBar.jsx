import { Lock, MessageCircle, ShieldCheck, Sparkles, Truck } from 'lucide-react'
import { TRUST } from '../../../config/site'
import styles from './TrustBar.module.css'

const ICONS = { shield: ShieldCheck, truck: Truck, chat: MessageCircle, sparkles: Sparkles, lock: Lock }

export function TrustBar() {
  return (
    <div className={styles.wrap}>
      <section className={styles.bar} aria-label="Why shop with us">
        {TRUST.map((t) => {
          const Icon = ICONS[t.icon] || Sparkles
          return (
            <div key={t.title} className={styles.item}>
              <span className={styles.icon}><Icon size={20} strokeWidth={1.6} /></span>
              <div><h3>{t.title}</h3><p>{t.text}</p></div>
            </div>
          )
        })}
      </section>
    </div>
  )
}
