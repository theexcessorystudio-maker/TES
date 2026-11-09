import { useState } from 'react'
import { UploadCloud, X } from 'lucide-react'
import { Spinner } from '../../../../components/ui'
import { uploadImage, imageUrl } from '../../../../lib/cloudinary'
import { cx } from '../../../../lib/format'
import styles from './ImageUploader.module.css'

/** Drag-and-drop Cloudinary uploader. The first image is the cover. Reports pending uploads via onBusyChange. */
export function ImageUploader({ images, onChange, onError, onBusyChange }) {
  const [pending, setPending] = useState(0)
  const [dragging, setDragging] = useState(false)

  const track = (d) => setPending((n) => { const next = n + d; onBusyChange?.(next > 0); return next })
  const upload = async (files) => {
    const list = files.filter((f) => f.type.startsWith('image/'))
    track(list.length)
    for (const file of list) {
      try { const url = await uploadImage(file); onChange((imgs) => [...imgs, url]) } catch (e) { onError?.(e.message) }
      track(-1)
    }
  }
  const makeCover = (i) => onChange((imgs) => [imgs[i], ...imgs.filter((_, k) => k !== i)])
  const remove = (i) => onChange((imgs) => imgs.filter((_, k) => k !== i))

  return (
    <div className={styles.uploader}>
      <label className={cx(styles.dropzone, dragging && styles.dragging)}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setDragging(false) }}
        onDrop={(e) => { e.preventDefault(); setDragging(false); upload([...e.dataTransfer.files]) }}>
        <UploadCloud size={28} />
        <b>{dragging ? 'Drop to upload' : 'Drag photos here'}</b>
        <span>or click to browse</span>
        <input type="file" accept="image/*" multiple hidden onChange={(e) => { upload([...e.target.files]); e.target.value = '' }} />
      </label>
      {(images.length > 0 || pending > 0) && (
        <div className={styles.thumbs}>
          {images.map((u, i) => (
            <div key={u} className={styles.thumb}>
              <img src={imageUrl(u, 200)} alt="" />
              {i === 0 ? <span className={cx(styles.cover, styles.coverActive)}>Cover</span> : <button type="button" className={styles.cover} onClick={() => makeCover(i)}>Make cover</button>}
              <button type="button" className={styles.remove} onClick={() => remove(i)} aria-label="Remove photo"><X size={13} /></button>
            </div>
          ))}
          {Array.from({ length: pending }, (_, i) => <div key={`p${i}`} className={cx(styles.thumb, styles.loading)}><Spinner /></div>)}
        </div>
      )}
    </div>
  )
}
