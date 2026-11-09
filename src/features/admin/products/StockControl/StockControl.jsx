import { Minus, Plus } from 'lucide-react'
import { cx } from '../../../../lib/format'
import styles from './StockControl.module.css'

export function StockControl({ stock, onAdjust }) {
  const state = stock === 0 ? 'zero' : stock <= 3 ? 'low' : 'ok'
  return (
    <div className={cx(styles.stock, styles[state])}>
      <button type="button" onClick={() => onAdjust(-1)} disabled={stock <= 0} aria-label="Decrease stock"><Minus size={14} /></button>
      <span><b>{stock}</b><small>{state === 'zero' ? 'Sold out' : state === 'low' ? 'Low' : 'In stock'}</small></span>
      <button type="button" onClick={() => onAdjust(1)} aria-label="Increase stock"><Plus size={14} /></button>
    </div>
  )
}
