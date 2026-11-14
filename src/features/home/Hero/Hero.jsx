import { useMemo } from 'react'
import { Skeleton } from '../../../components/ui'
import { useCatalog } from '../../../context/CatalogContext'
import { useProductViewer } from '../../../hooks/useProductViewer'
import { discountPercent, isSoldOut } from '../../../lib/product'
import { IntroTile } from './tiles/IntroTile/IntroTile'
import { ProductTile } from './tiles/ProductTile/ProductTile'
import { OfferTile } from './tiles/OfferTile/OfferTile'
import { CategoryTile } from './tiles/CategoryTile/CategoryTile'
import { SizeGuideTile } from './tiles/SizeGuideTile/SizeGuideTile'
import { CheckoutTile } from './tiles/CheckoutTile/CheckoutTile'
import { BrandTile } from './tiles/BrandTile/BrandTile'
import styles from './Hero.module.css'

/** Derives everything the bento shows from the live catalog in one pass. */
function useHeroData(products) {
  return useMemo(() => {
    const available = products.filter((p) => !isSoldOut(p))
    const counts = new Map()
    products.forEach((p) => p.category && counts.set(p.category, (counts.get(p.category) || 0) + 1))
    return {
      featured: available.filter((p) => p.images?.length).slice(0, 2),
      bestDiscount: Math.max(0, ...available.map(discountPercent)),
      categories: [...counts].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 6),
    }
  }, [products])
}

/**
 * Home page hero as a bento grid. Layout lives entirely in Hero.module.css (named grid areas),
 * so tiles stay layout-agnostic and can be rearranged per breakpoint without touching JSX.
 */
export function Hero() {
  const { products, loading } = useCatalog()
  const { open } = useProductViewer()
  const { featured, bestDiscount, categories } = useHeroData(products)

  const productSlot = (area, index, size, label) => {
    if (loading) return <Skeleton className={styles.skeleton} style={{ gridArea: area }} key={area} />
    const product = featured[index]
    return product
      ? <ProductTile key={area} area={area} order={index + 1} product={product} size={size} label={label} onOpen={open} />
      : <BrandTile key={area} area={area} order={index + 1} text={index === 0 ? 'New pieces arrive soon.' : 'Curated with care.'} />
  }

  return (
    <section className={styles.hero} id="top" aria-label="Welcome">
      <div className={styles.grid}>
        <IntroTile />
        {productSlot('feature', 0, 'feature', 'Featured')}
        {productSlot('spot', 1, 'compact', 'New in')}
        <OfferTile area="offer" order={3} bestDiscount={bestDiscount} />
        <CategoryTile area="cats" order={4} categories={categories} />
        <SizeGuideTile area="size" order={5} />
        <CheckoutTile area="secure" order={6} />
      </div>
    </section>
  )
}
