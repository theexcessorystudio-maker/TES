import { Link } from 'react-router-dom'
import { BadgeCheck, Clock, Video } from 'lucide-react'
import { POLICY } from '../../../config/policies'
import { BUSINESS, INSTAGRAM_URL } from '../../../config/site'
import { policyPath } from '../policies'
import { PolicySection } from '../PolicySection/PolicySection'
import { Callout } from '../Callout/Callout'
import { KeyFacts } from '../KeyFacts/KeyFacts'

export default function ReturnsPolicy() {
  const claimWindow = `${POLICY.claimWindowHours} hours`

  return (
    <>
      <KeyFacts items={[
        { icon: Video, title: '360° unboxing video required', text: 'One continuous video, from the sealed package to the product.' },
        { icon: BadgeCheck, title: 'Free replacement', text: 'When an item arrives damaged or is not what you ordered.' },
        { icon: Clock, title: `Report within ${claimWindow}`, text: `Inform within ${claimWindow} of delivery with your order number and video.` },
      ]} />

      <PolicySection id="all-orders-final" title="All orders are final">
        <p>
          Every piece is quality-checked before it leaves the studio. Since we curate in small batches, we ask you to shop with care. All orders are final, and we
          don’t offer returns, refunds or size exchanges.
        </p>
        <p>Not sure about your ring size? Please check our <Link to={policyPath('ring-size')}>Ring Size Guide</Link> before you order.</p>
      </PolicySection>

      <PolicySection id="wrong-or-defective" title="Wrong or defective piece? We will replace it, free of charge.">
        <p>
          Message us on {INSTAGRAM_URL ? <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer">Instagram</a> : 'Instagram'} or{' '}
          {BUSINESS.email ? <a href={`mailto:${BUSINESS.email}`}>email</a> : 'email'} within <strong>{claimWindow} of delivery</strong> with:
        </p>
        <ul>
          <li>your order details</li>
          <li>a clear 360 degree uncut unboxing video showing the issue</li>
          <li>a short note on what went wrong</li>
        </ul>
        <p>Once verified, we will arrange the pickup and send your replacement at no extra cost.</p>
        <p>Sale items are final and non-exchangeable, unless wrong or defective.</p>
        <Callout tone="info">Tip: please record your unboxing. It helps us resolve your concern faster.</Callout>
      </PolicySection>

      <PolicySection id="eligibility" title="When we replace or refund">
        <p>Every piece is checked before it leaves the studio. We accept a return or replacement only if:</p>
        <ul>
          <li><strong>The item arrived damaged</strong>: broken, bent, or damaged in transit.</li>
          <li><strong>You received the wrong item</strong>: a different product, colour or size from the one on your order.</li>
        </ul>
        <p>We don’t accept returns for change of mind or personal preference.</p>
      </PolicySection>

      <PolicySection id="unboxing-video" title="The 360° unboxing video">
        <Callout tone="warning" title="No unboxing video, no claim.">
          We can only accept a damage or wrong-item claim with a complete unboxing video. Please start recording <em>before</em> you open the parcel.
        </Callout>
        <p>For your video to be accepted, it must:</p>
        <ul>
          <li>Be <strong>one continuous recording</strong>, with no cuts, pauses or edits.</li>
          <li>Start with the <strong>sealed package</strong>, turned through a full <strong>360°</strong> so every side, the seal and the shipping label are clearly visible.</li>
          <li>Show the package being opened on camera.</li>
          <li>Show the product clearly from all angles, including the damage or the mismatch with your order.</li>
        </ul>
        <p>Please keep the product and its original packaging safe until your claim is resolved.</p>
      </PolicySection>

      <PolicySection id="how-to-claim" title="How to raise a claim">
        <ol>
          <li>Within <strong>{claimWindow} of delivery</strong>, message us on WhatsApp (or <Link to={policyPath('contact')}>any of our contact channels</Link>) with your order number.</li>
          <li>Send your 360° unboxing video and a few clear photos of the issue.</li>
          <li>We review every claim within 2 business days and confirm the next steps.</li>
          <li>Once your claim is approved, we arrange the return of the item and send your replacement.</li>
        </ol>
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
          <li>Orders cannot be cancelled once placed.</li>
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
