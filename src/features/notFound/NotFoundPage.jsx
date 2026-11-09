import { Button } from '../../components/ui'
import styles from './NotFoundPage.module.css'

export default function NotFoundPage() {
  return (
    <div className={styles.page}>
      <h1>Page not found</h1>
      <p>The page you’re looking for doesn’t exist or has moved.</p>
      <Button to="/">Back to the store</Button>
    </div>
  )
}
