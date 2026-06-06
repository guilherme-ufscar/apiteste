interface StatCardProps {
  label: string
  value: string | number
  icon: React.ReactNode
  color?: 'blue' | 'gold' | 'green' | 'red'
  subtitle?: string
}

import React from 'react'

const colorMap = {
  blue: { bg: 'bg-azure/10 border-azure/20', icon: 'text-azure', glow: 'shadow-glow-sm' },
  gold: { bg: 'bg-aureate/10 border-aureate/20', icon: 'text-aureate', glow: '' },
  green: { bg: 'bg-success/10 border-success/20', icon: 'text-success', glow: '' },
  red: { bg: 'bg-danger/10 border-danger/20', icon: 'text-danger', glow: '' },
}

export default function StatCard({ label, value, icon, color = 'blue', subtitle }: StatCardProps) {
  const c = colorMap[color]
  return (
    <div className={`glass-card p-5 ${c.glow} animate-slide-up`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="label-base">{label}</p>
          <p className="font-display text-3xl font-semibold text-mist-100 mt-1">{value}</p>
          {subtitle && <p className="text-xs text-mist-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`w-11 h-11 rounded-xl border ${c.bg} flex items-center justify-center ${c.icon} flex-shrink-0`}>
          {icon}
        </div>
      </div>
    </div>
  )
}
