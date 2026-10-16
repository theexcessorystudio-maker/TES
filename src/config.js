// Keep digits only: removes spaces, +, dashes, brackets
export const WHATSAPP = (import.meta.env.VITE_WHATSAPP_NUMBER || '').replace(/\D/g, '')
export const INSTAGRAM = import.meta.env.VITE_INSTAGRAM || ''
export const CURRENCY = '₹'

// ✏️ Edit these to match your REAL policies. Only promise what you can deliver — it's what builds trust.
export const TRUST = [
  { icon: 'shield', title: 'Quality Checked', text: 'Every piece is inspected before it leaves the studio.' },
  { icon: 'truck', title: 'Careful Delivery', text: 'Securely packed and shipped with tracking.' },
  { icon: 'chat', title: 'Order on WhatsApp', text: 'Talk to a real person. No account, no checkout maze.' },
  { icon: 'sparkles', title: 'Easy Support', text: 'Any issue with your order? We make it right.' },
]

export const STEPS = [
  { n: '01', title: 'Pick your piece', text: 'Browse the collection and tap Order Now.' },
  { n: '02', title: 'Chat with us', text: 'WhatsApp opens with your order pre-filled.' },
  { n: '03', title: 'Confirm & receive', text: 'We confirm details and ship it to your door.' },
]

// ✏️ Add REAL customer reviews here (with permission): { name: 'Ananya', text: '...' }
export const REVIEWS = []

export const FAQ = [
  { q: 'How do I place an order?', a: 'Tap “Order Now” on any product. WhatsApp opens with the product details already filled in — just send it and we’ll confirm.' },
  { q: 'How can I pay?', a: 'We share payment options in the WhatsApp chat once your order is confirmed.' },
  { q: 'How long does delivery take?', a: 'Delivery times depend on your location. We’ll confirm an estimate when you place your order.' },
  { q: 'What if something is wrong with my order?', a: 'Message us on WhatsApp with a photo and we’ll sort it out.' },
]

export const waLink = (text) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`

export const orderMessage = (p) =>
  `Hi The Excessory Studio! 👋\nI'd like to order:\n\n*${p.name}*\nPrice: ${CURRENCY}${Number(p.price).toLocaleString('en-IN')}\n${window.location.origin}/?p=${p.id}\n\nPlease confirm availability.`

export const cartMessage = (lines, total) =>
  `Hi The Excessory Studio! 👋\nI'd like to order:\n\n${lines
    .map((l, i) => `${i + 1}. *${l.p.name}* × ${l.qty} — ${CURRENCY}${(l.p.price * l.qty).toLocaleString('en-IN')}`)
    .join('\n')}\n\nTotal: ${CURRENCY}${total.toLocaleString('en-IN')}\n\nPlease confirm availability.`

// Stock helpers. Products saved before stock tracking (no `stock` number) fall back to the old inStock flag.
export const stockOf = (p) => (typeof p.stock === 'number' ? p.stock : p.inStock === false ? 0 : Infinity)
export const isSold = (p) => stockOf(p) <= 0