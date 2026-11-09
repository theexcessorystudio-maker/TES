import { useMemo, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Clock, Eye, FileText, IndianRupee, Plus, Trash2 } from 'lucide-react'
import { Button, IconButton, Pill, Spinner } from '../../../../components/ui'
import { useCatalog } from '../../../../context/CatalogContext'
import { useToast } from '../../../../context/ToastContext'
import { useSubscription } from '../../../../hooks/useSubscription'
import { deleteInvoice, invoiceTotals, subscribeInvoices, toggleInvoicePaid } from '../../../../services/invoices'
import { formatDate, formatMoney } from '../../../../lib/format'
import { SearchField } from '../../../catalog/SearchField/SearchField'
import { PanelHeader } from '../../shared/PanelHeader/PanelHeader'
import { StatGrid } from '../../shared/StatGrid/StatGrid'
import { DataList, DataRow, EmptyNote, RowActions, RowMedia, RowTitle } from '../../shared/DataRow/DataRow'
import { InvoiceForm } from '../InvoiceForm/InvoiceForm'
import { InvoiceView } from '../InvoiceView/InvoiceView'
import styles from './InvoicesPanel.module.css'

export function InvoicesPanel() {
  const { products } = useCatalog()
  const { notify } = useToast()
  const { data: invoices, loading, error } = useSubscription(subscribeInvoices, [])
  const [creating, setCreating] = useState(false)
  const [viewing, setViewing] = useState(null)
  const [query, setQuery] = useState('')

  const seq = Math.max(0, ...invoices.map((i) => i.seq || 0)) + 1
  const visible = useMemo(() => invoices.filter((i) => `${i.number} ${i.customer} ${i.phone}`.toLowerCase().includes(query.toLowerCase())), [invoices, query])
  const sum = (list) => list.reduce((n, i) => n + invoiceTotals(i).total, 0)
  const stats = [
    { label: 'Invoices', value: invoices.length, icon: FileText },
    { label: 'Collected', value: formatMoney(sum(invoices.filter((i) => i.status === 'Paid'))), icon: IndianRupee },
    { label: 'Pending payment', value: formatMoney(sum(invoices.filter((i) => i.status !== 'Paid'))), icon: Clock },
  ]
  const shown = viewing && (invoices.find((i) => i.id === viewing.id) || viewing)
  const remove = async (inv) => {
    if (!confirm(`Delete invoice ${inv.number}? Stock will not be restored.`)) return
    await deleteInvoice(inv.id)
    notify('Invoice deleted')
  }

  return (
    <>
      <PanelHeader title="Invoices" description="Create, print and share bills for offline and WhatsApp orders."
        action={<Button onClick={() => setCreating(true)} disabled={!!error}><Plus size={18} /> New invoice</Button>} />
      <StatGrid stats={stats} />
      <SearchField className={styles.search} value={query} onChange={setQuery} placeholder="Search by number, name or phone…" />

      {error ? <EmptyNote>Couldn’t load invoices. Publish the updated <b>firestore.rules</b>, then refresh.</EmptyNote>
        : loading ? <Spinner />
        : visible.length === 0 ? <EmptyNote>{invoices.length ? 'No invoices match that search.' : 'No invoices yet — create your first one.'}</EmptyNote> : (
          <DataList>
            <AnimatePresence>
              {visible.map((inv) => (
                <DataRow key={inv.id} layout="invoice">
                  <RowMedia onClick={() => setViewing(inv)} label={`View ${inv.number}`}><FileText size={20} /></RowMedia>
                  <RowTitle title={`${inv.number} · ${inv.customer}`} meta={`${formatDate(inv.date)} · ${inv.items?.length || 0} item${inv.items?.length === 1 ? '' : 's'}`} />
                  <b className={styles.total}>{formatMoney(invoiceTotals(inv).total)}</b>
                  <Pill tone={inv.status === 'Paid' ? 'success' : 'warning'} onClick={() => toggleInvoicePaid(inv)} title="Click to toggle paid / unpaid">{inv.status}</Pill>
                  <RowActions>
                    <IconButton label="View invoice" onClick={() => setViewing(inv)}><Eye size={17} /></IconButton>
                    <IconButton label="Delete invoice" variant="danger" onClick={() => remove(inv)}><Trash2 size={17} /></IconButton>
                  </RowActions>
                </DataRow>
              ))}
            </AnimatePresence>
          </DataList>
        )}
      <AnimatePresence>{creating && <InvoiceForm products={products} seq={seq} onClose={() => setCreating(false)} onSaved={(inv) => { setCreating(false); setViewing(inv) }} />}</AnimatePresence>
      <AnimatePresence>{shown && <InvoiceView invoice={shown} onClose={() => setViewing(null)} />}</AnimatePresence>
    </>
  )
}
