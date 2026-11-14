import { Link } from 'react-router-dom'
import { ShieldCheck } from 'lucide-react'
import { POLICY } from '../../../../../config/policies'
import { formatMoney } from '../../../../../lib/format'
import { policyPath } from '../../../../legal/policies'
import { BentoTile } from '../../BentoTile/BentoTile'
import styles from './CheckoutTile.module.css'

const METHODS = ['UPI', 'Cards', 'Netbanking']

export function CheckoutTile({ area, order }) {
  return (
    <BentoTile area={area} order={order} tone="abyss" className={styles.tile}>
      <span className={styles.icon}><ShieldCheck size={20} /></span>
      <div>
        <b className={styles.title}>Secure checkout</b>
        <p className={styles.text}>
          Guest checkout, powered by Cashfree. {formatMoney(POLICY.deliveryFee)} flat delivery across India ·{' '}
          <Link to={policyPath('returns')}>Replacement policy</Link>
        </p>
      </div>
      <ul className={styles.methods} aria-label="Payment methods">
        {METHODS.map((m) => <li key={m}>{m}</li>)}
      </ul>
    </BentoTile>
  )
}
