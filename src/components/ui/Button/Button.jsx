import { forwardRef } from 'react'
import { Link } from 'react-router-dom'
import { Spinner } from '../Spinner/Spinner'
import { cx } from '../../../lib/format'
import styles from './Button.module.css'

/**
 * Polymorphic button: renders <Link> for `to`, <a> for `href`, otherwise <button>.
 * variant: primary | outline | light | ghost   size: sm | md | lg
 */
export const Button = forwardRef(function Button(
  { variant = 'primary', size = 'md', block, loading, disabled, className, children, to, href, ...rest }, ref,
) {
  const classes = cx(styles.button, styles[variant], styles[size], block && styles.block, className)
  const content = loading ? <Spinner size={18} /> : children
  if (to) return <Link ref={ref} to={to} className={classes} {...rest}>{content}</Link>
  if (href) return <a ref={ref} href={href} className={classes} {...rest}>{content}</a>
  return <button ref={ref} type="button" className={classes} disabled={disabled || loading} aria-busy={loading || undefined} {...rest}>{content}</button>
})
