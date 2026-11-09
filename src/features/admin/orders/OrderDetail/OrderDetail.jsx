import { AlertTriangle, MessageCircle, Phone } from 'lucide-react'
import { Button, Field, Pill } from '../../../../components/ui'
import { imageUrl } from '../../../../lib/cloudinary'
import { formatDate, formatMoney } from '../../../../lib/format'
import { FULFILMENT } from '../../../../../shared/commerce'
import { formatAddress } from '../../../address/validation'
import { OrderTotals } from '../../../cart/OrderTotals/OrderTotals'
import { SidePanel } from '../../shared/SidePanel/SidePanel'
import { PAYMENT_LABEL, PAYMENT_TONE, shortRef } from '../orderMeta'
import styles from './OrderDetail.module.css'

export function OrderDetail({ order, onClose, onFulfilment }) {
  const phone = order.customer.phone
  return (
    <SidePanel title={shortRef(order.orderId)} subtitle={formatDate(order.createdAt)} onClose={onClose} wide>
      <div className={styles.status}>
        <Pill tone={PAYMENT_TONE[order.status]}>{PAYMENT_LABEL[order.status]}{order.payment?.method ? ` · ${order.payment.method}` : ''}</Pill>
        {order.uid ? <Pill>Account</Pill> : <Pill>Guest</Pill>}
      </div>
      {order.oversold && <p className={styles.warning}><AlertTriangle size={16} /> Stock ran out while this was being paid for — check inventory before shipping.</p>}

      {order.status === 'PAID' && (
        <Field as="select" label="Fulfilment status" value={order.fulfilment} onChange={(e) => onFulfilment(order, e.target.value)}>
          {FULFILMENT.map((f) => <option key={f}>{f}</option>)}
        </Field>
      )}

      <section className={styles.block}>
        <h3>Customer</h3>
        <p><b>{order.customer.name}</b><br />{order.customer.email}<br />+91 {phone}</p>
        <div className={styles.contact}>
          <Button size="sm" variant="outline" href={`tel:+91${phone}`}><Phone size={14} /> Call</Button>
          <Button size="sm" variant="outline" href={`https://wa.me/91${phone}?text=${encodeURIComponent(`Hi ${order.customer.name}! About your order ${shortRef(order.orderId)} from The Excessory Studio:`)}`} target="_blank" rel="noreferrer"><MessageCircle size={14} /> WhatsApp</Button>
        </div>
      </section>

      <section className={styles.block}>
        <h3>Ship to</h3>
        <p className={styles.address}>{formatAddress(order.address)}</p>
        {order.note && <p className={styles.note}>“{order.note}”</p>}
      </section>

      <section className={styles.block}>
        <h3>Items</h3>
        <ul className={styles.items} role="list">
          {order.items.map((i) => (
            <li key={`${i.productId}-${i.size || ''}`}>
              <img src={imageUrl(i.image, 100)} alt="" />
              <span><b>{i.name}</b>{i.size && <Pill tone="brand" className={styles.size}>Size {i.size}</Pill>}<small>{i.qty} × {formatMoney(i.price)}</small></span>
              <em>{formatMoney(i.qty * i.price)}</em>
            </li>
          ))}
        </ul>
        <OrderTotals subtotal={order.subtotal} shipping={order.shipping} total={order.total} />
      </section>
      <p className={styles.ref}>Full reference: {order.orderId}</p>
    </SidePanel>
  )
}
