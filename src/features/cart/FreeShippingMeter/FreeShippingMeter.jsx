import { Truck } from 'lucide-react'
import { SHIPPING } from '../../../../shared/commerce'
import { formatMoney } from '../../../lib/format'
import styles from './FreeShippingMeter.module.css'

/** Nudges order value up when a free-shipping threshold is configured. Hidden otherwise. */
export function FreeShippingMeter({ subtotal }) {
  if (!SHIPPING.flatFee || !SHIPPING.freeAbove) return null
  const remaining = Math.max(0, SHIPPING.freeAbove - subtotal)
  const progress = Math.min(100, (subtotal / SHIPPING.freeAbove) * 100)
  return (
    <div className={styles.meter}>
      <p><Truck size={15} /> {remaining > 0 ? <>Add <b>{formatMoney(remaining)}</b> more for free shipping</> : <b>You’ve unlocked free shipping!</b>}</p>
      <div className={styles.track} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)}>
        <span style={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}
