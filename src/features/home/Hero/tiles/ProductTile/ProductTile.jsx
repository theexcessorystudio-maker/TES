import { ArrowUpRight } from 'lucide-react'
import { imageUrl } from '../../../../../lib/cloudinary'
import { cx, formatMoney } from '../../../../../lib/format'
import { discountPercent } from '../../../../../lib/product'
import { BentoTile } from '../../BentoTile/BentoTile'
import styles from './ProductTile.module.css'

/** Full-bleed product photo tile. size: feature (tall, large caption) | compact */
export function ProductTile({ area, order, product, size = 'compact', label, onOpen }) {
  const off = discountPercent(product)
  return (
    <BentoTile area={area} order={order} tone="media" interactive className={cx(styles.tile, styles[size])}>
      <button type="button" className={styles.button} onClick={() => onOpen(product.id)} aria-label={`View ${product.name}`}>
        <img className={styles.image} src={imageUrl(product.images[0], size === 'feature' ? 800 : 520)} alt="" />
        <span className={styles.top}>
          {label && <span className={styles.chip}>{label}</span>}
          {off > 0 && <span className={cx(styles.chip, styles.offChip)}>−{off}%</span>}
        </span>
        <span className={styles.caption}>
          <span className={styles.text}>
            <b>{product.name}</b>
            <span className={styles.price}>{formatMoney(product.price)}{off > 0 && <s>{formatMoney(product.oldPrice)}</s>}</span>
          </span>
          <span className={styles.arrow} aria-hidden="true"><ArrowUpRight size={18} /></span>
        </span>
      </button>
    </BentoTile>
  )
}
