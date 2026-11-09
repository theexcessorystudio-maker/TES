import { cx } from '../../../lib/format'
import styles from './SectionTitle.module.css'

export function SectionTitle({ as: Tag = 'h2', size = 'lg', className, children }) {
  return <Tag className={cx(styles.title, styles[size], className)}>{children}</Tag>
}
