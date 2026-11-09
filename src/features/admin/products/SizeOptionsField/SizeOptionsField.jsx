import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { Checkbox } from '../../../../components/ui'
import { RING_SIZES } from '../../../../../shared/commerce'
import { cx } from '../../../../lib/format'
import styles from './SizeOptionsField.module.css'

const sortSizes = (list) => [...list].sort((a, b) => (Number(a) - Number(b)) || a.localeCompare(b))

/**
 * Admin control for which sizes a product is offered in.
 * value: { sizes: string[], sizeGuide: '' | 'ring' }   onChange(patch)
 */
export function SizeOptionsField({ sizes, sizeGuide, onChange }) {
  const [custom, setCustom] = useState('')
  const enabled = sizes.length > 0
  const extra = sizes.filter((s) => !RING_SIZES.includes(s))

  const toggle = (s) => onChange({ sizes: sortSizes(sizes.includes(s) ? sizes.filter((x) => x !== s) : [...sizes, s]) })
  const addCustom = () => {
    const s = custom.trim().slice(0, 12)
    if (s && !sizes.includes(s)) onChange({ sizes: sortSizes([...sizes, s]) })
    setCustom('')
  }

  return (
    <fieldset className={styles.field}>
      <legend className={styles.legend}>Sizes</legend>
      <Checkbox label="This product comes in sizes (customer must pick one)" checked={enabled}
        onChange={(e) => onChange(e.target.checked ? { sizes: [...RING_SIZES], sizeGuide: sizeGuide || 'ring' } : { sizes: [], sizeGuide: '' })} />

      {enabled && (
        <div className={styles.body}>
          <p className={styles.hint}>Tap to toggle the US ring sizes you stock:</p>
          <div className={styles.chips}>
            {RING_SIZES.map((s) => (
              <button key={s} type="button" className={cx(styles.chip, sizes.includes(s) && styles.on)} onClick={() => toggle(s)} aria-pressed={sizes.includes(s)}>{s}</button>
            ))}
            {extra.map((s) => (
              <span key={s} className={cx(styles.chip, styles.on, styles.custom)}>{s}<button type="button" onClick={() => toggle(s)} aria-label={`Remove size ${s}`}><X size={12} /></button></span>
            ))}
          </div>
          <div className={styles.addRow}>
            <input value={custom} onChange={(e) => setCustom(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustom() } }}
              placeholder="Other size (e.g. 6.5, Free size)" aria-label="Add a custom size" />
            <button type="button" onClick={addCustom} disabled={!custom.trim()}><Plus size={15} /> Add</button>
          </div>
          <div className={styles.quick}>
            <button type="button" onClick={() => onChange({ sizes: [...new Set([...RING_SIZES, ...sizes])] })}>Select all</button>
            <button type="button" onClick={() => onChange({ sizes: extra })}>Clear presets</button>
          </div>
          <Checkbox label="Show the ring size guide on this product" checked={sizeGuide === 'ring'} onChange={(e) => onChange({ sizeGuide: e.target.checked ? 'ring' : '' })} />
        </div>
      )}
    </fieldset>
  )
}
