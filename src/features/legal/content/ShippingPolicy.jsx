import { Link } from 'react-router-dom'
import { Clock, MapPin, PackageCheck, Truck } from 'lucide-react'
import { POLICY } from '../../../config/policies'
import { formatMoney } from '../../../lib/format'
import { policyPath } from '../policies'
import { PolicySection } from '../PolicySection/PolicySection'
import { Callout } from '../Callout/Callout'
import { KeyFacts } from '../KeyFacts/KeyFacts'

export default function ShippingPolicy() {
  const fee = formatMoney(POLICY.deliveryFee)
  return (
    <>
      <KeyFacts items={[
        { icon: Truck, title: `${fee} flat delivery`, text: 'One simple delivery fee on every order.' },
        { icon: PackageCheck, title: `Dispatched in ${POLICY.dispatchTime}`, text: 'Quality checked and securely packed.' },
        { icon: Clock, title: `Delivered in ${POLICY.deliveryTime}`, text: 'After dispatch, for most locations.' },
        { icon: MapPin, title: 'Shipping across India', text: 'With tracking details for every order.' },
      ]} />

      <PolicySection id="charges" title="Delivery charges">
        <p>
          A flat delivery fee of <strong>{fee}</strong> applies to every order, whatever its size or value. The fee is shown in your cart and at checkout, before you pay.
        </p>
      </PolicySection>

      <PolicySection id="dispatch" title="Processing and dispatch">
        <p>
          Orders are processed once payment is confirmed. Each piece is quality checked and packed with care, and your order is usually dispatched within{' '}
          <strong>{POLICY.dispatchTime}</strong>. Orders placed on Sundays or public holidays are processed on the next working day.
        </p>
      </PolicySection>

      <PolicySection id="delivery" title="Delivery timelines">
        <p>
          Once dispatched, most orders arrive within <strong>{POLICY.deliveryTime}</strong>. Remote locations can take longer.
        </p>
        <p>
          These are estimates, not guarantees. Courier delays, weather, local restrictions and festive-season volumes can affect delivery times. We’ll keep you informed if
          your order is delayed.
        </p>
      </PolicySection>

      <PolicySection id="where" title="Where we ship">
        <p>We currently ship to {POLICY.shipsTo}. We don’t ship internationally yet.</p>
      </PolicySection>

      <PolicySection id="tracking" title="Order tracking">
        <p>
          Once your order is dispatched, we share the courier and tracking details with you. If you signed in with Google, you can also see your order status anytime
          under <Link to="/account">My account</Link>.
        </p>
      </PolicySection>

      <PolicySection id="address" title="Delivery address">
        <p>
          Please check your delivery address and phone number carefully at checkout. If an order is returned to us because of an incorrect address or an unsuccessful
          delivery attempt, re-shipping costs another {fee} delivery fee.
        </p>
      </PolicySection>

      <PolicySection id="on-arrival" title="When your parcel arrives">
        <Callout tone="warning" title="Record your unboxing">
          Always record a continuous 360° video while opening your parcel. Without it, we can’t accept claims for damaged or wrong items.{' '}
          <Link to={`${policyPath('returns')}#unboxing-video`}>See the video requirements</Link>.
        </Callout>
        <p>If the outer package looks tampered with or badly damaged, please photograph it before you accept it, and let us know straight away.</p>
      </PolicySection>
    </>
  )
}
