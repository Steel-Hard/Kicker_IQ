import Link from 'next/link'
import { Avatar } from './avatar'
import { AthletePill } from './athlete-pill'
import type { Athlete } from '@/lib/mock-data'
import { formatNumber } from '@/lib/utils'

interface AthleteCardProps {
  athlete: Athlete
  showAlert?: boolean
  analyticsData?: Record<string, any>
}

export function AthleteCard({ athlete, analyticsData }: AthleteCardProps) {
  const sessions = analyticsData?.total_sessions || '—'
  const anomalies = analyticsData?.anomalies_count || '0'
  const lastClass = analyticsData?.performance_status || '—'
  const isQueda = lastClass === 'Queda de Desempenho'

  return (
    <Link
      href={`/atleta/${athlete.id}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 14px',
        background: 'var(--surface-2)',
        border: '1px solid var(--border-default)',
        borderRadius: 10,
        textDecoration: 'none',
        transition: 'background 120ms',
        position: 'relative',
        flexWrap: 'wrap',
      }}
    >
      <Avatar id={athlete.id} initials={athlete.initials} profile={athlete.profile} size="md" />

      <div style={{ flex: 1, minWidth: 200, display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
            <span
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: 'var(--text-primary)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              ID: {athlete.id}
            </span>
            {athlete.hasAlert && (
              <span className="k-dot k-dot--alert" />
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 11, color: 'var(--text-subtle)' }}>
              {athlete.position} · {athlete.group || 'N/A'}
            </span>
            <AthletePill profile={athlete.profile} label={athlete.profileLabel} />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, textAlign: 'right', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: 9, color: 'var(--text-subtle)', fontWeight: 500 }}>Sessões</span>
            <span style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>{sessions}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: 9, color: 'var(--text-subtle)', fontWeight: 500 }}>Anomalias</span>
            <span style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>{anomalies}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', minWidth: 100 }}>
            <span style={{ fontSize: 9, color: 'var(--text-subtle)', fontWeight: 500 }}>Última Classificação</span>
            <span style={{ fontSize: 11, color: isQueda ? 'var(--danger)' : 'var(--text-secondary)', fontWeight: 500 }}>{lastClass}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
