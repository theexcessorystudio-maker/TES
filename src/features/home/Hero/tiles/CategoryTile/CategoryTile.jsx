import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { categoryHref } from '../../../../catalog/useShopCategory'
import { BentoTile } from '../../BentoTile/BentoTile'
import styles from './CategoryTile.module.css'

/** Category chips that deep-link into the filtered shop. categories: [{ name, count }] */
export function CategoryTile({ area, order, categories }) {
  return (
    <BentoTile area={area} order={order} tone="sand" className={styles.tile}>
      <div className={styles.head}>
        <div>
          <p className={styles.title}>Shop by category</p>
          <p className={styles.sub}>Find your next favourite, from everyday staples to statement pieces.</p>
        </div>
        <Link to="/#shop" className={styles.all}>View all <ArrowRight size={15} /></Link>
      </div>
      {categories.length > 0 ? (
        <ul className={styles.chips}>
          {categories.map((c) => (
            <li key={c.name}>
              <Link to={categoryHref(c.name)} className={styles.chip}>{c.name}<span>{c.count}</span></Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.empty}>Our first collection is on its way.</p>
      )}
    </BentoTile>
  )
}
