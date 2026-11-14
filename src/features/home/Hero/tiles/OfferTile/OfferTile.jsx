import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'
import { OFFER_LABEL } from '../../../../../config/site'
import { BentoTile } from '../../BentoTile/BentoTile'
import styles from './OfferTile.module.css'

/** Highlights the best live discount; falls back to a “new arrivals” message when nothing is on offer. */
export function OfferTile({ area, order, bestDiscount }) {
  const onOffer = bestDiscount > 0
  return (
    <BentoTile area={area} order={order} tone="teal" interactive className={styles.tile}>
      <Link to="/#shop" className={styles.link}>
        <span className={styles.label}><Sparkles size={14} /> {onOffer ? OFFER_LABEL : 'Just landed'}</span>
        {onOffer
          ? <span className={styles.big}><small>up to</small>{bestDiscount}<em>% off</em></span>
          : <span className={styles.headline}>New pieces, added regularly</span>}
        <span className={styles.more}>Shop now <ArrowRight size={16} /></span>
      </Link>
    </BentoTile>
  )
}
