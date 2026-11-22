import { cx } from '../../../lib/format'
import styles from './Marquee.module.css'

/**
 * Endlessly scrolling strip of short labels. The list is rendered twice so the loop is seamless;
 * the copy is hidden from screen readers. Stops moving for people who prefer reduced motion.
 */
export function Marquee({ items, label, speed = 32, className }) {
  const row = (hidden) => (
    <ul className={styles.row} aria-hidden={hidden || undefined}>
      {/* Repeat short lists so one copy is always wider than the screen. */}
      {Array.from({ length: Math.max(2, Math.ceil(8 / items.length)) }, (_, r) => items.map((t, i) => (
        <li key={`${r}-${i}`}>{t}</li>
      )))}
    </ul>
  )
  return (
    <div className={cx(styles.marquee, className)} role="region" aria-label={label} style={{ '--marquee-duration': `${speed}s` }}>
      <div className={styles.track}>{row(false)}{row(true)}</div>
    </div>
  )
}
