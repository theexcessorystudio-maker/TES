import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Package, UserRound } from 'lucide-react'
import { PageSpinner } from '../../../components/ui'
import { useAuth } from '../../../context/AuthContext'
import { useAddresses, useCustomerOrders } from '../../../hooks/useCustomerData'
import { cx } from '../../../lib/format'
import { GoogleButton } from '../GoogleButton/GoogleButton'
import { OrderHistory } from '../OrderHistory/OrderHistory'
import { AddressBook } from '../AddressBook/AddressBook'
import styles from './AccountPage.module.css'

const TABS = [
  { id: 'orders', label: 'Orders', icon: Package },
  { id: 'addresses', label: 'Addresses', icon: MapPin },
]

export default function AccountPage() {
  const { user, loading } = useAuth()
  const [tab, setTab] = useState('orders')
  const orders = useCustomerOrders(user?.uid)
  const addresses = useAddresses(user?.uid)

  if (loading) return <PageSpinner />
  if (!user) {
    return (
      <div className={styles.page}>
        <div className={styles.signin}>
          <UserRound size={34} strokeWidth={1.4} />
          <h1>Your account</h1>
          <p>Sign in with Google to see your orders, manage saved addresses and review pieces you’ve bought.</p>
          <GoogleButton />
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <header className={styles.profile}>
        {user.photoURL ? <img src={user.photoURL} alt="" referrerPolicy="no-referrer" /> : <span className={styles.initial}>{user.displayName?.[0] || '?'}</span>}
        <div><h1>Hi, {user.displayName?.split(' ')[0] || 'there'}</h1><p>{user.email}</p></div>
      </header>

      <div className={styles.tabs} role="tablist">
        {TABS.map((t) => (
          <button key={t.id} type="button" role="tab" aria-selected={tab === t.id} className={cx(styles.tab, tab === t.id && styles.active)} onClick={() => setTab(t.id)}>
            {tab === t.id && <motion.span layoutId="account-tab" className={styles.indicator} />}
            <span className={styles.tabLabel}><t.icon size={16} /> {t.label}</span>
          </button>
        ))}
      </div>

      <section role="tabpanel" className={styles.panel}>
        {tab === 'orders'
          ? <OrderHistory orders={orders.data} loading={orders.loading} />
          : <AddressBook uid={user.uid} addresses={addresses.data} loading={addresses.loading} />}
      </section>
    </div>
  )
}
