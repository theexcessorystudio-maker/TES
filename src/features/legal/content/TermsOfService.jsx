import { Link } from 'react-router-dom'
import { BUSINESS } from '../../../config/site'
import { POLICY } from '../../../config/policies'
import { formatMoney } from '../../../lib/format'
import { policyPath } from '../policies'
import { PolicySection } from '../PolicySection/PolicySection'

export default function TermsOfService() {
  return (
    <>
      <PolicySection id="agreement" title="About these terms">
        <p>
          These terms apply to your use of this website and to any order you place with {BUSINESS.name}. By using the website or placing an order, you agree to these
          terms, our <Link to={policyPath('privacy')}>Privacy Policy</Link>, our <Link to={policyPath('shipping')}>Shipping Policy</Link> and our{' '}
          <Link to={policyPath('returns')}>Returns, Replacements &amp; Refunds</Link> policy.
        </p>
      </PolicySection>

      <PolicySection id="products" title="Products">
        <ul>
          <li>We do our best to show every piece accurately. Colours can look slightly different depending on your screen and the lighting.</li>
          <li>Measurements and sizes are approximate. For rings, please use the size guide on the product page.</li>
          <li>Products are subject to availability. Stock is confirmed at the moment you pay.</li>
        </ul>
      </PolicySection>

      <PolicySection id="pricing" title="Prices and payment">
        <ul>
          <li>Prices are in Indian Rupees (₹). A flat delivery fee of {formatMoney(POLICY.deliveryFee)} is added to every order and shown before you pay.</li>
          <li>Prices and offers may change without notice. The price you see at checkout is the price you pay.</li>
          <li>Payments are processed securely by Cashfree Payments. Your order is confirmed only after your payment succeeds.</li>
          <li>If a product is listed at an obviously incorrect price because of an error, we may cancel the order and refund you in full.</li>
        </ul>
      </PolicySection>

      <PolicySection id="orders" title="Orders">
        <p>
          We may decline or cancel an order, for example if an item is out of stock or we suspect fraud. If we cancel an order you’ve paid for, we refund you in full.
          For cancellations you request, see our <Link to={`${policyPath('returns')}#cancellations`}>cancellation terms</Link>.
        </p>
      </PolicySection>

      <PolicySection id="accounts" title="Accounts">
        <p>
          You can shop as a guest or sign in with Google. If you sign in, you’re responsible for activity on your account and for keeping your Google account secure.
        </p>
      </PolicySection>

      <PolicySection id="reviews" title="Reviews">
        <p>
          Only customers who have bought a product can review it. Reviews must be honest and about the product. We may remove reviews that are abusive, offensive,
          off-topic or contain personal information.
        </p>
      </PolicySection>

      <PolicySection id="care" title="Product care">
        <p>
          Fashion jewellery and accessories last longer when kept away from water, perfume and chemicals, and stored dry. Wear and changes in finish caused by use are
          not manufacturing defects.
        </p>
      </PolicySection>

      <PolicySection id="ip" title="Intellectual property">
        <p>
          All content on this website, including photographs, text, logos and designs, belongs to {BUSINESS.name}. Please don’t copy or reuse it without our written permission.
        </p>
      </PolicySection>

      <PolicySection id="liability" title="Limitation of liability">
        <p>
          To the extent the law allows, our total liability for any order is limited to the amount you paid for that order. We aren’t responsible for delays or failures
          caused by events beyond our reasonable control.
        </p>
      </PolicySection>

      <PolicySection id="law" title="Governing law">
        <p>These terms are governed by the laws of {POLICY.jurisdiction}, and any disputes are subject to the jurisdiction of the courts of {POLICY.jurisdiction}.</p>
      </PolicySection>

      <PolicySection id="changes" title="Changes and contact">
        <p>
          We may update these terms from time to time. The version on this page at the time of your order applies to that order. Questions?{' '}
          <Link to={policyPath('contact')}>Contact us</Link>.
        </p>
      </PolicySection>
    </>
  )
}
