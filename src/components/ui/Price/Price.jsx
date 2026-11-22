import { formatMoney, cx } from '../../../lib/format'
import { hasOffer } from '../../../lib/product'
import styles from './Price.module.css'

/** Selling price, with the MRP struck through when it is higher. size: sm | md | lg */
export function Price({ product, size = 'md' }) {
  return (
    <div className={cx(styles.price, styles[size])}>
      <div className={styles.amounts}>
        <b>{formatMoney(product.price)}</b>
        {hasOffer(product) && <s>MRP {formatMoney(product.oldPrice)}</s>}
      </div>
    </div>
  )
}
