import { useState } from 'react'
import FormField, { Input, Select } from '../ui/FormField'
import Button from '../ui/Button'
import type { Teacher, TeacherCreate } from '../../types'

interface Props {
  initial?: Partial<Teacher>
  onSubmit: (data: TeacherCreate) => Promise<void>
  onCancel: () => void
}

export default function TeacherForm({ initial, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState<TeacherCreate>({
    name: initial?.name ?? '',
    email: initial?.email ?? '',
    cpf: initial?.cpf ?? '',
    phone: initial?.phone ?? '',
    hire_date: initial?.hire_date ?? '',
    is_active: initial?.is_active ?? true,
  })
  const [errors, setErrors] = useState<Partial<Record<keyof TeacherCreate, string>>>({})
  const [loading, setLoading] = useState(false)

  const set = (field: keyof TeacherCreate) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = field === 'is_active' ? e.target.value === 'true' : e.target.value
    setForm(f => ({ ...f, [field]: value }))
    setErrors(er => ({ ...er, [field]: undefined }))
  }

  const validate = () => {
    const e: Partial<Record<keyof TeacherCreate, string>> = {}
    if (!form.name.trim()) e.name = 'Nome é obrigatório'
    if (!form.email.trim()) e.email = 'Email é obrigatório'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email inválido'
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
        <FormField label="Nome completo" required error={errors.name}>
          <Input value={form.name} onChange={set('name')} placeholder="Maria Souza" error={!!errors.name} />
        </FormField>
        <FormField label="Email" required error={errors.email}>
          <Input type="email" value={form.email} onChange={set('email')} placeholder="maria@escola.com" error={!!errors.email} />
        </FormField>
        <FormField label="CPF">
          <Input value={form.cpf ?? ''} onChange={set('cpf')} placeholder="000.000.000-00" />
        </FormField>
        <FormField label="Telefone">
          <Input value={form.phone ?? ''} onChange={set('phone')} placeholder="(11) 99999-9999" />
        </FormField>
        <FormField label="Data de Contratação">
          <Input type="date" value={form.hire_date ?? ''} onChange={set('hire_date')} />
        </FormField>
        {initial && (
          <FormField label="Status">
            <Select value={String(form.is_active)} onChange={set('is_active')}>
              <option value="true">Ativo</option>
              <option value="false">Inativo</option>
            </Select>
          </FormField>
        )}
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" loading={loading}>{initial ? 'Salvar' : 'Cadastrar'}</Button>
      </div>
    </form>
  )
}
