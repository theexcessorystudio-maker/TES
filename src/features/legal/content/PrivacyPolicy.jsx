import { Link } from 'react-router-dom'
import { BUSINESS } from '../../../config/site'
import { policyPath } from '../policies'
import { PolicySection } from '../PolicySection/PolicySection'
import { Callout } from '../Callout/Callout'

export default function PrivacyPolicy() {
  return (
    <>
      <PolicySection id="overview" title="Overview">
        <p>
          {BUSINESS.name} (“we”, “us”) respects your privacy. This policy explains what personal information we collect when you visit our website or place an order,
          how we use it, and the choices you have. We handle your information in line with applicable Indian law, including the Digital Personal Data Protection Act, 2023.
        </p>
        <Callout tone="success" title="The short version">
          We collect only what we need to deliver your order and support you. We never sell your data, and we never see or store your card details.
        </Callout>
      </PolicySection>

      <PolicySection id="what-we-collect" title="Information we collect">
        <ul>
          <li><strong>Order details:</strong> your name, email, phone number, delivery address and any order note you add at checkout.</li>
          <li><strong>Account details:</strong> if you sign in with Google, we receive your name, email address and profile photo. We never see your Google password.</li>
          <li><strong>Saved addresses and order history</strong>, if you choose to save them to your account.</li>
          <li><strong>Reviews:</strong> your rating, review text and display name. Reviews are public.</li>
          <li><strong>Messages</strong> you send us on WhatsApp, email or Instagram.</li>
          <li><strong>Browser storage:</strong> your cart is saved on your device so it’s still there when you come back.</li>
        </ul>
      </PolicySection>

      <PolicySection id="payments" title="Payment information">
        <p>
          Payments are processed securely by <strong>Cashfree Payments</strong>, a PCI DSS compliant payment gateway. Your card number, UPI PIN and banking credentials
          are entered on Cashfree’s secure page and never reach us. We only receive the payment status and a transaction reference.
        </p>
      </PolicySection>

      <PolicySection id="how-we-use" title="How we use your information">
        <ul>
          <li>To process, pack and deliver your order, and share delivery updates.</li>
          <li>To answer your questions and handle replacements, refunds and claims.</li>
          <li>To let verified buyers review products, and to show those reviews.</li>
          <li>To prevent fraud and keep the store secure.</li>
          <li>To keep the records we need for accounting and tax purposes.</li>
        </ul>
        <p>We don’t send you marketing messages unless you’ve asked to hear from us.</p>
      </PolicySection>

      <PolicySection id="sharing" title="Who we share it with">
        <p>We share only the information each service needs to do its job:</p>
        <ul>
          <li><strong>Cashfree Payments</strong>, to process your payment.</li>
          <li><strong>Courier partners</strong>: your name, phone number and address, to deliver your order.</li>
          <li><strong>Google Firebase</strong>, which securely stores our order and account data and provides Google sign-in.</li>
          <li><strong>Vercel</strong>, which hosts this website.</li>
        </ul>
        <p>We may also disclose information when the law requires it. <strong>We never sell or rent your personal information.</strong></p>
      </PolicySection>

      <PolicySection id="storage" title="Cookies and browser storage">
        <p>
          We use your browser’s storage to remember your cart and keep you signed in. We don’t use advertising or tracking cookies. Our payment partner may set its
          own cookies on its payment page to process your payment securely.
        </p>
      </PolicySection>

      <PolicySection id="retention" title="How long we keep it">
        <p>
          We keep order records for as long as we need them to fulfil orders, handle claims and meet legal and tax obligations. Account details and saved addresses are
          kept until you delete them or ask us to delete your account.
        </p>
      </PolicySection>

      <PolicySection id="security" title="How we protect it">
        <p>
          The website is served over an encrypted HTTPS connection. Access to customer data is restricted to authorised staff, and our database rules ensure customers
          can see only their own orders and addresses.
        </p>
      </PolicySection>

      <PolicySection id="your-rights" title="Your choices and rights">
        <ul>
          <li>You can check out as a guest, without creating an account.</li>
          <li>You can view, edit or delete saved addresses anytime under <Link to="/account">My account</Link>.</li>
          <li>You can edit or delete your reviews.</li>
          <li>You can ask us for a copy of your information, ask us to correct it, or ask us to delete your account and personal data, subject to records we must keep by law.</li>
        </ul>
        <p>To make a request, <Link to={policyPath('contact')}>contact us</Link>.</p>
      </PolicySection>

      <PolicySection id="children" title="Children">
        <p>Our store is meant for adults. If you’re under 18, please place orders with a parent or guardian.</p>
      </PolicySection>

      <PolicySection id="changes" title="Changes to this policy">
        <p>We may update this policy from time to time. The “Last updated” date at the top shows when it last changed.</p>
      </PolicySection>
    </>
  )
}
