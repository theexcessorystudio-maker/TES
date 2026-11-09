import { adminAuth } from './firebaseAdmin.js'
import { HttpError } from './http.js'

/** Returns the decoded Firebase ID token, or null for guests. An invalid token is treated as a guest. */
export async function optionalUser(req) {
  const header = req.headers.authorization || ''
  if (!header.startsWith('Bearer ')) return null
  try { return await adminAuth.verifyIdToken(header.slice(7)) } catch { return null }
}

export async function requireUser(req) {
  const user = await optionalUser(req)
  if (!user) throw new HttpError(401, 'Please sign in again.')
  return user
}
