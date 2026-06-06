import { useState, useEffect } from 'react'
import FormField, { Select } from '../ui/FormField'
import Button from '../ui/Button'
import type { Student, Subject, Period, EnrollmentCreate } from '../../types'
import { studentsApi } from '../../api/students'
import { subjectsApi } from '../../api/subjects'
import { periodsApi } from '../../api/periods'

interface Props {
  onSubmit: (data: EnrollmentCreate) => Promise<void>
  onCancel: () => void
}

export default function EnrollmentForm({ onSubmit, onCancel }: Props) {
  const [students, setStudents] = useState<Student[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [periods, setPeriods] = useState<Period[]>([])
  const [form, setForm] = useState({ student_id: '', subject_id: '', period_id: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    Promise.all([
      studentsApi.list({ is_active: true }),
      subjectsApi.list(),
      periodsApi.list(),
    ]).then(([s, sub, p]) => {
      setStudents(s.data)
      setSubjects(sub.data)
      setPeriods(p.data)
    }).catch(() => {})
  }, [])

  const set = (field: string) => (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm(f => ({ ...f, [field]: e.target.value }))
    setErrors(er => ({ ...er, [field]: '' }))
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.student_id) e.student_id = 'Selecione um aluno'
    if (!form.subject_id) e.subject_id = 'Selecione uma disciplina'
    if (!form.period_id) e.period_id = 'Selecione um período'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await onSubmit({
        student_id: Number(form.student_id),
        subject_id: Number(form.subject_id),
        period_id: Number(form.period_id),
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField label="Aluno" required error={errors.student_id}>
        <Select value={form.student_id} onChange={set('student_id')} error={!!errors.student_id}>
          <option value="">— Selecionar aluno —</option>
          {students.map(s => (
            <option key={s.id} value={s.id}>{s.name} {s.registration ? `(${s.registration})` : ''}</option>
          ))}
        </Select>
      </FormField>
      <FormField label="Disciplina" required error={errors.subject_id}>
        <Select value={form.subject_id} onChange={set('subject_id')} error={!!errors.subject_id}>
          <option value="">— Selecionar disciplina —</option>
          {subjects.map(s => (
            <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
          ))}
        </Select>
      </FormField>
      <FormField label="Período" required error={errors.period_id}>
        <Select value={form.period_id} onChange={set('period_id')} error={!!errors.period_id}>
          <option value="">— Selecionar período —</option>
          {periods.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </Select>
      </FormField>
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" loading={loading}>Matricular</Button>
      </div>
    </form>
  )
}
