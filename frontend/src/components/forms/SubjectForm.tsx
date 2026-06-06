import { useState, useEffect } from 'react'
import FormField, { Input, Select, Textarea } from '../ui/FormField'
import Button from '../ui/Button'
import type { Subject, SubjectCreate, Teacher } from '../../types'
import { teachersApi } from '../../api/teachers'

interface Props {
  initial?: Partial<Subject>
  onSubmit: (data: SubjectCreate) => Promise<void>
  onCancel: () => void
}

export default function SubjectForm({ initial, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState<SubjectCreate>({
    name: initial?.name ?? '',
    code: initial?.code ?? '',
    description: initial?.description ?? '',
    workload_hours: initial?.workload_hours ?? 60,
    teacher_id: initial?.teacher_id ?? undefined,
  })
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [errors, setErrors] = useState<Partial<Record<keyof SubjectCreate, string>>>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    teachersApi.list({ is_active: true }).then(r => setTeachers(r.data)).catch(() => {})
  }, [])

  const set = (field: keyof SubjectCreate) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const raw = e.target.value
    const value = field === 'workload_hours' ? Number(raw) : field === 'teacher_id' ? (raw ? Number(raw) : undefined) : raw
    setForm(f => ({ ...f, [field]: value }))
    setErrors(er => ({ ...er, [field]: undefined }))
  }

  const validate = () => {
    const e: Partial<Record<keyof SubjectCreate, string>> = {}
    if (!form.name.trim()) e.name = 'Nome é obrigatório'
    if (!form.code.trim()) e.code = 'Código é obrigatório'
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
        <FormField label="Nome da disciplina" required error={errors.name}>
          <Input value={form.name} onChange={set('name')} placeholder="Matemática" error={!!errors.name} />
        </FormField>
        <FormField label="Código" required error={errors.code}>
          <Input value={form.code} onChange={set('code')} placeholder="MAT101" error={!!errors.code} />
        </FormField>
        <FormField label="Carga Horária (h)">
          <Input type="number" value={form.workload_hours} onChange={set('workload_hours')} min={1} />
        </FormField>
        <FormField label="Professor">
          <Select value={String(form.teacher_id ?? '')} onChange={set('teacher_id')}>
            <option value="">— Sem professor —</option>
            {teachers.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </Select>
        </FormField>
      </div>
      <FormField label="Descrição">
        <Textarea value={form.description ?? ''} onChange={set('description')} rows={3} placeholder="Descrição da disciplina..." />
      </FormField>
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" loading={loading}>{initial ? 'Salvar' : 'Cadastrar'}</Button>
      </div>
    </form>
  )
}
