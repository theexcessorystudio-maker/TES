import { Hero } from '../Hero/Hero'
import { TrustBar } from '../TrustBar/TrustBar'
import { HowItWorks } from '../HowItWorks/HowItWorks'
import { Testimonials } from '../Testimonials/Testimonials'
import { Faq } from '../Faq/Faq'
import { ShopSection } from '../../catalog/ShopSection/ShopSection'

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <ShopSection />
      <HowItWorks />
      <Testimonials />
      <Faq />
    </>
  )
}
