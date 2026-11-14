import { motion, useReducedMotion } from 'framer-motion'
import { cx } from '../../../../lib/format'
import styles from './BentoTile.module.css'

/**
 * One cell of the hero bento. `area` maps to a named grid area in Hero.module.css,
 * `tone` sets the surface, and `order` staggers the entrance animation.
 */
export function BentoTile({ area, tone = 'light', order = 0, interactive, className, children, ...rest }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={cx(styles.tile, styles[tone], interactive && styles.interactive, className)}
      style={{ gridArea: area }}
      initial={{ opacity: 0, y: reduce ? 0 : 22, scale: reduce ? 1 : 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.12 + order * 0.07, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}
