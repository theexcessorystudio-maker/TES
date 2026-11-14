import { BentoTile } from '../../BentoTile/BentoTile'
import styles from './BrandTile.module.css'

/** Stands in for a product photo while the catalog is empty. */
export function BrandTile({ area, order, text = 'New pieces arrive soon.' }) {
  return (
    <BentoTile area={area} order={order} tone="sand" className={styles.tile}>
      <img src="/logo-circle.png" alt="" />
      <p>{text}</p>
    </BentoTile>
  )
}
