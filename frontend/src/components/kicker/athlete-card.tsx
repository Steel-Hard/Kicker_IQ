import Link from 'next/link'
import { Avatar } from './avatar'
import { AthletePill } from './athlete-pill'
import type { Athlete } from '@/lib/mock-data'
import { formatNumber } from '@/lib/utils'

interface AthleteCardProps {
  athlete: Athlete
  showAlert?: boolean
}

export function AthleteCard({ athlete, showAlert }: AthleteCardProps) {
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
      }}
    >
      <Avatar initials={athlete.initials} profile={athlete.profile} size="md" />

      <div style={{ flex: 1, minWidth: 0 }}>
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
            {athlete.name}
          </span>
          {athlete.hasAlert && (
            <span className="k-dot k-dot--alert" />
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 11, color: 'var(--text-subtle)' }}>
            #{athlete.number} · {athlete.position}
          </span>
          <AthletePill profile={athlete.profile} label={athlete.profileLabel} />
        </div>
      </div>

      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--text-primary)', lineHeight: 1.1 }}>
          {formatNumber(athlete.speed, 1)}<span style={{ fontSize: 10, color: 'var(--text-subtle)', marginLeft: 2 }}>km/h</span>
        </div>
        <div
          style={{
            fontSize: 10,
            color: athlete.speedDelta >= 0 ? 'var(--chart-baseline)' : 'var(--danger)',
            marginTop: 2,
          }}
        >
          {athlete.speedDelta >= 0 ? '+' : ''}{formatNumber(athlete.speedDelta, 1)}%
        </div>
      </div>
    </Link>
  )
}
