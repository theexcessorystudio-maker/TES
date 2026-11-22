import { Link } from 'react-router-dom'
import { Users } from 'lucide-react'
import { Button } from '../../../components/ui'
import { BUSINESS, WHATSAPP_COMMUNITY } from '../../../config/site'
import { POLICY } from '../../../config/policies'
import { policyPath } from '../policies'
import { PolicySection } from '../PolicySection/PolicySection'
import { ContactCards } from '../ContactCards/ContactCards'

export default function ContactUs() {
  return (
    <>
      <PolicySection id="say-hi" title="Get in touch">
        <p>
          Whether you have a question, need help with an order, or just want to say hi, we would love to hear from you.
        </p>
      </PolicySection>

      <ContactCards />

      <PolicySection id="community" title="Join our WhatsApp community">
        <p>Join our WhatsApp community for first looks and launch-day reminders.</p>
        {WHATSAPP_COMMUNITY && (
          <div><Button href={WHATSAPP_COMMUNITY} target="_blank" rel="noreferrer"><Users size={17} /> Join the community</Button></div>
        )}
      </PolicySection>

      <PolicySection id="report-issue" title="Received a damaged or wrong item?">
        <p>
          Message us within <strong>{POLICY.claimWindowHours} hours of delivery</strong> with your order number and your 360° unboxing video. Read the full{' '}
          <Link to={policyPath('returns')}>refund and cancellation policy</Link>.
        </p>
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
