import { StarRating } from '../../../components/ui'
import styles from './RatingSummary.module.css'

/** Compact "★★★★☆ 4.2 (12)" line. Renders nothing when there are no reviews. */
export function RatingSummary({ average, count, onClick }) {
  if (!count) return null
  const Tag = onClick ? 'button' : 'span'
  return (
    <Tag type={onClick ? 'button' : undefined} className={styles.summary} onClick={onClick}>
      <StarRating value={average} size={15} />
      <b>{average.toFixed(1)}</b>
      <span>({count} review{count === 1 ? '' : 's'})</span>
    </Tag>
  )
}
