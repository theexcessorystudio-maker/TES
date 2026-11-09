import { useMemo, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { IndianRupee, PackageCheck, ShoppingCart, Truck } from 'lucide-react'
import { Pill, Spinner } from '../../../../components/ui'
import { useToast } from '../../../../context/ToastContext'
import { useSubscription } from '../../../../hooks/useSubscription'
import { subscribeAllOrders, updateFulfilment } from '../../../../services/orders'
import { imageUrl } from '../../../../lib/cloudinary'
import { formatDate, formatMoney, cx } from '../../../../lib/format'
import { FULFILMENT } from '../../../../../shared/commerce'
import { SearchField } from '../../../catalog/SearchField/SearchField'
import { PanelHeader } from '../../shared/PanelHeader/PanelHeader'
import { StatGrid } from '../../shared/StatGrid/StatGrid'
import { DataList, DataRow, EmptyNote, RowMedia, RowTitle } from '../../shared/DataRow/DataRow'
import { OrderDetail } from '../OrderDetail/OrderDetail'
import { FILTERS, PAYMENT_LABEL, PAYMENT_TONE, itemCount, needsShipping, shortRef } from '../orderMeta'
import styles from './OrdersPanel.module.css'

export function OrdersPanel() {
  const { data: orders, loading, error } = useSubscription(subscribeAllOrders, [])
  const { notify } = useToast()
  const [filter, setFilter] = useState('ship')
  const [query, setQuery] = useState('')
  const [openId, setOpenId] = useState(null)

  const paid = orders.filter((o) => o.status === 'PAID')
  const stats = [
    { label: 'Paid orders', value: paid.length, icon: ShoppingCart },
    { label: 'Revenue', value: formatMoney(paid.reduce((n, o) => n + o.total, 0)), icon: IndianRupee },
    { label: 'To ship', value: orders.filter(needsShipping).length, icon: Truck },
    { label: 'Delivered', value: paid.filter((o) => o.fulfilment === 'Delivered').length, icon: PackageCheck },
  ]
  const visible = useMemo(() => {
    const test = FILTERS.find((f) => f.id === filter).test
    const q = query.trim().toLowerCase()
    return orders.filter((o) => test(o) && `${o.orderId} ${o.customer.name} ${o.customer.phone} ${o.customer.email}`.toLowerCase().includes(q))
  }, [orders, filter, query])
  const open = openId && orders.find((o) => o.id === openId)

  const changeFulfilment = async (order, fulfilment) => {
    try { await updateFulfilment(order.id, fulfilment); notify(`${shortRef(order.orderId)} marked ${fulfilment.toLowerCase()}`) } catch { notify('Could not update the order', { tone: 'error' }) }
  }

  return (
    <>
      <PanelHeader title="Orders" description="Online orders paid through Cashfree. Update fulfilment as you pack and ship." />
      <StatGrid stats={stats} />
      <div className={styles.toolbar}>
        <div className={styles.filters} role="tablist">
          {FILTERS.map((f) => (
            <button key={f.id} type="button" role="tab" aria-selected={filter === f.id} className={cx(styles.filter, filter === f.id && styles.active)} onClick={() => setFilter(f.id)}>{f.label}</button>
          ))}
        </div>
        <SearchField value={query} onChange={setQuery} placeholder="Search name, phone, email, ref…" />
      </div>

      {error ? <EmptyNote>Couldn’t load orders. Publish the updated <b>firestore.rules</b> (adds the admin-only <b>orders</b> collection), then refresh.</EmptyNote>
        : loading ? <Spinner />
        : visible.length === 0 ? <EmptyNote>{orders.length ? 'No orders in this view.' : 'No online orders yet.'}</EmptyNote> : (
          <DataList>
            <AnimatePresence>
              {visible.map((o) => (
                <DataRow key={o.id} layout="order">
                  <RowMedia src={imageUrl(o.items[0]?.image, 120)} onClick={() => setOpenId(o.id)} label={`Open ${shortRef(o.orderId)}`} />
                  <button type="button" className={styles.open} onClick={() => setOpenId(o.id)}>
                    <RowTitle title={`${o.customer.name} · ${shortRef(o.orderId)}`} meta={`${formatDate(o.createdAt)} · ${itemCount(o)} item${itemCount(o) === 1 ? '' : 's'}${o.items.some((i) => i.size) ? ' · sized' : ''}`} />
                  </button>
                  <b className={styles.total}>{formatMoney(o.total)}</b>
                  <Pill tone={PAYMENT_TONE[o.status]}>{PAYMENT_LABEL[o.status]}</Pill>
                  {o.status === 'PAID' ? (
                    <select className={styles.fulfilment} value={o.fulfilment} onChange={(e) => changeFulfilment(o, e.target.value)} aria-label="Fulfilment status">
                      {FULFILMENT.map((f) => <option key={f}>{f}</option>)}
                    </select>
                  ) : <span />}
                </DataRow>
              ))}
            </AnimatePresence>
          </DataList>
        )}
      <AnimatePresence>{open && <OrderDetail order={open} onClose={() => setOpenId(null)} onFulfilment={changeFulfilment} />}</AnimatePresence>
    </>
  )
}
