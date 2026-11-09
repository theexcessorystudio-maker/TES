import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { onAuthStateChanged, signInWithPopup, signInWithEmailAndPassword, signOut as fbSignOut } from 'firebase/auth'
import { auth, googleProvider } from '../lib/firebase'
import { ADMIN_EMAILS } from '../config/site'
import { claimGuestOrders } from '../services/orders'

const AuthContext = createContext(null)

const isGoogleUser = (u) => u?.providerData.some((p) => p.providerId === 'google.com')

/**
 * Admin = email listed in VITE_ADMIN_EMAILS. If that variable is not set, fall back to the
 * original behaviour (email/password accounts are admins) so existing setups keep working.
 */
const computeIsAdmin = (u) => {
  if (!u?.email) return false
  if (ADMIN_EMAILS.length) return ADMIN_EMAILS.includes(u.email.toLowerCase())
  return u.providerData.some((p) => p.providerId === 'password')
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined) // undefined = still resolving

  useEffect(() => onAuthStateChanged(auth, (u) => {
    setUser(u)
    // Link any guest orders placed with this Google email (once per browser session).
    const flag = u && `tes_claimed_${u.uid}`
    if (u && isGoogleUser(u) && !sessionStorage.getItem(flag)) {
      claimGuestOrders().then(() => sessionStorage.setItem(flag, '1')).catch(() => {})
    }
  }), [])

  const signInWithGoogle = useCallback(() => signInWithPopup(auth, googleProvider), [])
  const signInWithPassword = useCallback((email, password) => signInWithEmailAndPassword(auth, email, password), [])
  const signOut = useCallback(() => fbSignOut(auth), [])

  const value = useMemo(() => ({
    user: user ?? null,
    loading: user === undefined,
    isAdmin: computeIsAdmin(user),
    signInWithGoogle, signInWithPassword, signOut,
  }), [user, signInWithGoogle, signInWithPassword, signOut])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
