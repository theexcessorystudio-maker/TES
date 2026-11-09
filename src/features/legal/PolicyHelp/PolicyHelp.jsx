import { MessageCircle } from 'lucide-react'
import { Button } from '../../../components/ui'
import { waLink } from '../../../config/whatsapp'
import styles from './PolicyHelp.module.css'

export function PolicyHelp() {
  return (
    <aside className={styles.card}>
      <div>
        <p className={styles.title}>Still have a question?</p>
        <p className={styles.text}>Message us with your order number and we’ll help you out.</p>
      </div>
      <Button variant="light" href={waLink()} target="_blank" rel="noreferrer"><MessageCircle size={17} /> Chat on WhatsApp</Button>
    </aside>
  )
}
