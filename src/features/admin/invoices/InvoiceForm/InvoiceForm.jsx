import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Button, Checkbox, Field, FieldRow, IconButton } from '../../../../components/ui'
import { useToast } from '../../../../context/ToastContext'
import { createInvoice, invoiceNumber, invoiceTotals } from '../../../../services/invoices'
import { formatMoney, todayISO } from '../../../../lib/format'
import { CURRENCY } from '../../../../config/site'
import { SidePanel, PanelLabel } from '../../shared/SidePanel/SidePanel'
import { InvoiceSummary } from '../InvoiceSummary/InvoiceSummary'
import styles from './InvoiceForm.module.css'

const PAYMENTS = ['UPI', 'Cash', 'Bank transfer', 'Card', 'Cash on delivery']
const BLANK_ITEM = { productId: '', name: '', qty: 1, mrp: '', price: '' }

export function InvoiceForm({ products, seq, onClose, onSaved }) {
  const { notify } = useToast()
  const [f, setF] = useState({ customer: '', phone: '', address: '', date: todayISO(), payment: 'UPI', status: 'Paid', shipping: '', discount: '', notes: '', items: [{ ...BLANK_ITEM }] })
  const [reduceStock, setReduceStock] = useState(true)
  const [saving, setSaving] = useState(false)
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }))
  const setItem = (i, patch) => setF((s) => ({ ...s, items: s.items.map((it, k) => (k === i ? { ...it, ...patch } : it)) }))
  const pick = (i, id) => {
    const p = products.find((x) => x.id === id)
    setItem(i, p ? { productId: id, name: p.name, mrp: p.oldPrice > p.price ? p.oldPrice : '', price: p.price } : { productId: '' })
  }

  const items = f.items.map((it) => ({
    productId: it.productId, name: it.name.trim(), qty: Math.max(1, parseInt(it.qty, 10) || 1),
    price: Number(it.price) || 0, mrp: Number(it.mrp) > Number(it.price) ? Number(it.mrp) : 0,
  }))
  const shipping = Number(f.shipping) || 0
  const discount = Number(f.discount) || 0
  const totals = invoiceTotals({ items, shipping, discount })

  const save = async (e) => {
    e.preventDefault()
    if (!f.customer.trim() || items.some((i) => !i.name)) return notify('Customer name and item names are required', { tone: 'error' })
    setSaving(true)
    const data = {
      seq, number: invoiceNumber(seq), customer: f.customer.trim(), phone: f.phone.trim(), address: f.address.trim(), date: f.date,
      payment: f.payment, status: f.status, shipping, discount, notes: f.notes.trim(), items, total: totals.total,
    }
    try {
      const saved = await createInvoice(data, { reduceStock, products })
      notify(`Invoice ${data.number} created`)
      onSaved(saved)
    } catch {
      notify('Could not save — check Firestore rules allow invoices for your admin email', { tone: 'error' })
      setSaving(false)
    }
  }

  return (
    <SidePanel title="New invoice" subtitle={invoiceNumber(seq)} onClose={onClose} onSubmit={save} wide
      footer={<Button type="submit" block size="lg" loading={saving}>Create invoice</Button>}>
      <Field label="Customer name" required value={f.customer} onChange={(e) => set('customer', e.target.value)} placeholder="e.g. Ananya Sharma" />
      <FieldRow>
        <Field label="Phone" hint="(for WhatsApp)" type="tel" value={f.phone} onChange={(e) => set('phone', e.target.value)} placeholder="98XXXXXXXX" />
        <Field label="Date" type="date" required value={f.date} onChange={(e) => set('date', e.target.value)} />
      </FieldRow>
      <Field as="textarea" label="Address" hint="(optional)" rows={2} value={f.address} onChange={(e) => set('address', e.target.value)} />

      <PanelLabel>Items</PanelLabel>
      {f.items.map((it, i) => (
        <div key={i} className={styles.item}>
          <div className={styles.itemTop}>
            <Field as="select" compact value={it.productId} onChange={(e) => pick(i, e.target.value)} aria-label="Product">
              <option value="">Custom item</option>
              {products.map((p) => <option key={p.id} value={p.id}>{p.name} — {formatMoney(p.price)}</option>)}
            </Field>
            {f.items.length > 1 && <IconButton label="Remove item" variant="danger" onClick={() => set('items', f.items.filter((_, k) => k !== i))}><Trash2 size={16} /></IconButton>}
          </div>
          <Field compact required value={it.name} onChange={(e) => setItem(i, { name: e.target.value })} placeholder="Item name" aria-label="Item name" />
          <FieldRow columns={3}>
            <Field compact label="Qty" type="number" min="1" step="1" value={it.qty} onChange={(e) => setItem(i, { qty: e.target.value })} />
            <Field compact label="MRP" type="number" min="0" value={it.mrp} onChange={(e) => setItem(i, { mrp: e.target.value })} placeholder="—" />
            <Field compact label="Price" type="number" min="0" value={it.price} onChange={(e) => setItem(i, { price: e.target.value })} />
          </FieldRow>
        </div>
      ))}
      <Button size="sm" variant="outline" className={styles.addItem} onClick={() => set('items', [...f.items, { ...BLANK_ITEM }])}><Plus size={15} /> Add item</Button>

      <FieldRow>
        <Field label={`Shipping (${CURRENCY})`} type="number" min="0" value={f.shipping} onChange={(e) => set('shipping', e.target.value)} placeholder="0" />
        <Field label={`Extra discount (${CURRENCY})`} type="number" min="0" value={f.discount} onChange={(e) => set('discount', e.target.value)} placeholder="0" />
      </FieldRow>
      <FieldRow>
        <Field as="select" label="Payment" value={f.payment} onChange={(e) => set('payment', e.target.value)}>{PAYMENTS.map((m) => <option key={m}>{m}</option>)}</Field>
        <Field as="select" label="Status" value={f.status} onChange={(e) => set('status', e.target.value)}><option>Paid</option><option>Unpaid</option></Field>
      </FieldRow>
      <Field as="textarea" label="Notes" hint="(optional, printed on invoice)" rows={2} value={f.notes} onChange={(e) => set('notes', e.target.value)} />
      <Checkbox label="Reduce stock for store products on this invoice" checked={reduceStock} onChange={(e) => setReduceStock(e.target.checked)} />
      <InvoiceSummary totals={totals} shipping={shipping} discount={discount} />
    </SidePanel>
  )
}
