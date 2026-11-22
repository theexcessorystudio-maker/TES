import { Link } from 'react-router-dom'
import { Clock, CreditCard, PackageCheck, Truck } from 'lucide-react'
import { POLICY } from '../../../config/policies'
import { formatMoney } from '../../../lib/format'
import { policyPath } from '../policies'
import { PolicySection } from '../PolicySection/PolicySection'
import { Callout } from '../Callout/Callout'
import { KeyFacts } from '../KeyFacts/KeyFacts'

export default function ShippingPolicy() {
  const fee = formatMoney(POLICY.deliveryFee)
  const freeAbove = formatMoney(POLICY.freeShippingAbove)
  return (
    <>
      <KeyFacts items={[
        { icon: PackageCheck, title: `Dispatched in ${POLICY.dispatchTime}`, text: 'Of payment.' },
        { icon: Clock, title: `Delivered in ${POLICY.deliveryTime}`, text: 'May vary by location.' },
        { icon: Truck, title: `Free delivery above ${freeAbove}`, text: `A flat ${fee} delivery charge otherwise.` },
        { icon: CreditCard, title: 'Prepaid orders only', text: 'Checked out securely. No COD.' },
      ]} />

      <PolicySection id="delivery" title="Delivery Time">
        <ul>
          <li>Orders are dispatched within <strong>{POLICY.dispatchTime}</strong> of payment.</li>
          <li>Delivery usually takes <strong>{POLICY.deliveryTime}</strong> (may vary by location).</li>
          <li>We ship to serviceable pincodes across India through trusted courier partners.</li>
        </ul>
      </PolicySection>

      <PolicySection id="charges" title="Shipping Charges">
        <ul>
          <li>A flat <strong>{fee}</strong> delivery charge, free delivery on orders above <strong>{freeAbove}</strong>.</li>
        </ul>
      </PolicySection>

      <PolicySection id="checkout" title="Checkout">
        <p>All orders are prepaid and checked out securely (no COD).</p>
      </PolicySection>

      <PolicySection id="tracking" title="Tracking">
        <p>
          Once your order ships we send a tracking link on email and WhatsApp. You can also check anytime in <Link to="/account">My Account</Link> (sign in with Google)
          or on the <Link to="/track-order">Track order</Link> page using your order ID and phone number. Your AWB (tracking) number appears there once your order ships.
        </p>
        <p>
          Please double-check your address at checkout. If a delivery fails because of incorrect details, a re-attempt will be chargeable.
        </p>
      </PolicySection>

      <PolicySection id="on-arrival" title="When your parcel arrives">
        <Callout tone="warning" title="Record your unboxing">
          Always record a continuous 360° video while opening your parcel. Without it, we can’t accept claims for damaged or wrong items.{' '}
          <Link to={`${policyPath('returns')}#unboxing-video`}>See the video requirements</Link>.
        </Callout>
        <p>If the outer package looks tampered with or badly damaged, please photograph it before you accept it and let us know straight away.</p>
      </PolicySection>
    </>
  )
}
