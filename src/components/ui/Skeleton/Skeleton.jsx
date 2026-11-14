import { cx } from '../../../lib/format'
import styles from './Skeleton.module.css'

export function Skeleton({ className, ...rest }) {
  return <div className={cx(styles.skeleton, className)} aria-hidden="true" {...rest} />
}
