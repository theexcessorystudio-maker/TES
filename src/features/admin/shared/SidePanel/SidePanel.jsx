import { Dialog, DialogHeader } from '../../../../components/ui'
import styles from './SidePanel.module.css'

/** Right-hand editor panel. Renders a <form> when onSubmit is given. */
export function SidePanel({ title, subtitle, onClose, onSubmit, footer, wide, children }) {
  const Body = onSubmit ? 'form' : 'div'
  return (
    <Dialog label={title} placement="right" layer="drawer" onClose={onClose} showClose={false} closeOnBackdrop={!onSubmit} className={wide ? styles.wide : undefined}>
      <Body className={styles.panel} onSubmit={onSubmit} noValidate={onSubmit ? true : undefined}>
        <DialogHeader title={title} subtitle={subtitle} onClose={onClose} />
        <div className={styles.body}>{children}</div>
        {footer && <div className={styles.footer}>{footer}</div>}
      </Body>
    </Dialog>
  )
}

export function PanelLabel({ children }) {
  return <div className={styles.label}>{children}</div>
}
