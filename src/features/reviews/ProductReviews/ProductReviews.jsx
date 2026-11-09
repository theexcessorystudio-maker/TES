import { forwardRef, useState } from 'react'
import { BadgeCheck, Lock, Pencil, Trash2 } from 'lucide-react'
import { IconButton, Pill, StarRating, Spinner } from '../../../components/ui'
import { useAuth } from '../../../context/AuthContext'
import { useToast } from '../../../context/ToastContext'
import { usePurchaseCheck } from '../../../hooks/useCustomerData'
import { deleteReview, summarise } from '../../../services/reviews'
import { formatDate } from '../../../lib/format'
import { GoogleButton } from '../../account/GoogleButton/GoogleButton'
import { ReviewForm } from '../ReviewForm/ReviewForm'
import styles from './ProductReviews.module.css'

/** Verified-buyer reviews. Eligibility is enforced by Firestore rules; the UI just mirrors it. */
export const ProductReviews = forwardRef(function ProductReviews({ productId, reviews, loading }, ref) {
  const { user } = useAuth()
  const { notify } = useToast()
  const eligible = usePurchaseCheck(user?.uid, productId)
  const [editing, setEditing] = useState(false)
  const mine = user && reviews.find((r) => r.uid === user.uid)
  const { average, count } = summarise(reviews)

  const remove = async () => {
    if (!confirm('Delete your review?')) return
    await deleteReview(productId, user.uid)
    notify('Review deleted')
  }

  let composer = null
  if (!user) {
    composer = (
      <div className={styles.gate}>
        <Lock size={18} />
        <p>Bought this piece? Sign in with the Google account you used at checkout to leave a review.</p>
        <GoogleButton label="Sign in to review" />
      </div>
    )
  } else if (eligible === 'unknown') {
    composer = <div className={styles.gate}><Spinner size={18} /></div>
  } else if (!eligible) {
    composer = <div className={styles.gate}><Lock size={18} /><p>Only customers who have purchased this piece can review it.</p></div>
  } else if (!mine || editing) {
    composer = <ReviewForm productId={productId} user={user} existing={mine} onDone={mine ? () => setEditing(false) : undefined} />
  }

  return (
    <section ref={ref} className={styles.reviews} aria-labelledby="reviews-title">
      <header className={styles.head}>
        <h3 id="reviews-title" className={styles.title}>Customer reviews</h3>
        {count > 0 && <div className={styles.score}><b>{average.toFixed(1)}</b><StarRating value={average} size={18} /><span>{count} verified review{count === 1 ? '' : 's'}</span></div>}
      </header>

      {composer}

      {loading ? <Spinner /> : count === 0 ? (
        <p className={styles.empty}>No reviews yet.</p>
      ) : (
        <ul className={styles.list} role="list">
          {reviews.map((r) => (
            <li key={r.id} className={styles.review}>
              <div className={styles.meta}>
                <span className={styles.avatar}>{r.photo ? <img src={r.photo} alt="" referrerPolicy="no-referrer" /> : r.name?.[0]}</span>
                <div>
                  <b>{r.name}</b>
                  <span className={styles.date}>{formatDate(r.createdAt)}</span>
                </div>
                <Pill tone="success" className={styles.verified}><BadgeCheck size={13} /> Verified buyer</Pill>
              </div>
              <StarRating value={r.rating} size={15} />
              <p className={styles.text}>{r.text}</p>
              {user?.uid === r.uid && !editing && (
                <div className={styles.own}>
                  <IconButton label="Edit review" onClick={() => setEditing(true)}><Pencil size={15} /></IconButton>
                  <IconButton label="Delete review" variant="danger" onClick={remove}><Trash2 size={15} /></IconButton>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
})
