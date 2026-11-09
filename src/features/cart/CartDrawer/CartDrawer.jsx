import { useNavigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { ShoppingBag, MessageCircle, Lock } from 'lucide-react'
import { Button, Dialog, DialogHeader } from '../../../components/ui'
import { useCart } from '../../../context/cart/CartContext'
import { maxOrderable } from '../../../lib/product'
import { waLink, cartEnquiry } from '../../../config/whatsapp'
import { CartLine } from '../CartLine/CartLine'
import { OrderTotals } from '../OrderTotals/OrderTotals'
import { FreeShippingMeter } from '../FreeShippingMeter/FreeShippingMeter'
import { CartUpsell } from '../../bundles/CartUpsell/CartUpsell'
import styles from './CartDrawer.module.css'

export function CartDrawer({ onClose }) {
  const navigate = useNavigate()
  const cart = useCart()
  const { lines, liveLines, setQty, remove, clear, qtyInCart } = cart

  const checkout = () => { onClose(); navigate('/checkout') }

  return (
    <Dialog label="Your cart" placement="right" layer="drawer" onClose={onClose} showClose={false}>
      <DialogHeader title="Your cart" onClose={onClose} />
      {lines.length === 0 ? (
        <div className={styles.empty}>
          <ShoppingBag size={34} strokeWidth={1.4} />
          <p>Your cart is empty.</p>
          <span>Add a piece you love and check out in a minute — no account needed.</span>
          <Button onClick={onClose}>Browse the collection</Button>
        </div>
      ) : (
        <>
          <div className={styles.list}>
            <FreeShippingMeter subtotal={cart.subtotal} />
            <AnimatePresence initial={false}>
              {lines.map((l) => (
                <CartLine key={l.key} line={l} max={l.qty + Math.max(0, maxOrderable(l.product) - qtyInCart(l.product.id))}
                  onQty={(q) => setQty(l.key, q)} onRemove={() => remove(l.key)} />
              ))}
            </AnimatePresence>
            <CartUpsell />
          </div>
          <footer className={styles.footer}>
            <OrderTotals subtotal={cart.subtotal} savings={cart.savings} shipping={cart.shipping} total={cart.total} />
            <Button block size="lg" onClick={checkout} disabled={!liveLines.length}><Lock size={17} /> Checkout securely</Button>
            <div className={styles.secondary}>
              <a href={waLink(cartEnquiry(liveLines, cart.total))} target="_blank" rel="noreferrer"><MessageCircle size={14} /> Prefer WhatsApp?</a>
              <button type="button" onClick={clear}>Clear cart</button>
            </div>
          </footer>
        </>
      )}
    </Dialog>
  )
}
