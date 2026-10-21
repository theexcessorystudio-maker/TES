import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { MessageCircle, ShieldCheck, Truck, Sparkles, Search, X, Instagram, ChevronLeft, ChevronRight, ChevronDown, Star, ShoppingBag, Plus, Minus, Trash2 } from 'lucide-react'
import { useProducts } from '../hooks'
import { img } from '../cloudinary'
import { TRUST, STEPS, REVIEWS, FAQ, CURRENCY, INSTAGRAM, OFFER_LABEL, waLink, orderMessage, cartMessage, stockOf, isSold, offerOf } from '../config'

const ICONS = { shield: ShieldCheck, truck: Truck, chat: MessageCircle, sparkles: Sparkles }
const fmt = (n) => `${CURRENCY}${Number(n).toLocaleString('en-IN')}`
const discount = (p) => (p.oldPrice > p.price ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100) : 0)
const ease = [0.22, 1, 0.36, 1]

function Price({ p, lg }) {
  const off = discount(p)
  return (
    <div className={`price ${lg ? 'lg' : ''}`}>
      {off > 0 && <span className="offer"><Sparkles size={lg ? 14 : 12} /> {offerOf(p)}</span>}
      <div className="amt">
        <b>{fmt(p.price)}</b>
        {off > 0 && <><s>MRP {fmt(p.oldPrice)}</s><em className="save">{off}% off</em></>}
      </div>
    </div>
  )
}

function Nav({ count, onCart }) {
  return (
    <header className="nav glass">
      <a href="#top" className="brand"><img src="/logo-circle.png" alt="The Excessory Studio" /></a>
      <nav>
        <a href="#shop">Shop</a><a href="#how">How it works</a><a href="#faq">Questions</a>
        <a className="btn btn-sm" href={waLink('Hi The Excessory Studio! 👋')} target="_blank" rel="noreferrer">
          <MessageCircle size={16} /> Chat with us
        </a>
        <button className="cart-btn" onClick={onCart} aria-label={`Open cart, ${count} items`}>
          <ShoppingBag size={20} />
          {count > 0 && <motion.span key={count} className="badge" initial={{ scale: 0.4 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 18 }}>{count}</motion.span>}
        </button>
      </nav>
    </header>
  )
}

function HeroCard({ p, i, mx, my, onOpen }) {
  // flat 2D parallax (no 3D context, so glass never disappears)
  const depth = [10, 18, 26][i] || 14
  const x = useSpring(useTransform(mx, [-1, 1], [-depth, depth]), { stiffness: 110, damping: 18 })
  const y = useSpring(useTransform(my, [-1, 1], [-depth * 0.7, depth * 0.7]), { stiffness: 110, damping: 18 })
  return (
    <div className={`hc hc${i}`}>
      <motion.div style={{ x, y }}>
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.15, duration: 0.9, ease }}>
          <button className="glass hcard" onClick={() => onOpen(p)} aria-label={`View ${p.name}`}>
            <img src={img(p.images[0], 500)} alt={p.name} />
            <span className="cap"><b>{p.name}</b><i>{fmt(p.price)}{discount(p) > 0 && <s>{fmt(p.oldPrice)}</s>}</i></span>
          </button>
        </motion.div>
      </motion.div>
    </div>
  )
}

function HeroStack({ items, loading, onOpen }) {
  const mx = useMotionValue(0), my = useMotionValue(0)
  const move = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    mx.set(((e.clientX - r.left) / r.width) * 2 - 1); my.set(((e.clientY - r.top) / r.height) * 2 - 1)
  }
  const leave = () => { mx.set(0); my.set(0) }

  if (loading) return <div className="stack" />
  if (!items.length) {
    return (
      <div className="stack empty-stack">
        <motion.div className="glass empty-glass" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.8 }}>
          <img src="/logo-circle.png" alt="" /><p>New pieces arrive soon.</p>
        </motion.div>
      </div>
    )
  }
  return (
    <div className="stack" onPointerMove={move} onPointerLeave={leave}>
      {items.map((p, i) => <HeroCard key={p.id} p={p} i={i} mx={mx} my={my} onOpen={onOpen} />)}
    </div>
  )
}

function Hero({ products, loading, onOpen }) {
  const feat = products.filter((p) => p.images?.length && !isSold(p)).slice(0, 3)
  const best = Math.max(0, ...products.filter((p) => !isSold(p)).map(discount))
  const line = (t, d) => (
    <span className="ln"><motion.span initial={{ y: '112%' }} animate={{ y: 0 }} transition={{ delay: d, duration: 1, ease }}>{t}</motion.span></span>
  )
  return (
    <section className="hero" id="top">
      <div className="hero-copy">
        {best > 0 && (
          <motion.a href="#shop" className="eyebrow" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.7 }}>
            <Sparkles size={14} /> {OFFER_LABEL} · up to {best}% off
          </motion.a>
        )}
        <h1>{line('Accessories you’ll', 0.1)}{line(<>reach for <span className="hl">every day.</span></>, 0.22)}</h1>
        <motion.p className="sub" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.8 }}>
          Browse, tap Order now, and we confirm everything with you on WhatsApp.
        </motion.p>
        <motion.div className="hero-cta" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 0.8 }}>
          <a href="#shop" className="btn">Shop the collection</a>
          <a href="#how" className="btn btn-outline">How ordering works</a>
        </motion.div>
      </div>
      <HeroStack items={feat} loading={loading} onOpen={onOpen} />
    </section>
  )
}

function TrustBar() {
  return (
    <div className="trust-wrap">
      <section className="trust frost">
        {TRUST.map((t, i) => {
          const Icon = ICONS[t.icon] || Sparkles
          return (
            <div key={i} className="trust-item">
              <span className="ico"><Icon size={20} strokeWidth={1.6} /></span>
              <div><h4>{t.title}</h4><p>{t.text}</p></div>
            </div>
          )
        })}
      </section>
    </div>
  )
}

function Stepper({ qty, max, onChange, wide }) {
  return (
    <div className={`qty ${wide ? 'wide' : ''}`}>
      <button onClick={() => onChange(qty - 1)} aria-label="Decrease quantity"><Minus size={14} /></button>
      <span>{qty}</span>
      <button onClick={() => onChange(qty + 1)} aria-label="Increase quantity" disabled={qty >= max}><Plus size={14} /></button>
    </div>
  )
}

function Card({ p, onOpen, onAdd, qty, onQty }) {
  const sold = isSold(p)
  const stock = stockOf(p), max = Math.min(10, stock), low = stock > 0 && stock <= 3
  return (
    <motion.article layout initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.4, ease }} className={`card ${sold ? 'sold' : ''}`}>
      <button className="card-img" onClick={() => onOpen(p)} aria-label={`View ${p.name}`}>
        <img src={img(p.images?.[0], 600)} alt={p.name} loading="lazy" />
        {p.images?.[1] && <img className="alt" src={img(p.images[1], 600)} alt="" loading="lazy" />}
        {sold && <span className="tag dark">Sold out</span>}
      </button>
      <div className="card-body">
        <span className="cat">{p.category}</span>
        <h3 onClick={() => onOpen(p)}>{p.name}</h3>
        <Price p={p} />
        {low && <em className="low">Only {stock} left</em>}
        <div className="buy">
          {sold
            ? <button className="btn btn-sm" disabled>Sold out</button>
            : qty > 0
              ? <Stepper qty={qty} max={max} onChange={onQty} />
              : <button className="btn btn-sm" onClick={() => onAdd(p)}><ShoppingBag size={15} /> Add to cart</button>}
        </div>
      </div>
    </motion.article>
  )
}

function Modal({ p, onClose, onAdd, qty, onQty }) {
  const [i, setI] = useState(0)
  const n = p.images?.length || 1
  const stock = stockOf(p), max = Math.min(10, stock), low = stock > 0 && stock <= 3
  useEffect(() => {
    const k = (e) => e.key === 'Escape' && onClose()
    document.body.style.overflow = 'hidden'; window.addEventListener('keydown', k)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', k) }
  }, [onClose])
  return (
    <motion.div className="overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div className="modal" role="dialog" aria-label={p.name} initial={{ y: 50, opacity: 0, scale: 0.97 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 30, opacity: 0 }}
        transition={{ type: 'spring', damping: 28, stiffness: 270 }} onClick={(e) => e.stopPropagation()}>
        <button className="x glass" onClick={onClose} aria-label="Close"><X size={18} /></button>
        <div className="modal-scroll">
        <div className="gallery">
          <AnimatePresence mode="wait">
            <motion.img key={i} src={img(p.images?.[i], 900)} alt={p.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} />
          </AnimatePresence>
          {n > 1 && (<>
            <button className="nv l glass" onClick={() => setI((i - 1 + n) % n)} aria-label="Previous photo"><ChevronLeft size={20} /></button>
            <button className="nv r glass" onClick={() => setI((i + 1) % n)} aria-label="Next photo"><ChevronRight size={20} /></button>
            <div className="dots">{p.images.map((_, k) => <i key={k} className={k === i ? 'on' : ''} onClick={() => setI(k)} />)}</div>
          </>)}
        </div>
        <div className="info">
          <span className="cat">{p.category}</span>
          <h2>{p.name}</h2>
          <Price p={p} lg />
          {low && <span className="low">Only {stock} left</span>}
          <p className="desc">{p.description}</p>
          <ul className="mini-trust"><li><ShieldCheck size={16} /> Quality checked</li><li><Truck size={16} /> Careful packaging</li><li><MessageCircle size={16} /> Real person on WhatsApp</li></ul>
          <div className="actions">
            {isSold(p)
              ? <button className="btn btn-block" disabled>Sold out</button>
              : (<>
                  {qty > 0
                    ? <Stepper wide qty={qty} max={max} onChange={onQty} />
                    : <button className="btn btn-block btn-lg" onClick={() => onAdd(p)}><ShoppingBag size={19} /> Add to cart</button>}
                  <a className="btn btn-block btn-outline" href={waLink(orderMessage(p))} target="_blank" rel="noreferrer"><MessageCircle size={17} /> Order just this on WhatsApp</a>
                </>)}
          </div>
        </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function Faq() {
  const [open, setOpen] = useState(0)
  return (
    <div className="faq">
      {FAQ.map((f, i) => (
        <div key={i} className={`faq-item ${open === i ? 'open' : ''}`}>
          <button onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>{f.q}<motion.span animate={{ rotate: open === i ? 180 : 0 }}><ChevronDown size={18} /></motion.span></button>
          <AnimatePresence initial={false}>
            {open === i && <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease }}>{f.a}</motion.p>}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}

function CartDrawer({ lines, total, saved, onClose, setQty, clear }) {
  useEffect(() => {
    const k = (e) => e.key === 'Escape' && onClose()
    document.body.style.overflow = 'hidden'; window.addEventListener('keydown', k)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', k) }
  }, [onClose])
  const live = lines.filter((l) => !isSold(l.p))
  return (
    <motion.div className="overlay cart-ov" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.aside className="drawer" role="dialog" aria-label="Your cart" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 32, stiffness: 300 }} onClick={(e) => e.stopPropagation()}>
        <div className="dr-head"><h3>Your cart</h3><button className="icon" onClick={onClose} aria-label="Close cart"><X size={20} /></button></div>
        {lines.length === 0 ? (
          <div className="dr-empty">
            <ShoppingBag size={34} strokeWidth={1.4} />
            <p>Your cart is empty.</p><span>Add a piece you like and send the whole order in one message.</span>
            <button className="btn" onClick={onClose}>Browse the collection</button>
          </div>
        ) : (<>
          <div className="dr-list">
            <AnimatePresence initial={false}>
              {lines.map(({ p, qty }) => (
                <motion.div key={p.id} layout className={`cl ${isSold(p) ? 'off' : ''}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: 40 }}>
                  <img src={img(p.images?.[0], 160)} alt={p.name} />
                  <div className="cl-info">
                    <b>{p.name}</b>
                    <span>{isSold(p) ? 'Sold out — not included in your order' : <>{fmt(p.price)}{discount(p) > 0 && <s>{fmt(p.oldPrice)}</s>}</>}</span>
                    <div className="cl-row">
                      <div className="qty">
                        <button onClick={() => setQty(p.id, qty - 1)} aria-label="Decrease quantity"><Minus size={14} /></button>
                        <span>{qty}</span>
                        <button onClick={() => setQty(p.id, qty + 1)} aria-label="Increase quantity" disabled={qty >= Math.min(10, stockOf(p))}><Plus size={14} /></button>
                      </div>
                      <button className="icon danger" onClick={() => setQty(p.id, 0)} aria-label={`Remove ${p.name}`}><Trash2 size={17} /></button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <div className="dr-foot">
            {saved > 0 && <div className="saved"><span><Sparkles size={14} /> {OFFER_LABEL} savings</span><b>−{fmt(saved)}</b></div>}
            <div className="total"><span>Total</span><b>{fmt(total)}</b></div>
            <p className="note">Delivery and payment are confirmed with you on WhatsApp.</p>
            {live.length > 0
              ? <a className="btn btn-block btn-lg" href={waLink(cartMessage(live, total, saved))} target="_blank" rel="noreferrer"><MessageCircle size={19} /> Send order on WhatsApp</a>
              : <button className="btn btn-block btn-lg" disabled>Nothing available to order</button>}
            <button className="clear" onClick={clear}>Clear cart</button>
          </div>
        </>)}
      </motion.aside>
    </motion.div>
  )
}

export default function Store() {
  const { products, loading } = useProducts()
  const [cat, setCat] = useState('All')
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(null)
  const [cartOpen, setCartOpen] = useState(false)
  const [note, setNote] = useState(null)
  const timer = useRef()
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('tes_cart')) || [] } catch { return [] }
  })
  useEffect(() => { try { localStorage.setItem('tes_cart', JSON.stringify(cart)) } catch {} }, [cart])
  // drop items whose product was deleted
  useEffect(() => {
    if (!loading && products.length) setCart((c) => c.filter((x) => products.some((p) => p.id === x.id)).map((x) => {
      const s = stockOf(products.find((q) => q.id === x.id))
      return s > 0 && x.qty > s ? { ...x, qty: Math.min(s, 10) } : x
    }))
  }, [loading, products])

  const lines = useMemo(() => cart.map((c) => ({ p: products.find((p) => p.id === c.id), qty: c.qty })).filter((l) => l.p), [cart, products])
  const total = lines.reduce((n, l) => (isSold(l.p) ? n : n + l.p.price * l.qty), 0)
  const saved = lines.reduce((n, l) => (isSold(l.p) || !(l.p.oldPrice > l.p.price) ? n : n + (l.p.oldPrice - l.p.price) * l.qty), 0)
  const count = cart.reduce((n, c) => n + c.qty, 0)
  const livePick = open && (products.find((p) => p.id === open.id) || open)
  const flash = (m) => { setNote(m); clearTimeout(timer.current); timer.current = setTimeout(() => setNote(null), 2800) }
  const qtyOf = (id) => cart.find((x) => x.id === id)?.qty || 0
  const capOf = (id) => { const p = products.find((x) => x.id === id); return p ? Math.min(10, stockOf(p)) : 10 }
  const add = (p) => {
    const max = Math.min(10, stockOf(p))
    if (qtyOf(p.id) >= max) return flash(`Only ${max} available`)
    setCart((c) => c.find((x) => x.id === p.id) ? c.map((x) => (x.id === p.id ? { ...x, qty: x.qty + 1 } : x)) : [...c, { id: p.id, qty: 1 }])
    flash(`${p.name} added to cart`)
  }
  const setQty = (id, q) => setCart((c) => (q <= 0 ? c.filter((x) => x.id !== id) : c.map((x) => (x.id === id ? { ...x, qty: Math.min(q, capOf(id)) } : x))))

  const cats = useMemo(() => ['All', ...new Set(products.map((p) => p.category).filter(Boolean))], [products])
  const list = useMemo(() => products.filter((p) =>
    (cat === 'All' || p.category === cat) && p.name.toLowerCase().includes(q.toLowerCase())), [products, cat, q])

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('p')
    if (id && products.length) { const f = products.find((p) => p.id === id); if (f) setOpen(f) }
  }, [products])

  return (
    <>
      <Nav count={count} onCart={() => setCartOpen(true)} />
      <Hero products={products} loading={loading} onOpen={setOpen} />
      <TrustBar />

      <section className="section" id="shop">
        <div className="sec-head">
          <h2 className="title">Shop the collection</h2>
          <label className="search"><Search size={16} /><input placeholder="Search pieces" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search pieces" /></label>
        </div>
        {cats.length > 1 && (
          <div className="seg" role="tablist">{cats.map((c) => (
            <button key={c} className={c === cat ? 'on' : ''} onClick={() => setCat(c)}>
              {c === cat && <motion.span layoutId="seg" className="seg-bg" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
              <span>{c}</span>
            </button>))}
          </div>
        )}

        {loading ? (
          <div className="grid">{[...Array(8)].map((_, i) => <div key={i} className="skeleton" />)}</div>
        ) : list.length === 0 ? (
          <p className="empty">{products.length ? 'Nothing matches that search. Try another word or category.' : 'New pieces are on the way. Message us on WhatsApp to hear first.'}</p>
        ) : (
          <motion.div layout className="grid"><AnimatePresence mode="popLayout">{list.map((p) => <Card key={p.id} p={p} onOpen={setOpen} onAdd={add} qty={qtyOf(p.id)} onQty={(q) => setQty(p.id, q)} />)}</AnimatePresence></motion.div>
        )}
      </section>

      <section className="how" id="how">
        <div className="how-in">
          <h2 className="title">How ordering works</h2>
          <div className="steps">{STEPS.map((s, i) => (
            <div key={i} className="step glass"><span>{s.n}</span><h4>{s.title}</h4><p>{s.text}</p></div>))}
          </div>
        </div>
      </section>

      {REVIEWS.length > 0 && (
        <section className="section">
          <h2 className="title">What customers say</h2>
          <div className="reviews">{REVIEWS.map((r, i) => (
            <div key={i} className="review">
              <div className="stars">{[...Array(5)].map((_, k) => <Star key={k} size={15} fill="currentColor" />)}</div>
              <p>“{r.text}”</p><b>{r.name}</b>
            </div>))}
          </div>
        </section>
      )}

      <section className="section faq-sec" id="faq">
        <h2 className="title">Good to know</h2>
        <Faq />
      </section>

      <footer className="footer">
        <div className="foot-in">
          <div className="foot-brand"><img src="/logo-circle.png" alt="" /><div><b>The Excessory Studio</b><p>Questions? We’re one message away.</p></div></div>
          <div className="foot-links">
            <a className="btn btn-light" href={waLink('Hi The Excessory Studio! 👋')} target="_blank" rel="noreferrer"><MessageCircle size={17} /> Message on WhatsApp</a>
            {INSTAGRAM && <a className="btn btn-ghost" href={`https://instagram.com/${INSTAGRAM}`} target="_blank" rel="noreferrer"><Instagram size={17} /> Instagram</a>}
          </div>
        </div>
        <small>© {new Date().getFullYear()} The Excessory Studio</small>
      </footer>

      <motion.a className="fab" href={waLink('Hi The Excessory Studio! 👋')} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp"
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.6, type: 'spring' }}>
        <MessageCircle size={26} />
      </motion.a>

      <AnimatePresence>{open && <Modal p={livePick} qty={qtyOf(open.id)} onQty={(q) => setQty(open.id, q)} onClose={() => setOpen(null)} onAdd={add} />}</AnimatePresence>
      <AnimatePresence>{cartOpen && <CartDrawer lines={lines} total={total} saved={saved} onClose={() => setCartOpen(false)} setQty={setQty} clear={() => setCart([])} />}</AnimatePresence>
      <AnimatePresence>
        {note && (
          <motion.div className="toast" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0 }}>
            {note}<button onClick={() => { setCartOpen(true); setNote(null) }}>View cart</button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}