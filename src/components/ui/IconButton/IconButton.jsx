import { cx } from '../../../lib/format'
import styles from './IconButton.module.css'

/** Square icon-only button. `label` is required for screen readers. variant: plain | danger | solid */
export function IconButton({ label, variant = 'plain', className, children, ...rest }) {
  return (
    <button type="button" aria-label={label} title={label} className={cx(styles.iconButton, styles[variant], className)} {...rest}>
      {children}
    </button>
  )
}
