import { formatMoney, cx } from '../../../../lib/format'
import { OFFER_LABEL } from '../../../../config/site'
import styles from './InvoiceSummary.module.css'

export function InvoiceSummary({ totals, shipping, discount, className }) {
  return (
    <div className={cx(styles.summary, className)}>
      {totals.savings > 0 && (
        <>
          <div><span>Total at MRP</span><span>{formatMoney(totals.mrp)}</span></div>
          <div className={styles.savings}><span>{OFFER_LABEL} savings</span><span>−{formatMoney(totals.savings)}</span></div>
        </>
      )}
      <div><span>Subtotal</span><span>{formatMoney(totals.sub)}</span></div>
      {shipping > 0 && <div><span>Shipping</span><span>{formatMoney(shipping)}</span></div>}
      {discount > 0 && <div><span>Extra discount</span><span>−{formatMoney(discount)}</span></div>}
      <div className={styles.grand}><span>Total</span><b>{formatMoney(totals.total)}</b></div>
    </div>
  )
}
