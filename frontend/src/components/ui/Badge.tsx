interface BadgeProps {
  status: string
}

const config: Record<string, { label: string; className: string }> = {
  active: { label: 'Ativo', className: 'bg-success/15 text-success border-success/30' },
  inactive: { label: 'Inativo', className: 'bg-mist-500/15 text-mist-400 border-mist-500/30' },
  cancelled: { label: 'Cancelado', className: 'bg-danger/15 text-danger border-danger/30' },
  completed: { label: 'Concluído', className: 'bg-azure-glow text-azure border-azure/30' },
  true: { label: 'Ativo', className: 'bg-success/15 text-success border-success/30' },
  false: { label: 'Inativo', className: 'bg-mist-500/15 text-mist-400 border-mist-500/30' },
}

export default function Badge({ status }: BadgeProps) {
  const key = String(status)
  const c = config[key] ?? { label: key, className: 'bg-mist-500/15 text-mist-400 border-mist-500/30' }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${c.className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-80" />
      {c.label}
    </span>
  )
}
