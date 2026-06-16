'use client'

import { useState } from 'react'
import { Bell, Plus, Filter, X, ChevronDown } from 'lucide-react'
import { AlertCard } from '@/components/kicker/alert-card'
import { useAlerts } from '@/context/AlertContext'
import type { Alert } from '@/context/AlertContext'
import { useAthletes } from '@/context/AthleteContext'

type FilterStatus = 'all' | 'active' | 'resolved'
type FilterSeverity = 'all' | 'high' | 'medium' | 'low'

const statusFilters: { key: FilterStatus; label: string }[] = [
  { key: 'all', label: 'Todos' },
  { key: 'active', label: 'Ativos' },
  { key: 'resolved', label: 'Resolvidos' },
]

const severityFilters: { key: FilterSeverity; label: string; color: string }[] = [
  { key: 'all', label: 'Todas', color: 'var(--text-secondary)' },
  { key: 'high', label: 'Alto', color: 'var(--danger)' },
  { key: 'medium', label: 'Médio', color: 'var(--warning, #f59e0b)' },
  { key: 'low', label: 'Baixo', color: 'var(--success-text, #22c55e)' },
]

export default function AlertasPage() {
  const { alerts, activeCount, resolveAlert, createAlert, deleteAlert } = useAlerts()
  const { athletes } = useAthletes()
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all')
  const [severityFilter, setSeverityFilter] = useState<FilterSeverity>('all')
  const [showCreate, setShowCreate] = useState(false)

  const filteredAlerts = alerts.filter(a => {
    if (statusFilter !== 'all' && a.status !== statusFilter) return false
    if (severityFilter !== 'all' && a.severity !== severityFilter) return false
    return true
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--surface-1)', minHeight: '100vh' }}>
      {/* Top bar */}
      <div
        style={{
          height: 48,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 14px',
          background: 'var(--surface-1)',
          borderBottom: '1px solid var(--border-subtle)',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Bell size={16} style={{ color: 'var(--primary-strong)' }} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', lineHeight: 1.2 }}>
              Alertas
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-subtle)', lineHeight: 1.3 }}>
              {activeCount} {activeCount === 1 ? 'alerta ativo' : 'alertas ativos'}
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            padding: '6px 12px',
            borderRadius: 8,
            border: 'none',
            background: 'var(--primary)',
            color: '#000',
            fontSize: 11,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'var(--font-sans)',
          }}
        >
          <Plus size={13} />
          Novo
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '12px 14px', paddingBottom: 100 }}>
        {/* Status filter chips */}
        <div style={{ display: 'flex', gap: 6 }}>
          {statusFilters.map(f => (
            <button
              key={f.key}
              onClick={() => setStatusFilter(f.key)}
              className={`alert-filter-chip ${statusFilter === f.key ? 'alert-filter-chip--active' : ''}`}
            >
              {f.label}
              {f.key === 'active' && activeCount > 0 && (
                <span className="alert-filter-chip__count">{activeCount}</span>
              )}
            </button>
          ))}
        </div>

        {/* Severity filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Filter size={11} style={{ color: 'var(--text-subtle)' }} />
          <span style={{ fontSize: 10, color: 'var(--text-subtle)', marginRight: 2 }}>Gravidade:</span>
          {severityFilters.map(f => (
            <button
              key={f.key}
              onClick={() => setSeverityFilter(f.key)}
              className={`alert-severity-chip ${severityFilter === f.key ? 'alert-severity-chip--active' : ''}`}
              style={{
                '--chip-color': f.color,
              } as React.CSSProperties}
            >
              {f.key !== 'all' && (
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: f.color,
                    flexShrink: 0,
                  }}
                />
              )}
              {f.label}
            </button>
          ))}
        </div>

        {/* Alert list */}
        {filteredAlerts.length === 0 ? (
          <div className="alert-empty-state">
            <Bell size={32} style={{ color: 'var(--text-subtle)', opacity: 0.4 }} />
            <div style={{ fontSize: 13, color: 'var(--text-subtle)', marginTop: 8 }}>
              Nenhum alerta encontrado
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-subtle)', opacity: 0.6 }}>
              {statusFilter === 'resolved'
                ? 'Nenhum alerta foi resolvido ainda'
                : 'Todos os alertas estão resolvidos'}
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filteredAlerts.map(alert => (
              <AlertCard
                key={alert._id}
                alert={alert}
                onResolve={alert.status === 'active' ? resolveAlert : undefined}
                onDelete={deleteAlert}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create alert modal */}
      {showCreate && (
        <CreateAlertModal
          athletes={athletes}
          onClose={() => setShowCreate(false)}
          onCreate={createAlert}
        />
      )}
    </div>
  )
}

/* ───── Create Alert Modal ───── */

interface CreateAlertModalProps {
  athletes: { id: string; name: string }[]
  onClose: () => void
  onCreate: (data: Omit<Alert, '_id' | 'status' | 'resolvedAt' | 'resolvedBy' | 'createdAt' | 'updatedAt'>) => Promise<void>
}

function CreateAlertModal({ athletes, onClose, onCreate }: CreateAlertModalProps) {
  const [athleteId, setAthleteId] = useState('')
  const [type, setType] = useState<Alert['type']>('custom')
  const [severity, setSeverity] = useState<Alert['severity']>('medium')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const selectedAthlete = athletes.find(a => a.id === athleteId)

  const handleSubmit = async () => {
    if (!athleteId || !title || !description) return
    setSubmitting(true)
    await onCreate({
      athleteId,
      athleteName: selectedAthlete?.name || `Atleta ${athleteId}`,
      type,
      severity,
      title,
      description,
    })
    setSubmitting(false)
    onClose()
  }

  return (
    <div className="alert-modal-overlay" onClick={onClose}>
      <div className="alert-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="alert-modal__header">
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
            Novo Alerta
          </span>
          <button onClick={onClose} className="alert-modal__close">
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <div className="alert-modal__body">
          {/* Athlete select */}
          <div className="alert-form-group">
            <label className="alert-form-label">Atleta</label>
            <div className="alert-form-select-wrapper">
              <select
                value={athleteId}
                onChange={e => setAthleteId(e.target.value)}
                className="alert-form-select"
              >
                <option value="">Selecione um atleta...</option>
                {athletes.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.name || `ID: ${a.id}`}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="alert-form-select-icon" />
            </div>
          </div>

          {/* Type select */}
          <div className="alert-form-group">
            <label className="alert-form-label">Tipo</label>
            <div className="alert-form-select-wrapper">
              <select
                value={type}
                onChange={e => setType(e.target.value as Alert['type'])}
                className="alert-form-select"
              >
                <option value="carga_elevada">Carga Elevada</option>
                <option value="pse_alta">PSE Alta</option>
                <option value="queda_performance">Queda de Performance</option>
                <option value="lesao_risco">Risco de Lesão</option>
                <option value="custom">Personalizado</option>
              </select>
              <ChevronDown size={14} className="alert-form-select-icon" />
            </div>
          </div>

          {/* Severity */}
          <div className="alert-form-group">
            <label className="alert-form-label">Gravidade</label>
            <div style={{ display: 'flex', gap: 6 }}>
              {(['high', 'medium', 'low'] as const).map(s => {
                const config = {
                  high: { label: 'Alto', color: 'var(--danger)' },
                  medium: { label: 'Médio', color: 'var(--warning, #f59e0b)' },
                  low: { label: 'Baixo', color: 'var(--success-text, #22c55e)' },
                }
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSeverity(s)}
                    className={`alert-severity-option ${severity === s ? 'alert-severity-option--active' : ''}`}
                    style={{
                      '--sev-color': config[s].color,
                    } as React.CSSProperties}
                  >
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: config[s].color }} />
                    {config[s].label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Title */}
          <div className="alert-form-group">
            <label className="alert-form-label">Título</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Ex: Carga acumulada elevada"
              className="alert-form-input"
            />
          </div>

          {/* Description */}
          <div className="alert-form-group">
            <label className="alert-form-label">Descrição</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Descreva o alerta com detalhes..."
              rows={3}
              className="alert-form-textarea"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="alert-modal__footer">
          <button onClick={onClose} className="alert-modal__btn alert-modal__btn--cancel">
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={!athleteId || !title || !description || submitting}
            className="alert-modal__btn alert-modal__btn--submit"
          >
            {submitting ? 'Criando...' : 'Criar Alerta'}
          </button>
        </div>
      </div>
    </div>
  )
}
