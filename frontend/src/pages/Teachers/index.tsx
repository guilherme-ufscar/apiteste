import { useEffect, useState } from 'react'
import DataTable, { Column } from '../../components/ui/DataTable'
import Modal from '../../components/ui/Modal'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import TeacherForm from '../../components/forms/TeacherForm'
import type { Teacher, TeacherCreate } from '../../types'
import { teachersApi } from '../../api/teachers'

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [editing, setEditing] = useState<Teacher | null>(null)
  const [deleting, setDeleting] = useState<Teacher | null>(null)
  const [toast, setToast] = useState('')

  const load = () => {
    setLoading(true)
    teachersApi.list().then(r => setTeachers(r.data)).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const filtered = teachers.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.email.toLowerCase().includes(search.toLowerCase())
  )

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const handleCreate = async (data: TeacherCreate) => {
    await teachersApi.create(data)
    setShowCreate(false)
    showToast('Professor cadastrado!')
    load()
  }

  const handleUpdate = async (data: TeacherCreate) => {
    if (!editing) return
    await teachersApi.update(editing.id, data)
    setEditing(null)
    showToast('Professor atualizado!')
    load()
  }

  const handleDelete = async () => {
    if (!deleting) return
    await teachersApi.delete(deleting.id)
    setDeleting(null)
    showToast('Professor desativado!')
    load()
  }

  const columns: Column<Teacher>[] = [
    { key: 'name', header: 'Nome', sortable: true, render: t => <span className="font-medium text-mist-100">{t.name}</span> },
    { key: 'email', header: 'Email', render: t => <span className="text-mist-400">{t.email}</span> },
    { key: 'phone', header: 'Telefone', render: t => t.phone ?? '—' },
    { key: 'hire_date', header: 'Contratação', render: t => t.hire_date ? new Date(t.hire_date).toLocaleDateString('pt-BR') : '—' },
    { key: 'is_active', header: 'Status', render: t => <Badge status={String(t.is_active)} /> },
    {
      key: 'actions', header: 'Ações',
      render: t => (
        <div className="flex gap-2" onClick={e => e.stopPropagation()}>
          <Button size="sm" variant="secondary" onClick={() => setEditing(t)}>Editar</Button>
          <Button size="sm" variant="danger" onClick={() => setDeleting(t)}>Desativar</Button>
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
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-mist-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input className="input-base pl-10" placeholder="Buscar professor..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Novo Professor
        </Button>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="px-5 py-3 border-b border-ink-600/50">
          <p className="text-sm text-mist-400">{filtered.length} professor{filtered.length !== 1 ? 'es' : ''}</p>
        </div>
        <DataTable columns={columns} data={filtered} loading={loading} keyExtractor={t => t.id}
          emptyTitle="Nenhum professor encontrado" emptyDescription="Cadastre um professor para começar" />
      </div>

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Novo Professor">
        <TeacherForm onSubmit={handleCreate} onCancel={() => setShowCreate(false)} />
      </Modal>
      <Modal open={!!editing} onClose={() => setEditing(null)} title="Editar Professor">
        {editing && <TeacherForm initial={editing} onSubmit={handleUpdate} onCancel={() => setEditing(null)} />}
      </Modal>
      <Modal open={!!deleting} onClose={() => setDeleting(null)} title="Confirmar Desativação" size="sm">
        {deleting && (
          <div className="space-y-4">
            <p className="text-mist-300 text-sm">Desativar professor <span className="text-mist-100 font-medium">{deleting.name}</span>?</p>
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setDeleting(null)}>Cancelar</Button>
              <Button variant="danger" onClick={handleDelete}>Desativar</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
