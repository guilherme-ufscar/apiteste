import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DataTable, { Column } from '../../components/ui/DataTable'
import Modal from '../../components/ui/Modal'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import StudentForm from '../../components/forms/StudentForm'
import type { Student, StudentCreate } from '../../types'
import { studentsApi } from '../../api/students'

export default function StudentsPage() {
  const navigate = useNavigate()
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [editing, setEditing] = useState<Student | null>(null)
  const [deleting, setDeleting] = useState<Student | null>(null)
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const r = await studentsApi.list()
      setStudents(r.data)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erro')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase()) ||
    (s.registration ?? '').includes(search)
  )

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const handleCreate = async (data: StudentCreate) => {
    await studentsApi.create(data)
    setShowCreate(false)
    showToast('Aluno cadastrado com sucesso!')
    load()
  }

  const handleUpdate = async (data: StudentCreate) => {
    if (!editing) return
    await studentsApi.update(editing.id, data)
    setEditing(null)
    showToast('Aluno atualizado!')
    load()
  }

  const handleDelete = async () => {
    if (!deleting) return
    await studentsApi.delete(deleting.id)
    setDeleting(null)
    showToast('Aluno desativado!')
    load()
  }

  const columns: Column<Student>[] = [
    {
      key: 'name', header: 'Nome', sortable: true,
      render: s => (
        <span className="font-medium text-mist-100 hover:text-azure cursor-pointer"
          onClick={e => { e.stopPropagation(); navigate(`/students/${s.id}`) }}>
          {s.name}
        </span>
      )
    },
    { key: 'email', header: 'Email', sortable: true, render: s => <span className="text-mist-400">{s.email}</span> },
    { key: 'registration', header: 'Matrícula', render: s => s.registration ?? '—' },
    { key: 'phone', header: 'Telefone', render: s => s.phone ?? '—' },
    { key: 'is_active', header: 'Status', render: s => <Badge status={String(s.is_active)} /> },
    {
      key: 'actions', header: 'Ações',
      render: s => (
        <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
          <Button size="sm" variant="ghost" onClick={() => navigate(`/students/${s.id}`)}>Ver</Button>
          <Button size="sm" variant="secondary" onClick={() => setEditing(s)}>Editar</Button>
          <Button size="sm" variant="danger" onClick={() => setDeleting(s)}>Desativar</Button>
        </div>
      )
    },
  ]

  return (
    <div className="space-y-5 animate-slide-up">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-success/15 border border-success/30 text-success
          px-4 py-3 rounded-xl text-sm font-medium shadow-lg animate-slide-up">
          {toast}
        </div>
      )}

      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-mist-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            className="input-base pl-10"
            placeholder="Buscar por nome, email ou matrícula..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Novo Aluno
        </Button>
      </div>

      {error && <div className="glass-card p-4 text-danger text-sm">{error}</div>}

      <div className="glass-card overflow-hidden">
        <div className="px-5 py-3 border-b border-ink-600/50 flex items-center justify-between">
          <p className="text-sm text-mist-400">{filtered.length} aluno{filtered.length !== 1 ? 's' : ''}</p>
        </div>
        <DataTable
          columns={columns}
          data={filtered}
          loading={loading}
          keyExtractor={s => s.id}
          emptyTitle="Nenhum aluno encontrado"
          emptyDescription="Cadastre um novo aluno para começar"
        />
      </div>

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Novo Aluno" size="lg">
        <StudentForm onSubmit={handleCreate} onCancel={() => setShowCreate(false)} />
      </Modal>

      <Modal open={!!editing} onClose={() => setEditing(null)} title="Editar Aluno" size="lg">
        {editing && <StudentForm initial={editing} onSubmit={handleUpdate} onCancel={() => setEditing(null)} />}
      </Modal>

      <Modal open={!!deleting} onClose={() => setDeleting(null)} title="Confirmar Desativação" size="sm">
        {deleting && (
          <div className="space-y-4">
            <p className="text-mist-300 text-sm">
              Deseja desativar o aluno <span className="text-mist-100 font-medium">{deleting.name}</span>?
              As matrículas e notas serão mantidas.
            </p>
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
