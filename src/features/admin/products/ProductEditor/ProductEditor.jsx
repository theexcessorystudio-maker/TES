import { useState } from 'react'
import { Button, Field, FieldRow } from '../../../../components/ui'
import { useToast } from '../../../../context/ToastContext'
import { saveProduct } from '../../../../services/products'
import { CURRENCY, OFFER_LABEL, PRODUCT_CATEGORIES } from '../../../../config/site'
import { RING_SIZES } from '../../../../../shared/commerce'
import { SidePanel, PanelLabel } from '../../shared/SidePanel/SidePanel'
import { ImageUploader } from '../ImageUploader/ImageUploader'
import { SizeOptionsField } from '../SizeOptionsField/SizeOptionsField'
import { PairingsField } from '../PairingsField/PairingsField'

export const EMPTY_PRODUCT = { name: '', price: '', oldPrice: '', offerLabel: '', category: '', description: '', images: [], stock: '', sizes: [], sizeGuide: '', pairsWith: [] }

/** Maps a stored product to form state (legacy products may lack newer fields). */
const toForm = (p) => ({
  ...EMPTY_PRODUCT, ...p,
  stock: typeof p?.stock === 'number' ? p.stock : p?.id && p.inStock === false ? 0 : '',
  sizes: p?.sizes || [], sizeGuide: p?.sizeGuide || '', pairsWith: p?.pairsWith || [],
})

/** Maps form state to the Firestore document shape. */
const toDocument = (f) => {
  const stock = Math.max(0, parseInt(f.stock, 10) || 0)
  return {
    name: f.name.trim(), price: Number(f.price), oldPrice: f.oldPrice ? Number(f.oldPrice) : 0, offerLabel: f.offerLabel.trim(),
    category: f.category.trim(), description: f.description.trim(), images: f.images, stock, inStock: stock > 0,
    sizes: f.sizes, sizeGuide: f.sizes.length ? f.sizeGuide : '', pairsWith: f.pairsWith,
  }
}

export function ProductEditor({ initial, products, onClose }) {
  const { notify } = useToast()
  const [form, setForm] = useState(() => toForm(initial))
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const set = (patch) => setForm((f) => ({ ...f, ...patch }))
  const bind = (key) => ({ value: form[key], onChange: (e) => set({ [key]: e.target.value }) })

  // Picking "Rings" for a product without sizes pre-fills the ring sizes + guide (admin can still change them).
  const setCategory = (category) => set(category === 'Rings' && !form.sizes.length ? { category, sizes: [...RING_SIZES], sizeGuide: 'ring' } : { category })

  const save = async (e) => {
    e.preventDefault()
    if (!form.images.length) return notify('Add at least one image', { tone: 'error' })
    if (!form.name.trim() || form.price === '' || !form.category.trim() || form.stock === '') return notify('Name, price, category and stock are required', { tone: 'error' })
    setSaving(true)
    try {
      await saveProduct(form.id, toDocument(form))
      notify(form.id ? 'Product updated' : 'Product added')
      onClose()
    } catch {
      notify('Could not save — are you signed in as admin?', { tone: 'error' })
      setSaving(false)
    }
  }

  return (
    <SidePanel title={form.id ? 'Edit product' : 'New product'} onClose={onClose} onSubmit={save} wide
      footer={<Button type="submit" block size="lg" loading={saving} disabled={uploading}>{form.id ? 'Save changes' : 'Publish product'}</Button>}>
      <PanelLabel>Photos <small>(first photo is the cover)</small></PanelLabel>
      <ImageUploader images={form.images} onChange={(fn) => setForm((f) => ({ ...f, images: fn(f.images) }))}
        onError={(m) => notify(m, { tone: 'error' })} onBusyChange={setUploading} />

      <Field label="Name" required placeholder="e.g. Pearl Drop Earrings" {...bind('name')} />
      <FieldRow>
        <Field label={`MRP (${CURRENCY})`} hint="(optional)" type="number" min="0" placeholder="e.g. 900" {...bind('oldPrice')} />
        <Field label={`Selling price (${CURRENCY})`} required type="number" min="0" placeholder="e.g. 700" {...bind('price')} />
      </FieldRow>
      <Field label="Offer label" hint="(shown when MRP is higher than the price)" placeholder={OFFER_LABEL} {...bind('offerLabel')} />
      <Field label="Category" required list="product-categories" placeholder="Earrings, Rings, Bags…" value={form.category} onChange={(e) => setCategory(e.target.value)} />
      <datalist id="product-categories">{PRODUCT_CATEGORIES.map((c) => <option key={c} value={c} />)}</datalist>
      <Field as="textarea" label="Description" rows={4} placeholder="Material, size, care…" {...bind('description')} />
      <Field label="Stock quantity" hint="(total across all sizes · 0 marks it sold out)" required type="number" min="0" step="1" placeholder="e.g. 12" {...bind('stock')} />

      <SizeOptionsField sizes={form.sizes} sizeGuide={form.sizeGuide} onChange={set} />
      <PairingsField value={form.pairsWith} onChange={(pairsWith) => set({ pairsWith })} products={products} currentId={form.id} />
    </SidePanel>
  )
}
