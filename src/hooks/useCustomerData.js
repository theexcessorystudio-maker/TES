import { useEffect, useState } from 'react'
import { useSubscription } from './useSubscription'
import { subscribeAddresses } from '../services/addresses'
import { subscribeCustomerOrders } from '../services/orders'
import { subscribeProductReviews, hasPurchased } from '../services/reviews'

export const useAddresses = (uid) => useSubscription(uid ? (ok, err) => subscribeAddresses(uid, ok, err) : null, [uid])

export const useCustomerOrders = (uid) => useSubscription(uid ? (ok, err) => subscribeCustomerOrders(uid, ok, err) : null, [uid])

export const useProductReviews = (productId) =>
  useSubscription(productId ? (ok, err) => subscribeProductReviews(productId, ok, err) : null, [productId])

/** 'unknown' while checking → true / false. Guests are never eligible. */
export function usePurchaseCheck(uid, productId) {
  const [eligible, setEligible] = useState('unknown')
  useEffect(() => {
    let live = true
    if (!uid || !productId) { setEligible(false); return undefined }
    setEligible('unknown')
    hasPurchased(uid, productId).then((ok) => live && setEligible(ok)).catch(() => live && setEligible(false))
    return () => { live = false }
  }, [uid, productId])
  return eligible
}
