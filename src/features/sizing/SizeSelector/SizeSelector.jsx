import { Ruler } from 'lucide-react'
import { cx } from '../../../lib/format'
import styles from './SizeSelector.module.css'

/** Radio-style size chips with an optional "Size guide" trigger. */
export function SizeSelector({ sizes, value, onChange, onOpenGuide, error }) {
  return (
    <fieldset className={styles.selector} aria-describedby={error ? 'size-error' : undefined}>
      <div className={styles.head}>
        <legend className={styles.legend}>Size{value && <span>: US {value}</span>}</legend>
        {onOpenGuide && <button type="button" className={styles.guide} onClick={onOpenGuide}><Ruler size={14} /> Size guide</button>}
      </div>
      <div className={styles.options} role="radiogroup" aria-label="Size">
        {sizes.map((s) => (
          <button key={s} type="button" role="radio" aria-checked={value === s} className={cx(styles.option, value === s && styles.selected)} onClick={() => onChange(s)}>
            {s}
          </button>
        ))}
      </div>
      {error && <p id="size-error" className={styles.error}>{error}</p>}
    </fieldset>
  )
}
