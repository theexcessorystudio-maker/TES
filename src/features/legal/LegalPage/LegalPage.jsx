import { Navigate } from 'react-router-dom'
import { POLICY } from '../../../config/policies'
import { formatDate } from '../../../lib/format'
import { useDocumentTitle } from '../../../hooks/useDocumentTitle'
import { policyBySlug } from '../policies'
import { POLICY_CONTENT } from '../content'
import { PolicyNav } from '../PolicyNav/PolicyNav'
import { PolicyHelp } from '../PolicyHelp/PolicyHelp'
import styles from './LegalPage.module.css'

/** Shared shell for every store policy page: header, policy sidebar, content and help card. */
export default function LegalPage({ slug }) {
  const policy = policyBySlug(slug)
  const Content = POLICY_CONTENT[slug]
  useDocumentTitle(policy?.title)
  if (!policy || !Content) return <Navigate to="/" replace />

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>Store policies</p>
        <h1 className={styles.title}>{policy.title}</h1>
        <p className={styles.summary}>{policy.summary}</p>
        {policy.dated !== false && <p className={styles.meta}>Last updated {formatDate(POLICY.lastUpdated)}</p>}
      </header>

      <div className={styles.layout}>
        <PolicyNav />
        <div className={styles.main}>
          <article className={styles.article}><Content /></article>
          <PolicyHelp />
        </div>
      </div>
    </div>
  )
}
