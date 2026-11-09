import { motion } from 'framer-motion'
import { ShoppingBag, Ruler } from 'lucide-react'
import { Button, Price, QuantityStepper } from '../../../components/ui'
import { imageUrl } from '../../../lib/cloudinary'
import { cx } from '../../../lib/format'
import { isSoldOut, isLowStock, stockOf, requiresSize, maxOrderable } from '../../../lib/product'
import { useCart } from '../../../context/cart/CartContext'
import { useToast } from '../../../context/ToastContext'
import styles from './ProductCard.module.css'

export function ProductCard({ product, onOpen }) {
  const { lines, add, setQty, open: openCart } = useCart()
  const { notify } = useToast()
  const sold = isSoldOut(product)
  const sized = requiresSize(product)
  const line = !sized && lines.find((l) => l.key === product.id)

  const handleAdd = () => {
    const r = add(product)
    notify(r.message, r.ok ? { action: { label: 'View cart', onClick: openCart } } : { tone: 'error' })
  }

  let action
  if (sold) action = <Button size="sm" block disabled>Sold out</Button>
  else if (sized) action = <Button size="sm" variant="outline" block onClick={() => onOpen(product.id)}><Ruler size={15} /> Choose size</Button>
  else if (line) action = <QuantityStepper block value={line.qty} max={maxOrderable(product)} onChange={(q) => setQty(line.key, q)} />
  else action = <Button size="sm" block onClick={handleAdd}><ShoppingBag size={15} /> Add to cart</Button>

  return (
    <motion.article layout initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} className={cx(styles.card, sold && styles.sold)}>
      <button type="button" className={styles.media} onClick={() => onOpen(product.id)} aria-label={`View ${product.name}`}>
        <img src={imageUrl(product.images?.[0], 600)} alt={product.name} loading="lazy" />
        {product.images?.[1] && <img className={styles.alt} src={imageUrl(product.images[1], 600)} alt="" loading="lazy" />}
        {sold && <span className={styles.tag}>Sold out</span>}
      </button>
      <div className={styles.body}>
        <span className={styles.category}>{product.category}</span>
        <h3 className={styles.name}><button type="button" onClick={() => onOpen(product.id)}>{product.name}</button></h3>
        <Price product={product} />
        {isLowStock(product) && <em className={styles.low}>Only {stockOf(product)} left</em>}
        <div className={styles.action}>{action}</div>
      </div>
    </motion.article>
  )
}
