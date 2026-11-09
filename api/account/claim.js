import { createHandler } from '../_lib/http.js'
import { requireUser } from '../_lib/auth.js'
import { claimOrders } from '../_lib/orders.js'

// POST /api/account/claim — after Google sign-in, attach earlier guest orders placed with the same email.
export default createHandler(['POST'], async (req) => ({ linked: await claimOrders(await requireUser(req)) }))
