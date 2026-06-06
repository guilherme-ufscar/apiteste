import { useEffect, useState } from 'react'
import FormField, { Select } from '../../components/ui/FormField'
import Button from '../../components/ui/Button'
import { PageLoader } from '../../components/ui/LoadingSpinner'
import type { Period, Subject, Enrollment } from '../../types'
import { periodsApi } from '../../api/periods'
import { subjectsApi } from '../../api/subjects'
import { enrollmentsApi } from '../../api/enrollments'

const GRADE_TYPES = ['AV1', 'AV2', 'AV3', 'Final']

interface GradeRow {
  enrollment: Enrollment
  grades: Record<string, string>
  saved: boolean
  saving: boolean
}

export default function GradesPage() {
  const [periods, setPeriods] = useState<Period[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('')
  const [rows, setRows] = useState<GradeRow[]>([])
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => {
    Promise.all([periodsApi.list(), subjectsApi.list()]).then(([p, s]) => {
      setPeriods(p.data)
      setSubjects(s.data)
    })
  }, [])

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const loadEnrollments = async () => {
    if (!selectedPeriod || !selectedSubject) return
    setLoading(true)
    try {
      const [enrollRes] = await Promise.all([
        enrollmentsApi.list({ period_id: Number(selectedPeriod), subject_id: Number(selectedSubject) }),
      ])
      const newRows: GradeRow[] = await Promise.all(
        enrollRes.data.map(async e => {
          const gradesRes = await enrollmentsApi.getGrades(e.id)
          const grades: Record<string, string> = {}
          for (const g of gradesRes.data) {
            grades[g.grade_type] = String(g.value)
          }
          return { enrollment: e, grades, saved: false, saving: false }
        })
      )
      setRows(newRows)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadEnrollments() }, [selectedPeriod, selectedSubject])

  const setGradeValue = (rowIdx: number, type: string, value: string) => {
    setRows(rs => rs.map((r, i) => i === rowIdx ? { ...r, grades: { ...r.grades, [type]: value }, saved: false } : r))
  }

  const saveRow = async (rowIdx: number) => {
    const row = rows[rowIdx]
    setRows(rs => rs.map((r, i) => i === rowIdx ? { ...r, saving: true } : r))
    try {
      for (const [type, val] of Object.entries(row.grades)) {
        if (val !== '') {
          await enrollmentsApi.addGrade(row.enrollment.id, {
            grade_type: type,
            value: Number(val),
          })
        }
      }
      setRows(rs => rs.map((r, i) => i === rowIdx ? { ...r, saving: false, saved: true } : r))
      showToast('Notas salvas!')
    } catch (e: unknown) {
      setRows(rs => rs.map((r, i) => i === rowIdx ? { ...r, saving: false } : r))
      showToast(e instanceof Error ? e.message : 'Erro ao salvar')
    }
  }

  const saveAll = async () => {
    for (let i = 0; i < rows.length; i++) {
      await saveRow(i)
    }
  }

  return (
    <div className="space-y-5 animate-slide-up">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-success/15 border border-success/30 text-success px-4 py-3 rounded-xl text-sm shadow-lg animate-slide-up">
          {toast}
        </div>
      )}

      {/* Filters */}
      <div className="glass-card p-5">
        <p className="section-title mb-4">Selecionar Turma</p>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Período Letivo">
            <Select value={selectedPeriod} onChange={e => { setSelectedPeriod(e.target.value); setSelectedSubject(''); setRows([]) }}>
              <option value="">— Selecione o período —</option>
              {periods.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </Select>
          </FormField>
          <FormField label="Disciplina">
            <Select value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)} disabled={!selectedPeriod}>
              <option value="">— Selecione a disciplina —</option>
              {subjects.map(s => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}
            </Select>
          </FormField>
        </div>
      </div>

      {/* Grade table */}
      {loading && <PageLoader />}

      {!loading && selectedPeriod && selectedSubject && (
        <div className="glass-card overflow-hidden">
          <div className="px-5 py-4 border-b border-ink-600/50 flex items-center justify-between">
            <p className="section-title">{rows.length} aluno{rows.length !== 1 ? 's' : ''} matriculados</p>
            {rows.length > 0 && (
              <Button size="sm" onClick={saveAll}>Salvar Todas as Notas</Button>
            )}
          </div>

          {rows.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-mist-500">Nenhum aluno matriculado nessa turma.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-sans">
                <thead>
                  <tr className="border-b border-ink-600/50">
                    <th className="text-left px-4 py-3 text-xs font-medium text-mist-500 uppercase tracking-wider">Aluno</th>
                    {GRADE_TYPES.map(t => (
                      <th key={t} className="text-center px-3 py-3 text-xs font-medium text-mist-500 uppercase tracking-wider">{t}</th>
                    ))}
                    <th className="text-center px-4 py-3 text-xs font-medium text-mist-500 uppercase tracking-wider">Média</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-700/40">
                  {rows.map((row, idx) => {
                    const vals = GRADE_TYPES.map(t => row.grades[t]).filter(v => v !== '' && v !== undefined).map(Number)
                    const avg = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null
                    return (
                      <tr key={row.enrollment.id} className="table-row-hover">
                        <td className="px-4 py-3">
                          <p className="font-medium text-mist-100">{row.enrollment.student?.name}</p>
                          {row.enrollment.student?.registration && (
                            <p className="text-xs text-mist-500">{row.enrollment.student.registration}</p>
                          )}
                        </td>
                        {GRADE_TYPES.map(type => (
                          <td key={type} className="px-3 py-3 text-center">
                            <input
                              type="number" step="0.1" min={0} max={10}
                              className="w-16 input-base text-center text-sm py-1.5 px-2"
                              placeholder="—"
                              value={row.grades[type] ?? ''}
                              onChange={e => setGradeValue(idx, type, e.target.value)}
                            />
                          </td>
                        ))}
                        <td className="px-4 py-3 text-center">
                          {avg !== null ? (
                            <span className={`font-semibold font-display text-base ${avg >= 6 ? 'text-success' : 'text-danger'}`}>
                              {avg.toFixed(1)}
                            </span>
                          ) : <span className="text-mist-600">—</span>}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {row.saved ? (
                            <span className="text-xs text-success flex items-center gap-1 justify-end">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                              </svg>
                              Salvo
                            </span>
                          ) : (
                            <Button size="sm" variant="secondary" loading={row.saving} onClick={() => saveRow(idx)}>
                              Salvar
                            </Button>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {!selectedPeriod && (
        <div className="glass-card p-8 text-center">
          <p className="text-mist-400 text-sm">Selecione um período e uma disciplina para lançar notas.</p>
        </div>
      )}
    </div>
  )
}
