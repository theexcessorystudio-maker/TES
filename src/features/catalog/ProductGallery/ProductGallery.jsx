import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { imageUrl } from '../../../lib/cloudinary'
import { cx } from '../../../lib/format'
import styles from './ProductGallery.module.css'

export function ProductGallery({ images = [], alt }) {
  const [index, setIndex] = useState(0)
  const n = images.length || 1
  const go = (d) => setIndex((i) => (i + d + n) % n)
  return (
    <div className={styles.gallery}>
      <AnimatePresence mode="wait">
        <motion.img key={index} src={imageUrl(images[index], 900)} alt={alt} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} />
      </AnimatePresence>
      {n > 1 && (
        <>
          <button type="button" className={cx(styles.nav, styles.prev)} onClick={() => go(-1)} aria-label="Previous photo"><ChevronLeft size={20} /></button>
          <button type="button" className={cx(styles.nav, styles.next)} onClick={() => go(1)} aria-label="Next photo"><ChevronRight size={20} /></button>
          <div className={styles.dots}>
            {images.map((_, k) => <button key={k} type="button" className={k === index ? styles.dotActive : styles.dot} onClick={() => setIndex(k)} aria-label={`Photo ${k + 1}`} aria-current={k === index} />)}
          </div>
        </>
      )}
    </div>
  )
}
