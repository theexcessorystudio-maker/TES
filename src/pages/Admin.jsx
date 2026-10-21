import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import { addDoc, collection, deleteDoc, doc, serverTimestamp, updateDoc, writeBatch } from 'firebase/firestore'
import { Plus, Minus, Clock, Pencil, Trash2, LogOut, Package, Eye, EyeOff, UploadCloud, X, Loader2, ExternalLink, Search, FileText, Receipt, Printer, MessageCircle, IndianRupee } from 'lucide-react'
import { auth, db } from '../firebase'
import { uploadImage, img } from '../cloudinary'
import { useProducts, useInvoices } from '../hooks'
import { CURRENCY, OFFER_LABEL, BUSINESS, INVOICE_PREFIX, isSold } from '../config'

const fmt = (n) => `${CURRENCY}${Number(n).toLocaleString('en-IN')}`
const empty = { name: '', price: '', oldPrice: '', offerLabel: '', category: '', description: '', images: [], stock: '' }

function Login() {
  const [email, setEmail] = useState(''); const [pw, setPw] = useState('')
  const [err, setErr] = useState(''); const [busy, setBusy] = useState(false)
  const submit = async (e) => {
    e.preventDefault(); setBusy(true); setErr('')
    try { await signInWithEmailAndPassword(auth, email, pw) } catch { setErr('Incorrect email or password.') }
    setBusy(false)
  }
  return (
    <div className="login">
      <motion.form onSubmit={submit} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
        <img src="/logo-circle.png" alt="" />
        <h2>Studio Admin</h2>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={pw} onChange={(e) => setPw(e.target.value)} required />
        {err && <p className="err">{err}</p>}
        <button className="btn btn-block" disabled={busy}>{busy ? <Loader2 className="spin" size={18} /> : 'Sign in'}</button>
      </motion.form>
    </div>
  )
}

function Editor({ initial, onClose, toast }) {
  const [f, setF] = useState({ ...empty, ...initial, stock: typeof initial?.stock === 'number' ? initial.stock : initial?.id && initial.inStock === false ? 0 : '' })
  const [up, setUp] = useState(0); const [saving, setSaving] = useState(false); const [drag, setDrag] = useState(false)
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }))

  const onFiles = async (files) => {
    setUp((u) => u + files.length)
    for (const file of files) {
      try { const url = await uploadImage(file); setF((s) => ({ ...s, images: [...s.images, url] })) }
      catch (e) { toast(e.message, true) }
      setUp((u) => u - 1)
    }
  }
  const save = async (e) => {
    e.preventDefault()
    if (!f.images.length) return toast('Add at least one image', true)
    setSaving(true)
    const n = Math.max(0, parseInt(f.stock, 10) || 0)
    const data = { name: f.name.trim(), price: Number(f.price), oldPrice: f.oldPrice ? Number(f.oldPrice) : 0, offerLabel: f.offerLabel.trim(),
      category: f.category.trim(), description: f.description.trim(), images: f.images, stock: n, inStock: n > 0 }
    try {
      if (f.id) await updateDoc(doc(db, 'products', f.id), data)
      else await addDoc(collection(db, 'products'), { ...data, createdAt: serverTimestamp() })
      toast(f.id ? 'Product updated' : 'Product added'); onClose()
    } catch { toast('Could not save — are you signed in as admin?', true) }
    setSaving(false)
  }
  const move = (i) => set('images', [f.images[i], ...f.images.filter((_, k) => k !== i)])

  return (
    <motion.div className="overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.form className="editor" onSubmit={save} initial={{ x: 80, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 80, opacity: 0 }}
        transition={{ type: 'spring', damping: 28, stiffness: 280 }}>
        <div className="ed-head"><h3>{f.id ? 'Edit product' : 'New product'}</h3><button type="button" className="icon" onClick={onClose}><X size={20} /></button></div>

        <label>Photos <small>(first photo is the cover)</small></label>
        <div className={`dropzone ${drag ? 'over' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
          onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setDrag(false) }}
          onDrop={(e) => { e.preventDefault(); setDrag(false); onFiles([...e.dataTransfer.files].filter((f) => f.type.startsWith('image/'))) }}>
          <label className="dz-btn"><UploadCloud size={28} /><b>{drag ? 'Drop to upload' : 'Drag photos here'}</b><span>or click to browse</span>
            <input type="file" accept="image/*" multiple hidden onChange={(e) => { onFiles([...e.target.files]); e.target.value = '' }} /></label>
        </div>
        {(f.images.length > 0 || up > 0) && (
          <div className="uploads">
            {f.images.map((u, i) => (
              <div key={u} className="thumb">
                <img src={img(u, 200)} alt="" />
                {i > 0 && <button type="button" className="mk" onClick={() => move(i)}>Make cover</button>}
                {i === 0 && <span className="mk on">Cover</span>}
                <button type="button" className="rm" onClick={() => set('images', f.images.filter((_, k) => k !== i))}><X size={13} /></button>
              </div>))}
            {[...Array(up)].map((_, i) => <div key={i} className="thumb load"><Loader2 className="spin" /></div>)}
          </div>
        )}

        <label>Name<input required value={f.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Pearl Drop Earrings" /></label>
        <div className="row2">
          <label>MRP ({CURRENCY}) <small>(optional)</small><input type="number" min="0" value={f.oldPrice} onChange={(e) => set('oldPrice', e.target.value)} placeholder="e.g. 900" /></label>
          <label>Selling price ({CURRENCY})<input required type="number" min="0" value={f.price} onChange={(e) => set('price', e.target.value)} placeholder="e.g. 700" /></label>
        </div>
        <label>Offer label <small>(shown when MRP is higher than the price)</small><input value={f.offerLabel} onChange={(e) => set('offerLabel', e.target.value)} placeholder={OFFER_LABEL} /></label>
        <label>Category<input required list="cats" value={f.category} onChange={(e) => set('category', e.target.value)} placeholder="Earrings, Rings, Bags…" />
          <datalist id="cats">{['Earrings', 'Necklaces', 'Rings', 'Bracelets', 'Hair', 'Bags'].map((c) => <option key={c} value={c} />)}</datalist></label>
        <label>Description<textarea rows="4" value={f.description} onChange={(e) => set('description', e.target.value)} placeholder="Material, size, care…" /></label>
        <label>Stock quantity <small>(how many you have · 0 marks it sold out)</small><input required type="number" min="0" step="1" value={f.stock} onChange={(e) => set('stock', e.target.value)} placeholder="e.g. 12" /></label>

        <button className="btn btn-block btn-lg" disabled={saving || up > 0}>{saving ? <Loader2 className="spin" size={18} /> : f.id ? 'Save changes' : 'Publish product'}</button>
      </motion.form>
    </motion.div>
  )
}

/* ---------- invoices ---------- */
const PAYMENTS = ['UPI', 'Cash', 'Bank transfer', 'Card', 'Cash on delivery']
const blankItem = { productId: '', name: '', qty: 1, mrp: '', price: '' }
const today = () => { const d = new Date(); return new Date(d - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10) }
const fmtDate = (d) => (d ? new Date(`${d}T00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '')
const invNo = (seq) => `${INVOICE_PREFIX}-${String(seq).padStart(4, '0')}`
const totalsOf = (inv) => {
  const items = inv.items || []
  const mrp = items.reduce((n, i) => n + Math.max(i.mrp || 0, i.price) * i.qty, 0)
  const sub = items.reduce((n, i) => n + i.price * i.qty, 0)
  return { mrp, sub, savings: mrp - sub, total: Math.max(0, sub + (inv.shipping || 0) - (inv.discount || 0)) }
}
// WhatsApp needs a country code; assume India for plain 10-digit numbers
const waPhone = (ph) => { const d = (ph || '').replace(/\D/g, ''); return d.length === 10 ? `91${d}` : d }

function InvoiceForm({ products, seq, onClose, onSaved, toast }) {
  const [f, setF] = useState({ customer: '', phone: '', address: '', date: today(), payment: 'UPI', status: 'Paid', shipping: '', discount: '', notes: '', items: [{ ...blankItem }] })
  const [reduce, setReduce] = useState(true); const [saving, setSaving] = useState(false)
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }))
  const setItem = (i, patch) => setF((s) => ({ ...s, items: s.items.map((it, k) => (k === i ? { ...it, ...patch } : it)) }))
  const pick = (i, id) => {
    const p = products.find((x) => x.id === id)
    setItem(i, p ? { productId: id, name: p.name, mrp: p.oldPrice > p.price ? p.oldPrice : '', price: p.price } : { productId: '' })
  }
  const items = f.items.map((it) => ({ productId: it.productId, name: it.name.trim(), qty: Math.max(1, parseInt(it.qty, 10) || 1), price: Number(it.price) || 0, mrp: Number(it.mrp) > Number(it.price) ? Number(it.mrp) : 0 }))
  const t = totalsOf({ items, shipping: Number(f.shipping) || 0, discount: Number(f.discount) || 0 })

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    const data = { seq, number: invNo(seq), customer: f.customer.trim(), phone: f.phone.trim(), address: f.address.trim(), date: f.date,
      payment: f.payment, status: f.status, shipping: Number(f.shipping) || 0, discount: Number(f.discount) || 0, notes: f.notes.trim(),
      items, total: t.total, stockReduced: reduce, createdAt: serverTimestamp() }
    try {
      const batch = writeBatch(db)
      const ref = doc(collection(db, 'invoices'))
      batch.set(ref, data)
      if (reduce) {
        const need = {}
        items.forEach((i) => { if (i.productId) need[i.productId] = (need[i.productId] || 0) + i.qty })
        Object.entries(need).forEach(([id, q]) => {
          const p = products.find((x) => x.id === id)
          if (p && typeof p.stock === 'number') { const n = Math.max(0, p.stock - q); batch.update(doc(db, 'products', id), { stock: n, inStock: n > 0 }) }
        })
      }
      await batch.commit()
      toast(`Invoice ${data.number} created`); onSaved({ id: ref.id, ...data })
    } catch { toast('Could not save — check Firestore rules allow invoices for your admin email', true); setSaving(false) }
  }

  return (
    <motion.div className="overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.form className="editor" onSubmit={save} initial={{ x: 80, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 80, opacity: 0 }}
        transition={{ type: 'spring', damping: 28, stiffness: 280 }}>
        <div className="ed-head"><div><h3>New invoice</h3><small>{invNo(seq)}</small></div><button type="button" className="icon" onClick={onClose}><X size={20} /></button></div>

        <label>Customer name<input required value={f.customer} onChange={(e) => set('customer', e.target.value)} placeholder="e.g. Ananya Sharma" /></label>
        <div className="row2">
          <label>Phone <small>(for WhatsApp)</small><input type="tel" value={f.phone} onChange={(e) => set('phone', e.target.value)} placeholder="98XXXXXXXX" /></label>
          <label>Date<input required type="date" value={f.date} onChange={(e) => set('date', e.target.value)} /></label>
        </div>
        <label>Address <small>(optional)</small><textarea rows="2" value={f.address} onChange={(e) => set('address', e.target.value)} /></label>

        <div className="lbl">Items</div>
        {f.items.map((it, i) => (
          <div key={i} className="itm">
            <div className="itm-top">
              <select value={it.productId} onChange={(e) => pick(i, e.target.value)} aria-label="Product">
                <option value="">Custom item</option>
                {products.map((p) => <option key={p.id} value={p.id}>{p.name} — {fmt(p.price)}</option>)}
              </select>
              {f.items.length > 1 && <button type="button" className="icon danger" onClick={() => set('items', f.items.filter((_, k) => k !== i))} aria-label="Remove item"><Trash2 size={16} /></button>}
            </div>
            <input required value={it.name} onChange={(e) => setItem(i, { name: e.target.value })} placeholder="Item name" aria-label="Item name" />
            <div className="row3">
              <label>Qty<input required type="number" min="1" step="1" value={it.qty} onChange={(e) => setItem(i, { qty: e.target.value })} /></label>
              <label>MRP<input type="number" min="0" value={it.mrp} onChange={(e) => setItem(i, { mrp: e.target.value })} placeholder="—" /></label>
              <label>Price<input required type="number" min="0" value={it.price} onChange={(e) => setItem(i, { price: e.target.value })} /></label>
            </div>
          </div>
        ))}
        <button type="button" className="btn btn-sm btn-outline add-itm" onClick={() => set('items', [...f.items, { ...blankItem }])}><Plus size={15} /> Add item</button>

        <div className="row2">
          <label>Shipping ({CURRENCY})<input type="number" min="0" value={f.shipping} onChange={(e) => set('shipping', e.target.value)} placeholder="0" /></label>
          <label>Extra discount ({CURRENCY})<input type="number" min="0" value={f.discount} onChange={(e) => set('discount', e.target.value)} placeholder="0" /></label>
        </div>
        <div className="row2">
          <label>Payment<select value={f.payment} onChange={(e) => set('payment', e.target.value)}>{PAYMENTS.map((m) => <option key={m}>{m}</option>)}</select></label>
          <label>Status<select value={f.status} onChange={(e) => set('status', e.target.value)}><option>Paid</option><option>Unpaid</option></select></label>
        </div>
        <label>Notes <small>(optional, printed on invoice)</small><textarea rows="2" value={f.notes} onChange={(e) => set('notes', e.target.value)} /></label>
        <label className="check"><input type="checkbox" checked={reduce} onChange={(e) => setReduce(e.target.checked)} /> Reduce stock for store products on this invoice</label>

        <div className="sum">
          {t.savings > 0 && <><div><span>Total at MRP</span><span>{fmt(t.mrp)}</span></div><div className="sv"><span>{OFFER_LABEL} savings</span><span>−{fmt(t.savings)}</span></div></>}
          <div><span>Subtotal</span><span>{fmt(t.sub)}</span></div>
          {Number(f.shipping) > 0 && <div><span>Shipping</span><span>{fmt(f.shipping)}</span></div>}
          {Number(f.discount) > 0 && <div><span>Extra discount</span><span>−{fmt(f.discount)}</span></div>}
          <div className="grand"><span>Total</span><b>{fmt(t.total)}</b></div>
        </div>
        <button className="btn btn-block btn-lg" disabled={saving}>{saving ? <Loader2 className="spin" size={18} /> : 'Create invoice'}</button>
      </motion.form>
    </motion.div>
  )
}

function InvoiceView({ inv, onClose }) {
  const t = totalsOf(inv)
  useEffect(() => {
    const k = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k)
  }, [onClose])
  const msg = `Hi ${inv.customer}! 👋\nHere's your invoice from ${BUSINESS.name}.\n\nInvoice: ${inv.number}\nDate: ${fmtDate(inv.date)}\n\n${inv.items
    .map((i, k) => `${k + 1}. ${i.name} × ${i.qty} — ${fmt(i.price * i.qty)}`).join('\n')}${inv.shipping ? `\nShipping — ${fmt(inv.shipping)}` : ''}${inv.discount ? `\nDiscount — −${fmt(inv.discount)}` : ''}\n\n*Total: ${fmt(t.total)}*${
    t.savings > 0 ? `\nYou saved ${fmt(t.savings)} with our ${OFFER_LABEL.toLowerCase()} 🎉` : ''}\nPayment: ${inv.payment} (${inv.status})\n\nThank you for shopping with us!`
  const phone = waPhone(inv.phone)
  return (
    <motion.div className="overlay inv-ov" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div className="sheet" role="dialog" aria-label={`Invoice ${inv.number}`} initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }}
        transition={{ type: 'spring', damping: 28, stiffness: 270 }} onClick={(e) => e.stopPropagation()}>
        <div className="sheet-bar">
          <b>{inv.number}</b>
          <div>
            {phone && <a className="btn btn-sm btn-outline" href={`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`} target="_blank" rel="noreferrer"><MessageCircle size={15} /> WhatsApp</a>}
            <button className="btn btn-sm" onClick={() => window.print()}><Printer size={15} /> Print / PDF</button>
            <button className="icon" onClick={onClose} aria-label="Close"><X size={20} /></button>
          </div>
        </div>
        <article className="inv">
          <div className="inv-band" />
          <header className="inv-head">
            <div className="inv-from">
              <img src="/logo-circle.png" alt="" />
              <div>
                <b>{BUSINESS.name}</b>
                {BUSINESS.address && <span>{BUSINESS.address}</span>}
                {BUSINESS.phone && <span>{BUSINESS.phone}</span>}
                {BUSINESS.email && <span>{BUSINESS.email}</span>}
                {BUSINESS.gstin && <span>GSTIN: {BUSINESS.gstin}</span>}
              </div>
            </div>
            <div className="inv-meta">
              <h2>Invoice</h2>
              <span>No. <b>{inv.number}</b></span>
              <span>Date <b>{fmtDate(inv.date)}</b></span>
              <span className={`pill ${inv.status === 'Paid' ? 'on' : 'low'}`}>{inv.status}</span>
            </div>
          </header>
          <div className="inv-to">
            <small>Billed to</small><b>{inv.customer}</b>
            {inv.phone && <span>{inv.phone}</span>}{inv.address && <span className="addr">{inv.address}</span>}
          </div>
          <div className="inv-tbl">
            <table>
              <thead><tr><th>#</th><th>Item</th><th>Qty</th><th>MRP</th><th>Price</th><th>Amount</th></tr></thead>
              <tbody>{inv.items.map((i, k) => (
                <tr key={k}><td>{k + 1}</td><td>{i.name}</td><td>{i.qty}</td><td>{i.mrp > i.price ? <s>{fmt(i.mrp)}</s> : '—'}</td><td>{fmt(i.price)}</td><td>{fmt(i.price * i.qty)}</td></tr>))}
              </tbody>
            </table>
          </div>
          <div className="inv-foot">
            <div className="inv-pay"><small>Payment</small><b>{inv.payment}</b>{inv.notes && <p>{inv.notes}</p>}</div>
            <div className="sum">
              {t.savings > 0 && <><div><span>Total at MRP</span><span>{fmt(t.mrp)}</span></div><div className="sv"><span>{OFFER_LABEL} savings</span><span>−{fmt(t.savings)}</span></div></>}
              <div><span>Subtotal</span><span>{fmt(t.sub)}</span></div>
              {inv.shipping > 0 && <div><span>Shipping</span><span>{fmt(inv.shipping)}</span></div>}
              {inv.discount > 0 && <div><span>Extra discount</span><span>−{fmt(inv.discount)}</span></div>}
              <div className="grand"><span>Total</span><b>{fmt(t.total)}</b></div>
            </div>
          </div>
          <p className="inv-thanks">Thank you for shopping with {BUSINESS.name}!</p>
        </article>
      </motion.div>
    </motion.div>
  )
}

function Invoices({ products, toast }) {
  const { invoices, loading, error } = useInvoices()
  const [form, setForm] = useState(false); const [view, setView] = useState(null); const [q, setQ] = useState('')
  const seq = Math.max(0, ...invoices.map((i) => i.seq || 0)) + 1
  const list = useMemo(() => invoices.filter((i) => `${i.number} ${i.customer} ${i.phone}`.toLowerCase().includes(q.toLowerCase())), [invoices, q])
  const sum = (arr) => arr.reduce((n, i) => n + totalsOf(i).total, 0)
  const stats = [
    { l: 'Invoices', v: invoices.length, i: FileText },
    { l: 'Collected', v: fmt(sum(invoices.filter((i) => i.status === 'Paid'))), i: IndianRupee },
    { l: 'Pending payment', v: fmt(sum(invoices.filter((i) => i.status !== 'Paid'))), i: Clock },
  ]
  const shown = view && (invoices.find((i) => i.id === view.id) || view)
  const toggle = (inv) => updateDoc(doc(db, 'invoices', inv.id), { status: inv.status === 'Paid' ? 'Unpaid' : 'Paid' })
  const del = async (inv) => { if (confirm(`Delete invoice ${inv.number}? Stock will not be restored.`)) { await deleteDoc(doc(db, 'invoices', inv.id)); toast('Invoice deleted') } }

  return (
    <main>
      <div className="a-head">
        <div><h1>Invoices</h1><p>Create, print and share bills for your orders.</p></div>
        <button className="btn" onClick={() => setForm(true)} disabled={error}><Plus size={18} /> New invoice</button>
      </div>
      <div className="stats">{stats.map((s, i) => (
        <motion.div key={s.l} className="stat" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
          <s.i size={20} /><b>{s.v}</b><span>{s.l}</span></motion.div>))}
      </div>
      <label className="search wide"><Search size={16} /><input placeholder="Search by number, name or phone…" value={q} onChange={(e) => setQ(e.target.value)} /></label>

      {error ? <p className="empty">Couldn’t load invoices. Publish the updated <b>firestore.rules</b> (it adds an admin-only <b>invoices</b> collection), then refresh.</p>
        : loading ? <p className="empty">Loading…</p>
        : list.length === 0 ? <p className="empty">{invoices.length ? 'No invoices match that search.' : 'No invoices yet — create your first one.'}</p> : (
        <div className="table">
          <AnimatePresence>{list.map((inv) => (
            <motion.div key={inv.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -30 }} className="trow">
              <button className="ino" onClick={() => setView(inv)} aria-label={`View ${inv.number}`}><FileText size={20} /></button>
              <div className="tn"><b>{inv.number} · {inv.customer}</b><span>{fmtDate(inv.date)} · {inv.items?.length || 0} item{inv.items?.length === 1 ? '' : 's'}</span></div>
              <div className="tp">{fmt(totalsOf(inv).total)}</div>
              <button className={`pill ${inv.status === 'Paid' ? 'on' : 'low'}`} onClick={() => toggle(inv)} title="Click to toggle paid / unpaid">{inv.status}</button>
              <div className="acts">
                <button className="icon" onClick={() => setView(inv)} aria-label="View invoice"><Eye size={17} /></button>
                <button className="icon danger" onClick={() => del(inv)} aria-label="Delete invoice"><Trash2 size={17} /></button>
              </div>
            </motion.div>))}
          </AnimatePresence>
        </div>
      )}
      <AnimatePresence>{form && <InvoiceForm products={products} seq={seq} toast={toast} onClose={() => setForm(false)} onSaved={(inv) => { setForm(false); setView(inv) }} />}</AnimatePresence>
      <AnimatePresence>{shown && <InvoiceView inv={shown} onClose={() => setView(null)} />}</AnimatePresence>
    </main>
  )
}

function Dashboard({ user }) {
  const { products, loading } = useProducts()
  const [tab, setTab] = useState('products')
  const [edit, setEdit] = useState(null); const [q, setQ] = useState(''); const [t, setT] = useState(null)
  const toast = (msg, bad) => { setT({ msg, bad }); setTimeout(() => setT(null), 2800) }
  const list = useMemo(() => products.filter((p) => p.name.toLowerCase().includes(q.toLowerCase())), [products, q])
  const low = (p) => typeof p.stock === 'number' && p.stock > 0 && p.stock <= 3
  const stats = [
    { l: 'Total products', v: products.length, i: Package },
    { l: 'In stock', v: products.filter((p) => !isSold(p)).length, i: Eye },
    { l: 'Low stock (3 or fewer)', v: products.filter(low).length, i: Clock },
    { l: 'Sold out', v: products.filter(isSold).length, i: EyeOff },
  ]
  const del = async (p) => { if (confirm(`Delete “${p.name}”?`)) { await deleteDoc(doc(db, 'products', p.id)); toast('Deleted') } }
  const adjust = (p, d) => { const n = Math.max(0, p.stock + d); updateDoc(doc(db, 'products', p.id), { stock: n, inStock: n > 0 }) }

  return (
    <div className="admin">
      <aside>
        <img src="/logo-circle.png" alt="" />
        <p>Signed in as<br /><b>{user.email}</b></p>
        <nav className="tabs">
          <button className={tab === 'products' ? 'on' : ''} onClick={() => setTab('products')}><Package size={16} /> Products</button>
          <button className={tab === 'invoices' ? 'on' : ''} onClick={() => setTab('invoices')}><Receipt size={16} /> Invoices</button>
        </nav>
        <a href="/" target="_blank" rel="noreferrer"><ExternalLink size={16} /> View store</a>
        <button className="out" onClick={() => signOut(auth)}><LogOut size={16} /> Sign out</button>
      </aside>
      {tab === 'invoices' ? <Invoices products={products} toast={toast} /> : (
      <main>
        <div className="a-head">
          <div><h1>Products</h1><p>Manage everything customers see in your store.</p></div>
          <button className="btn" onClick={() => setEdit(empty)}><Plus size={18} /> Add product</button>
        </div>
        <div className="stats">{stats.map((s, i) => (
          <motion.div key={s.l} className="stat" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
            <s.i size={20} /><b>{s.v}</b><span>{s.l}</span></motion.div>))}
        </div>
        <label className="search wide"><Search size={16} /><input placeholder="Search products…" value={q} onChange={(e) => setQ(e.target.value)} /></label>

        {loading ? <p className="empty">Loading…</p> : list.length === 0 ? <p className="empty">No products yet — add your first one.</p> : (
          <div className="table">
            <AnimatePresence>{list.map((p) => (
              <motion.div key={p.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -30 }} className="trow">
                <img src={img(p.images?.[0], 120)} alt="" />
                <div className="tn"><b>{p.name}</b><span>{p.category}</span></div>
                <div className="tp">{fmt(p.price)}{p.oldPrice > p.price && <s>{fmt(p.oldPrice)}</s>}</div>
                {typeof p.stock === 'number' ? (
                  <div className={`stk ${p.stock === 0 ? 'zero' : low(p) ? 'low' : ''}`}>
                    <button onClick={() => adjust(p, -1)} disabled={p.stock <= 0} aria-label="Decrease stock"><Minus size={14} /></button>
                    <span><b>{p.stock}</b><small>{p.stock === 0 ? 'Sold out' : low(p) ? 'Low' : 'In stock'}</small></span>
                    <button onClick={() => adjust(p, 1)} aria-label="Increase stock"><Plus size={14} /></button>
                  </div>
                ) : <button className="pill low" onClick={() => setEdit(p)}>Set stock</button>}
                <div className="acts">
                  <button className="icon" onClick={() => setEdit(p)}><Pencil size={17} /></button>
                  <button className="icon danger" onClick={() => del(p)}><Trash2 size={17} /></button>
                </div>
              </motion.div>))}
            </AnimatePresence>
          </div>
        )}
      </main>)}
      <AnimatePresence>{edit && <Editor initial={edit} onClose={() => setEdit(null)} toast={toast} />}</AnimatePresence>
      <AnimatePresence>{t && <motion.div className={`toast ${t.bad ? 'bad' : ''}`} initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0 }}>{t.msg}</motion.div>}</AnimatePresence>
    </div>
  )
}

export default function Admin() {
  const [user, setUser] = useState(undefined)
  useEffect(() => onAuthStateChanged(auth, setUser), [])
  if (user === undefined) return <div className="login"><Loader2 className="spin" color="#034B54" /></div>
  return user ? <Dashboard user={user} /> : <Login />
}