'use client'

import { Bell, ChevronRight, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { KpiCard } from '@/components/kicker/kpi-card'
import { AlertBanner } from '@/components/kicker/alert-banner'
import { PerformanceChart } from '@/components/kicker/performance-chart'
import { teamStats, athletes } from '@/lib/mock-data'
import { formatNumber, formatDelta } from '@/lib/utils'

export default function DashboardPage() {
  const alertAthletes = athletes.filter((a) => a.hasAlert)

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
            São Paulo FC
          </div>
          <div style={{ fontSize: 10, color: 'var(--text-subtle)', lineHeight: 1.3 }}>
            {teamStats.lastMatch.date}
          </div>
        </div>
        <button
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
          }}
        >
          <Bell size={14} color="var(--text-secondary)" />
          {alertAthletes.length > 0 && (
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
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: '16px 14px', paddingBottom: 24 }}>

        {/* Last match result */}
        <div
          className="animate-slide-down"
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
              ÚLTIMO RESULTADO · {teamStats.lastMatch.jornada}
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
                {teamStats.lastMatch.result}
              </span>
              <span style={{ fontSize: 15, fontWeight: 500, color: 'var(--text-primary)' }}>
                {teamStats.lastMatch.score}
              </span>
              <span style={{ fontSize: 12, color: 'var(--text-subtle)' }}>
                vs {teamStats.lastMatch.opponent}
              </span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 10, color: 'var(--text-subtle)' }}>
              {teamStats.lastMatch.competition.split(' — ')[1] || 'Série A'}
            </div>
          </div>
        </div>

        {/* Alerts */}
        {alertAthletes.length > 0 && (
          <div className="animate-slide-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div className="k-section-label">ALERTAS ATIVOS</div>
            {alertAthletes.map((a) => (
              <AlertBanner
                key={a.id}
                title={`${a.name} — ${a.alertTitle}`}
                description={a.alertDesc}
                action="Ver ↗"
              />
            ))}
          </div>
        )}

        {/* KPI grid */}
        <div className="animate-slide-up delay-2">
          <div className="k-section-label" style={{ marginBottom: 10 }}>
            ÚLTIMOS 7 DIAS — ELENCO
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <KpiCard
              label="Vel. máx média"
              value={`${formatNumber(teamStats.avgSpeed, 1)} km/h`}
              delta={formatDelta(teamStats.speedDelta)}
              deltaDirection="up"
            />
            <KpiCard
              label="Dist. sprint média"
              value={`${teamStats.avgSprintDist} m`}
              delta={formatDelta(teamStats.sprintDelta)}
              deltaDirection="up"
            />
            <KpiCard
              label="Carga semanal"
              value={`${teamStats.avgLoad.toLocaleString('pt-BR')} AU`}
              delta={formatDelta(teamStats.loadDelta)}
              deltaDirection="up"
            />
            <KpiCard
              label="PSE média"
              value={formatNumber(teamStats.avgPse, 1)}
              delta={formatDelta(teamStats.pseDelta)}
              deltaDirection={teamStats.pseDelta > 10 ? 'down' : 'up'}
            />
          </div>
        </div>

        {/* Sprint evolution chart */}
        <div className="animate-slide-up delay-3">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div className="k-section-label">EVOLUÇÃO — DIST. DE SPRINT (m)</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span className="k-dot k-dot--success" />
                <span style={{ fontSize: 10, color: 'var(--text-subtle)' }}>Média</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span className="k-dot k-dot--alert" />
                <span style={{ fontSize: 10, color: 'var(--text-subtle)' }}>Alerta</span>
              </div>
            </div>
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
              data={teamStats.sprintHistory}
              average={teamStats.avgSprintDist - 20}
            />
          </div>
        </div>

        {/* Quick actions */}
        <div className="animate-slide-up delay-4">
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
        <div className="animate-slide-up delay-5">
          <div className="k-section-label" style={{ marginBottom: 10 }}>TOP PERFORMERS — J22</div>
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
                  <span
                    className={`k-avatar k-avatar--sm k-avatar--${athlete.profile}`}
                  >
                    {athlete.initials}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)' }}>
                      {athlete.name}
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
