import { motion } from 'framer-motion'
import styles from './StatGrid.module.css'

/** stats: [{ label, value, icon }] — the first card is highlighted. */
export function StatGrid({ stats }) {
  return (
    <div className={styles.grid}>
      {stats.map((s, i) => (
        <motion.div key={s.label} className={styles.stat} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
          <s.icon size={20} /><b>{s.value}</b><span>{s.label}</span>
        </motion.div>
      ))}
    </div>
  )
}
