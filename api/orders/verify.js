import { createHandler, jsonBody, HttpError } from '../_lib/http.js'
import { syncWithGateway, toPublicOrder } from '../_lib/orders.js'

// POST /api/orders/verify { orderId } — called by the order status page after Cashfree redirects back.
export default createHandler(['POST'], async (req) => {
  const { orderId } = jsonBody(req)
  if (typeof orderId !== 'string' || !/^TES-[A-Z0-9]+-[a-f0-9]{16}$/.test(orderId)) throw new HttpError(400, 'Invalid order reference.')
  return { order: toPublicOrder(await syncWithGateway(orderId)) }
})
