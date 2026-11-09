export class HttpError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

/**
 * Wraps a Vercel function: enforces allowed methods, serialises the return value as JSON
 * and converts thrown errors into consistent `{ error }` responses.
 */
export function createHandler(methods, fn) {
  return async (req, res) => {
    if (!methods.includes(req.method)) {
      res.setHeader('Allow', methods.join(', '))
      return res.status(405).json({ error: 'Method not allowed' })
    }
    try {
      const result = await fn(req, res)
      if (!res.headersSent) res.status(200).json(result ?? { ok: true })
    } catch (err) {
      const status = err instanceof HttpError ? err.status : 500
      if (status >= 500) console.error(err)
      if (!res.headersSent) res.status(status).json({ error: status >= 500 ? 'Something went wrong. Please try again.' : err.message })
    }
  }
}

export function jsonBody(req) {
  if (req.body && typeof req.body === 'object') return req.body
  try { return JSON.parse(req.body || '{}') } catch { throw new HttpError(400, 'Invalid JSON body') }
}

export function siteUrl(req) {
  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/$/, '')
  const proto = req.headers['x-forwarded-proto'] || 'https'
  return `${proto}://${req.headers['x-forwarded-host'] || req.headers.host}`
}
