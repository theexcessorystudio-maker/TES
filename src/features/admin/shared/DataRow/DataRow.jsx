import { motion } from 'framer-motion'
import { cx } from '../../../../lib/format'
import styles from './DataRow.module.css'

/** Card-style table row. `layout` names a column template defined in the module. */
export function DataRow({ layout = 'product', className, children }) {
  return (
    <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -30 }} className={cx(styles.row, styles[layout], className)}>
      {children}
    </motion.div>
  )
}

export function DataList({ children }) {
  return <div className={styles.list}>{children}</div>
}

export function RowMedia({ src, children, onClick, label }) {
  const Tag = onClick ? 'button' : 'div'
  return <Tag type={onClick ? 'button' : undefined} className={styles.media} onClick={onClick} aria-label={label}>{src ? <img src={src} alt="" /> : children}</Tag>
}

export function RowTitle({ title, meta }) {
  return <div className={styles.title}><b>{title}</b><span>{meta}</span></div>
}

export function RowActions({ children }) {
  return <div className={styles.actions}>{children}</div>
}

export function EmptyNote({ children }) {
  return <p className={styles.empty}>{children}</p>
}
