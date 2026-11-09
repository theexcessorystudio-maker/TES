import { SectionTitle, StarRating } from '../../../components/ui'
import { TESTIMONIALS } from '../../../config/site'
import styles from './Testimonials.module.css'

export function Testimonials() {
  if (!TESTIMONIALS.length) return null
  return (
    <section className={styles.section}>
      <SectionTitle>What customers say</SectionTitle>
      <div className={styles.grid}>
        {TESTIMONIALS.map((t) => (
          <figure key={t.name} className={styles.card}>
            <StarRating value={5} size={15} />
            <blockquote>“{t.text}”</blockquote>
            <figcaption>{t.name}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
