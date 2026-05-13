'use client'

import { cn } from '@/lib/utils'
import type { AthleteProfile } from '@/lib/mock-data'

export type FilterValue = 'todos' | AthleteProfile

const filters: { value: FilterValue; label: string; dotClass?: string }[] = [
  { value: 'todos',     label: 'Todos' },
  { value: 'explosivo', label: 'Explosivo',    dotClass: 'k-dot--warning' },
  { value: 'impacto',   label: 'Alto impacto', dotClass: 'k-dot--alert' },
  { value: 'resist',    label: 'Alta resist.', dotClass: 'k-dot--success' },
  { value: 'baixa',     label: 'Baixa intens.',dotClass: 'k-dot--muted' },
]

interface FilterChipsProps {
  value: FilterValue
  onChange: (v: FilterValue) => void
}

export function FilterChips({ value, onChange }: FilterChipsProps) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 6,
        overflowX: 'auto',
        padding: '0 14px',
        scrollbarWidth: 'none',
      }}
    >
      {filters.map((f) => (
        <button
          key={f.value}
          aria-selected={value === f.value}
          onClick={() => onChange(f.value)}
          className={cn('k-chip', value === f.value && 'k-chip--selected')}
        >
          {f.dotClass && value !== f.value && (
            <span className={cn('k-dot', f.dotClass)} />
          )}
          {f.label}
        </button>
      ))}
    </div>
  )
}
