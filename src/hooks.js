import { useEffect, useState } from 'react'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { db } from './firebase'

export function useProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'))
    return onSnapshot(q, (s) => { setProducts(s.docs.map((d) => ({ id: d.id, ...d.data() }))); setLoading(false) },
      () => setLoading(false))
  }, [])
  return { products, loading }
}

// Admin only — Firestore rules must allow the admin to read `invoices`
export function useInvoices() {
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  useEffect(() => {
    const q = query(collection(db, 'invoices'), orderBy('createdAt', 'desc'))
    return onSnapshot(q, (s) => { setInvoices(s.docs.map((d) => ({ id: d.id, ...d.data({ serverTimestamps: 'estimate' }) }))); setLoading(false); setError(false) },
      () => { setLoading(false); setError(true) })
  }, [])
  return { invoices, loading, error }
}
