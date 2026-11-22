import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { COVER_IMAGE } from '../../../config/site'
import { useCatalog } from '../../../context/CatalogContext'
import { useProductViewer } from '../../../hooks/useProductViewer'
import { imageUrl } from '../../../lib/cloudinary'
import { isSoldOut } from '../../../lib/product'
import { policyPath } from '../../legal/policies'
import styles from './Hero.module.css'

/** Three in-stock pieces with photos, preferring different categories for a varied collage. */
function useCollage(products) {
  return useMemo(() => {
    const pool = products.filter((p) => p.images?.length && !isSoldOut(p))
    const picks = []
    const seen = new Set()
    for (const p of pool) if (picks.length < 3 && !seen.has(p.category)) { picks.push(p); seen.add(p.category) }
    for (const p of pool) if (picks.length < 3 && !picks.includes(p)) picks.push(p)
    return picks
  }, [products])
}

/**
 * Home page opener: the studio's intro beside a visual. The visual is the cover photo from
 * config/site.js when set, otherwise an editorial collage of live products.
 */
export function Hero() {
  const { products, loading } = useCatalog()
  const { open } = useProductViewer()
  const collage = useCollage(products)

  return (
    <section className={styles.hero} id="top" aria-label="Welcome">
      <div className={styles.copy}>
        <p className={styles.eyebrow} style={{ '--delay': '0.05s' }}>The Excessory Studio</p>
        <h1 className={styles.title} style={{ '--delay': '0.15s' }}>
          Accessories you’ll reach for <em>every day.</em>
        </h1>
        <div className={styles.rule} aria-hidden="true" style={{ '--delay': '0.3s' }} />
        <p className={styles.sub} style={{ '--delay': '0.35s' }}>
          Skin-friendly. Tarnish-resistant. Made to be worn on repeat.
          <br />
          Thoughtfully curated pieces, packed with care and delivered to your door.
        </p>
        <div className={styles.actions} style={{ '--delay': '0.45s' }}>
          <Link to="/#shop" className={styles.primary}>Shop the collection</Link>
          <Link to={policyPath('about')} className={styles.secondary}>Our story <ArrowRight size={15} /></Link>
        </div>
      </div>

      <div className={styles.visual}>
        {COVER_IMAGE ? (
          <img className={styles.cover} src={COVER_IMAGE} alt="The Excessory Studio jewellery" fetchpriority="high" />
        ) : (
          <div className={styles.collage}>
            {[0, 1, 2].map((i) => {
              const p = collage[i]
              if (!p) return <span key={i} className={styles.tile} data-loading={loading || undefined} />
              return (
                <button key={p.id} type="button" className={styles.tile} onClick={() => open(p.id)} aria-label={`View ${p.name}`}>
                  <img src={imageUrl(p.images[0], i === 0 ? 900 : 600)} alt="" fetchpriority={i === 0 ? 'high' : undefined} />
                  <span className={styles.caption}>{p.name}</span>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
