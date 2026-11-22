import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Package, Search } from 'lucide-react'
import { Button, Field, FieldRow } from '../../../components/ui'
import { useAuth } from '../../../context/AuthContext'
import { useDocumentTitle } from '../../../hooks/useDocumentTitle'
import { lookupOrder } from '../../../services/orders'
import { GoogleButton } from '../../account/GoogleButton/GoogleButton'
import { policyPath } from '../../legal/policies'
import styles from './TrackOrderPage.module.css'

/**
 * Order lookup. Signed-in shoppers see every order in My Account; guests enter their order ID
 * (TES-XXXXXX, shown on the order page) together with the phone number used at checkout.
 */
export default function TrackOrderPage() {
  useDocumentTitle('Track your order')
  const { user } = useAuth()
  const navigate = useNavigate()
  const [orderRef, setOrderRef] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    if (!/^\s*TES-[A-Z0-9]+/i.test(orderRef)) return setError('Please enter your order ID, e.g. TES-M3X9K2.')
    if (phone.replace(/\D/g, '').length < 10) return setError('Please enter the 10-digit phone number you used at checkout.')
    setBusy(true)
    setError('')
    try {
      const order = await lookupOrder(orderRef, phone)
      navigate(`/order/${order.orderId}`)
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>Orders</p>
        <h1 className={styles.title}>Track your order</h1>
        <p className={styles.summary}>See your order status and, once it ships, your AWB (tracking) number.</p>
      </header>

      <div className={styles.cards}>
        <section className={styles.card}>
          <span className={styles.icon}><Package size={20} /></span>
          <h2>Signed in with Google?</h2>
          <p>All your orders and their status are in My Account.</p>
          {user ? <Button to="/account">Go to My Account</Button> : <GoogleButton onSignedIn={() => navigate('/account')} />}
        </section>

        <section className={styles.card}>
          <span className={styles.icon}><Search size={20} /></span>
          <h2>Checked out as a guest?</h2>
          <p>Enter your order ID and the phone number you used at checkout.</p>
          <form onSubmit={submit} className={styles.form}>
            <FieldRow>
              <Field label="Order ID" value={orderRef} onChange={(e) => { setOrderRef(e.target.value); setError('') }}
                placeholder="TES-M3X9K2" autoComplete="off" spellCheck={false} autoCapitalize="characters" />
              <Field label="Phone number" type="tel" inputMode="numeric" value={phone} onChange={(e) => { setPhone(e.target.value); setError('') }}
                placeholder="10-digit mobile" autoComplete="tel-national" maxLength={14} />
            </FieldRow>
            {error && <p className={styles.error} role="alert">{error}</p>}
            <Button type="submit" loading={busy}>View my order</Button>
          </form>
        </section>
      </div>

      <p className={styles.help}>
        Can’t find your order ID? It’s on the page you saw after paying. Or <Link to={policyPath('contact')}>contact us</Link> with your name and phone number and we’ll look it up for you.
      </p>
    </div>
  )
}
