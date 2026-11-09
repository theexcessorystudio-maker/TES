import { motion } from 'framer-motion'
import { cx } from '../../../lib/format'
import styles from './CategoryTabs.module.css'

export function CategoryTabs({ categories, value, onChange }) {
  return (
    <div className={styles.tabs} role="tablist" aria-label="Categories">
      {categories.map((c) => (
        <button key={c} type="button" role="tab" aria-selected={c === value} className={cx(styles.tab, c === value && styles.active)} onClick={() => onChange(c)}>
          {c === value && <motion.span layoutId="category-pill" className={styles.indicator} transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
          <span className={styles.label}>{c}</span>
        </button>
      ))}
    </div>
  )
}
