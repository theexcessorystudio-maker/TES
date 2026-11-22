import { Link } from 'react-router-dom'
import { policyPath } from '../policies'
import { PolicySection } from '../PolicySection/PolicySection'

export default function Materials() {
  return (
    <>
      <PolicySection id="pvd-gold" title="18k Gold PVD Plating">
        <p>
          Our gold finish is applied with PVD (Physical Vapour Deposition), an advanced process that bonds a layer of 18k gold to the surface of the piece at a
          molecular level. Unlike traditional plating, which sits on top and wears away, PVD fuses with the metal. That gives you:
        </p>
        <ul>
          <li>A rich, long-lasting gold finish</li>
          <li>Greater durability for daily wear</li>
          <li>Better resistance to tarnishing</li>
          <li>A piece that keeps its shine with simple care</li>
        </ul>
      </PolicySection>

      <PolicySection id="stainless-steel" title="Premium Stainless Steel Base">
        <p>Under the gold is high-grade 304 and 316L surgical steel, chosen for strength and comfort. It is:</p>
        <ul>
          <li>Rust-resistant</li>
          <li>Sweat-friendly</li>
          <li>Gentle on skin</li>
          <li>Sturdy enough to be worn daily and layered</li>
        </ul>
      </PolicySection>

      <PolicySection id="hypoallergenic" title="Hypoallergenic & Skin-Safe">
        <p>
          All our pieces are hypoallergenic and made with skin-friendly surgical steel, so they are kind to sensitive skin. No green marks, no irritation, just glow.
        </p>
      </PolicySection>

      <PolicySection id="stones" title="Pearls, Stones & Zircons">
        <p>
          Select designs feature hand-selected semi-precious stones and cubic zirconia, which are cut and polished individually for a little extra sparkle. They are
          more delicate than the metal, so they need a little extra care.
        </p>
      </PolicySection>

      <PolicySection id="real-life" title="Made for Real Life">
        <p>
          Your commute, your workday, your weekend plans, your night out. Wear it, layer it, live in it. For the longest-lasting shine, take it off before swimming
          and keep it away from harsh chemicals. See our <Link to={policyPath('care')}>Jewellery Care guide</Link>.
        </p>
      </PolicySection>
    </>
  )
}
