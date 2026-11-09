import { Fragment, useMemo, useState } from 'react'
import { Plus, ShoppingBag, Check } from 'lucide-react'
import { Button } from '../../../components/ui'
import { useCatalog } from '../../../context/CatalogContext'
import { useCart } from '../../../context/cart/CartContext'
import { useToast } from '../../../context/ToastContext'
import { useProductViewer } from '../../../hooks/useProductViewer'
import { frequentlyBoughtWith } from '../../../lib/recommendations'
import { imageUrl } from '../../../lib/cloudinary'
import { formatMoney, cx } from '../../../lib/format'
import { requiresSize, isSoldOut } from '../../../lib/product'
import styles from './FrequentlyBoughtTogether.module.css'

/**
 * Bundle builder shown on the product page. The main product's size comes from the page's size selector;
 * add-ons that need a size get a compact picker inline.
 */
export function FrequentlyBoughtTogether({ product, selectedSize, onSizeMissing }) {
  const { products } = useCatalog()
  const { add, open: openCart } = useCart()
  const { notify } = useToast()
  const { open: openProduct } = useProductViewer()
  const addOns = useMemo(() => frequentlyBoughtWith(product, products, 2), [product, products])
  const bundle = useMemo(() => [product, ...addOns], [product, addOns])

  const [checked, setChecked] = useState(() => new Set(bundle.map((p) => p.id)))
  const [sizes, setSizes] = useState({})
  if (!addOns.length || isSoldOut(product)) return null

  const chosen = bundle.filter((p) => checked.has(p.id))
  const total = chosen.reduce((n, p) => n + Number(p.price), 0)
  const mrpTotal = chosen.reduce((n, p) => n + Math.max(Number(p.oldPrice) || 0, Number(p.price)), 0)
  const sizeFor = (p) => (p.id === product.id ? selectedSize : sizes[p.id])
  const toggle = (id) => setChecked((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n })

  const addBundle = () => {
    const missing = chosen.find((p) => requiresSize(p) && !sizeFor(p))
    if (missing) {
      if (missing.id === product.id) onSizeMissing?.()
      return notify(`Choose a size for ${missing.name} first`, { tone: 'error' })
    }
    const results = chosen.map((p) => add(p, { size: sizeFor(p) || null }))
    const added = results.filter((r) => r.ok).length
    if (!added) return notify(results[0]?.message || 'Could not add these items', { tone: 'error' })
    notify(`${added} item${added > 1 ? 's' : ''} added to cart`, { action: { label: 'View cart', onClick: openCart } })
  }

  return (
    <section className={styles.bundle} aria-labelledby="fbt-title">
      <h3 id="fbt-title" className={styles.title}>Frequently bought together</h3>
      <div className={styles.visual}>
        {bundle.map((p, i) => (
          <Fragment key={p.id}>
            {i > 0 && <Plus size={18} className={styles.plus} aria-hidden="true" />}
            <button type="button" className={cx(styles.thumb, !checked.has(p.id) && styles.dimmed)} onClick={() => (p.id === product.id ? null : openProduct(p.id))}
              aria-label={p.id === product.id ? `${p.name} (this item)` : `View ${p.name}`}>
              <img src={imageUrl(p.images?.[0], 240)} alt="" loading="lazy" />
            </button>
          </Fragment>
        ))}
      </div>

      <ul className={styles.list} role="list">
        {bundle.map((p) => (
          <li key={p.id} className={styles.item}>
            <label className={styles.check}>
              <input type="checkbox" checked={checked.has(p.id)} onChange={() => toggle(p.id)} />
              <span className={styles.box} aria-hidden="true"><Check size={13} strokeWidth={3} /></span>
              <span className={styles.name}>{p.id === product.id ? <><b>This item:</b> {p.name}</> : p.name}</span>
            </label>
            {requiresSize(p) && p.id !== product.id && (
              <select className={styles.size} value={sizes[p.id] || ''} onChange={(e) => setSizes((s) => ({ ...s, [p.id]: e.target.value }))} aria-label={`Size for ${p.name}`}>
                <option value="">Size</option>
                {p.sizes.map((s) => <option key={s} value={s}>US {s}</option>)}
              </select>
            )}
            <span className={styles.price}>{formatMoney(p.price)}</span>
          </li>
        ))}
      </ul>

      <div className={styles.footer}>
        <div className={styles.total}>
          <span>Total for {chosen.length} item{chosen.length === 1 ? '' : 's'}</span>
          <b>{formatMoney(total)}</b>
          {mrpTotal > total && <s>{formatMoney(mrpTotal)}</s>}
        </div>
        <Button onClick={addBundle} disabled={!chosen.length}><ShoppingBag size={16} /> Add {chosen.length > 1 ? `all ${chosen.length}` : ''} to cart</Button>
      </div>
    </section>
  )
}
