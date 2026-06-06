import { useEffect, useState } from 'react'
import DataTable, { Column } from '../../components/ui/DataTable'
import Modal from '../../components/ui/Modal'
import Button from '../../components/ui/Button'
import SubjectForm from '../../components/forms/SubjectForm'
import type { Subject, SubjectCreate } from '../../types'
import { subjectsApi } from '../../api/subjects'

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [editing, setEditing] = useState<Subject | null>(null)
  const [deleting, setDeleting] = useState<Subject | null>(null)
  const [toast, setToast] = useState('')

  const load = () => {
    setLoading(true)
    subjectsApi.list().then(r => setSubjects(r.data)).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const filtered = subjects.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.code.toLowerCase().includes(search.toLowerCase())
  )

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const handleCreate = async (data: SubjectCreate) => {
    await subjectsApi.create(data)
    setShowCreate(false)
    showToast('Disciplina cadastrada!')
    load()
  }

  const handleUpdate = async (data: SubjectCreate) => {
    if (!editing) return
    await subjectsApi.update(editing.id, data)
    setEditing(null)
    showToast('Disciplina atualizada!')
    load()
  }

  const handleDelete = async () => {
    if (!deleting) return
    await subjectsApi.delete(deleting.id)
    setDeleting(null)
    showToast('Disciplina removida!')
    load()
  }

  const columns: Column<Subject>[] = [
    {
      key: 'code', header: 'Código',
      render: s => (
        <span className="font-mono text-xs bg-azure/10 text-azure border border-azure/20 px-2 py-0.5 rounded">{s.code}</span>
      )
    },
    { key: 'name', header: 'Disciplina', sortable: true, render: s => <span className="font-medium text-mist-100">{s.name}</span> },
    { key: 'teacher', header: 'Professor', render: s => s.teacher ? <span className="text-mist-300">{s.teacher.name}</span> : <span className="text-mist-600">—</span> },
    { key: 'workload_hours', header: 'Carga Horária', render: s => `${s.workload_hours}h` },
    {
      key: 'actions', header: 'Ações',
      render: s => (
        <div className="flex gap-2" onClick={e => e.stopPropagation()}>
          <Button size="sm" variant="secondary" onClick={() => setEditing(s)}>Editar</Button>
          <Button size="sm" variant="danger" onClick={() => setDeleting(s)}>Remover</Button>
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
          <input className="input-base pl-10" placeholder="Buscar por nome ou código..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nova Disciplina
        </Button>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="px-5 py-3 border-b border-ink-600/50">
          <p className="text-sm text-mist-400">{filtered.length} disciplina{filtered.length !== 1 ? 's' : ''}</p>
        </div>
        <DataTable columns={columns} data={filtered} loading={loading} keyExtractor={s => s.id}
          emptyTitle="Nenhuma disciplina encontrada" emptyDescription="Cadastre disciplinas para vincular aos alunos" />
      </div>

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Nova Disciplina" size="lg">
        <SubjectForm onSubmit={handleCreate} onCancel={() => setShowCreate(false)} />
      </Modal>
      <Modal open={!!editing} onClose={() => setEditing(null)} title="Editar Disciplina" size="lg">
        {editing && <SubjectForm initial={editing} onSubmit={handleUpdate} onCancel={() => setEditing(null)} />}
      </Modal>
      <Modal open={!!deleting} onClose={() => setDeleting(null)} title="Confirmar Remoção" size="sm">
        {deleting && (
          <div className="space-y-4">
            <p className="text-mist-300 text-sm">Remover a disciplina <span className="text-mist-100 font-medium">{deleting.name}</span>?</p>
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
