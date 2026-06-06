import { useEffect, useState } from 'react'
import StatCard from '../components/ui/StatCard'
import { PageLoader } from '../components/ui/LoadingSpinner'
import type { DashboardStats } from '../types'
import { dashboardApi } from '../api/dashboard'

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    dashboardApi.stats()
      .then(r => setStats(r.data))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <PageLoader />
  if (error) return (
    <div className="glass-card p-6 text-center">
      <p className="text-danger">Erro ao carregar dashboard: {error}</p>
    </div>
  )
  if (!stats) return null

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total de Alunos"
          value={stats.total_students}
          color="blue"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
        />
        <StatCard
          label="Professores"
          value={stats.total_teachers}
          color="gold"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
          }
        />
        <StatCard
          label="Disciplinas"
          value={stats.total_subjects}
          color="green"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          }
        />
        <StatCard
          label="Matrículas Ativas"
          value={stats.active_enrollments}
          color="blue"
          subtitle={stats.pass_rate !== null ? `${Math.round(stats.pass_rate * 100)}% aprovação` : undefined}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          }
        />
      </div>

      {/* Average grade banner */}
      {stats.average_grade !== null && (
        <div className="glass-card px-5 py-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-aureate/10 border border-aureate/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-aureate" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
          <div>
            <p className="label-base">Média geral do sistema</p>
            <p className="font-display text-2xl font-semibold text-aureate">{stats.average_grade.toFixed(1)}</p>
          </div>
          {stats.pass_rate !== null && (
            <div className="ml-8">
              <p className="label-base">Taxa de aprovação</p>
              <p className="font-display text-2xl font-semibold text-success">{Math.round(stats.pass_rate * 100)}%</p>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Enrollments */}
        <div className="glass-card">
          <div className="px-5 py-4 border-b border-ink-600/50">
            <h2 className="section-title">Matrículas Recentes</h2>
          </div>
          <div className="divide-y divide-ink-700/40">
            {stats.recent_enrollments.length === 0 ? (
              <p className="px-5 py-6 text-mist-500 text-sm text-center">Nenhuma matrícula registrada</p>
            ) : stats.recent_enrollments.map(e => (
              <div key={e.id} className="px-5 py-3 flex items-center justify-between table-row-hover">
                <div>
                  <p className="text-sm font-medium text-mist-100">{e.student}</p>
                  <p className="text-xs text-mist-500">{e.subject}</p>
                </div>
                <p className="text-xs text-mist-500">
                  {new Date(e.enrolled_at).toLocaleDateString('pt-BR')}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Grades by Subject */}
        <div className="glass-card">
          <div className="px-5 py-4 border-b border-ink-600/50">
            <h2 className="section-title">Médias por Disciplina</h2>
          </div>
          <div className="divide-y divide-ink-700/40">
            {stats.grades_by_subject.length === 0 ? (
              <p className="px-5 py-6 text-mist-500 text-sm text-center">Nenhuma nota registrada</p>
            ) : stats.grades_by_subject.map((g, i) => (
              <div key={i} className="px-5 py-3 flex items-center justify-between table-row-hover">
                <div className="flex-1 mr-4">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-mist-100">{g.subject}</p>
                    <p className={`text-sm font-semibold font-display ${g.average >= 6 ? 'text-success' : 'text-danger'}`}>
                      {g.average.toFixed(1)}
                    </p>
                  </div>
                  <div className="w-full h-1.5 bg-ink-600/60 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${g.average >= 6 ? 'bg-success' : 'bg-danger'}`}
                      style={{ width: `${(g.average / 10) * 100}%` }}
                    />
                  </div>
                </div>
                <p className="text-xs text-mist-500 flex-shrink-0">{g.count} notas</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
