import { addDoc, collection, deleteDoc, doc, onSnapshot, serverTimestamp, updateDoc, writeBatch } from 'firebase/firestore'
import { db } from '../lib/firebase'

const col = (uid) => collection(db, 'users', uid, 'addresses')
export const ADDRESS_FIELDS = ['name', 'phone', 'line1', 'line2', 'city', 'state', 'pincode']
const pick = (a) => Object.fromEntries(ADDRESS_FIELDS.map((k) => [k, String(a[k] ?? '').trim()]))

export const subscribeAddresses = (uid, onData, onError) =>
  onSnapshot(col(uid), (s) => onData(s.docs.map((d) => ({ id: d.id, ...d.data() }))
    .sort((a, b) => Number(!!b.isDefault) - Number(!!a.isDefault))), onError)

export const addAddress = (uid, address, isDefault = false) =>
  addDoc(col(uid), { ...pick(address), isDefault, createdAt: serverTimestamp() })

export const updateAddress = (uid, id, address) => updateDoc(doc(col(uid), id), pick(address))

export const removeAddress = (uid, id) => deleteDoc(doc(col(uid), id))

export async function makeDefault(uid, id, all) {
  const batch = writeBatch(db)
  all.forEach((a) => batch.update(doc(col(uid), a.id), { isDefault: a.id === id }))
  await batch.commit()
}

/** Same address already saved? Avoids duplicates when "save for next time" is ticked repeatedly. */
export const isSameAddress = (a, b) => ['line1', 'city', 'pincode'].every((k) => (a[k] || '').trim().toLowerCase() === (b[k] || '').trim().toLowerCase())
