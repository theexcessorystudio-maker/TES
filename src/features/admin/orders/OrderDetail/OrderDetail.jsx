import { useEffect, useState } from 'react'
import { AlertTriangle, MessageCircle, Phone, Truck } from 'lucide-react'
import { Button, Field, Pill } from '../../../../components/ui'
import { imageUrl } from '../../../../lib/cloudinary'
import { formatDate, formatMoney } from '../../../../lib/format'
import { FULFILMENT } from '../../../../../shared/commerce'
import { formatAddress } from '../../../address/validation'
import { useToast } from '../../../../context/ToastContext'
import { updateAwb } from '../../../../services/orders'
import { OrderTotals } from '../../../cart/OrderTotals/OrderTotals'
import { SidePanel } from '../../shared/SidePanel/SidePanel'
import { PAYMENT_LABEL, PAYMENT_TONE, shortRef } from '../orderMeta'
import styles from './OrderDetail.module.css'

/** AWB entry. You create the shipment with the courier yourself, then paste its AWB number here. */
function AwbField({ order }) {
  const { notify } = useToast()
  const [value, setValue] = useState(order.awb || '')
  const [saving, setSaving] = useState(false)
  useEffect(() => setValue(order.awb || ''), [order.awb])
  const changed = value.trim() !== (order.awb || '')

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await updateAwb(order, value)
      notify(value.trim() ? `AWB saved for ${shortRef(order.orderId)}` : 'AWB removed')
    } catch {
      notify('Could not save the AWB number. Please try again.', { tone: 'error' })
    }
    setSaving(false)
  }

  return (
    <form className={styles.awb} onSubmit={save}>
      <Field label="AWB / tracking number" hint="(customers see this on their order)" value={value} maxLength={40}
        onChange={(e) => setValue(e.target.value)} placeholder="Paste the AWB after creating the shipment" autoComplete="off" spellCheck={false} />
      <Button type="submit" size="sm" disabled={!changed} loading={saving}><Truck size={14} /> {order.awb ? 'Update AWB' : 'Save AWB'}</Button>
      {!order.awb && ['New', 'Packed'].includes(order.fulfilment) && <small>Saving an AWB also marks the order as Shipped.</small>}
    </form>
  )
}

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
      {order.status === 'PAID' && <AwbField order={order} />}

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
