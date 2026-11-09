import { cx } from '../../../lib/format'
import { formatAddress } from '../validation'
import styles from './AddressCard.module.css'

/** Displays a saved address. Becomes a radio option when `selectable`. */
export function AddressCard({ address, selectable, selected, onSelect, actions, badge }) {
  const body = (
    <>
      <div className={styles.head}><b>{address.name}</b>{badge}</div>
      <p>{formatAddress(address)}</p>
      <span className={styles.phone}>{address.phone}</span>
    </>
  )
  if (selectable) {
    return (
      <label className={cx(styles.card, styles.selectable, selected && styles.selected)}>
        <input type="radio" name="saved-address" checked={selected} onChange={onSelect} />
        <div className={styles.body}>{body}</div>
      </label>
    )
  }
  return (
    <div className={styles.card}>
      <div className={styles.body}>{body}</div>
      {actions && <div className={styles.actions}>{actions}</div>}
    </div>
  )
}
