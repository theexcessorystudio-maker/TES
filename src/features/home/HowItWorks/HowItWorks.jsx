import { SectionTitle } from '../../../components/ui'
import { STEPS } from '../../../config/site'
import styles from './HowItWorks.module.css'

export function HowItWorks() {
  return (
    <section className={styles.section} id="how">
      <div className={styles.inner}>
        <SectionTitle className={styles.title}>How it works</SectionTitle>
        <ol className={styles.steps} role="list">
          {STEPS.map((s) => (
            <li key={s.n} className={styles.step}>
              <span className={styles.number}>{s.n}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
