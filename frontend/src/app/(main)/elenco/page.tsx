'use client'

import { useState, useMemo } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import { TopBar } from '@/components/kicker/top-bar'
import { AthleteList } from '@/components/kicker/athlete-list'
import { FilterChips, type FilterValue } from '@/components/kicker/filter-chips'
import { useAthletes } from '@/context/AthleteContext'

export default function ElencoPage() {
  const { athletes, loading, error } = useAthletes()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<FilterValue>('todos')

  const filtered = useMemo(() => {
    return athletes.filter((a) => {
      const matchesQuery =
        !query ||
        a.id.includes(query) ||
        a.position.toLowerCase().includes(query.toLowerCase()) ||
        (a.group && a.group.toLowerCase().includes(query.toLowerCase()))
      const matchesFilter = filter === 'todos' || a.profile === filter
      return matchesQuery && matchesFilter
    })
  }, [query, filter, athletes])

  const alertCount = athletes.filter((a) => a.hasAlert).length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--surface-1)' }}>
      <TopBar
        title="Elenco"
        subtitle={`${athletes.length} atletas · ${alertCount} alerta${alertCount !== 1 ? 's' : ''}`}
        right={
          <button
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              border: '1px solid var(--border-emphasis)',
              background: 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <SlidersHorizontal size={14} color="var(--text-secondary)" />
          </button>
        }
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 14 }}>

        {error && (
          <div style={{ padding: '0 14px' }}>
            <div style={{ padding: 12, background: 'var(--danger-bg)', color: 'var(--danger-text)', borderRadius: 10, fontSize: 13 }}>
              {error}
            </div>
          </div>
        )}

        {/* Search */}
        <div style={{ padding: '0 14px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              height: 36,
              padding: '0 12px',
              background: 'var(--surface-3)',
              border: '1px solid var(--border-emphasis)',
              borderRadius: 10,
            }}
          >
            <Search size={13} color="var(--text-subtle)" style={{ flexShrink: 0 }} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por ID, posição ou grupo…"
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                fontSize: 13,
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-sans)',
              }}
            />
          </div>
        </div>

        {/* Filter chips */}
        <FilterChips value={filter} onChange={setFilter} />

        {/* List */}
        <div style={{ padding: '0 14px', paddingBottom: 24 }}>
          <AthleteList 
            athletes={filtered} 
            loading={loading && athletes.length === 0} 
            emptyMessage="Nenhum atleta encontrado com os filtros atuais."
          />
        </div>
      </div>
    </div>
  )
}
