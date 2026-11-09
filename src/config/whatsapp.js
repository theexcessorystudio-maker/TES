import { WHATSAPP } from './site'
import { formatMoney } from '../lib/format'
import { hasOffer, offerLabelOf } from '../lib/product'

export const GREETING = 'Hi The Excessory Studio! 👋'
export const waLink = (text = GREETING) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`

export const productEnquiry = (p, size) =>
  `${GREETING}\nI have a question about:\n\n*${p.name}*${size ? ` (size ${size})` : ''}\nPrice: ${formatMoney(p.price)}${
    hasOffer(p) ? ` (MRP ~${formatMoney(p.oldPrice)}~ · ${offerLabelOf(p)})` : ''}\n${window.location.origin}/?p=${p.id}`

export const orderSupport = (orderId) => `${GREETING}\nI need help with my order *${orderId}*.`

export const cartEnquiry = (lines, total) =>
  `${GREETING}\nI'd like to order:\n\n${lines
    .map((l, i) => `${i + 1}. *${l.product.name}*${l.size ? ` (size ${l.size})` : ''} × ${l.qty} — ${formatMoney(l.product.price * l.qty)}`)
    .join('\n')}\n\nTotal: ${formatMoney(total)}\n\nPlease confirm availability.`

export const replacementRequest = () =>
  `${GREETING}\nI’d like to report an issue with my order.\n\nOrder number: \nIssue (damaged / wrong item): \n\nI’m attaching my unboxing video and photos.`
