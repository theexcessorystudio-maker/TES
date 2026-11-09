import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { LogOut, Package, User } from 'lucide-react'
import { useAuth } from '../../../context/AuthContext'
import { useToast } from '../../../context/ToastContext'
import { GoogleButton } from '../GoogleButton/GoogleButton'
import styles from './AccountMenu.module.css'

export function AccountMenu() {
  const { user, loading, signOut } = useAuth()
  const { notify } = useToast()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    const onDown = (e) => { if (!ref.current?.contains(e.target)) setOpen(false) }
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('pointerdown', onDown); document.removeEventListener('keydown', onKey) }
  }, [open])

  if (loading) return <span className={styles.placeholder} aria-hidden="true" />
  if (!user) return <GoogleButton compact />

  return (
    <div className={styles.menu} ref={ref}>
      <button type="button" className={styles.trigger} onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-haspopup="menu" aria-label="Account menu">
        {user.photoURL ? <img src={user.photoURL} alt="" referrerPolicy="no-referrer" /> : <User size={18} />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div role="menu" className={styles.dropdown} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }}>
            <p className={styles.who}><b>{user.displayName || 'Signed in'}</b><span>{user.email}</span></p>
            <Link role="menuitem" to="/account" onClick={() => setOpen(false)}><Package size={16} /> Orders & addresses</Link>
            <button role="menuitem" type="button" onClick={async () => { setOpen(false); await signOut(); notify('Signed out') }}><LogOut size={16} /> Sign out</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
