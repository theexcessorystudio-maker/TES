import { EMAIL_RE, PHONE_RE, PINCODE_RE } from '../../../shared/commerce'

export const EMPTY_ADDRESS = { name: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '' }

/** Returns a map of field → message. Empty object means valid. Mirrors the API's checks. */
export function validateAddress(a, { requireEmail = false } = {}) {
  const e = {}
  if ((a.name || '').trim().length < 2) e.name = 'Enter the recipient’s full name'
  if (!PHONE_RE.test((a.phone || '').replace(/\D/g, '').slice(-10))) e.phone = 'Enter a valid 10-digit mobile number'
  if (requireEmail && !EMAIL_RE.test((a.email || '').trim())) e.email = 'Enter a valid email address'
  if (!(a.line1 || '').trim()) e.line1 = 'Enter your house / flat and street'
  if (!(a.city || '').trim()) e.city = 'Enter your city'
  if (!a.state) e.state = 'Choose your state'
  if (!PINCODE_RE.test((a.pincode || '').trim())) e.pincode = 'Enter a valid 6-digit PIN code'
  return e
}

export const formatAddress = (a) => [a.line1, a.line2, `${a.city}, ${a.state} ${a.pincode}`].filter(Boolean).join(', ')
