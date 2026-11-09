import { Link } from 'react-router-dom'
import { Package } from 'lucide-react'
import { Pill, Spinner } from '../../../components/ui'
import { imageUrl } from '../../../lib/cloudinary'
import { formatDate, formatMoney } from '../../../lib/format'
import styles from './OrderHistory.module.css'

const PAYMENT_TONE = { PAID: 'success', PENDING: 'warning', FAILED: 'danger' }
const PAYMENT_LABEL = { PAID: 'Paid', PENDING: 'Awaiting payment', FAILED: 'Payment failed' }
const FULFIL_TONE = { Delivered: 'success', Cancelled: 'danger' }

export function OrderHistory({ orders, loading }) {
  if (loading) return <Spinner />
  if (!orders.length) {
    return (
      <div className={styles.empty}>
        <Package size={30} strokeWidth={1.4} />
        <p>No orders yet.</p>
        <span>Orders you place while signed in — or as a guest with this email — will show up here.</span>
      </div>
    )
  }
  return (
    <ul className={styles.list} role="list">
      {orders.map((o) => (
        <li key={o.id}>
          <Link to={`/order/${o.orderId}`} className={styles.order}>
            <div className={styles.thumbs}>
              {o.items.slice(0, 3).map((i) => <img key={`${i.productId}-${i.size}`} src={imageUrl(i.image, 120)} alt="" />)}
              {o.items.length > 3 && <span>+{o.items.length - 3}</span>}
            </div>
            <div className={styles.info}>
              <b>{o.items.map((i) => i.name).join(', ')}</b>
              <span>{formatDate(o.createdAt)} · {o.items.reduce((n, i) => n + i.qty, 0)} item(s)</span>
            </div>
            <div className={styles.status}>
              <Pill tone={PAYMENT_TONE[o.status]}>{PAYMENT_LABEL[o.status]}</Pill>
              {o.status === 'PAID' && <Pill tone={FULFIL_TONE[o.fulfilment] || 'neutral'}>{o.fulfilment}</Pill>}
            </div>
            <b className={styles.total}>{formatMoney(o.total)}</b>
          </Link>
        </li>
      ))}
    </ul>
  )
}
