import { formatMoney } from '../../../lib/format'
import styles from './OrderTotals.module.css'

export function OrderTotals({ subtotal, savings = 0, shipping = 0, total }) {
  return (
    <dl className={styles.totals}>
      {savings > 0 && <div className={styles.savings}><dt>You save on MRP</dt><dd>−{formatMoney(savings)}</dd></div>}
      <div><dt>Subtotal</dt><dd>{formatMoney(subtotal)}</dd></div>
      <div><dt>Shipping</dt><dd>{shipping ? formatMoney(shipping) : 'Free'}</dd></div>
      <div className={styles.grand}><dt>Total</dt><dd>{formatMoney(total)}</dd></div>
    </dl>
  )
}
