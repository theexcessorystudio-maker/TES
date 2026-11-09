import { motion } from 'framer-motion'
import { Trash2 } from 'lucide-react'
import { IconButton, QuantityStepper } from '../../../components/ui'
import { imageUrl } from '../../../lib/cloudinary'
import { formatMoney, cx } from '../../../lib/format'
import { isSoldOut, hasOffer } from '../../../lib/product'
import styles from './CartLine.module.css'

/** One cart row. `readOnly` drops the controls (used in the checkout summary). */
export function CartLine({ line, max, onQty, onRemove, readOnly }) {
  const { product, size, qty } = line
  const sold = isSoldOut(product)
  return (
    <motion.div layout className={cx(styles.line, sold && styles.unavailable, readOnly && styles.compact)}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: 40 }}>
      <div className={styles.media}>
        <img src={imageUrl(product.images?.[0], 160)} alt="" />
        {readOnly && <span className={styles.qtyBadge}>{qty}</span>}
      </div>
      <div className={styles.info}>
        <b className={styles.name}>{product.name}</b>
        {size && <span className={styles.size}>Size US {size}</span>}
        <span className={styles.price}>
          {sold ? 'Sold out — not included in your order' : <>{formatMoney(product.price * (readOnly ? qty : 1))}{!readOnly && hasOffer(product) && <s>{formatMoney(product.oldPrice)}</s>}</>}
        </span>
        {!readOnly && (
          <div className={styles.controls}>
            <QuantityStepper size="sm" value={qty} max={max} onChange={onQty} />
            <IconButton label={`Remove ${product.name}`} variant="danger" onClick={onRemove}><Trash2 size={17} /></IconButton>
          </div>
        )}
      </div>
    </motion.div>
  )
}
