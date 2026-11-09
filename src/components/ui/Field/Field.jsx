import { forwardRef, useId } from 'react'
import { cx } from '../../../lib/format'
import styles from './Field.module.css'

/**
 * Label + control + hint/error, wired together with ids for accessibility.
 * <Field label="Name" value=... onChange=... />   <Field as="select" ...><option/></Field>   <Field as="textarea" />
 */
export const Field = forwardRef(function Field({ label, hint, error, as: Control = 'input', className, compact, children, ...props }, ref) {
  const id = useId()
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined
  return (
    <div className={cx(styles.field, className)}>
      {label && <label htmlFor={id} className={styles.label}>{label}{hint && !error && <small id={`${id}-hint`} className={styles.hint}> {hint}</small>}</label>}
      <Control ref={ref} id={id} className={cx(styles.control, compact && styles.compact, error && styles.invalid)} aria-invalid={!!error || undefined} aria-describedby={describedBy} {...props}>
        {children}
      </Control>
      {error && <p id={`${id}-error`} className={styles.error}>{error}</p>}
    </div>
  )
})

export function Checkbox({ label, className, ...props }) {
  return (
    <label className={cx(styles.checkbox, className)}>
      <input type="checkbox" {...props} />
      <span>{label}</span>
    </label>
  )
}

export function FieldRow({ columns = 2, children }) {
  return <div className={styles.row} style={{ '--columns': columns }}>{children}</div>
}
