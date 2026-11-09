import { CartLine } from '../../cart/CartLine/CartLine'
import { OrderTotals } from '../../cart/OrderTotals/OrderTotals'
import { FreeShippingMeter } from '../../cart/FreeShippingMeter/FreeShippingMeter'
import styles from './OrderSummary.module.css'

export function OrderSummary({ lines, subtotal, savings, shipping, total, footer }) {
  return (
    <aside className={styles.summary} aria-label="Order summary">
      <h2 className={styles.title}>Order summary</h2>
      <div className={styles.lines}>{lines.map((l) => <CartLine key={l.key} line={l} readOnly />)}</div>
      <FreeShippingMeter subtotal={subtotal} />
      <OrderTotals subtotal={subtotal} savings={savings} shipping={shipping} total={total} />
      {footer}
    </aside>
  )
}
