import { Mail } from 'lucide-react'
import { Button } from '../../../components/ui'
import { policyPath } from '../policies'
import styles from './PolicyHelp.module.css'

export function PolicyHelp() {
  return (
    <aside className={styles.card}>
      <div>
        <p className={styles.title}>Still have a question?</p>
        <p className={styles.text}>Message us with your order number and we’ll help you out.</p>
      </div>
      <Button variant="light" to={policyPath('contact')}><Mail size={17} /> Contact us</Button>
    </aside>
  )
}
