import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { SectionTitle, Skeleton } from '../../../components/ui'
import { useCatalog } from '../../../context/CatalogContext'
import { useProductViewer } from '../../../hooks/useProductViewer'
import { ProductCard } from '../ProductCard/ProductCard'
import { CategoryTabs } from '../CategoryTabs/CategoryTabs'
import { SearchField } from '../SearchField/SearchField'
import styles from './ShopSection.module.css'

export function ShopSection() {
  const { products, loading } = useCatalog()
  const { open } = useProductViewer()
  const [category, setCategory] = useState('All')
  const [query, setQuery] = useState('')

  const categories = useMemo(() => ['All', ...new Set(products.map((p) => p.category).filter(Boolean))], [products])
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return products.filter((p) => (category === 'All' || p.category === category) && p.name.toLowerCase().includes(q))
  }, [products, category, query])

  return (
    <section className={styles.section} id="shop" aria-labelledby="shop-title">
      <div className={styles.head}>
        <SectionTitle><span id="shop-title">Shop the collection</span></SectionTitle>
        <SearchField value={query} onChange={setQuery} placeholder="Search pieces" />
      </div>
      {categories.length > 2 && <CategoryTabs categories={categories} value={category} onChange={setCategory} />}

      {loading ? (
        <div className={styles.grid}>{Array.from({ length: 8 }, (_, i) => <Skeleton key={i} className={styles.skeleton} />)}</div>
      ) : visible.length === 0 ? (
        <p className={styles.empty}>{products.length ? 'Nothing matches that search. Try another word or category.' : 'New pieces are on the way. Message us on WhatsApp to hear first.'}</p>
      ) : (
        <motion.div layout className={styles.grid}>
          <AnimatePresence mode="popLayout">{visible.map((p) => <ProductCard key={p.id} product={p} onOpen={open} />)}</AnimatePresence>
        </motion.div>
      )}
    </section>
  )
}
