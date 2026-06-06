import { useEffect, useState } from 'react'
import FormField, { Select } from '../../components/ui/FormField'
import { PageLoader } from '../../components/ui/LoadingSpinner'
import type { Period } from '../../types'
import { periodsApi } from '../../api/periods'
import client from '../../api/client'

interface GradeSummaryRow {
  student_id: number
  student_name: string
  registration?: string
  subject: string
  code: string
  average: number
  passed: boolean
}

export default function ReportsPage() {
  const [periods, setPeriods] = useState<Period[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState('')
  const [rows, setRows] = useState<GradeSummaryRow[]>([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState<'all' | 'passing' | 'failing'>('all')

  useEffect(() => {
    periodsApi.list().then(r => setPeriods(r.data))
  }, [])

  useEffect(() => {
    if (!selectedPeriod) { setRows([]); return }
    setLoading(true)
    client.get('/reports/grade-summary', { params: { period_id: selectedPeriod } })
      .then(r => setRows(r.data))
      .finally(() => setLoading(false))
  }, [selectedPeriod])

  const filtered = rows.filter(r => {
    if (filter === 'passing') return r.passed
    if (filter === 'failing') return !r.passed
    return true
  })

  const passing = rows.filter(r => r.passed).length
  const failing = rows.filter(r => !r.passed).length

  return (
    <div className="space-y-5 animate-slide-up">
      {/* Filter bar */}
      <div className="glass-card p-5">
        <div className="flex items-end gap-4">
          <div className="flex-1 max-w-xs">
            <FormField label="Período Letivo">
              <Select value={selectedPeriod} onChange={e => setSelectedPeriod(e.target.value)}>
                <option value="">— Todos os períodos —</option>
                {periods.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </Select>
            </FormField>
          </div>
          {rows.length > 0 && (
            <div className="flex gap-2 pb-0.5">
              {(['all', 'passing', 'failing'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    filter === f
                      ? f === 'failing' ? 'bg-danger/15 text-danger border border-danger/30'
                        : f === 'passing' ? 'bg-success/15 text-success border border-success/30'
                        : 'bg-azure/15 text-azure border border-azure/30'
                      : 'text-mist-400 hover:text-mist-200 hover:bg-ink-700/50'
                  }`}
                >
                  {f === 'all' ? `Todos (${rows.length})` : f === 'passing' ? `Aprovados (${passing})` : `Reprovados (${failing})`}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Stats summary */}
      {rows.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <div className="glass-card p-4 text-center">
            <p className="label-base">Total de Registros</p>
            <p className="font-display text-2xl font-semibold text-mist-100">{rows.length}</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="label-base">Aprovados</p>
            <p className="font-display text-2xl font-semibold text-success">{passing}</p>
            <p className="text-xs text-mist-500">{rows.length ? Math.round((passing / rows.length) * 100) : 0}%</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="label-base">Reprovados</p>
            <p className="font-display text-2xl font-semibold text-danger">{failing}</p>
            <p className="text-xs text-mist-500">{rows.length ? Math.round((failing / rows.length) * 100) : 0}%</p>
          </div>
        </div>
      )}

      {/* Table */}
      {loading ? <PageLoader /> : (
        <div className="glass-card overflow-hidden">
          {!selectedPeriod ? (
            <div className="p-8 text-center">
              <p className="text-mist-500 text-sm">Selecione um período para visualizar o relatório.</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-mist-500 text-sm">Nenhum registro encontrado.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-sans">
                <thead>
                  <tr className="border-b border-ink-600/50">
                    <th className="text-left px-4 py-3 text-xs font-medium text-mist-500 uppercase tracking-wider">Aluno</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-mist-500 uppercase tracking-wider">Matrícula</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-mist-500 uppercase tracking-wider">Disciplina</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-mist-500 uppercase tracking-wider">Código</th>
                    <th className="text-center px-4 py-3 text-xs font-medium text-mist-500 uppercase tracking-wider">Média</th>
                    <th className="text-center px-4 py-3 text-xs font-medium text-mist-500 uppercase tracking-wider">Situação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-700/40">
                  {filtered.map((row, i) => (
                    <tr key={i} className="table-row-hover">
                      <td className="px-4 py-3 font-medium text-mist-100">{row.student_name}</td>
                      <td className="px-4 py-3 text-mist-400 font-mono text-xs">{row.registration ?? '—'}</td>
                      <td className="px-4 py-3 text-mist-200">{row.subject}</td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs bg-azure/10 text-azure border border-azure/20 px-2 py-0.5 rounded">{row.code}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`font-semibold font-display text-base ${row.average >= 6 ? 'text-success' : 'text-danger'}`}>
                          {row.average.toFixed(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                          ${row.passed
                            ? 'bg-success/15 text-success border-success/30'
                            : 'bg-danger/15 text-danger border-danger/30'}`}>
                          {row.passed ? 'Aprovado' : 'Reprovado'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
