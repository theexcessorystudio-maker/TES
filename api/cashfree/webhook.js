import { cashfree } from '../_lib/cashfree.js'
import { syncWithGateway } from '../_lib/orders.js'

const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } })

/**
 * POST /api/cashfree/webhook — server-to-server confirmation, independent of the customer's browser.
 * Uses the Web-standard handler signature so we get the exact raw body, which the HMAC signature covers.
 */
export async function POST(request) {
  const raw = await request.text()
  const valid = cashfree.verifyWebhook(raw, request.headers.get('x-webhook-timestamp'), request.headers.get('x-webhook-signature'))
  if (!valid) return json({ error: 'Invalid signature' }, 401)

  let orderId
  try { orderId = JSON.parse(raw)?.data?.order?.order_id } catch { return json({ error: 'Invalid JSON' }, 400) }

  try {
    // Re-fetch from the gateway rather than trusting the payload's status; sync is idempotent.
    if (orderId) await syncWithGateway(orderId)
  } catch (err) {
    if (err.status === 404) return json({ ok: true, ignored: 'unknown order' })
    console.error(err)
    return json({ error: 'Processing failed' }, 500) // non-2xx → Cashfree retries
  }
  return json({ ok: true })
}
