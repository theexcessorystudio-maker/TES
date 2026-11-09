import { X } from 'lucide-react'
import { imageUrl } from '../../../../lib/cloudinary'
import styles from './PairingsField.module.css'

const MAX = 3

/** Hand-pick "Frequently bought together" partners. Empty = automatic suggestions. */
export function PairingsField({ value, onChange, products, currentId }) {
  const picked = value.map((id) => products.find((p) => p.id === id)).filter(Boolean)
  const options = products.filter((p) => p.id !== currentId && !value.includes(p.id))
  return (
    <div className={styles.field}>
      <div className={styles.label}>Frequently bought together <small>(up to {MAX} · leave empty for automatic suggestions)</small></div>
      {picked.length > 0 && (
        <ul className={styles.chips} role="list">
          {picked.map((p) => (
            <li key={p.id} className={styles.chip}>
              <img src={imageUrl(p.images?.[0], 80)} alt="" />
              <span>{p.name}</span>
              <button type="button" onClick={() => onChange(value.filter((id) => id !== p.id))} aria-label={`Remove ${p.name}`}><X size={13} /></button>
            </li>
          ))}
        </ul>
      )}
      {value.length < MAX && (
        <select className={styles.select} value="" onChange={(e) => e.target.value && onChange([...value, e.target.value])} aria-label="Add a pairing">
          <option value="">+ Add a product to pair with…</option>
          {options.map((p) => <option key={p.id} value={p.id}>{p.name}{p.category ? ` · ${p.category}` : ''}</option>)}
        </select>
      )}
    </div>
  )
}
