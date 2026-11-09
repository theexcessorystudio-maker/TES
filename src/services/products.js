import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'

const col = collection(db, 'products')

export const subscribeProducts = (onData, onError) =>
  onSnapshot(query(col, orderBy('createdAt', 'desc')), (s) => onData(s.docs.map((d) => ({ id: d.id, ...d.data() }))), onError)

export const saveProduct = (id, data) =>
  id ? updateDoc(doc(db, 'products', id), data) : addDoc(col, { ...data, createdAt: serverTimestamp() })

export const deleteProduct = (id) => deleteDoc(doc(db, 'products', id))

export const setStock = (id, stock) => {
  const n = Math.max(0, stock)
  return updateDoc(doc(db, 'products', id), { stock: n, inStock: n > 0 })
}
