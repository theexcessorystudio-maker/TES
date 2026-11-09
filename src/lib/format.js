import { CURRENCY } from '../config/site'

export const formatMoney = (n) => `${CURRENCY}${Number(n || 0).toLocaleString('en-IN')}`

export const formatDate = (value) => {
  if (!value) return ''
  const d = typeof value === 'string' ? new Date(`${value}T00:00`) : value?.toDate ? value.toDate() : new Date(value)
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export const todayISO = () => {
  const d = new Date()
  return new Date(d - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10)
}

export const cx = (...classes) => classes.filter(Boolean).join(' ')
