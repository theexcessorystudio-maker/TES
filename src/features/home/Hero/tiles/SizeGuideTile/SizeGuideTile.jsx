import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Ruler } from 'lucide-react'
import { SizeGuideDialog } from '../../../../sizing/SizeGuideDialog/SizeGuideDialog'
import { BentoTile } from '../../BentoTile/BentoTile'
import styles from './SizeGuideTile.module.css'

export function SizeGuideTile({ area, order }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <BentoTile area={area} order={order} tone="light" interactive className={styles.tile}>
        <button type="button" className={styles.button} onClick={() => setOpen(true)}>
          <span className={styles.icon}><Ruler size={20} /></span>
          <span>
            <b className={styles.title}>Find your ring size</b>
            <span className={styles.text}>Measure a ring you own and match it in seconds.</span>
          </span>
          <span className={styles.cta}>Open size guide</span>
        </button>
      </BentoTile>
      <AnimatePresence>{open && <SizeGuideDialog onClose={() => setOpen(false)} />}</AnimatePresence>
    </>
  )
}
