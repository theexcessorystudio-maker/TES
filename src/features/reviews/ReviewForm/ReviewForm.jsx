import { useState } from 'react'
import { Button, Field, StarRating } from '../../../components/ui'
import { useToast } from '../../../context/ToastContext'
import { saveReview } from '../../../services/reviews'
import styles from './ReviewForm.module.css'

const LABELS = ['', 'Not for me', 'Could be better', 'Good', 'Really like it', 'Love it!']

export function ReviewForm({ productId, user, existing, onDone }) {
  const { notify } = useToast()
  const [rating, setRating] = useState(existing?.rating || 0)
  const [text, setText] = useState(existing?.text || '')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    if (!rating) return setError('Please choose a star rating.')
    if (text.trim().length < 3) return setError('Please write a few words about the piece.')
    setSaving(true); setError('')
    try {
      await saveReview({ productId, user, rating, text })
      notify(existing ? 'Review updated' : 'Thank you for your review!')
      onDone?.()
    } catch {
      setError('Could not save your review. Only customers who bought this piece can review it.')
    }
    setSaving(false)
  }

  return (
    <form className={styles.form} onSubmit={submit}>
      <div className={styles.rating}>
        <StarRating value={rating} onChange={setRating} size={26} />
        <span>{LABELS[rating]}</span>
      </div>
      <Field as="textarea" label="Your review" rows={3} maxLength={1000} value={text} onChange={(e) => setText(e.target.value)} placeholder="How does it look, feel and wear?" error={error} />
      <div className={styles.actions}>
        {onDone && existing && <Button variant="outline" size="sm" onClick={onDone}>Cancel</Button>}
        <Button type="submit" size="sm" loading={saving}>{existing ? 'Update review' : 'Post review'}</Button>
      </div>
    </form>
  )
}
