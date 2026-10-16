import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import { addDoc, collection, deleteDoc, doc, serverTimestamp, updateDoc } from 'firebase/firestore'
import { Plus, Minus, Clock, Pencil, Trash2, LogOut, Package, Eye, EyeOff, UploadCloud, X, Loader2, ExternalLink, Search, Tag } from 'lucide-react'
import { auth, db } from '../firebase'
import { uploadImage, img } from '../cloudinary'
import { useProducts } from '../hooks'
import { CURRENCY, isSold } from '../config'

const fmt = (n) => `${CURRENCY}${Number(n).toLocaleString('en-IN')}`
const empty = { name: '', price: '', oldPrice: '', category: '', description: '', images: [], stock: '' }

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
    const data = { name: f.name.trim(), price: Number(f.price), oldPrice: f.oldPrice ? Number(f.oldPrice) : 0,
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
          <label>Price ({CURRENCY})<input required type="number" min="0" value={f.price} onChange={(e) => set('price', e.target.value)} /></label>
          <label>Original price <small>(optional)</small><input type="number" min="0" value={f.oldPrice} onChange={(e) => set('oldPrice', e.target.value)} /></label>
        </div>
        <label>Category<input required list="cats" value={f.category} onChange={(e) => set('category', e.target.value)} placeholder="Earrings, Rings, Bags…" />
          <datalist id="cats">{['Earrings', 'Necklaces', 'Rings', 'Bracelets', 'Hair', 'Bags'].map((c) => <option key={c} value={c} />)}</datalist></label>
        <label>Description<textarea rows="4" value={f.description} onChange={(e) => set('description', e.target.value)} placeholder="Material, size, care…" /></label>
        <label>Stock quantity <small>(how many you have · 0 marks it sold out)</small><input required type="number" min="0" step="1" value={f.stock} onChange={(e) => set('stock', e.target.value)} placeholder="e.g. 12" /></label>

        <button className="btn btn-block btn-lg" disabled={saving || up > 0}>{saving ? <Loader2 className="spin" size={18} /> : f.id ? 'Save changes' : 'Publish product'}</button>
      </motion.form>
    </motion.div>
  )
}

function Dashboard({ user }) {
  const { products, loading } = useProducts()
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
        <a href="/" target="_blank" rel="noreferrer"><ExternalLink size={16} /> View store</a>
        <button onClick={() => signOut(auth)}><LogOut size={16} /> Sign out</button>
      </aside>
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
                <div className="tp">{fmt(p.price)}</div>
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
      </main>
      <AnimatePresence>{edit && <Editor initial={edit} onClose={() => setEdit(null)} toast={toast} />}</AnimatePresence>
      <AnimatePresence>{t && <motion.div className={`toast ${t.bad ? 'bad' : ''}`} initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0 }}>{t.msg}</motion.div>}</AnimatePresence>
    </div>
  )
}

export default function Admin() {
  const [user, setUser] = useState(undefined)
  useEffect(() => onAuthStateChanged(auth, setUser), [])
  if (user === undefined) return <div className="login"><Loader2 className="spin" color="#F4EEE6" /></div>
  return user ? <Dashboard user={user} /> : <Login />
}