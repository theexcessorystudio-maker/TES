import crypto from 'node:crypto'

const API_VERSION = '2023-08-01'
const isProd = process.env.CASHFREE_ENV === 'production'
const BASE_URL = isProd ? 'https://api.cashfree.com/pg' : 'https://sandbox.cashfree.com/pg'

function credentials() {
  const id = process.env.CASHFREE_APP_ID
  const secret = process.env.CASHFREE_SECRET_KEY
  if (!id || !secret) throw new Error('Cashfree is not configured: set CASHFREE_APP_ID and CASHFREE_SECRET_KEY')
  return { id, secret }
}

async function request(path, { method = 'GET', body } = {}) {
  const { id, secret } = credentials()
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { 'x-client-id': id, 'x-client-secret': secret, 'x-api-version': API_VERSION, 'content-type': 'application/json', accept: 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = new Error(`Cashfree ${method} ${path} failed (${res.status}): ${data.message || 'unknown error'}`)
    err.gateway = data
    throw err
  }
  return data
}

/** Thin gateway adapter: the rest of the API never talks to Cashfree directly. */
export const cashfree = {
  createOrder: (payload) => request('/orders', { method: 'POST', body: payload }),
  getOrder: (orderId) => request(`/orders/${encodeURIComponent(orderId)}`),
  getPayments: (orderId) => request(`/orders/${encodeURIComponent(orderId)}/payments`),

  /** Cashfree signs webhooks as base64(HMAC-SHA256(timestamp + rawBody, secretKey)). */
  verifyWebhook(rawBody, timestamp, signature) {
    if (!rawBody || !timestamp || !signature) return false
    const expected = crypto.createHmac('sha256', credentials().secret).update(timestamp + rawBody).digest('base64')
    const a = Buffer.from(expected), b = Buffer.from(signature)
    return a.length === b.length && crypto.timingSafeEqual(a, b)
  },
}
