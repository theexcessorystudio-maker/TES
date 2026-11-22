import { Marquee } from '../../../components/ui'
import { MARQUEE_MIDDLE } from '../../../config/site'
import { Hero } from '../Hero/Hero'
import { Testimonials } from '../Testimonials/Testimonials'
import { Faq } from '../Faq/Faq'
import { ShopSection } from '../../catalog/ShopSection/ShopSection'

export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee items={MARQUEE_MIDDLE} label="Why you’ll love our jewellery" speed={40} />
      <ShopSection />
      <Testimonials />
      <Faq />
    </>
  )
}
