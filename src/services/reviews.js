import { collection, deleteDoc, doc, getDoc, onSnapshot, query, serverTimestamp, setDoc, where } from 'firebase/firestore'
import { db } from '../lib/firebase'

/** One review per customer per product: the id is deterministic, so saving again edits it. */
export const reviewId = (productId, uid) => `${productId}_${uid}`

export const subscribeProductReviews = (productId, onData, onError) =>
  onSnapshot(query(collection(db, 'reviews'), where('productId', '==', productId)),
    (s) => onData(s.docs.map((d) => ({ id: d.id, ...d.data({ serverTimestamps: 'estimate' }) }))
      .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))), onError)

/** Firestore rules only allow this when users/{uid}/purchases/{productId} exists (written by the payment API). */
export const hasPurchased = async (uid, productId) => (await getDoc(doc(db, 'users', uid, 'purchases', productId))).exists()

export const saveReview = ({ productId, user, rating, text }) =>
  setDoc(doc(db, 'reviews', reviewId(productId, user.uid)), {
    productId, uid: user.uid, name: user.displayName?.split(' ')[0] || 'Customer', photo: user.photoURL || '',
    rating, text: text.trim(), createdAt: serverTimestamp(),
  })

export const deleteReview = (productId, uid) => deleteDoc(doc(db, 'reviews', reviewId(productId, uid)))

export const summarise = (reviews) => {
  const count = reviews.length
  const average = count ? reviews.reduce((n, r) => n + r.rating, 0) / count : 0
  return { count, average: Math.round(average * 10) / 10 }
}
