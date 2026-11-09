import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import { MessageCircle, Printer, X } from 'lucide-react'
import { Button, IconButton, Pill } from '../../../../components/ui'
import { useDialogBehaviour } from '../../../../hooks/useDialogBehaviour'
import { invoiceTotals } from '../../../../services/invoices'
import { formatDate, formatMoney } from '../../../../lib/format'
import { BUSINESS, OFFER_LABEL } from '../../../../config/site'
import { InvoiceSummary } from '../InvoiceSummary/InvoiceSummary'
import styles from './InvoiceView.module.css'

// WhatsApp needs a country code; assume India for plain 10-digit numbers
const waPhone = (ph) => { const d = (ph || '').replace(/\D/g, ''); return d.length === 10 ? `91${d}` : d }

const shareMessage = (inv, t) => `Hi ${inv.customer}! 👋\nHere's your invoice from ${BUSINESS.name}.\n\nInvoice: ${inv.number}\nDate: ${formatDate(inv.date)}\n\n${inv.items
  .map((i, k) => `${k + 1}. ${i.name} × ${i.qty} — ${formatMoney(i.price * i.qty)}`).join('\n')}${inv.shipping ? `\nShipping — ${formatMoney(inv.shipping)}` : ''}${inv.discount ? `\nDiscount — −${formatMoney(inv.discount)}` : ''}\n\n*Total: ${formatMoney(t.total)}*${
  t.savings > 0 ? `\nYou saved ${formatMoney(t.savings)} with our ${OFFER_LABEL.toLowerCase()} 🎉` : ''}\nPayment: ${inv.payment} (${inv.status})\n\nThank you for shopping with us!`

/** Printable invoice. Rendered in a portal marked data-print-root so print.css can isolate it. */
export function InvoiceView({ invoice: inv, onClose }) {
  useDialogBehaviour(onClose)
  const t = invoiceTotals(inv)
  const phone = waPhone(inv.phone)

  return createPortal(
    <motion.div data-print-root className={styles.backdrop} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div className={styles.sheet} role="dialog" aria-modal="true" aria-label={`Invoice ${inv.number}`}
        initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }} transition={{ type: 'spring', damping: 28, stiffness: 270 }}
        onClick={(e) => e.stopPropagation()}>
        <div className={styles.toolbar}>
          <b>{inv.number}</b>
          <div>
            {phone && <Button size="sm" variant="outline" href={`https://wa.me/${phone}?text=${encodeURIComponent(shareMessage(inv, t))}`} target="_blank" rel="noreferrer"><MessageCircle size={15} /> WhatsApp</Button>}
            <Button size="sm" onClick={() => window.print()}><Printer size={15} /> Print / PDF</Button>
            <IconButton label="Close" onClick={onClose}><X size={20} /></IconButton>
          </div>
        </div>

        <article className={styles.invoice}>
          <div className={styles.band} />
          <header className={styles.head}>
            <div className={styles.from}>
              <img src="/logo-circle.png" alt="" />
              <div>
                <b>{BUSINESS.name}</b>
                {BUSINESS.address && <span>{BUSINESS.address}</span>}
                {BUSINESS.phone && <span>{BUSINESS.phone}</span>}
                {BUSINESS.email && <span>{BUSINESS.email}</span>}
                {BUSINESS.gstin && <span>GSTIN: {BUSINESS.gstin}</span>}
              </div>
            </div>
            <div className={styles.meta}>
              <h2>Invoice</h2>
              <span>No. <b>{inv.number}</b></span>
              <span>Date <b>{formatDate(inv.date)}</b></span>
              <Pill tone={inv.status === 'Paid' ? 'success' : 'warning'}>{inv.status}</Pill>
            </div>
          </header>

          <div className={styles.to}>
            <small>Billed to</small><b>{inv.customer}</b>
            {inv.phone && <span>{inv.phone}</span>}
            {inv.address && <span className={styles.addr}>{inv.address}</span>}
          </div>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead><tr><th>#</th><th>Item</th><th>Qty</th><th>MRP</th><th>Price</th><th>Amount</th></tr></thead>
              <tbody>
                {inv.items.map((i, k) => (
                  <tr key={k}><td>{k + 1}</td><td>{i.name}</td><td>{i.qty}</td><td>{i.mrp > i.price ? <s>{formatMoney(i.mrp)}</s> : '—'}</td><td>{formatMoney(i.price)}</td><td>{formatMoney(i.price * i.qty)}</td></tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.foot}>
            <div className={styles.payment}><small>Payment</small><b>{inv.payment}</b>{inv.notes && <p>{inv.notes}</p>}</div>
            <InvoiceSummary className={styles.summary} totals={t} shipping={inv.shipping} discount={inv.discount} />
          </div>
          <p className={styles.thanks}>Thank you for shopping with {BUSINESS.name}!</p>
        </article>
      </motion.div>
    </motion.div>,
    document.body,
  )
}
