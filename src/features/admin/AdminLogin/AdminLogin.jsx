import { useState } from 'react'
import { motion } from 'framer-motion'
import { ShieldAlert } from 'lucide-react'
import { Button, Field } from '../../../components/ui'
import { useAuth } from '../../../context/AuthContext'
import { GoogleButton } from '../../account/GoogleButton/GoogleButton'
import styles from './AdminLogin.module.css'

export function AdminLogin() {
  const { signInWithPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true); setError('')
    try { await signInWithPassword(email, password) } catch { setError('Incorrect email or password.') }
    setBusy(false)
  }

  return (
    <div className={styles.page}>
      <motion.form className={styles.card} onSubmit={submit} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
        <img src="/logo-circle.png" alt="" />
        <h1>Studio Admin</h1>
        <Field type="email" placeholder="Email" aria-label="Email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Field type="password" placeholder="Password" aria-label="Password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error && <p className={styles.error} role="alert">{error}</p>}
        <Button type="submit" block loading={busy}>Sign in</Button>
        <span className={styles.or}>or</span>
        <GoogleButton label="Sign in with Google" />
      </motion.form>
    </div>
  )
}

export function NotAuthorised({ email, onSignOut }) {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <ShieldAlert size={40} strokeWidth={1.4} className={styles.alert} />
        <h1>No admin access</h1>
        <p className={styles.text}><b>{email}</b> isn’t on the admin list. Sign in with an admin account.</p>
        <Button block onClick={onSignOut}>Sign out</Button>
        <Button block variant="outline" to="/">Back to the store</Button>
      </div>
    </div>
  )
}
