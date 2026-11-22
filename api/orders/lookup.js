import { createHandler, jsonBody } from '../_lib/http.js'
import { findGuestOrder, toPublicOrder } from '../_lib/orders.js'

// POST /api/orders/lookup { orderRef, phone } — guests find their order with its order ID and checkout phone number.
export default createHandler(['POST'], async (req) => {
  const { orderRef, phone } = jsonBody(req)
  const order = await findGuestOrder(orderRef, phone)
  return { order: toPublicOrder(order) }
})
