import { Link } from 'react-router-dom'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { Button } from '../../../components/ui'
import { useCatalog } from '../../../context/CatalogContext'
import { useProductViewer } from '../../../hooks/useProductViewer'
import { imageUrl } from '../../../lib/cloudinary'
import { formatMoney, cx } from '../../../lib/format'
import { isSoldOut, discountPercent } from '../../../lib/product'
import { OFFER_LABEL } from '../../../config/site'
import styles from './Hero.module.css'

const ease = [0.22, 1, 0.36, 1]

function FloatingCard({ product, index, mx, my, onOpen }) {
  // flat 2D parallax (no 3D context, so the glass never disappears)
  const depth = [10, 18, 26][index] || 14
  const x = useSpring(useTransform(mx, [-1, 1], [-depth, depth]), { stiffness: 110, damping: 18 })
  const y = useSpring(useTransform(my, [-1, 1], [-depth * 0.7, depth * 0.7]), { stiffness: 110, damping: 18 })
  return (
    <div className={cx(styles.slot, styles[`slot${index}`])}>
      <motion.div style={{ x, y }}>
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + index * 0.15, duration: 0.9, ease }}>
          <button type="button" className={styles.card} onClick={() => onOpen(product.id)} aria-label={`View ${product.name}`}>
            <img src={imageUrl(product.images[0], 500)} alt={product.name} />
            <span className={styles.caption}>
              <b>{product.name}</b>
              <i>{formatMoney(product.price)}{discountPercent(product) > 0 && <s>{formatMoney(product.oldPrice)}</s>}</i>
            </span>
          </button>
        </motion.div>
      </motion.div>
    </div>
  )
}

function Showcase() {
  const { products, loading } = useCatalog()
  const { open } = useProductViewer()
  const mx = useMotionValue(0), my = useMotionValue(0)
  const featured = products.filter((p) => p.images?.length && !isSoldOut(p)).slice(0, 3)

  if (loading) return <div className={styles.showcase} />
  if (!featured.length) {
    return (
      <div className={cx(styles.showcase, styles.showcaseEmpty)}>
        <motion.div className={styles.emptyCard} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.8 }}>
          <img src="/logo-circle.png" alt="" /><p>New pieces arrive soon.</p>
        </motion.div>
      </div>
    )
  }
  const move = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    mx.set(((e.clientX - r.left) / r.width) * 2 - 1)
    my.set(((e.clientY - r.top) / r.height) * 2 - 1)
  }
  return (
    <div className={styles.showcase} onPointerMove={move} onPointerLeave={() => { mx.set(0); my.set(0) }}>
      {featured.map((p, i) => <FloatingCard key={p.id} product={p} index={i} mx={mx} my={my} onOpen={open} />)}
    </div>
  )
}

export function Hero() {
  const { products } = useCatalog()
  const best = Math.max(0, ...products.filter((p) => !isSoldOut(p)).map(discountPercent))
  const line = (text, delay) => (
    <span className={styles.line}><motion.span initial={{ y: '112%' }} animate={{ y: 0 }} transition={{ delay, duration: 1, ease }}>{text}</motion.span></span>
  )
  return (
    <section className={styles.hero} id="top">
      <div className={styles.copy}>
        {best > 0 && (
          <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.7 }}>
            <Link to="/#shop" className={styles.eyebrow}><Sparkles size={14} /> {OFFER_LABEL} · up to {best}% off</Link>
          </motion.span>
        )}
        <h1 className={styles.title}>{line('Accessories you’ll', 0.1)}{line(<>reach for <span className="text-highlight">every day.</span></>, 0.22)}</h1>
        <motion.p className={styles.sub} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.8 }}>
          Thoughtfully made pieces, checked by hand and delivered to your door. Check out in a minute — no account needed.
        </motion.p>
        <motion.div className={styles.cta} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 0.8 }}>
          <Button to="/#shop">Shop the collection</Button>
          <Button to="/#how" variant="outline">How it works</Button>
        </motion.div>
      </div>
      <Showcase />
    </section>
  )
}
