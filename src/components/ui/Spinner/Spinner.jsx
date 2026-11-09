import { Loader2 } from 'lucide-react'
import styles from './Spinner.module.css'

export function Spinner({ size = 20, label = 'Loading' }) {
  return <Loader2 size={size} className={styles.spinner} role="status" aria-label={label} />
}

export function PageSpinner() {
  return <div className={styles.page}><Spinner size={28} /></div>
}
