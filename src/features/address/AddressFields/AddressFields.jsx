import { Field, FieldRow } from '../../../components/ui'
import { INDIAN_STATES } from '../../../config/site'

/** Controlled address inputs. `value` + `onChange(patch)` + `errors` keep it reusable across checkout and account. */
export function AddressFields({ value, onChange, errors = {}, includeContact = true }) {
  const bind = (key) => ({ value: value[key] ?? '', onChange: (e) => onChange({ [key]: e.target.value }), error: errors[key] })
  return (
    <>
      {includeContact && (
        <FieldRow>
          <Field label="Full name" autoComplete="name" {...bind('name')} />
          <Field label="Mobile number" type="tel" inputMode="numeric" autoComplete="tel-national" placeholder="98XXXXXXXX" maxLength={14} {...bind('phone')} />
        </FieldRow>
      )}
      <Field label="House / flat, street" autoComplete="address-line1" {...bind('line1')} />
      <Field label="Area, landmark" hint="(optional)" autoComplete="address-line2" {...bind('line2')} />
      <FieldRow columns={3}>
        <Field label="City" autoComplete="address-level2" {...bind('city')} />
        <Field as="select" label="State" autoComplete="address-level1" {...bind('state')}>
          <option value="">Select</option>
          {INDIAN_STATES.map((s) => <option key={s}>{s}</option>)}
        </Field>
        <Field label="PIN code" inputMode="numeric" autoComplete="postal-code" maxLength={6} {...bind('pincode')} />
      </FieldRow>
    </>
  )
}
