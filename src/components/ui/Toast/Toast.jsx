import { AnimatePresence, motion } from 'framer-motion'
import { cx } from '../../../lib/format'
import styles from './Toast.module.css'

export function ToastViewport({ toast, onDismiss }) {
  return (
    <div className={styles.viewport} aria-live="polite">
      <AnimatePresence>
        {toast && (
          <motion.div key={toast.id} className={cx(styles.toast, styles[toast.tone])} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0 }}>
            {toast.message}
            {toast.action && <button type="button" onClick={() => { toast.action.onClick(); onDismiss() }}>{toast.action.label}</button>}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
