import { collection, doc, onSnapshot, orderBy, query, updateDoc, where } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { apiPost } from '../lib/api'

const byNewest = (a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
const mapDocs = (s) => s.docs.map((d) => ({ id: d.id, ...d.data({ serverTimestamps: 'estimate' }) }))

/** Creates the order server-side (prices re-checked there) and returns a Cashfree payment session. */
export const createCheckout = ({ customer, address, items, note }) =>
  apiPost('orders/create', { customer, address, note, items: items.map(({ id, size, qty }) => ({ id, size, qty })) })

export const verifyOrder = (orderId) => apiPost('orders/verify', { orderId }).then((r) => r.order)

export const claimGuestOrders = () => apiPost('account/claim')

/** Customer's own orders. Sorted client-side to avoid needing a composite index. */
export const subscribeCustomerOrders = (uid, onData, onError) =>
  onSnapshot(query(collection(db, 'orders'), where('uid', '==', uid)), (s) => onData(mapDocs(s).sort(byNewest)), onError)

export const subscribeAllOrders = (onData, onError) =>
  onSnapshot(query(collection(db, 'orders'), orderBy('createdAt', 'desc')), (s) => onData(mapDocs(s)), onError)

export const updateFulfilment = (orderId, fulfilment) => updateDoc(doc(db, 'orders', orderId), { fulfilment })
