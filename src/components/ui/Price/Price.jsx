import { Sparkles } from 'lucide-react'
import { formatMoney, cx } from '../../../lib/format'
import { discountPercent, offerLabelOf } from '../../../lib/product'
import styles from './Price.module.css'

/** Selling price with MRP, % off and offer badge. size: sm | md | lg */
export function Price({ product, size = 'md', showBadge = true }) {
  const off = discountPercent(product)
  return (
    <div className={cx(styles.price, styles[size])}>
      {showBadge && off > 0 && <span className={styles.badge}><Sparkles size={size === 'lg' ? 14 : 12} /> {offerLabelOf(product)}</span>}
      <div className={styles.amounts}>
        <b>{formatMoney(product.price)}</b>
        {off > 0 && <><s>MRP {formatMoney(product.oldPrice)}</s><em>{off}% off</em></>}
      </div>
    </div>
  )
}
