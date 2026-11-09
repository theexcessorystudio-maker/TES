import { collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc, writeBatch } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { INVOICE_PREFIX } from '../config/site'

export const invoiceNumber = (seq) => `${INVOICE_PREFIX}-${String(seq).padStart(4, '0')}`

export const invoiceTotals = (inv) => {
  const items = inv.items || []
  const mrp = items.reduce((n, i) => n + Math.max(i.mrp || 0, i.price) * i.qty, 0)
  const sub = items.reduce((n, i) => n + i.price * i.qty, 0)
  return { mrp, sub, savings: mrp - sub, total: Math.max(0, sub + (inv.shipping || 0) - (inv.discount || 0)) }
}

export const subscribeInvoices = (onData, onError) =>
  onSnapshot(query(collection(db, 'invoices'), orderBy('createdAt', 'desc')),
    (s) => onData(s.docs.map((d) => ({ id: d.id, ...d.data({ serverTimestamps: 'estimate' }) }))), onError)

/** Writes the invoice and (optionally) decrements stock atomically. */
export async function createInvoice(data, { reduceStock, products }) {
  const batch = writeBatch(db)
  const ref = doc(collection(db, 'invoices'))
  batch.set(ref, { ...data, stockReduced: reduceStock, createdAt: serverTimestamp() })
  if (reduceStock) {
    const need = {}
    data.items.forEach((i) => { if (i.productId) need[i.productId] = (need[i.productId] || 0) + i.qty })
    Object.entries(need).forEach(([id, q]) => {
      const p = products.find((x) => x.id === id)
      if (p && typeof p.stock === 'number') { const n = Math.max(0, p.stock - q); batch.update(doc(db, 'products', id), { stock: n, inStock: n > 0 }) }
    })
  }
  await batch.commit()
  return { id: ref.id, ...data }
}

export const toggleInvoicePaid = (inv) => updateDoc(doc(db, 'invoices', inv.id), { status: inv.status === 'Paid' ? 'Unpaid' : 'Paid' })
export const deleteInvoice = (id) => deleteDoc(doc(db, 'invoices', id))
