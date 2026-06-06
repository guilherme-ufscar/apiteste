import { useEffect, useState } from 'react'
import DataTable, { Column } from '../../components/ui/DataTable'
import Modal from '../../components/ui/Modal'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import PeriodForm from '../../components/forms/PeriodForm'
import type { Period, PeriodCreate } from '../../types'
import { periodsApi } from '../../api/periods'

export default function PeriodsPage() {
  const [periods, setPeriods] = useState<Period[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [editing, setEditing] = useState<Period | null>(null)
  const [deleting, setDeleting] = useState<Period | null>(null)
  const [toast, setToast] = useState('')

  const load = () => {
    setLoading(true)
    periodsApi.list().then(r => setPeriods(r.data)).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const handleCreate = async (data: PeriodCreate) => {
    await periodsApi.create(data)
    setShowCreate(false)
    showToast('Período criado!')
    load()
  }

  const handleUpdate = async (data: PeriodCreate) => {
    if (!editing) return
    await periodsApi.update(editing.id, data)
    setEditing(null)
    showToast('Período atualizado!')
    load()
  }

  const handleDelete = async () => {
    if (!deleting) return
    await periodsApi.delete(deleting.id)
    setDeleting(null)
    showToast('Período removido!')
    load()
  }

  const toggleActive = async (period: Period) => {
    await periodsApi.patch(period.id, { is_active: !period.is_active })
    showToast(period.is_active ? 'Período desativado' : 'Período ativado!')
    load()
  }

  const columns: Column<Period>[] = [
    { key: 'name', header: 'Período', sortable: true, render: p => <span className="font-medium text-mist-100">{p.name}</span> },
    { key: 'year', header: 'Ano', render: p => p.year },
    { key: 'semester', header: 'Semestre', render: p => `${p.semester}° Semestre` },
    { key: 'start_date', header: 'Início', render: p => p.start_date ? new Date(p.start_date).toLocaleDateString('pt-BR') : '—' },
    { key: 'end_date', header: 'Término', render: p => p.end_date ? new Date(p.end_date).toLocaleDateString('pt-BR') : '—' },
    { key: 'is_active', header: 'Status', render: p => <Badge status={p.is_active ? 'active' : 'inactive'} /> },
    {
      key: 'actions', header: 'Ações',
      render: p => (
        <div className="flex gap-2" onClick={e => e.stopPropagation()}>
          <Button size="sm" variant={p.is_active ? 'secondary' : 'primary'} onClick={() => toggleActive(p)}>
            {p.is_active ? 'Desativar' : 'Ativar'}
          </Button>
          <Button size="sm" variant="secondary" onClick={() => setEditing(p)}>Editar</Button>
          <Button size="sm" variant="danger" onClick={() => setDeleting(p)}>Remover</Button>
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
          Novo Período
        </Button>
      </div>

      <div className="glass-card overflow-hidden">
        <DataTable columns={columns} data={periods} loading={loading} keyExtractor={p => p.id}
          emptyTitle="Nenhum período cadastrado" emptyDescription="Crie um período letivo para começar" />
      </div>

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Novo Período" size="lg">
        <PeriodForm onSubmit={handleCreate} onCancel={() => setShowCreate(false)} />
      </Modal>
      <Modal open={!!editing} onClose={() => setEditing(null)} title="Editar Período" size="lg">
        {editing && <PeriodForm initial={editing} onSubmit={handleUpdate} onCancel={() => setEditing(null)} />}
      </Modal>
      <Modal open={!!deleting} onClose={() => setDeleting(null)} title="Confirmar Remoção" size="sm">
        {deleting && (
          <div className="space-y-4">
            <p className="text-mist-300 text-sm">Remover período <span className="text-mist-100 font-medium">{deleting.name}</span>? Isso removerá todas as matrículas vinculadas.</p>
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
