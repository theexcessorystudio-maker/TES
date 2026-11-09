import { useState } from 'react'
import { Star } from 'lucide-react'
import { cx } from '../../../lib/format'
import styles from './StarRating.module.css'

/** Read-only when `onChange` is omitted; otherwise an accessible 1–5 radio group. */
export function StarRating({ value = 0, onChange, size = 16, className }) {
  const [hover, setHover] = useState(0)
  if (!onChange) {
    return (
      <span className={cx(styles.stars, className)} role="img" aria-label={`${value} out of 5 stars`}>
        {[1, 2, 3, 4, 5].map((n) => <Star key={n} size={size} className={n <= Math.round(value) ? styles.on : styles.off} fill="currentColor" />)}
      </span>
    )
  }
  const shown = hover || value
  return (
    <div className={cx(styles.stars, styles.input, className)} role="radiogroup" aria-label="Rating" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button" role="radio" aria-checked={value === n} aria-label={`${n} star${n > 1 ? 's' : ''}`}
          onMouseEnter={() => setHover(n)} onClick={() => onChange(n)}>
          <Star size={size} className={n <= shown ? styles.on : styles.off} fill="currentColor" />
        </button>
      ))}
    </div>
  )
}
