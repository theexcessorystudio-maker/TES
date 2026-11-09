import crypto from 'node:crypto'
import { adminDb, FieldValue } from './firebaseAdmin.js'
import { cashfree } from './cashfree.js'
import { HttpError } from './http.js'
import {
  CURRENCY_CODE, MAX_QTY_PER_LINE, ORDER_STATUS, EMAIL_RE, PHONE_RE, PINCODE_RE,
  shippingFor, stockOf, requiresSize, lineKey,
} from '../../shared/commerce.js'

const orders = () => adminDb.collection('orders')
const clean = (v, max = 200) => String(v ?? '').trim().slice(0, max)

/** Unguessable id — it doubles as the guest's access key for the order status page. */
export const newOrderId = () => `TES-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(8).toString('hex')}`

export function parseCheckout(body) {
  const c = body?.customer || {}, a = body?.address || {}
  const customer = { name: clean(c.name, 80), email: clean(c.email, 120).toLowerCase(), phone: clean(c.phone, 15).replace(/\D/g, '').slice(-10) }
  const address = { line1: clean(a.line1), line2: clean(a.line2), city: clean(a.city, 80), state: clean(a.state, 80), pincode: clean(a.pincode, 6) }

  if (customer.name.length < 2) throw new HttpError(400, 'Please enter your full name.')
  if (!EMAIL_RE.test(customer.email)) throw new HttpError(400, 'Please enter a valid email address.')
  if (!PHONE_RE.test(customer.phone)) throw new HttpError(400, 'Please enter a valid 10-digit mobile number.')
  if (!address.line1 || !address.city || !address.state) throw new HttpError(400, 'Please complete your delivery address.')
  if (!PINCODE_RE.test(address.pincode)) throw new HttpError(400, 'Please enter a valid 6-digit PIN code.')

  const items = Array.isArray(body?.items) ? body.items.slice(0, 50) : []
  if (!items.length) throw new HttpError(400, 'Your cart is empty.')
  return { customer, address, items, note: clean(body?.note, 500) }
}

/** Re-prices the cart from Firestore. Client-sent prices are never trusted. */
export async function priceCart(rawItems) {
  const merged = new Map()
  for (const it of rawItems) {
    const id = clean(it?.id, 64), size = clean(it?.size, 12) || null
    const qty = Math.max(1, Math.min(MAX_QTY_PER_LINE, parseInt(it?.qty, 10) || 1))
    if (!id) continue
    const key = lineKey(id, size)
    merged.set(key, { id, size, qty: Math.min(MAX_QTY_PER_LINE, (merged.get(key)?.qty || 0) + qty) })
  }
  const ids = [...new Set([...merged.values()].map((l) => l.id))]
  const snaps = await adminDb.getAll(...ids.map((id) => adminDb.collection('products').doc(id)))
  const products = new Map(snaps.filter((s) => s.exists).map((s) => [s.id, { id: s.id, ...s.data() }]))

  const needed = new Map()
  const items = [...merged.values()].map(({ id, size, qty }) => {
    const p = products.get(id)
    if (!p) throw new HttpError(409, 'An item in your cart is no longer available. Please review your cart.')
    if (requiresSize(p) && !p.sizes.includes(size)) throw new HttpError(400, `Please choose a size for ${p.name}.`)
    if (!requiresSize(p) && size) throw new HttpError(400, `${p.name} does not come in sizes.`)
    needed.set(id, (needed.get(id) || 0) + qty)
    return { productId: id, name: p.name, size, qty, price: Number(p.price), mrp: Number(p.oldPrice) > Number(p.price) ? Number(p.oldPrice) : 0, image: p.images?.[0] || '' }
  })
  for (const [id, qty] of needed) {
    const p = products.get(id), stock = stockOf(p)
    if (stock < qty) throw new HttpError(409, stock <= 0 ? `${p.name} just sold out.` : `Only ${stock} of ${p.name} left — please update your cart.`)
  }
  const subtotal = items.reduce((n, i) => n + i.price * i.qty, 0)
  const shipping = shippingFor(subtotal)
  return { items, subtotal, shipping, total: subtotal + shipping }
}

export async function createOrder({ input, user, site }) {
  const priced = await priceCart(input.items)
  const orderId = newOrderId()
  const ref = orders().doc(orderId)
  await ref.set({
    orderId, status: ORDER_STATUS.PENDING, fulfilment: 'New',
    uid: user?.uid || null, customer: input.customer, address: input.address, note: input.note,
    ...priced, currency: CURRENCY_CODE, createdAt: FieldValue.serverTimestamp(),
  })

  const gatewayOrder = await cashfree.createOrder({
    order_id: orderId,
    order_amount: priced.total,
    order_currency: CURRENCY_CODE,
    customer_details: {
      customer_id: user?.uid || `guest_${input.customer.phone}`,
      customer_name: input.customer.name,
      customer_email: input.customer.email,
      customer_phone: input.customer.phone,
    },
    order_meta: {
      return_url: `${site}/order/${orderId}`,
      // Cashfree only accepts https webhooks, so local http dev relies on the return-url check.
      ...(site.startsWith('https://') && { notify_url: `${site}/api/cashfree/webhook` }),
    },
    order_note: `${priced.items.length} item(s) · The Excessory Studio`,
  })
  await ref.update({ cfOrderId: gatewayOrder.cf_order_id ?? null, paymentSessionId: gatewayOrder.payment_session_id })
  return { orderId, paymentSessionId: gatewayOrder.payment_session_id }
}

/**
 * Idempotently marks an order paid: decrements stock and records purchases (which unlock reviews).
 * Safe to call from both the webhook and the return-url check — whichever arrives first wins.
 */
async function markPaid(orderId, payment) {
  const ref = orders().doc(orderId)
  await adminDb.runTransaction(async (tx) => {
    const snap = await tx.get(ref)
    if (!snap.exists || snap.data().status === ORDER_STATUS.PAID) return
    const order = snap.data()

    const qtyById = new Map()
    order.items.forEach((i) => qtyById.set(i.productId, (qtyById.get(i.productId) || 0) + i.qty))
    const productRefs = [...qtyById.keys()].map((id) => adminDb.collection('products').doc(id))
    const productSnaps = productRefs.length ? await tx.getAll(...productRefs) : []

    let oversold = false
    productSnaps.forEach((ps) => {
      if (!ps.exists || typeof ps.data().stock !== 'number') return
      const left = ps.data().stock - qtyById.get(ps.id)
      if (left < 0) oversold = true
      tx.update(ps.ref, { stock: Math.max(0, left), inStock: left > 0 })
    })
    if (order.uid) {
      qtyById.forEach((_, productId) => {
        tx.set(adminDb.doc(`users/${order.uid}/purchases/${productId}`), { orderId, at: FieldValue.serverTimestamp() }, { merge: true })
      })
    }
    tx.update(ref, { status: ORDER_STATUS.PAID, paidAt: FieldValue.serverTimestamp(), payment, oversold })
  })
}

/** Asks Cashfree for the truth about an order and reflects it in Firestore. */
export async function syncWithGateway(orderId) {
  const ref = orders().doc(orderId)
  const snap = await ref.get()
  if (!snap.exists) throw new HttpError(404, 'Order not found.')
  if (snap.data().status === ORDER_STATUS.PAID) return snap.data()

  const gateway = await cashfree.getOrder(orderId)
  if (gateway.order_status === 'PAID') {
    const payments = await cashfree.getPayments(orderId).catch(() => [])
    const ok = Array.isArray(payments) ? payments.find((p) => p.payment_status === 'SUCCESS') : null
    await markPaid(orderId, { method: ok?.payment_group || null, cfPaymentId: ok?.cf_payment_id ?? null, amount: gateway.order_amount })
  } else if (['EXPIRED', 'TERMINATED'].includes(gateway.order_status)) {
    await ref.update({ status: ORDER_STATUS.FAILED })
  }
  const fresh = (await ref.get()).data()
  return { ...fresh, gatewayActive: gateway.order_status === 'ACTIVE' }
}

/** What the browser is allowed to see about an order. */
export function toPublicOrder(o) {
  return {
    orderId: o.orderId, status: o.status, fulfilment: o.fulfilment,
    customer: { name: o.customer.name, email: o.customer.email }, address: o.address,
    items: o.items, subtotal: o.subtotal, shipping: o.shipping, total: o.total,
    paymentSessionId: o.status === ORDER_STATUS.PENDING && o.gatewayActive ? o.paymentSessionId : null,
  }
}

/** Links paid guest orders to a newly signed-in account with the same verified email. */
export async function claimOrders(user) {
  if (!user.email || !user.email_verified) return 0
  const snap = await orders().where('customer.email', '==', user.email.toLowerCase()).get()
  const batch = adminDb.batch()
  let linked = 0
  snap.docs.forEach((d) => {
    const o = d.data()
    if (o.status !== ORDER_STATUS.PAID || (o.uid && o.uid !== user.uid)) return
    if (!o.uid) { batch.update(d.ref, { uid: user.uid }); linked++ }
    o.items.forEach((i) => batch.set(adminDb.doc(`users/${user.uid}/purchases/${i.productId}`), { orderId: o.orderId, at: FieldValue.serverTimestamp() }, { merge: true }))
  })
  await batch.commit()
  return linked
}
