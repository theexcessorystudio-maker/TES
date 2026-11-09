import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle2, Clock, MessageCircle, XCircle } from 'lucide-react'
import { Button, PageSpinner, Spinner } from '../../../components/ui'
import { useAuth } from '../../../context/AuthContext'
import { useCart } from '../../../context/cart/CartContext'
import { redirectToPayment } from '../../../lib/payments'
import { imageUrl } from '../../../lib/cloudinary'
import { formatMoney } from '../../../lib/format'
import { waLink, orderSupport } from '../../../config/whatsapp'
import { GoogleButton } from '../../account/GoogleButton/GoogleButton'
import { OrderTotals } from '../../cart/OrderTotals/OrderTotals'
import { formatAddress } from '../../address/validation'
import { PENDING_ORDER_KEY } from '../CheckoutPage/CheckoutPage'
import { useOrderStatus } from './useOrderStatus'
import styles from './OrderStatusPage.module.css'

const VIEW = {
  PAID: { icon: CheckCircle2, tone: 'success', title: 'Thank you! Your order is confirmed.', text: 'We’ve received your payment and will start packing your pieces.' },
  PENDING: { icon: Clock, tone: 'warning', title: 'Payment not completed', text: 'Your order is saved but we haven’t received payment yet.' },
  FAILED: { icon: XCircle, tone: 'danger', title: 'Payment failed or expired', text: 'No money was taken. Your cart is still saved — please try again.' },
}

export default function OrderStatusPage() {
  const { orderId } = useParams()
  const { user } = useAuth()
  const { clear } = useCart()
  const { order, error, loading, settling } = useOrderStatus(orderId)
  const [retrying, setRetrying] = useState(false)

  // Empty the cart only once the order this browser started is actually paid.
  useEffect(() => {
    if (order?.status === 'PAID' && sessionStorage.getItem(PENDING_ORDER_KEY) === orderId) {
      clear()
      sessionStorage.removeItem(PENDING_ORDER_KEY)
    }
  }, [order?.status, orderId, clear])

  if (loading) return <PageSpinner />
  if (error) {
    return (
      <div className={styles.page}>
        <div className={styles.card}><h1 className={styles.title}>We couldn’t find that order</h1><p className={styles.text}>{error}</p><Button to="/">Back to the store</Button></div>
      </div>
    )
  }

  const view = VIEW[order.status] || VIEW.PENDING
  const Icon = view.icon
  const retry = async () => { setRetrying(true); try { await redirectToPayment(order.paymentSessionId) } catch { setRetrying(false) } }

  return (
    <div className={styles.page}>
      <motion.div className={styles.card} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
        <div className={styles.status} data-tone={view.tone}>
          {settling ? <Spinner size={30} /> : <Icon size={34} strokeWidth={1.6} />}
        </div>
        <h1 className={styles.title}>{settling ? 'Confirming your payment…' : view.title}</h1>
        <p className={styles.text}>{settling ? 'This usually takes a few seconds. Please don’t close this page.' : view.text}</p>
        <p className={styles.reference}>Order reference <b>{order.orderId.split('-').slice(0, 2).join('-')}</b></p>

        {!settling && order.status === 'PENDING' && order.paymentSessionId && <Button size="lg" onClick={retry} loading={retrying}>Complete payment</Button>}
        {!settling && order.status !== 'PAID' && <Button variant="outline" to="/checkout">Back to checkout</Button>}

        <div className={styles.details}>
          <section>
            <h2>Items</h2>
            <ul className={styles.items} role="list">
              {order.items.map((i) => (
                <li key={`${i.productId}-${i.size || ''}`}>
                  <img src={imageUrl(i.image, 120)} alt="" />
                  <span><b>{i.name}</b>{i.size && <small>Size US {i.size}</small>}<small>Qty {i.qty}</small></span>
                  <em>{formatMoney(i.price * i.qty)}</em>
                </li>
              ))}
            </ul>
            <OrderTotals subtotal={order.subtotal} shipping={order.shipping} total={order.total} />
          </section>
          <section>
            <h2>Delivering to</h2>
            <p className={styles.address}><b>{order.customer.name}</b><br />{formatAddress(order.address)}</p>
            <p className={styles.muted}>Confirmation sent to {order.customer.email}</p>
          </section>
        </div>

        {order.status === 'PAID' && !user && (
          <div className={styles.upsell}>
            <p>Sign in with Google using <b>{order.customer.email}</b> to track this order and review your pieces once they arrive.</p>
            <GoogleButton label="Sign in with Google" />
          </div>
        )}

        <div className={styles.footer}>
          <Button variant="outline" size="sm" href={waLink(orderSupport(order.orderId))} target="_blank" rel="noreferrer"><MessageCircle size={15} /> Need help?</Button>
          <Button size="sm" to={user ? '/account' : '/'}>{user ? 'View my orders' : 'Continue shopping'}</Button>
        </div>
      </motion.div>
    </div>
  )
}
