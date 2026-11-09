import { useMemo } from 'react'
import { Plus } from 'lucide-react'
import { useCatalog } from '../../../context/CatalogContext'
import { useCart } from '../../../context/cart/CartContext'
import { useToast } from '../../../context/ToastContext'
import { useProductViewer } from '../../../hooks/useProductViewer'
import { cartRecommendations } from '../../../lib/recommendations'
import { imageUrl } from '../../../lib/cloudinary'
import { formatMoney } from '../../../lib/format'
import { requiresSize } from '../../../lib/product'
import styles from './CartUpsell.module.css'

/** "Complete the look" rail inside the cart — one-tap add for items without sizes. */
export function CartUpsell() {
  const { products } = useCatalog()
  const { lines, add, close: closeCart } = useCart()
  const { notify } = useToast()
  const { open: openProduct } = useProductViewer()
  const open = (id) => { closeCart(); openProduct(id) }
  const picks = useMemo(() => cartRecommendations(lines.map((l) => l.product), products, 4), [lines, products])
  if (!picks.length) return null

  const quickAdd = (p) => {
    if (requiresSize(p)) return open(p.id)
    const r = add(p)
    notify(r.message, r.ok ? undefined : { tone: 'error' })
  }

  return (
    <section className={styles.upsell} aria-labelledby="upsell-title">
      <h4 id="upsell-title" className={styles.title}>Complete the look</h4>
      <div className={styles.rail}>
        {picks.map((p) => (
          <article key={p.id} className={styles.card}>
            <button type="button" className={styles.media} onClick={() => open(p.id)} aria-label={`View ${p.name}`}>
              <img src={imageUrl(p.images?.[0], 240)} alt="" loading="lazy" />
            </button>
            <b className={styles.name}>{p.name}</b>
            <div className={styles.row}>
              <span>{formatMoney(p.price)}</span>
              <button type="button" className={styles.add} onClick={() => quickAdd(p)} aria-label={requiresSize(p) ? `Choose size for ${p.name}` : `Add ${p.name}`}>
                <Plus size={16} />
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
