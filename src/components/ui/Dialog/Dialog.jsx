import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useDialogBehaviour } from '../../../hooks/useDialogBehaviour'
import { IconButton } from '../IconButton/IconButton'
import { cx } from '../../../lib/format'
import styles from './Dialog.module.css'

const PRESETS = {
  center: { initial: { y: 40, opacity: 0, scale: 0.97 }, animate: { y: 0, opacity: 1, scale: 1 }, exit: { y: 30, opacity: 0 } },
  right: { initial: { x: '100%' }, animate: { x: 0 }, exit: { x: '100%' } },
}

/**
 * Accessible overlay primitive used by every modal, drawer and side panel.
 * placement: center | right     Wrap in <AnimatePresence> at the call site for exit animations.
 */
export function Dialog({ label, onClose, placement = 'center', className, showClose = true, closeOnBackdrop = true, layer = 'overlay', children }) {
  useDialogBehaviour(onClose)
  const motionProps = PRESETS[placement]
  return (
    <motion.div className={cx(styles.backdrop, styles[placement], styles[layer])} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={closeOnBackdrop ? onClose : undefined}>
      <motion.div role="dialog" aria-modal="true" aria-label={label} className={cx(styles.panel, styles[`${placement}Panel`], className)}
        {...motionProps} transition={{ type: 'spring', damping: 30, stiffness: 290 }} onClick={(e) => e.stopPropagation()}>
        {showClose && <IconButton label="Close" variant="solid" className={styles.close} onClick={onClose}><X size={18} /></IconButton>}
        {children}
      </motion.div>
    </motion.div>
  )
}

/** Standard header row for drawers / side panels. */
export function DialogHeader({ title, subtitle, onClose }) {
  return (
    <div className={styles.header}>
      <div>
        <h2 className={styles.title}>{title}</h2>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      {onClose && <IconButton label="Close" onClick={onClose}><X size={20} /></IconButton>}
    </div>
  )
}
