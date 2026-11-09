import { createHandler, jsonBody, siteUrl } from '../_lib/http.js'
import { optionalUser } from '../_lib/auth.js'
import { createOrder, parseCheckout } from '../_lib/orders.js'

// POST /api/orders/create — works for guests and signed-in customers alike.
export default createHandler(['POST'], async (req) => {
  const input = parseCheckout(jsonBody(req))
  const user = await optionalUser(req)
  return createOrder({ input, user, site: siteUrl(req) })
})
