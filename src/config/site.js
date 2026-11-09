/* ✏️ Store copy and business details. Edit freely — only promise what you can deliver. */
import { POLICY } from './policies'

// Keep digits only: removes spaces, +, dashes, brackets
export const WHATSAPP = (import.meta.env.VITE_WHATSAPP_NUMBER || '').replace(/\D/g, '')
export const INSTAGRAM = import.meta.env.VITE_INSTAGRAM || ''
export const CURRENCY = '₹'

/** Emails allowed into /admin (comma separated). Must match the list in firestore.rules. */
export const ADMIN_EMAILS = (import.meta.env.VITE_ADMIN_EMAILS || '')
  .split(',').map((e) => e.trim().toLowerCase()).filter(Boolean)

export const TRUST = [
  { icon: 'shield', title: 'Quality Checked', text: 'Every piece is inspected before it leaves the studio.' },
  { icon: 'truck', title: 'Careful Delivery', text: 'Securely packed and shipped with tracking.' },
  { icon: 'lock', title: 'Secure Checkout', text: 'Pay by UPI, card or netbanking. No account needed.' },
  { icon: 'chat', title: 'Real Support', text: 'Questions about your order? Message us on WhatsApp.' },
]

export const STEPS = [
  { n: '01', title: 'Pick your piece', text: 'Browse the collection and add what you love to your cart.' },
  { n: '02', title: 'Check out securely', text: 'Pay as a guest or sign in with Google. UPI, cards and netbanking accepted.' },
  { n: '03', title: 'Receive & review', text: 'We pack it with care and ship it to your door. Tell us what you think.' },
]

// ✏️ Hand-picked testimonials shown on the home page (with permission): { name: 'Ananya', text: '...' }
// Verified product reviews from customers appear on each product automatically.
export const TESTIMONIALS = []

export const FAQ = [
  { q: 'Do I need an account to order?', a: 'No. You can check out as a guest. Signing in with Google lets you save addresses, track orders and leave reviews.' },
  { q: 'How can I pay?', a: 'We accept UPI, debit and credit cards, netbanking and wallets through our secure payment partner, Cashfree.' },
  { q: 'How do I find my ring size?', a: 'Open any ring and tap “Size guide”. Measure the inside diameter of a ring you already wear and match it to the chart.' },
  {
    q: 'How much is delivery and how long does it take?',
    a: `Delivery is a flat ${CURRENCY}${POLICY.deliveryFee} on every order. Orders are dispatched within ${POLICY.dispatchTime} and usually arrive ${POLICY.deliveryTime} after dispatch.`,
  },
  {
    q: 'What if my order arrives damaged or wrong?',
    a: `Message us within ${POLICY.claimWindowHours} hours of delivery with your order number and a continuous 360° unboxing video, starting from the sealed package. Approved claims get a free replacement. Without an unboxing video we can’t accept the claim. See our Returns & Replacement policy for details.`,
  },
  {
    q: 'Can I exchange for a different size?',
    a: `If your item arrived correct and undamaged, we may be able to replace it with another size (subject to stock) for ${CURRENCY}${POLICY.replacementFee}. Please check the size guide before ordering.`,
  },
]

// ✏️ Badge shown next to the price whenever a product's MRP is higher than its selling price.
// A product can override it with its own "Offer label" in the admin panel.
export const OFFER_LABEL = 'Launch offer'

// ✏️ Your business details — printed on every invoice. Leave a field empty to hide it.
export const BUSINESS = {
  name: 'The Excessory Studio',
  address: '',
  phone: WHATSAPP ? `+${WHATSAPP}` : '',
  email: '',
  gstin: '',
}
export const INVOICE_PREFIX = 'TES'

export const PRODUCT_CATEGORIES = ['Earrings', 'Necklaces', 'Rings', 'Bracelets', 'Hair', 'Bags']

export const INDIAN_STATES = [
  'Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chandigarh', 'Chhattisgarh',
  'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir',
  'Jharkhand', 'Karnataka', 'Kerala', 'Ladakh', 'Lakshadweep', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya',
  'Mizoram', 'Nagaland', 'Odisha', 'Puducherry', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
]
