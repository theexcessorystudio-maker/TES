import { useMemo, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Clock, Eye, EyeOff, Package, Pencil, Plus, Ruler, Trash2 } from 'lucide-react'
import { Button, IconButton, Pill, Spinner } from '../../../../components/ui'
import { useCatalog } from '../../../../context/CatalogContext'
import { useToast } from '../../../../context/ToastContext'
import { deleteProduct, setStock } from '../../../../services/products'
import { imageUrl } from '../../../../lib/cloudinary'
import { formatMoney } from '../../../../lib/format'
import { isSoldOut, isLowStock, hasOffer } from '../../../../lib/product'
import { SearchField } from '../../../catalog/SearchField/SearchField'
import { PanelHeader } from '../../shared/PanelHeader/PanelHeader'
import { StatGrid } from '../../shared/StatGrid/StatGrid'
import { DataList, DataRow, EmptyNote, RowActions, RowMedia, RowTitle } from '../../shared/DataRow/DataRow'
import { ProductEditor, EMPTY_PRODUCT } from '../ProductEditor/ProductEditor'
import { StockControl } from '../StockControl/StockControl'
import styles from './ProductsPanel.module.css'

export function ProductsPanel() {
  const { products, loading } = useCatalog()
  const { notify } = useToast()
  const [editing, setEditing] = useState(null)
  const [query, setQuery] = useState('')

  const visible = useMemo(() => products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase())), [products, query])
  const stats = [
    { label: 'Total products', value: products.length, icon: Package },
    { label: 'In stock', value: products.filter((p) => !isSoldOut(p)).length, icon: Eye },
    { label: 'Low stock (3 or fewer)', value: products.filter(isLowStock).length, icon: Clock },
    { label: 'Sold out', value: products.filter(isSoldOut).length, icon: EyeOff },
  ]
  const remove = async (p) => {
    if (!confirm(`Delete “${p.name}”?`)) return
    await deleteProduct(p.id)
    notify('Deleted')
  }

  return (
    <>
      <PanelHeader title="Products" description="Manage everything customers see in your store."
        action={<Button onClick={() => setEditing(EMPTY_PRODUCT)}><Plus size={18} /> Add product</Button>} />
      <StatGrid stats={stats} />
      <SearchField className={styles.search} value={query} onChange={setQuery} placeholder="Search products…" />

      {loading ? <Spinner /> : visible.length === 0 ? <EmptyNote>No products yet — add your first one.</EmptyNote> : (
        <DataList>
          <AnimatePresence>
            {visible.map((p) => (
              <DataRow key={p.id} layout="product">
                <RowMedia src={imageUrl(p.images?.[0], 120)} />
                <RowTitle title={p.name} meta={<>{p.category}{p.sizes?.length > 0 && <span className={styles.sizes}><Ruler size={12} /> {p.sizes.length} sizes</span>}</>} />
                <div className={styles.price}>{formatMoney(p.price)}{hasOffer(p) && <s>{formatMoney(p.oldPrice)}</s>}</div>
                {typeof p.stock === 'number'
                  ? <StockControl stock={p.stock} onAdjust={(d) => setStock(p.id, p.stock + d)} />
                  : <Pill tone="warning" onClick={() => setEditing(p)}>Set stock</Pill>}
                <RowActions>
                  <IconButton label="Edit" onClick={() => setEditing(p)}><Pencil size={17} /></IconButton>
                  <IconButton label="Delete" variant="danger" onClick={() => remove(p)}><Trash2 size={17} /></IconButton>
                </RowActions>
              </DataRow>
            ))}
          </AnimatePresence>
        </DataList>
      )}
      <AnimatePresence>{editing && <ProductEditor initial={editing} products={products} onClose={() => setEditing(null)} />}</AnimatePresence>
    </>
  )
}
