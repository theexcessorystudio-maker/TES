import { Link } from 'react-router-dom'
import { BadgeCheck, Clock, IndianRupee, Video } from 'lucide-react'
import { POLICY } from '../../../config/policies'
import { formatMoney } from '../../../lib/format'
import { policyPath } from '../policies'
import { PolicySection } from '../PolicySection/PolicySection'
import { Callout } from '../Callout/Callout'
import { KeyFacts } from '../KeyFacts/KeyFacts'

export default function ReturnsPolicy() {
  const fee = formatMoney(POLICY.replacementFee)
  const claimWindow = `${POLICY.claimWindowHours} hours`

  return (
    <>
      <KeyFacts items={[
        { icon: Video, title: '360° unboxing video required', text: 'One continuous video, from the sealed package to the product.' },
        { icon: BadgeCheck, title: 'Free replacement', text: 'When an item arrives damaged or isn’t what you ordered.' },
        { icon: Clock, title: `Report within ${claimWindow}`, text: 'Of delivery, with your order number and video.' },
        { icon: IndianRupee, title: `${fee} for other replacements`, text: 'When the item arrived correct and undamaged.' },
      ]} />

      <PolicySection id="eligibility" title="When we replace or refund">
        <p>Every piece is checked before it leaves the studio. We accept a return or replacement only if:</p>
        <ul>
          <li><strong>The item arrived damaged</strong>: broken, bent, or damaged in transit.</li>
          <li><strong>You received the wrong item</strong>: a different product, colour or size from the one on your order.</li>
        </ul>
        <p>We don’t accept returns for change of mind or personal preference.</p>
      </PolicySection>

      <PolicySection id="unboxing-video" title="The 360° unboxing video">
        <Callout tone="warning" title="No unboxing video, no claim">
          We can only accept a damage or wrong-item claim with a complete unboxing video. Please start recording <em>before</em> you open the parcel.
        </Callout>
        <p>For your video to be accepted, it must:</p>
        <ul>
          <li>Be <strong>one continuous recording</strong>, with no cuts, pauses or edits.</li>
          <li>Start with the <strong>sealed package</strong>, turned through a full <strong>360°</strong> so every side, the seal and the shipping label are clearly visible.</li>
          <li>Show the package being opened on camera.</li>
          <li>Show the product clearly from all angles, including the damage or the mismatch with your order.</li>
        </ul>
        <p>Please keep the product, its original packaging and any tags until your claim is resolved.</p>
      </PolicySection>

      <PolicySection id="how-to-claim" title="How to raise a claim">
        <ol>
          <li>Within <strong>{claimWindow} of delivery</strong>, message us on WhatsApp (or <Link to={policyPath('contact')}>any of our contact channels</Link>) with your order number.</li>
          <li>Send your 360° unboxing video and a few clear photos of the issue.</li>
          <li>We review every claim within 2 business days and confirm the next steps.</li>
          <li>Once your claim is approved, we arrange the return of the item and send your replacement.</li>
        </ol>
      </PolicySection>

      <PolicySection id="charges" title="Replacement charges">
        <ul>
          <li><strong>Damaged or wrong item: free.</strong> Once your claim is approved, we cover the full cost of the return and the replacement delivery.</li>
          <li>
            <strong>Any other replacement: {fee}.</strong> If the item arrived correct and undamaged but you’d like a replacement (for example, a different ring size),
            we may be able to help, depending on stock. A {fee} charge covers the return and re-delivery. The item must be unused and unworn, in its original packaging.
          </li>
        </ul>
        <Callout tone="info">Not sure about your ring size? Check the size guide on any ring before ordering to avoid a chargeable replacement.</Callout>
      </PolicySection>

      <PolicySection id="refunds" title="Refunds">
        <p>
          If we can’t send a replacement for an approved damage or wrong-item claim (for example, the piece is out of stock), we refund the full amount you paid,
          including the delivery fee.
        </p>
        <p>
          Refunds go to your original payment method within <strong>{POLICY.refundTime}</strong> of approval. Your bank or UPI app may take a few extra days to show the credit.
        </p>
      </PolicySection>

      <PolicySection id="cancellations" title="Cancellations">
        <ul>
          <li><strong>Before dispatch:</strong> message us with your order number and we’ll cancel your order and refund it in full.</li>
          <li><strong>After dispatch:</strong> orders can no longer be cancelled.</li>
          <li>
            If you refuse a delivery that isn’t damaged or wrong, we refund the order after it reaches us, minus the {formatMoney(POLICY.deliveryFee)} delivery fee.
          </li>
        </ul>
      </PolicySection>

      <PolicySection id="not-covered" title="What isn’t covered">
        <ul>
          <li>Claims made without a complete, unedited unboxing video.</li>
          <li>Claims raised more than {claimWindow} after delivery.</li>
          <li>Damage caused after delivery, through use, accidents or improper care.</li>
          <li>Normal wear over time, such as gradual changes in plating or finish.</li>
          <li>Small differences in colour caused by screen settings or photography lighting.</li>
        </ul>
      </PolicySection>
    </>
  )
}
