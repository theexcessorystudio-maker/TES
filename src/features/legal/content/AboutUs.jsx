import { PolicySection } from '../PolicySection/PolicySection'
import styles from './content.module.css'

export default function AboutUs() {
  return (
    <>
      <PolicySection id="our-story" title="For your everyday excess.">
        <p>The Excessory Studio is a small jewellery studio built on one belief: jewellery shouldn’t wait for a special occasion.</p>
        <p>
          Every piece is curated in small batches, with one rule: if we wouldn’t wear it on repeat, it doesn’t make the shelf. From subtle everyday pieces to ones that
          make a little more of a statement, each is made to fit easily into your life, worn daily, layered, and loved. Never a thousand look-alikes.
        </p>
        <p>We’re new, we’re small, and we reply to our own DMs. Welcome in.</p>
      </PolicySection>

      <PolicySection id="founder" title="A Note from the Founder">
        <p>
          I have always loved jewellery, not just for how it looks, but for how it makes you feel. The quiet confidence of a ring you love. The way a necklace catches
          the light. The little extra something a pair of earrings brings to an ordinary day.
        </p>
        <p>
          That became TES: a space for thoughtfully curated, tarnish-resistant, demi-fine jewellery that brings together everyday wearability and a little bit of luxe.
        </p>
        <p>
          Every piece here is something I would wear myself, and every order is packed with care. When you open your TES order, I hope you feel that quiet excitement
          of something just right. That feeling is what I’m here for.
        </p>
        <p className={styles.signoff}>Made to last. Made to love.</p>
        <p className={styles.signature}>
          <b>Ritika</b>
          <span>Founder, The Excessory Studio 🌸</span>
        </p>
      </PolicySection>
    </>
  )
}
