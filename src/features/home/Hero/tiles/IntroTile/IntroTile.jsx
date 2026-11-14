import { motion } from 'framer-motion'
import { Button } from '../../../../../components/ui'
import { BentoTile } from '../../BentoTile/BentoTile'
import styles from './IntroTile.module.css'

const ease = [0.22, 1, 0.36, 1]

function RevealLine({ children, delay }) {
  return (
    <span className={styles.line}>
      <motion.span initial={{ y: '112%' }} animate={{ y: 0 }} transition={{ delay, duration: 1, ease }}>{children}</motion.span>
    </span>
  )
}

export function IntroTile() {
  return (
    <BentoTile area="intro" className={styles.tile}>
      <p className={styles.eyebrow}>The Excessory Studio</p>
      <h1 className={styles.title}>
        <RevealLine delay={0.15}>Accessories you’ll</RevealLine>
        <RevealLine delay={0.27}>reach for <span className="text-highlight">every day.</span></RevealLine>
      </h1>
      <motion.p className={styles.sub} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.8 }}>
        Thoughtfully curated pieces, checked by hand and delivered to your door. Check out in a minute, no account needed.
      </motion.p>
      <motion.div className={styles.cta} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 0.8 }}>
        <Button to="/#shop" size="lg">Shop the collection</Button>
        <Button to="/#how" variant="outline" size="lg">How it works</Button>
      </motion.div>
    </BentoTile>
  )
}
