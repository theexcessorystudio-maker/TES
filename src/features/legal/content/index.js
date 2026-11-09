import ContactUs from './ContactUs'
import ShippingPolicy from './ShippingPolicy'
import ReturnsPolicy from './ReturnsPolicy'
import PrivacyPolicy from './PrivacyPolicy'
import TermsOfService from './TermsOfService'

/** Page content per policy slug (see ../policies.js). Bundled together in the lazy legal chunk. */
export const POLICY_CONTENT = {
  contact: ContactUs,
  shipping: ShippingPolicy,
  returns: ReturnsPolicy,
  privacy: PrivacyPolicy,
  terms: TermsOfService,
}
