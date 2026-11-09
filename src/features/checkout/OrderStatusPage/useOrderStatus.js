import { useCallback, useEffect, useRef, useState } from 'react'
import { verifyOrder } from '../../../services/orders'

const MAX_POLLS = 6
const POLL_MS = 2500

/**
 * Confirms an order with the server (which asks Cashfree). While a payment is still settling
 * the status can be PENDING for a few seconds, so we poll briefly before giving up.
 */
export function useOrderStatus(orderId) {
  const [state, setState] = useState({ order: null, error: '', loading: true, settling: false })
  const polls = useRef(0)

  const check = useCallback(async () => {
    try {
      const order = await verifyOrder(orderId)
      const settling = order.status === 'PENDING' && polls.current < MAX_POLLS
      setState({ order, error: '', loading: false, settling })
      return settling
    } catch (e) {
      setState({ order: null, error: e.message, loading: false, settling: false })
      return false
    }
  }, [orderId])

  useEffect(() => {
    let timer
    let live = true
    polls.current = 0
    const run = async () => {
      const again = await check()
      if (live && again) { polls.current += 1; timer = setTimeout(run, POLL_MS) }
    }
    run()
    return () => { live = false; clearTimeout(timer) }
  }, [check])

  return state
}
