import styles from './KeyFacts.module.css'

/** At-a-glance summary cards shown above the full policy text. items: [{ icon, title, text }] */
export function KeyFacts({ items, label = 'Key points' }) {
  return (
    <ul className={styles.grid} aria-label={label}>
      {items.map(({ icon: Icon, title, text }) => (
        <li key={title} className={styles.card}>
          <span className={styles.icon}><Icon size={20} aria-hidden="true" /></span>
          <b>{title}</b>
          <p>{text}</p>
        </li>
      ))}
    </ul>
  )
}
