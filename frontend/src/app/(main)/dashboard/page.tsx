'use client'

import { Bell, ChevronRight, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { KpiCard } from '@/components/kicker/kpi-card'
import { AlertBanner } from '@/components/kicker/alert-banner'
import { PerformanceChart } from '@/components/kicker/performance-chart'
import { teamStats as mockTeamStats } from '@/lib/mock-data'
import { formatNumber, formatDelta } from '@/lib/utils'
import { useAthletes } from '@/context/AthleteContext'
import { useAuth } from '@/context/AuthContext'
import { Avatar } from '@/components/kicker/avatar'
import { useAlerts } from '@/context/AlertContext'

export default function DashboardPage() {
  const { loading: authLoading } = useAuth()
  const { athletes, loading: athletesLoading, error } = useAthletes()
  const { alerts, activeCount } = useAlerts()

  const activeAlerts = alerts.filter(a => a.status === 'active')
  
  const stats = athletes.length > 0 ? {
    avgSpeed: athletes.reduce((acc, a) => acc + a.speed, 0) / athletes.length,
    avgSprintDist: Math.round(athletes.reduce((acc, a) => acc + a.sprintDistance, 0) / athletes.length),
    avgLoad: Math.round(athletes.reduce((acc, a) => acc + a.weeklyLoad, 0) / athletes.length),
    avgPse: athletes.reduce((acc, a) => acc + a.pse, 0) / athletes.length,
    speedDelta: athletes.reduce((acc, a) => acc + a.speedDelta, 0) / athletes.length,
    sprintDelta: athletes.reduce((acc, a) => acc + a.sprintDelta, 0) / athletes.length,
    loadDelta: athletes.reduce((acc, a) => acc + a.loadDelta, 0) / athletes.length,
    pseDelta: athletes.reduce((acc, a) => acc + a.pseDelta, 0) / athletes.length,
  } : {
    avgSpeed: mockTeamStats.avgSpeed,
    avgSprintDist: mockTeamStats.avgSprintDist,
    avgLoad: mockTeamStats.avgLoad,
    avgPse: mockTeamStats.avgPse,
    speedDelta: mockTeamStats.speedDelta,
    sprintDelta: mockTeamStats.sprintDelta,
    loadDelta: mockTeamStats.loadDelta,
    pseDelta: mockTeamStats.pseDelta,
  }

  const isLoading = authLoading || (athletesLoading && athletes.length === 0)

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--surface-1)' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-subtle)' }}>
          <Loader2 className="animate-spin" size={24} />
          <span style={{ marginLeft: 8 }}>Iniciando Dashboard...</span>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--surface-1)' }}>
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
        <div>
          <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', lineHeight: 1.2 }}>
            Kicker IQ Dashboard
          </div>
          <div style={{ fontSize: 10, color: 'var(--text-subtle)', lineHeight: 1.3 }}>
            Sessão Ativa: {new Date().toLocaleDateString()}
          </div>
        </div>
        <Link
          href="/alertas"
          style={{
            width: 30,
            height: 30,
            borderRadius: 10,
            border: '1px solid var(--border-emphasis)',
            background: 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            position: 'relative',
            textDecoration: 'none',
          }}
        >
          <Bell size={14} color="var(--text-secondary)" />
          {activeCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: -3,
                right: -3,
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: 'var(--danger)',
                border: '1.5px solid var(--surface-1)',
              }}
            />
          )}
        </Link>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: '16px 14px', paddingBottom: 24 }}>

        {error && (
          <div style={{ padding: 12, background: 'var(--danger-bg)', color: 'var(--danger-text)', borderRadius: 10, fontSize: 13 }}>
            {error}
          </div>
        )}

        {/* Last match result (Still mock as no backend endpoint yet) */}
        <div
          style={{
            background: 'var(--surface-2)',
            border: '1px solid var(--border-default)',
            borderRadius: 10,
            padding: '12px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ fontSize: 10, color: 'var(--text-subtle)', marginBottom: 3, letterSpacing: 0.3 }}>
              ÚLTIMO RESULTADO · {mockTeamStats.lastMatch.jornada}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  color: 'var(--success-text)',
                  background: 'var(--success-bg)',
                  padding: '2px 8px',
                  borderRadius: 20,
                }}
              >
                {mockTeamStats.lastMatch.result}
              </span>
              <span style={{ fontSize: 15, fontWeight: 500, color: 'var(--text-primary)' }}>
                {mockTeamStats.lastMatch.score}
              </span>
              <span style={{ fontSize: 12, color: 'var(--text-subtle)' }}>
                vs {mockTeamStats.lastMatch.opponent}
              </span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 10, color: 'var(--text-subtle)' }}>
              Série A
            </div>
          </div>
        </div>

        {/* Alerts */}
        {activeAlerts.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div className="k-section-label">ALERTAS ATIVOS</div>
              <Link href="/alertas" style={{ fontSize: 10, color: 'var(--primary-strong)', textDecoration: 'none', fontWeight: 500 }}>
                Ver todos →
              </Link>
            </div>
            {activeAlerts.slice(0, 3).map((a) => (
              <AlertBanner
                key={a._id}
                title={`${a.athleteName} — ${a.title}`}
                description={a.description}
                action="Ver ↗"
                onAction={() => window.location.href = '/alertas'}
              />
            ))}
          </div>
        )}

        {/* KPI grid */}
        <div>
          <div className="k-section-label" style={{ marginBottom: 10 }}>
            ÚLTIMOS 7 DIAS — ELENCO
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <KpiCard
              label="Vel. máx média"
              value={`${formatNumber(stats.avgSpeed, 1)} km/h`}
              delta={formatDelta(stats.speedDelta)}
              deltaDirection={stats.speedDelta >= 0 ? "up" : "down"}
            />
            <KpiCard
              label="Dist. sprint média"
              value={`${stats.avgSprintDist} m`}
              delta={formatDelta(stats.sprintDelta)}
              deltaDirection={stats.sprintDelta >= 0 ? "up" : "down"}
            />
            <KpiCard
              label="Carga semanal"
              value={`${stats.avgLoad.toLocaleString('pt-BR')} AU`}
              delta={formatDelta(stats.loadDelta)}
              deltaDirection={stats.loadDelta >= 0 ? "up" : "down"}
            />
            <KpiCard
              label="PSE média"
              value={formatNumber(stats.avgPse, 1)}
              delta={formatDelta(stats.pseDelta)}
              deltaDirection={stats.pseDelta > 10 ? 'down' : 'up'}
            />
          </div>
        </div>

        {/* Sprint evolution chart */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div className="k-section-label">EVOLUÇÃO — DIST. DE SPRINT (m)</div>
          </div>
          <div
            style={{
              background: 'var(--surface-2)',
              border: '1px solid var(--border-default)',
              borderRadius: 10,
              padding: '12px 8px 8px',
            }}
          >
            <PerformanceChart
              data={mockTeamStats.sprintHistory}
              average={stats.avgSprintDist - 20}
            />
          </div>
        </div>

        {/* Quick actions */}
        <div>
          <div className="k-section-label" style={{ marginBottom: 10 }}>AÇÕES RÁPIDAS</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <Link
              href="/comparar"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px',
                background: 'var(--surface-2)',
                border: '1px solid var(--border-default)',
                borderRadius: 10,
                textDecoration: 'none',
              }}
            >
              <div>
                <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 2 }}>
                  Comparar
                </div>
                <div style={{ fontSize: 10, color: 'var(--text-subtle)' }}>atletas</div>
              </div>
              <ChevronRight size={14} color="var(--text-subtle)" />
            </Link>

            <Link
              href="/elenco"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px',
                background: 'var(--surface-2)',
                border: '1px solid var(--border-default)',
                borderRadius: 10,
                textDecoration: 'none',
              }}
            >
              <div>
                <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 2 }}>
                  Elenco
                </div>
                <div style={{ fontSize: 10, color: 'var(--text-subtle)' }}>ver todos</div>
              </div>
              <ChevronRight size={14} color="var(--text-subtle)" />
            </Link>
          </div>
        </div>

        {/* Top performers */}
        <div>
          <div className="k-section-label" style={{ marginBottom: 10 }}>TOP PERFORMERS — GERAL</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {athletes
              .sort((a, b) => b.speed - a.speed)
              .slice(0, 3)
              .map((athlete, i) => (
                <Link
                  key={athlete.id}
                  href={`/atleta/${athlete.id}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '10px 12px',
                    background: 'var(--surface-2)',
                    borderRadius: i === 0 ? '10px 10px 0 0' : i === 2 ? '0 0 10px 10px' : 0,
                    border: '1px solid var(--border-default)',
                    borderBottom: i < 2 ? 'none' : '1px solid var(--border-default)',
                    textDecoration: 'none',
                  }}
                >
                  <span style={{ fontSize: 11, color: 'var(--text-subtle)', width: 16, textAlign: 'right' }}>
                    {i + 1}
                  </span>
                  <Avatar id={athlete.id} initials={athlete.initials} profile={athlete.profile} size="sm" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)' }}>
                      ID: {athlete.id}
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--text-subtle)' }}>{athlete.position}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>
                      {formatNumber(athlete.speed, 1)}<span style={{ fontSize: 10, color: 'var(--text-subtle)', marginLeft: 2 }}>km/h</span>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>

      </div>
    </div>
  )
}
