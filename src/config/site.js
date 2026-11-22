/* ✏️ Store copy and business details. Edit freely — only promise what you can deliver. */
import { POLICY } from './policies'

// Keep digits only: removes spaces, +, dashes, brackets
export const WHATSAPP = (import.meta.env.VITE_WHATSAPP_NUMBER || '').replace(/\D/g, '')
/** Instagram handle, accepted as a handle ("theexcessorystudio", "@theexcessorystudio") or a full profile URL. */
export const INSTAGRAM = (import.meta.env.VITE_INSTAGRAM || 'theexcessorystudio')
  .trim().replace(/^https?:\/\/(www\.)?instagram\.com\//i, '').replace(/^@/, '').split(/[/?#]/)[0]
export const INSTAGRAM_URL = INSTAGRAM ? `https://www.instagram.com/${INSTAGRAM}/` : ''
/** ✏️ Invite link to the WhatsApp community (chat.whatsapp.com/…). Leave empty to hide the invite. */
export const WHATSAPP_COMMUNITY = import.meta.env.VITE_WHATSAPP_COMMUNITY || ''
export const CURRENCY = '₹'

/** Emails allowed into /admin (comma separated). Must match the list in firestore.rules. */
export const ADMIN_EMAILS = (import.meta.env.VITE_ADMIN_EMAILS || '')
  .split(',').map((e) => e.trim().toLowerCase()).filter(Boolean)

/**
 * ✏️ Big cover photo at the top of the home page. Drop the image into /public (e.g. public/cover.jpg)
 * and set the path here. While empty, a plain placeholder is shown.
 */
export const COVER_IMAGE = ''

const freeShip = `Free shipping on orders above ${CURRENCY}${POLICY.freeShippingAbove}`

/** ✏️ Scrolling label strips: one above the header, one between the cover and the shop. */
export const MARQUEE_TOP = ['Demi-fine Jewellery', 'Made to Last, Made to Love', freeShip]
export const MARQUEE_MIDDLE = ['Everyday Jewellery', '18k Gold Plated', 'Anti Tarnish', 'Water Resistant', 'Hypoallergenic', 'Premium Finish']

// ✏️ Hand-picked testimonials shown on the home page (with permission): { name: 'Ananya', text: '...' }
// Verified product reviews from customers appear on each product automatically.
export const TESTIMONIALS = []

/** Home page FAQ. `links` turn the named phrase into a link: { text, to }. */
export const FAQ = [
  {
    q: 'Is your jewellery tarnish-resistant and hypoallergenic?',
    a: 'Yes. Our pieces are 18k PVD gold-plated stainless steel, which makes them tarnish-resistant and gentle on sensitive skin, so they’re made for everyday wear. To keep them looking their best, avoid prolonged contact with harsh chemicals and perfume. Pearl pieces don’t love water, so keep those dry. For more on keeping your pieces looking their best, see our Jewellery Care page.',
    link: { text: 'Jewellery Care page', to: '/jewellery-care' },
  },
  {
    q: 'How do I care for my jewellery?',
    a: 'Store pieces in a dry place, keep them away from perfumes and harsh chemicals and wipe gently with a soft cloth after use. For the full guide, see our Jewellery Care page.',
    link: { text: 'Jewellery Care page', to: '/jewellery-care' },
  },
  {
    q: 'How do I find my ring size?',
    a: 'Open any ring and tap ‘Size guide’. Measure the inside diameter of a ring you already wear and match it to the chart. As we can’t offer size exchanges, please check the guide before ordering.',
    link: { text: 'the guide', to: '/ring-size-guide' },
  },
  {
    q: 'Do I need an account to order?',
    a: 'No, you can check out as a guest. With an account, you can save addresses and track your orders from the My Account page.',
    link: { text: 'My Account', to: '/account' },
  },
  {
    q: 'How can I pay?',
    a: 'We accept UPI, debit and credit cards, netbanking and wallets through our secure payment partner. All orders are prepaid, we don’t offer Cash on Delivery.',
  },
  {
    q: 'How long does shipping take, and what does it cost?',
    a: `Orders are dispatched within ${POLICY.dispatchTime} and delivered in ${POLICY.deliveryTime} across India, depending on your location. We will send you a tracking link as soon as your order ships. Shipping is a flat ${CURRENCY}${POLICY.deliveryFee} and free on orders above ${CURRENCY}${POLICY.freeShippingAbove}.\n\nIf you need it faster in Delhi NCR (Delhi, Noida, Gurgaon), message us on Instagram or WhatsApp us on ${WHATSAPP ? WHATSAPP.replace(/^91(?=\d{10}$)/, '') : 'WhatsApp'} and we will arrange express delivery.`,
  },
  {
    q: 'Do you accept returns or exchanges?',
    a: `We don’t accept returns or exchanges for change of mind. If your order arrives damaged, defective, or incorrect, message us within ${POLICY.claimWindowHours} hours of delivery and we’ll arrange an exchange. Please record a 360° unboxing video before opening the parcel and share it with your message.`,
  },
]

// ✏️ Name used for MRP savings in the cart and on invoices. (The storefront no longer shows offer badges or % off.)
export const OFFER_LABEL = 'Offer'

// ✏️ Your business details — printed on every invoice. Leave a field empty to hide it.
export const BUSINESS = {
  name: 'The Excessory Studio',
  address: '',
  phone: WHATSAPP ? `+${WHATSAPP}` : '',
  email: 'theexcessorystudio@gmail.com',
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
