import styles from './PanelHeader.module.css'

export function PanelHeader({ title, description, action }) {
  return (
    <header className={styles.header}>
      <div><h1>{title}</h1>{description && <p>{description}</p>}</div>
      {action}
    </header>
  )
}
