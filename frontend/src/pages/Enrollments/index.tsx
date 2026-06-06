import { useEffect, useState } from 'react'
import DataTable, { Column } from '../../components/ui/DataTable'
import Modal from '../../components/ui/Modal'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import EnrollmentForm from '../../components/forms/EnrollmentForm'
import type { Enrollment, EnrollmentCreate } from '../../types'
import { enrollmentsApi } from '../../api/enrollments'

export default function EnrollmentsPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [cancelling, setCancelling] = useState<Enrollment | null>(null)
  const [deleting, setDeleting] = useState<Enrollment | null>(null)
  const [toast, setToast] = useState('')

  const load = () => {
    setLoading(true)
    enrollmentsApi.list().then(r => setEnrollments(r.data)).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const handleCreate = async (data: EnrollmentCreate) => {
    await enrollmentsApi.create(data)
    setShowCreate(false)
    showToast('Matrícula realizada!')
    load()
  }

  const handleCancel = async () => {
    if (!cancelling) return
    await enrollmentsApi.patch(cancelling.id, { status: 'cancelled' })
    setCancelling(null)
    showToast('Matrícula cancelada')
    load()
  }

  const handleDelete = async () => {
    if (!deleting) return
    await enrollmentsApi.delete(deleting.id)
    setDeleting(null)
    showToast('Matrícula removida')
    load()
  }

  const columns: Column<Enrollment>[] = [
    {
      key: 'student', header: 'Aluno',
      render: e => e.student ? <span className="font-medium text-mist-100">{e.student.name}</span> : <span className="text-mist-500">—</span>
    },
    {
      key: 'subject', header: 'Disciplina',
      render: e => e.subject ? (
        <div>
          <span className="text-mist-200">{e.subject.name}</span>
          <span className="ml-2 text-xs text-mist-500 font-mono">{e.subject.code}</span>
        </div>
      ) : <span className="text-mist-500">—</span>
    },
    { key: 'period', header: 'Período', render: e => e.period?.name ?? '—' },
    { key: 'status', header: 'Status', render: e => <Badge status={e.status} /> },
    {
      key: 'enrolled_at', header: 'Data',
      render: e => new Date(e.enrolled_at).toLocaleDateString('pt-BR')
    },
    {
      key: 'actions', header: 'Ações',
      render: e => (
        <div className="flex gap-2" onClick={ev => ev.stopPropagation()}>
          {e.status === 'active' && (
            <Button size="sm" variant="secondary" onClick={() => setCancelling(e)}>Cancelar</Button>
          )}
          <Button size="sm" variant="danger" onClick={() => setDeleting(e)}>Remover</Button>
        </div>
      )
    },
  ]

  return (
    <div className="space-y-5 animate-slide-up">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-success/15 border border-success/30 text-success px-4 py-3 rounded-xl text-sm shadow-lg animate-slide-up">
          {toast}
        </div>
      )}
      <div className="flex justify-end">
        <Button onClick={() => setShowCreate(true)}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nova Matrícula
        </Button>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="px-5 py-3 border-b border-ink-600/50">
          <p className="text-sm text-mist-400">{enrollments.length} matrícula{enrollments.length !== 1 ? 's' : ''}</p>
        </div>
        <DataTable columns={columns} data={enrollments} loading={loading} keyExtractor={e => e.id}
          emptyTitle="Nenhuma matrícula encontrada" emptyDescription="Matricule alunos em disciplinas para começar" />
      </div>

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Nova Matrícula">
        <EnrollmentForm onSubmit={handleCreate} onCancel={() => setShowCreate(false)} />
      </Modal>

      <Modal open={!!cancelling} onClose={() => setCancelling(null)} title="Cancelar Matrícula" size="sm">
        {cancelling && (
          <div className="space-y-4">
            <p className="text-mist-300 text-sm">
              Cancelar matrícula de <span className="text-mist-100 font-medium">{cancelling.student?.name}</span> em{' '}
              <span className="text-mist-100 font-medium">{cancelling.subject?.name}</span>?
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setCancelling(null)}>Voltar</Button>
              <Button variant="danger" onClick={handleCancel}>Cancelar Matrícula</Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={!!deleting} onClose={() => setDeleting(null)} title="Remover Matrícula" size="sm">
        {deleting && (
          <div className="space-y-4">
            <p className="text-mist-300 text-sm">Remover permanentemente esta matrícula e todas as notas/frequência associadas?</p>
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setDeleting(null)}>Cancelar</Button>
              <Button variant="danger" onClick={handleDelete}>Remover</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
