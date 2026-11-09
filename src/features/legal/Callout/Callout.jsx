import { AlertTriangle, CheckCircle2, Info } from 'lucide-react'
import { cx } from '../../../lib/format'
import styles from './Callout.module.css'

const ICONS = { info: Info, warning: AlertTriangle, success: CheckCircle2 }

/** Highlighted note inside a policy. tone: info | warning | success */
export function Callout({ tone = 'info', title, children }) {
  const Icon = ICONS[tone]
  return (
    <aside className={cx(styles.callout, styles[tone])}>
      <Icon size={20} className={styles.icon} aria-hidden="true" />
      <div>
        {title && <p className={styles.title}>{title}</p>}
        <div className={styles.body}>{children}</div>
      </div>
    </aside>
  )
}
