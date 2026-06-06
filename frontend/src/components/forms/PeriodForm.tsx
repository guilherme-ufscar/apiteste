import { useState } from 'react'
import FormField, { Input, Select } from '../ui/FormField'
import Button from '../ui/Button'
import type { Period, PeriodCreate } from '../../types'

interface Props {
  initial?: Partial<Period>
  onSubmit: (data: PeriodCreate) => Promise<void>
  onCancel: () => void
}

export default function PeriodForm({ initial, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState<PeriodCreate>({
    name: initial?.name ?? '',
    year: initial?.year ?? new Date().getFullYear(),
    semester: initial?.semester ?? 1,
    start_date: initial?.start_date ?? '',
    end_date: initial?.end_date ?? '',
    is_active: initial?.is_active ?? false,
  })
  const [errors, setErrors] = useState<Partial<Record<keyof PeriodCreate, string>>>({})
  const [loading, setLoading] = useState(false)

  const set = (field: keyof PeriodCreate) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const raw = e.target.value
    let value: unknown = raw
    if (field === 'year') value = Number(raw)
    else if (field === 'semester') value = Number(raw) as 1 | 2
    else if (field === 'is_active') value = raw === 'true'
    setForm(f => ({ ...f, [field]: value }))
    setErrors(er => ({ ...er, [field]: undefined }))
  }

  const validate = () => {
    const e: Partial<Record<keyof PeriodCreate, string>> = {}
    if (!form.name.trim()) e.name = 'Nome é obrigatório'
    if (!form.year) e.year = 'Ano é obrigatório'
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
        <FormField label="Nome do período" required error={errors.name}>
          <Input value={form.name} onChange={set('name')} placeholder="2025/1" error={!!errors.name} />
        </FormField>
        <FormField label="Ano" required error={errors.year as string}>
          <Input type="number" value={form.year} onChange={set('year')} min={2020} max={2099} />
        </FormField>
        <FormField label="Semestre" required>
          <Select value={String(form.semester)} onChange={set('semester')}>
            <option value="1">1° Semestre</option>
            <option value="2">2° Semestre</option>
          </Select>
        </FormField>
        <FormField label="Status">
          <Select value={String(form.is_active)} onChange={set('is_active')}>
            <option value="false">Inativo</option>
            <option value="true">Ativo</option>
          </Select>
        </FormField>
        <FormField label="Data de Início">
          <Input type="date" value={form.start_date ?? ''} onChange={set('start_date')} />
        </FormField>
        <FormField label="Data de Término">
          <Input type="date" value={form.end_date ?? ''} onChange={set('end_date')} />
        </FormField>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" loading={loading}>{initial ? 'Salvar' : 'Criar Período'}</Button>
      </div>
    </form>
  )
}
