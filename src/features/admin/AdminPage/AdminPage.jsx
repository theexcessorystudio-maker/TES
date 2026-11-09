import { PageSpinner } from '../../../components/ui'
import { useAuth } from '../../../context/AuthContext'
import { AdminLogin, NotAuthorised } from '../AdminLogin/AdminLogin'
import { AdminShell } from '../AdminShell/AdminShell'

/** Gatekeeper: loading → login → not-authorised → dashboard. Firestore rules are the real enforcement. */
export default function AdminPage() {
  const { user, loading, isAdmin, signOut } = useAuth()
  if (loading) return <PageSpinner />
  if (!user) return <AdminLogin />
  if (!isAdmin) return <NotAuthorised email={user.email} onSignOut={signOut} />
  return <AdminShell />
}
