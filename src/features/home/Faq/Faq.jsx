import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { SectionTitle } from '../../../components/ui'
import { FAQ } from '../../../config/site'
import styles from './Faq.module.css'

export function Faq() {
  const [open, setOpen] = useState(0)
  return (
    <section className={styles.section} id="faq">
      <SectionTitle className={styles.title}>Good to know</SectionTitle>
      <div>
        {FAQ.map((f, i) => (
          <div key={f.q} className={styles.item}>
            <h3>
              <button type="button" className={styles.question} onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i} aria-controls={`faq-${i}`}>
                {f.q}
                <motion.span animate={{ rotate: open === i ? 180 : 0 }}><ChevronDown size={18} /></motion.span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {open === i && (
                <motion.p id={`faq-${i}`} className={styles.answer} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
                  {f.a}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  )
}
