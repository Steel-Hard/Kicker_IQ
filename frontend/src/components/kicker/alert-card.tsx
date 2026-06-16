'use client'

import { AlertTriangle, CheckCircle2, Clock, Trash2 } from 'lucide-react'
import type { Alert } from '@/context/AlertContext'

interface AlertCardProps {
  alert: Alert
  onResolve?: (id: string) => void
  onDelete?: (id: string) => void
}

const severityConfig = {
  high: {
    color: 'var(--danger)',
    bg: 'var(--danger-bg, rgba(239,68,68,0.1))',
    label: 'Alto',
  },
  medium: {
    color: 'var(--warning, #f59e0b)',
    bg: 'var(--warning-bg, rgba(245,158,11,0.1))',
    label: 'Médio',
  },
  low: {
    color: 'var(--success-text, #22c55e)',
    bg: 'var(--success-bg, rgba(34,197,94,0.1))',
    label: 'Baixo',
  },
}

const typeLabels: Record<string, string> = {
  carga_elevada: 'Carga Elevada',
  pse_alta: 'PSE Alta',
  queda_performance: 'Queda de Performance',
  lesao_risco: 'Risco de Lesão',
  custom: 'Personalizado',
}

function timeAgo(dateStr: string): string {
  const now = Date.now()
  const date = new Date(dateStr).getTime()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)

  if (diffMins < 1) return 'Agora'
  if (diffMins < 60) return `${diffMins}min atrás`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h atrás`
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays === 1) return 'Ontem'
  return `${diffDays}d atrás`
}

export function AlertCard({ alert, onResolve, onDelete }: AlertCardProps) {
  const severity = severityConfig[alert.severity]
  const isResolved = alert.status === 'resolved'

  return (
    <div className={`alert-card ${isResolved ? 'alert-card--resolved' : ''}`}>
      {/* Severity indicator bar */}
      <div
        className="alert-card__severity-bar"
        style={{ background: isResolved ? 'var(--text-subtle)' : severity.color }}
      />

      <div className="alert-card__content">
        {/* Header row */}
        <div className="alert-card__header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1, minWidth: 0 }}>
            <AlertTriangle
              size={13}
              style={{
                color: isResolved ? 'var(--text-subtle)' : severity.color,
                flexShrink: 0,
              }}
            />
            <span className="alert-card__athlete-name">
              {alert.athleteName}
            </span>
            <span
              className="alert-card__severity-badge"
              style={{
                color: isResolved ? 'var(--text-subtle)' : severity.color,
                background: isResolved ? 'var(--surface-3, rgba(255,255,255,0.05))' : severity.bg,
              }}
            >
              {severity.label}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
            <Clock size={10} style={{ color: 'var(--text-subtle)' }} />
            <span className="alert-card__time">{timeAgo(alert.createdAt)}</span>
          </div>
        </div>

        {/* Title */}
        <div className="alert-card__title">{alert.title}</div>

        {/* Description */}
        <div className="alert-card__description">{alert.description}</div>

        {/* Footer row */}
        <div className="alert-card__footer">
          <span
            className="alert-card__type-badge"
          >
            {typeLabels[alert.type] || alert.type}
          </span>

          <div style={{ display: 'flex', gap: 6 }}>
            {isResolved ? (
              <span className="alert-card__resolved-badge">
                <CheckCircle2 size={11} />
                Resolvido
              </span>
            ) : (
              <>
                {onResolve && (
                  <button
                    className="alert-card__btn alert-card__btn--resolve"
                    onClick={() => onResolve(alert._id)}
                  >
                    <CheckCircle2 size={12} />
                    Resolver
                  </button>
                )}
              </>
            )}
            {onDelete && (
              <button
                className="alert-card__btn alert-card__btn--delete"
                onClick={() => onDelete(alert._id)}
              >
                <Trash2 size={12} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
