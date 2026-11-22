import AboutUs from './AboutUs'
import Materials from './Materials'
import JewelleryCare from './JewelleryCare'
import RingSizeGuide from './RingSizeGuide'
import ContactUs from './ContactUs'
import ShippingPolicy from './ShippingPolicy'
import ReturnsPolicy from './ReturnsPolicy'
import PrivacyPolicy from './PrivacyPolicy'
import TermsOfService from './TermsOfService'

/** Page content per slug (see ../policies.js). Bundled together in the lazy legal chunk. */
export const POLICY_CONTENT = {
  about: AboutUs,
  materials: Materials,
  care: JewelleryCare,
  'ring-size': RingSizeGuide,
  contact: ContactUs,
  shipping: ShippingPolicy,
  returns: ReturnsPolicy,
  privacy: PrivacyPolicy,
  terms: TermsOfService,
}
