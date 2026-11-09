import { NavLink } from 'react-router-dom'
import { cx } from '../../../lib/format'
import { POLICIES, POLICY_GROUPS } from '../policies'
import styles from './PolicyNav.module.css'

/** Sidebar on desktop, horizontally scrolling chips on mobile. */
export function PolicyNav() {
  return (
    <nav className={styles.nav} aria-label="Store policies">
      {Object.entries(POLICY_GROUPS).map(([group, label]) => (
        <div key={group} className={styles.group}>
          <p className={styles.label}>{label}</p>
          <ul className={styles.list}>
            {POLICIES.filter((p) => p.group === group).map((p) => (
              <li key={p.slug}>
                <NavLink to={p.path} className={({ isActive }) => cx(styles.link, isActive && styles.active)}>{p.navLabel}</NavLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  )
}
