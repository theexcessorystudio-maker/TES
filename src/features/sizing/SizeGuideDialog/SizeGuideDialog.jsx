import { Download } from 'lucide-react'
import { Button, Dialog } from '../../../components/ui'
import { SIZE_GUIDES } from '../../../config/sizeGuides'
import { cx } from '../../../lib/format'
import styles from './SizeGuideDialog.module.css'

export function SizeGuideDialog({ guideId = 'ring', highlight, onClose }) {
  const guide = SIZE_GUIDES[guideId]
  if (!guide) return null
  return (
    <Dialog label={guide.title} onClose={onClose} layer="top" className={styles.dialog}>
      <div className={styles.body}>
        <p className={styles.brand}>theexcessorystudio</p>
        <h2 className={styles.title}>{guide.title}</h2>
        <p className={styles.intro}>{guide.intro}</p>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead><tr>{guide.columns.map((c) => <th key={c.key} scope="col">{c.label}</th>)}</tr></thead>
            <tbody>
              {guide.rows.map((r) => (
                <tr key={r.size} className={cx(highlight === r.size && styles.highlight)}>
                  {guide.columns.map((c) => <td key={c.key}>{r[c.key]}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ul className={styles.tips}>{guide.tips.map((t) => <li key={t}>{t}</li>)}</ul>
        {guide.downloadUrl && <Button variant="outline" size="sm" href={guide.downloadUrl} target="_blank" rel="noreferrer"><Download size={15} /> Download printable chart</Button>}
      </div>
    </Dialog>
  )
}
