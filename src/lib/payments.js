import { load } from '@cashfreepayments/cashfree-js'

const mode = import.meta.env.VITE_CASHFREE_MODE === 'production' ? 'production' : 'sandbox'
let sdk

/** Lazily loads Cashfree.js once, then redirects to the hosted checkout for the given session. */
export async function redirectToPayment(paymentSessionId) {
  sdk ??= load({ mode })
  const cashfree = await sdk
  if (!cashfree) throw new Error('Payment service could not load. Please check your connection and try again.')
  const result = await cashfree.checkout({ paymentSessionId, redirectTarget: '_self' })
  if (result?.error) throw new Error(result.error.message || 'Payment could not be started.')
}
