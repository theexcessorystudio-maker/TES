import { useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { MessageCircle, ShieldCheck, ShoppingBag, Truck, Lock } from 'lucide-react'
import { Button, Dialog, Price, QuantityStepper } from '../../../components/ui'
import { useCart } from '../../../context/cart/CartContext'
import { useToast } from '../../../context/ToastContext'
import { useProductReviews } from '../../../hooks/useCustomerData'
import { lineKey } from '../../../../shared/commerce'
import { isSoldOut, isLowStock, stockOf, requiresSize, maxOrderable } from '../../../lib/product'
import { summarise } from '../../../services/reviews'
import { waLink, productEnquiry } from '../../../config/whatsapp'
import { ProductGallery } from '../ProductGallery/ProductGallery'
import { SizeSelector } from '../../sizing/SizeSelector/SizeSelector'
import { SizeGuideDialog } from '../../sizing/SizeGuideDialog/SizeGuideDialog'
import { FrequentlyBoughtTogether } from '../../bundles/FrequentlyBoughtTogether/FrequentlyBoughtTogether'
import { ProductReviews } from '../../reviews/ProductReviews/ProductReviews'
import { RatingSummary } from '../../reviews/RatingSummary/RatingSummary'
import styles from './ProductModal.module.css'

export function ProductModal({ product, onClose }) {
  const { lines, add, setQty, qtyInCart, open: openCart } = useCart()
  const { notify } = useToast()
  const { data: reviews, loading: reviewsLoading } = useProductReviews(product.id)
  const [size, setSize] = useState(null)
  const [sizeError, setSizeError] = useState('')
  const [guideOpen, setGuideOpen] = useState(false)
  const reviewsRef = useRef(null)
  const sizeRef = useRef(null)

  const sized = requiresSize(product)
  const sold = isSoldOut(product)
  const line = lines.find((l) => l.key === lineKey(product.id, sized ? size : null))
  const roomLeft = maxOrderable(product) - qtyInCart(product.id)
  const rating = summarise(reviews)

  const askForSize = () => {
    setSizeError('Please choose a size')
    sizeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
  const handleAdd = () => {
    if (sized && !size) return askForSize()
    const r = add(product, { size })
    notify(r.message, r.ok ? { action: { label: 'View cart', onClick: openCart } } : { tone: 'error' })
  }
  const chooseSize = (s) => { setSize(s); setSizeError('') }

  return (
    <Dialog label={product.name} onClose={onClose} className={styles.dialog}>
      <div className={styles.scroll}>
        <div className={styles.top}>
          <ProductGallery images={product.images} alt={product.name} />
          <div className={styles.info}>
            <span className={styles.category}>{product.category}</span>
            <h2 className={styles.name}>{product.name}</h2>
            <RatingSummary {...rating} onClick={() => reviewsRef.current?.scrollIntoView({ behavior: 'smooth' })} />
            <Price product={product} size="lg" />
            {isLowStock(product) && <span className={styles.low}>Only {stockOf(product)} left</span>}
            {product.description && <p className={styles.description}>{product.description}</p>}

            {sized && !sold && (
              <div ref={sizeRef}>
                <SizeSelector sizes={product.sizes} value={size} onChange={chooseSize} error={sizeError}
                  onOpenGuide={product.sizeGuide ? () => setGuideOpen(true) : undefined} />
              </div>
            )}

            <ul className={styles.assurances} role="list">
              <li><ShieldCheck size={16} /> Quality checked</li>
              <li><Truck size={16} /> Careful packaging</li>
              <li><Lock size={16} /> Secure checkout · UPI, cards, netbanking</li>
            </ul>

            <div className={styles.actions}>
              {sold ? <Button block disabled>Sold out</Button> : line ? (
                <QuantityStepper block size="lg" value={line.qty} max={line.qty + roomLeft} onChange={(q) => setQty(line.key, q)} />
              ) : (
                <Button block size="lg" onClick={handleAdd} disabled={roomLeft <= 0}><ShoppingBag size={19} /> {roomLeft <= 0 ? 'Max quantity in cart' : 'Add to cart'}</Button>
              )}
              <Button block variant="outline" href={waLink(productEnquiry(product, size))} target="_blank" rel="noreferrer"><MessageCircle size={17} /> Ask about this piece</Button>
            </div>
          </div>
        </div>

        <div className={styles.more}>
          <FrequentlyBoughtTogether product={product} selectedSize={size} onSizeMissing={askForSize} />
          <ProductReviews ref={reviewsRef} productId={product.id} reviews={reviews} loading={reviewsLoading} />
        </div>
      </div>
      <AnimatePresence>{guideOpen && <SizeGuideDialog guideId={product.sizeGuide} highlight={size} onClose={() => setGuideOpen(false)} />}</AnimatePresence>
    </Dialog>
  )
}
