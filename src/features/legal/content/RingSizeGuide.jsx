import { Download } from 'lucide-react'
import { Button } from '../../../components/ui'
import { SIZE_GUIDES } from '../../../config/sizeGuides'
import { PolicySection } from '../PolicySection/PolicySection'
import { Callout } from '../Callout/Callout'
import styles from './content.module.css'

export default function RingSizeGuide() {
  const guide = SIZE_GUIDES.ring
  return (
    <PolicySection id="chart" title="How to measure">
      <p>{guide.intro}</p>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead><tr>{guide.columns.map((c) => <th key={c.key} scope="col">{c.label}</th>)}</tr></thead>
          <tbody>
            {guide.rows.map((r) => <tr key={r.size}>{guide.columns.map((c) => <td key={c.key}>{r[c.key]}</td>)}</tr>)}
          </tbody>
        </table>
      </div>
      {guide.tips.map((t) => <Callout key={t} tone="info">{t}</Callout>)}
      {guide.downloadUrl && (
        <div>
          <Button variant="outline" size="sm" href={guide.downloadUrl} target="_blank" rel="noreferrer"><Download size={15} /> Download printable chart</Button>
        </div>
      )}
    </PolicySection>
  )
}
