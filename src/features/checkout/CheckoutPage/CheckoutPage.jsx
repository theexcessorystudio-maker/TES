import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Lock, ShieldCheck, ShoppingBag } from 'lucide-react'
import { Button, Checkbox, Field, PageSpinner } from '../../../components/ui'
import { useAuth } from '../../../context/AuthContext'
import { useCart } from '../../../context/cart/CartContext'
import { useCatalog } from '../../../context/CatalogContext'
import { useToast } from '../../../context/ToastContext'
import { useAddresses } from '../../../hooks/useCustomerData'
import { createCheckout } from '../../../services/orders'
import { addAddress, isSameAddress } from '../../../services/addresses'
import { redirectToPayment } from '../../../lib/payments'
import { formatMoney } from '../../../lib/format'
import { GoogleButton } from '../../account/GoogleButton/GoogleButton'
import { AddressFields } from '../../address/AddressFields/AddressFields'
import { AddressCard } from '../../address/AddressCard/AddressCard'
import { EMPTY_ADDRESS, validateAddress } from '../../address/validation'
import { CheckoutSection } from '../CheckoutSection/CheckoutSection'
import { OrderSummary } from '../OrderSummary/OrderSummary'
import styles from './CheckoutPage.module.css'
import { policyPath } from '../../legal/policies'

export const PENDING_ORDER_KEY = 'tes_pending_order'
const NEW = 'new'

export default function CheckoutPage() {
  const { user, loading: authLoading } = useAuth()
  const { loading: catalogLoading } = useCatalog()
  const cart = useCart()
  const { notify } = useToast()
  const { data: saved } = useAddresses(user?.uid)

  const [email, setEmail] = useState('')
  const [form, setForm] = useState(EMPTY_ADDRESS)
  const [selectedId, setSelectedId] = useState(NEW)
  const [saveAddress, setSaveAddress] = useState(true)
  const [note, setNote] = useState('')
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState('')

  // Prefill from the Google profile and default saved address.
  useEffect(() => {
    if (!user) return
    setEmail((e) => e || user.email || '')
    setForm((f) => (f.name ? f : { ...f, name: user.displayName || '' }))
  }, [user])
  useEffect(() => {
    if (saved.length && selectedId === NEW && !form.line1) setSelectedId(saved[0].id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saved])

  const selected = useMemo(() => saved.find((a) => a.id === selectedId), [saved, selectedId])
  const shipping = selected || form

  if (authLoading || catalogLoading) return <PageSpinner />

  if (!cart.liveLines.length) {
    return (
      <div className={styles.empty}>
        <ShoppingBag size={36} strokeWidth={1.4} />
        <h1>Your cart is empty</h1>
        <p>Add something you love, then come back to check out.</p>
        <Button to="/#shop">Browse the collection</Button>
      </div>
    )
  }

  const patch = (p) => { setForm((f) => ({ ...f, ...p })); setErrors((e) => { const n = { ...e }; Object.keys(p).forEach((k) => delete n[k]); return n }) }

  const submit = async (e) => {
    e.preventDefault()
    setServerError('')
    const found = validateAddress({ ...shipping, email }, { requireEmail: true })
    setErrors(found)
    if (Object.keys(found).length) {
      requestAnimationFrame(() => document.querySelector('[aria-invalid="true"]')?.focus())
      return
    }
    setSubmitting(true)
    try {
      const phone = shipping.phone.replace(/\D/g, '').slice(-10)
      const { orderId, paymentSessionId } = await createCheckout({
        customer: { name: shipping.name, email, phone },
        address: { line1: shipping.line1, line2: shipping.line2, city: shipping.city, state: shipping.state, pincode: shipping.pincode },
        items: cart.liveLines.map((l) => ({ id: l.product.id, size: l.size, qty: l.qty })),
        note,
      })
      if (user && !selected && saveAddress && !saved.some((a) => isSameAddress(a, form))) {
        await addAddress(user.uid, { ...form, phone }, saved.length === 0).catch(() => {})
      }
      sessionStorage.setItem(PENDING_ORDER_KEY, orderId)
      await redirectToPayment(paymentSessionId)
    } catch (err) {
      setServerError(err.message)
      notify(err.message, { tone: 'error' })
      setSubmitting(false)
    }
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Checkout</h1>
        <p><Lock size={14} /> Secure payment by Cashfree · UPI, cards, netbanking & wallets</p>
      </header>

      <form className={styles.layout} onSubmit={submit} noValidate>
        <div className={styles.main}>
          {!user && (
            <div className={styles.express}>
              <div>
                <b>Have an account?</b>
                <p>Sign in to use saved addresses, track orders and review your purchases. Or just continue as a guest.</p>
              </div>
              <GoogleButton />
            </div>
          )}

          <CheckoutSection step={1} title="Contact">
            <Field label="Email" type="email" autoComplete="email" value={email} onChange={(e) => { setEmail(e.target.value); setErrors((x) => ({ ...x, email: undefined })) }}
              error={errors.email} hint="(for your order confirmation)" />
          </CheckoutSection>

          <CheckoutSection step={2} title="Delivery address">
            {saved.length > 0 && (
              <div className={styles.saved} role="radiogroup" aria-label="Saved addresses">
                {saved.map((a) => <AddressCard key={a.id} address={a} selectable selected={selectedId === a.id} onSelect={() => setSelectedId(a.id)} />)}
                <label className={styles.newOption}>
                  <input type="radio" name="saved-address" checked={selectedId === NEW} onChange={() => setSelectedId(NEW)} /> Use a new address
                </label>
              </div>
            )}
            {selectedId === NEW && (
              <>
                <AddressFields value={form} onChange={patch} errors={errors} />
                {user && <Checkbox label="Save this address to my account" checked={saveAddress} onChange={(e) => setSaveAddress(e.target.checked)} />}
              </>
            )}
            {selected && Object.keys(errors).length > 0 && <p className={styles.error}>This saved address is incomplete. Please edit it in your account or use a new address.</p>}
          </CheckoutSection>

          <CheckoutSection step={3} title="Anything else?">
            <Field as="textarea" rows={2} label="Order note" hint="(optional — gift message, delivery instructions)" maxLength={500} value={note} onChange={(e) => setNote(e.target.value)} />
          </CheckoutSection>
        </div>

        <OrderSummary lines={cart.liveLines} subtotal={cart.subtotal} savings={cart.savings} shipping={cart.shipping} total={cart.total}
          footer={(
            <div className={styles.pay}>
              {serverError && <p className={styles.error} role="alert">{serverError}</p>}
              <Button type="submit" block size="lg" loading={submitting}><Lock size={17} /> Pay {formatMoney(cart.total)}</Button>
              <p className={styles.assure}><ShieldCheck size={14} /> You’ll be taken to Cashfree’s secure page to pay. Prices and stock are confirmed before payment.</p>
              <p className={styles.agree}>
                By placing this order you agree to our <Link to={policyPath('terms')}>Terms</Link>, <Link to={policyPath('returns')}>Returns &amp; Replacement policy</Link> and{' '}
                <Link to={policyPath('privacy')}>Privacy Policy</Link>.
              </p>
              <Link to="/" className={styles.back}>← Continue shopping</Link>
            </div>
          )}
        />
      </form>
    </div>
  )
}
