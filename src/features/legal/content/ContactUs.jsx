import { Link } from 'react-router-dom'
import { MessageCircle } from 'lucide-react'
import { Button } from '../../../components/ui'
import { BUSINESS } from '../../../config/site'
import { POLICY } from '../../../config/policies'
import { replacementRequest, waLink } from '../../../config/whatsapp'
import { policyPath } from '../policies'
import { PolicySection } from '../PolicySection/PolicySection'
import { ContactCards } from '../ContactCards/ContactCards'

export default function ContactUs() {
  return (
    <>
      <ContactCards />

      <PolicySection id="order-help" title="Help with an order">
        <p>
          Please include your <strong>order number</strong> (it starts with <strong>TES-</strong>) so we can help you quickly. You’ll find it on your order confirmation page
          and, if you signed in with Google, under <Link to="/account">My account</Link>.
        </p>
      </PolicySection>

      <PolicySection id="report-issue" title="Received a damaged or wrong item?">
        <p>
          Message us within <strong>{POLICY.claimWindowHours} hours of delivery</strong> with your order number and your 360° unboxing video. Read the full{' '}
          <Link to={policyPath('returns')}>returns &amp; replacement policy</Link>.
        </p>
        <div>
          <Button href={waLink(replacementRequest())} target="_blank" rel="noreferrer"><MessageCircle size={17} /> Report an issue on WhatsApp</Button>
        </div>
      </PolicySection>

      {(BUSINESS.address || BUSINESS.gstin) && (
        <PolicySection id="business" title="Business details">
          <p>
            <strong>{BUSINESS.name}</strong>
            {BUSINESS.address && <><br />{BUSINESS.address}</>}
            {BUSINESS.gstin && <><br />GSTIN: {BUSINESS.gstin}</>}
          </p>
        </PolicySection>
      )}
    </>
  )
}
