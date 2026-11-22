import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { SectionTitle } from '../../../components/ui'
import { FAQ } from '../../../config/site'
import styles from './Faq.module.css'

/** Renders an answer's paragraphs, turning the first match of `link.text` into a link. */
function Answer({ text, link }) {
  return text.split('\n\n').map((para, i) => {
    const at = link ? para.lastIndexOf(link.text) : -1
    return (
      <p key={i}>
        {at < 0 ? para : <>{para.slice(0, at)}<Link to={link.to}>{link.text}</Link>{para.slice(at + link.text.length)}</>}
      </p>
    )
  })
}

export function Faq() {
  const [open, setOpen] = useState(0)
  return (
    <section className={styles.section} id="faq">
      <div className={styles.head}>
        <SectionTitle>Frequently Asked Questions</SectionTitle>
        <p className={styles.intro}>Everything you need to know about TES: our jewellery, shipping, and care.</p>
      </div>
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
                <motion.div id={`faq-${i}`} className={styles.answer} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
                  <Answer text={f.a} link={f.link} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  )
}
