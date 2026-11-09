import { Minus, Plus } from 'lucide-react'
import { cx } from '../../../lib/format'
import styles from './QuantityStepper.module.css'

/** size: sm | md | lg     block stretches to full width */
export function QuantityStepper({ value, max = Infinity, min = 0, onChange, size = 'md', block, label = 'Quantity' }) {
  return (
    <div className={cx(styles.stepper, styles[size], block && styles.block)} role="group" aria-label={label}>
      <button type="button" onClick={() => onChange(value - 1)} disabled={value <= min} aria-label={`Decrease ${label.toLowerCase()}`}><Minus size={14} /></button>
      <output aria-live="polite">{value}</output>
      <button type="button" onClick={() => onChange(value + 1)} disabled={value >= max} aria-label={`Increase ${label.toLowerCase()}`}><Plus size={14} /></button>
    </div>
  )
}
