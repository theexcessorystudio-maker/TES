export const PAYMENT_TONE = { PAID: 'success', PENDING: 'warning', FAILED: 'danger' }
export const PAYMENT_LABEL = { PAID: 'Paid', PENDING: 'Unpaid', FAILED: 'Failed' }
export const shortRef = (orderId) => orderId.split('-').slice(0, 2).join('-')
export const itemCount = (o) => o.items.reduce((n, i) => n + i.qty, 0)
export const needsShipping = (o) => o.status === 'PAID' && ['New', 'Packed'].includes(o.fulfilment)

export const FILTERS = [
  { id: 'ship', label: 'To ship', test: needsShipping },
  { id: 'paid', label: 'All paid', test: (o) => o.status === 'PAID' },
  { id: 'unpaid', label: 'Unpaid / failed', test: (o) => o.status !== 'PAID' },
  { id: 'all', label: 'Everything', test: () => true },
]
