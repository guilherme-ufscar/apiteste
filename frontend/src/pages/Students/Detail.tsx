import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { PageLoader } from '../../components/ui/LoadingSpinner'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import type { ReportCard } from '../../types'
import { studentsApi } from '../../api/students'

export default function StudentDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [data, setData] = useState<ReportCard | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    studentsApi.reportCard(Number(id))
      .then(r => setData(r.data))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <PageLoader />
  if (error) return (
    <div className="glass-card p-6 text-center">
      <p className="text-danger">{error}</p>
      <Button variant="ghost" className="mt-3" onClick={() => navigate('/students')}>Voltar</Button>
    </div>
  )
  if (!data) return null

  const { student, report } = data

  const calcAvg = (grades: Record<string, number>) => {
    const vals = Object.values(grades)
    return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null
  }

  const allTypes = [...new Set(report.flatMap(r => Object.keys(r.grades)))]

  return (
    <div className="space-y-6 animate-slide-up max-w-5xl">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/students')} className="btn-ghost p-2 rounded-lg">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="page-title">Boletim do Aluno</h1>
      </div>

      {/* Student Info */}
      <div className="glass-card p-5">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-azure/10 border border-azure/20 flex items-center justify-center flex-shrink-0">
            <span className="font-display text-xl font-semibold text-azure">
              {student.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1">
            <h2 className="font-display text-xl font-semibold text-mist-100">{student.name}</h2>
            <p className="text-sm text-mist-400 mt-0.5">{student.email}</p>
            {student.registration && (
              <p className="text-xs text-mist-500 mt-1">Matrícula: <span className="text-mist-300">{student.registration}</span></p>
            )}
          </div>
          <div className="text-right">
            {report.length > 0 && (
              <>
                <p className="label-base">Média geral</p>
                <p className="font-display text-2xl font-semibold text-aureate">
                  {(report.reduce((acc, r) => {
                    const avg = calcAvg(r.grades)
                    return avg !== null ? acc + avg : acc
                  }, 0) / report.filter(r => Object.keys(r.grades).length > 0).length || 0).toFixed(1)}
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Report Card */}
      {report.length === 0 ? (
        <div className="glass-card p-8 text-center">
          <p className="text-mist-400">Nenhuma matrícula encontrada para este aluno.</p>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="px-5 py-4 border-b border-ink-600/50">
            <h3 className="section-title">Boletim Escolar</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-sans">
              <thead>
                <tr className="border-b border-ink-600/50">
                  <th className="text-left px-4 py-3 text-xs font-medium text-mist-500 uppercase tracking-wider">Disciplina</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-mist-500 uppercase tracking-wider">Período</th>
                  {allTypes.map(t => (
                    <th key={t} className="text-center px-3 py-3 text-xs font-medium text-mist-500 uppercase tracking-wider">{t}</th>
                  ))}
                  <th className="text-center px-4 py-3 text-xs font-medium text-mist-500 uppercase tracking-wider">Média</th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-mist-500 uppercase tracking-wider">Situação</th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-mist-500 uppercase tracking-wider">Frequência</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-700/40">
                {report.map(entry => {
                  const avg = calcAvg(entry.grades)
                  return (
                    <tr key={entry.enrollment_id} className="table-row-hover">
                      <td className="px-4 py-3">
                        <p className="font-medium text-mist-100">{entry.subject.name}</p>
                        <p className="text-xs text-mist-500">{entry.subject.code}</p>
                      </td>
                      <td className="px-4 py-3 text-mist-400">{entry.period.name}</td>
                      {allTypes.map(t => (
                        <td key={t} className="px-3 py-3 text-center">
                          {entry.grades[t] !== undefined ? (
                            <span className={`font-medium font-display ${entry.grades[t] >= 6 ? 'text-success' : 'text-danger'}`}>
                              {entry.grades[t].toFixed(1)}
                            </span>
                          ) : <span className="text-mist-600">—</span>}
                        </td>
                      ))}
                      <td className="px-4 py-3 text-center">
                        {avg !== null ? (
                          <span className={`font-semibold font-display text-base ${avg >= 6 ? 'text-success' : 'text-danger'}`}>
                            {avg.toFixed(1)}
                          </span>
                        ) : <span className="text-mist-600">—</span>}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {entry.passed !== null ? (
                          <Badge status={entry.passed ? 'active' : 'cancelled'} />
                        ) : <span className="text-mist-600">—</span>}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {entry.attendance_rate !== null ? (
                          <span className={entry.attendance_rate >= 0.75 ? 'text-success' : 'text-warning'}>
                            {Math.round(entry.attendance_rate * 100)}%
                          </span>
                        ) : <span className="text-mist-600">—</span>}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
