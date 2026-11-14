import { useState } from 'react'
import { MapPin, Pencil, Plus, Star, Trash2 } from 'lucide-react'
import { Button, IconButton, Pill, Spinner } from '../../../components/ui'
import { useToast } from '../../../context/ToastContext'
import { addAddress, makeDefault, removeAddress, updateAddress } from '../../../services/addresses'
import { AddressFields } from '../../address/AddressFields/AddressFields'
import { AddressCard } from '../../address/AddressCard/AddressCard'
import { EMPTY_ADDRESS, validateAddress } from '../../address/validation'
import styles from './AddressBook.module.css'

function AddressEditor({ initial, onCancel, onSave }) {
  const [value, setValue] = useState({ ...EMPTY_ADDRESS, ...initial })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const submit = async (e) => {
    e.preventDefault()
    const found = validateAddress(value)
    setErrors(found)
    if (Object.keys(found).length) return
    setSaving(true)
    try { await onSave({ ...value, phone: value.phone.replace(/\D/g, '').slice(-10) }) } finally { setSaving(false) }
  }
  return (
    <form className={styles.editor} onSubmit={submit} noValidate>
      <AddressFields value={value} onChange={(p) => setValue((v) => ({ ...v, ...p }))} errors={errors} />
      <div className={styles.editorActions}>
        <Button variant="outline" size="sm" onClick={onCancel}>Cancel</Button>
        <Button type="submit" size="sm" loading={saving}>Save address</Button>
      </div>
    </form>
  )
}

export function AddressBook({ uid, addresses, loading }) {
  const { notify } = useToast()
  const [editing, setEditing] = useState(null) // null | 'new' | address

  const save = async (value) => {
    try {
      if (editing === 'new') await addAddress(uid, value, addresses.length === 0)
      else await updateAddress(uid, editing.id, value)
      notify('Address saved')
      setEditing(null)
    } catch (err) {
      console.error('Saving address failed', err)
      notify(err?.code === 'permission-denied'
        ? 'Could not save the address: the database rejected it. Publish the latest firestore.rules in Firebase.'
        : 'Could not save the address. Please try again.', { tone: 'error' })
    }
  }
  const remove = async (a) => {
    if (!confirm('Remove this address?')) return
    await removeAddress(uid, a.id)
    notify('Address removed')
  }

  if (loading) return <Spinner />

  return (
    <div className={styles.book}>
      {addresses.length === 0 && editing !== 'new' && (
        <div className={styles.empty}><MapPin size={28} strokeWidth={1.4} /><p>No saved addresses yet.</p></div>
      )}
      <div className={styles.grid}>
        {addresses.map((a) => (editing?.id === a.id ? (
          <AddressEditor key={a.id} initial={a} onCancel={() => setEditing(null)} onSave={save} />
        ) : (
          <AddressCard key={a.id} address={a} badge={a.isDefault && <Pill tone="brand">Default</Pill>}
            actions={(
              <>
                {!a.isDefault && <IconButton label="Make default" onClick={() => makeDefault(uid, a.id, addresses)}><Star size={16} /></IconButton>}
                <IconButton label="Edit address" onClick={() => setEditing(a)}><Pencil size={16} /></IconButton>
                <IconButton label="Remove address" variant="danger" onClick={() => remove(a)}><Trash2 size={16} /></IconButton>
              </>
            )} />
        )))}
      </div>
      {editing === 'new'
        ? <AddressEditor onCancel={() => setEditing(null)} onSave={save} />
        : <Button variant="outline" onClick={() => setEditing('new')}><Plus size={16} /> Add a new address</Button>}
    </div>
  )
}
