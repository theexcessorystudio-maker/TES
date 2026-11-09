import styles from './CheckoutSection.module.css'

export function CheckoutSection({ step, title, aside, children }) {
  return (
    <section className={styles.section} aria-labelledby={`step-${step}`}>
      <header className={styles.head}>
        <h2 id={`step-${step}`}><span className={styles.step}>{step}</span>{title}</h2>
        {aside}
      </header>
      <div className={styles.body}>{children}</div>
    </section>
  )
}
