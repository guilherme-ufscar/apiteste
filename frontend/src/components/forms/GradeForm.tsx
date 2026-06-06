import { useState } from 'react'
import FormField, { Input, Select } from '../ui/FormField'
import Button from '../ui/Button'
import type { GradeCreate } from '../../types'

const GRADE_TYPES = ['AV1', 'AV2', 'AV3', 'AV4', 'Final', 'Recuperação']

interface Props {
  initial?: { grade_type?: string; value?: number; notes?: string }
  onSubmit: (data: GradeCreate) => Promise<void>
  onCancel: () => void
}

export default function GradeForm({ initial, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState<GradeCreate>({
    grade_type: initial?.grade_type ?? 'AV1',
    value: initial?.value ?? 0,
    notes: initial?.notes ?? '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const e: Record<string, string> = {}
    if (form.value < 0 || form.value > 10) e.value = 'Nota deve ser entre 0 e 10'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!validate()) return
    setLoading(true)
    try { await onSubmit(form) } finally { setLoading(false) }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Tipo de Nota" required>
          <Select value={form.grade_type} onChange={e => setForm(f => ({ ...f, grade_type: e.target.value }))}>
            {GRADE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </Select>
        </FormField>
        <FormField label="Nota (0–10)" required error={errors.value}>
          <Input
            type="number" step="0.1" min={0} max={10}
            value={form.value}
            onChange={e => setForm(f => ({ ...f, value: Number(e.target.value) }))}
            error={!!errors.value}
          />
        </FormField>
      </div>
      <FormField label="Observações">
        <Input value={form.notes ?? ''} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Observação opcional..." />
      </FormField>
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" loading={loading}>Salvar Nota</Button>
      </div>
    </form>
  )
}
