import { auth } from './firebase'

/** JSON client for our Vercel functions. Attaches the Firebase ID token when a customer is signed in. */
export async function apiPost(path, body) {
  const headers = { 'content-type': 'application/json' }
  const token = await auth.currentUser?.getIdToken().catch(() => null)
  if (token) headers.authorization = `Bearer ${token}`

  const res = await fetch(`/api/${path}`, { method: 'POST', headers, body: JSON.stringify(body ?? {}) })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || 'Something went wrong. Please try again.')
  return data
}
