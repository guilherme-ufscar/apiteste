import { useLocation } from 'react-router-dom'

const titles: Record<string, { title: string; subtitle: string }> = {
  '/': { title: 'Dashboard', subtitle: 'Visão geral do sistema' },
  '/students': { title: 'Alunos', subtitle: 'Gerenciar cadastro de alunos' },
  '/teachers': { title: 'Professores', subtitle: 'Gerenciar corpo docente' },
  '/subjects': { title: 'Disciplinas', subtitle: 'Gerenciar disciplinas e vínculos' },
  '/periods': { title: 'Períodos', subtitle: 'Gerenciar períodos letivos' },
  '/enrollments': { title: 'Matrículas', subtitle: 'Gerenciar matrículas de alunos' },
  '/grades': { title: 'Notas', subtitle: 'Lançamento de notas por disciplina' },
  '/reports': { title: 'Relatórios', subtitle: 'Resumos de desempenho acadêmico' },
}

export default function Header() {
  const location = useLocation()

  const base = '/' + location.pathname.split('/')[1]
  const info = titles[base] ?? { title: 'Escola', subtitle: '' }

  return (
    <header className="sticky top-0 z-10 bg-ink-950/90 backdrop-blur-md border-b border-ink-700/50 px-6 py-4">
      <div>
        <h1 className="font-display text-xl font-semibold text-mist-100 leading-tight">{info.title}</h1>
        {info.subtitle && <p className="text-xs text-mist-500 mt-0.5">{info.subtitle}</p>}
      </div>
    </header>
  )
}
