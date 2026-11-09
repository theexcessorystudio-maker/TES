import { cx } from '../../../lib/format'
import styles from './Pill.module.css'

/** Status chip. tone: success | warning | danger | neutral | brand. Renders a button when onClick is given. */
export function Pill({ tone = 'neutral', onClick, className, children, ...rest }) {
  const Tag = onClick ? 'button' : 'span'
  return <Tag type={onClick ? 'button' : undefined} onClick={onClick} className={cx(styles.pill, styles[tone], onClick && styles.interactive, className)} {...rest}>{children}</Tag>
}
