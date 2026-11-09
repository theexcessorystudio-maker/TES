import { Search } from 'lucide-react'
import { cx } from '../../../lib/format'
import styles from './SearchField.module.css'

export function SearchField({ value, onChange, placeholder = 'Search', className }) {
  return (
    <label className={cx(styles.search, className)}>
      <Search size={16} aria-hidden="true" />
      <input type="search" placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} aria-label={placeholder} />
    </label>
  )
}
