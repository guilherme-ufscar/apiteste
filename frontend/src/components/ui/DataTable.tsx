import React, { useState } from 'react'
import { PageLoader } from './LoadingSpinner'
import EmptyState from './EmptyState'

export interface Column<T> {
  key: string
  header: string
  render?: (row: T) => React.ReactNode
  sortable?: boolean
  className?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  loading?: boolean
  emptyTitle?: string
  emptyDescription?: string
  keyExtractor: (row: T) => string | number
  onRowClick?: (row: T) => void
}

export default function DataTable<T>({
  columns,
  data,
  loading,
  emptyTitle = 'Nenhum registro encontrado',
  emptyDescription,
  keyExtractor,
  onRowClick,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  const toggleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const sorted = sortKey
    ? [...data].sort((a, b) => {
        const av = (a as Record<string, unknown>)[sortKey]
        const bv = (b as Record<string, unknown>)[sortKey]
        const cmp = String(av ?? '').localeCompare(String(bv ?? ''))
        return sortDir === 'asc' ? cmp : -cmp
      })
    : data

  if (loading) return <PageLoader />

  if (!data.length) return <EmptyState title={emptyTitle} description={emptyDescription} />

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm font-sans">
        <thead>
          <tr className="border-b border-ink-600/60">
            {columns.map(col => (
              <th
                key={col.key}
                className={`text-left px-4 py-3 text-xs font-medium text-mist-500 uppercase tracking-wider
                  ${col.sortable ? 'cursor-pointer hover:text-mist-300 select-none' : ''}
                  ${col.className ?? ''}`}
                onClick={col.sortable ? () => toggleSort(col.key) : undefined}
              >
                <span className="inline-flex items-center gap-1">
                  {col.header}
                  {col.sortable && (
                    <span className="text-mist-600">
                      {sortKey === col.key ? (sortDir === 'asc' ? '↑' : '↓') : '⇅'}
                    </span>
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-700/40">
          {sorted.map(row => (
            <tr
              key={keyExtractor(row)}
              className={`table-row-hover ${onRowClick ? 'cursor-pointer' : ''}`}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map(col => (
                <td key={col.key} className={`px-4 py-3 text-mist-200 ${col.className ?? ''}`}>
                  {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? '—')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
