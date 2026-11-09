import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'
import { getAuth } from 'firebase-admin/auth'

function credential() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) return cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT))
  const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } = process.env
  if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY) {
    throw new Error('Firebase Admin is not configured: set FIREBASE_SERVICE_ACCOUNT or FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY')
  }
  return cert({ projectId: FIREBASE_PROJECT_ID, clientEmail: FIREBASE_CLIENT_EMAIL, privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') })
}

const app = getApps()[0] ?? initializeApp({ credential: credential() })

export const adminDb = getFirestore(app)
export const adminAuth = getAuth(app)
export { FieldValue }
