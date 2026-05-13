'use client'

import { useState, useMemo } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import { TopBar } from '@/components/kicker/top-bar'
import { AthleteCard } from '@/components/kicker/athlete-card'
import { FilterChips, type FilterValue } from '@/components/kicker/filter-chips'
import { athletes } from '@/lib/mock-data'

export default function ElencoPage() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<FilterValue>('todos')

  const filtered = useMemo(() => {
    return athletes.filter((a) => {
      const matchesQuery =
        !query ||
        a.name.toLowerCase().includes(query.toLowerCase()) ||
        a.position.toLowerCase().includes(query.toLowerCase())
      const matchesFilter = filter === 'todos' || a.profile === filter
      return matchesQuery && matchesFilter
    })
  }, [query, filter])

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
              placeholder="Buscar atleta ou posição…"
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
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            padding: '0 14px',
            paddingBottom: 24,
          }}
        >
          {filtered.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '40px 0',
                color: 'var(--text-subtle)',
                fontSize: 13,
              }}
            >
              Nenhum atleta encontrado
            </div>
          ) : (
            filtered.map((athlete, i) => (
              <div
                key={athlete.id}
                className="animate-slide-up"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <AthleteCard athlete={athlete} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
