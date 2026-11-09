import styles from './PolicySection.module.css'

/** A titled block of policy prose. `id` makes the heading linkable (/returns-policy#how-to-claim). */
export function PolicySection({ id, title, children }) {
  return (
    <section id={id} className={styles.section} aria-labelledby={id && `${id}-title`}>
      <h2 id={id && `${id}-title`} className={styles.title}>{title}</h2>
      <div className={styles.prose}>{children}</div>
    </section>
  )
}
