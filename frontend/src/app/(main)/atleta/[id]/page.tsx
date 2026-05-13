'use client'

import { useState } from 'react'
import { Share2 } from 'lucide-react'
import { TopBar } from '@/components/kicker/top-bar'
import { Avatar } from '@/components/kicker/avatar'
import { AthletePill } from '@/components/kicker/athlete-pill'
import { AlertBanner } from '@/components/kicker/alert-banner'
import { KpiCard } from '@/components/kicker/kpi-card'
import { KickerRadarChart } from '@/components/kicker/radar-chart'
import { PerformanceChart } from '@/components/kicker/performance-chart'
import { athletes } from '@/lib/mock-data'
import { formatNumber, formatDelta } from '@/lib/utils'

const tabs = ['Desempenho', 'Histórico', 'Carga'] as const
type Tab = (typeof tabs)[number]

export default function AtletaPage({ params }: { params: { id: string } }) {
  const { id } = params
  const athlete = athletes.find((a) => a.id === id) ?? athletes[0]
  const [tab, setTab] = useState<Tab>('Desempenho')

  const radarData = {
    velocidade:    athlete.radar.velocidade,
    resistencia:   athlete.radar.resistencia,
    explosividade: athlete.radar.explosividade,
    carga:         athlete.radar.carga,
    recuperacao:   athlete.radar.recuperacao,
    tecnica:       athlete.radar.tecnica,
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--surface-1)' }}>
      <TopBar
        title={`#${athlete.number} · ${athlete.position}`}
        back
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
            <Share2 size={13} color="var(--text-secondary)" />
          </button>
        }
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '16px 14px', paddingBottom: 24 }}>

        {/* Hero */}
        <div
          className="animate-slide-up"
          style={{
            background: 'var(--surface-2)',
            border: '1px solid var(--border-default)',
            borderRadius: 10,
            padding: '16px 14px',
            display: 'flex',
            gap: 14,
            alignItems: 'center',
          }}
        >
          <Avatar initials={athlete.initials} profile={athlete.profile} size="lg" />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 17, fontWeight: 500, color: 'var(--text-primary)', lineHeight: 1.2, marginBottom: 6 }}>
              {athlete.name}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              <AthletePill profile={athlete.profile} label={athlete.profileLabel} />
              <span style={{ fontSize: 11, color: 'var(--text-subtle)' }}>
                {athlete.age} anos
              </span>
            </div>
          </div>
        </div>

        {/* Alert */}
        {athlete.hasAlert && (
          <div className="animate-slide-up delay-1">
            <AlertBanner
              title={athlete.alertTitle!}
              description={athlete.alertDesc}
              action="Detalhes ↗"
            />
          </div>
        )}

        {/* Tabs */}
        <div
          className="animate-fade-in delay-2"
          style={{
            display: 'flex',
            gap: 0,
            background: 'var(--surface-3)',
            borderRadius: 10,
            padding: 3,
          }}
        >
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                flex: 1,
                height: 32,
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: 500,
                fontFamily: 'var(--font-sans)',
                background: tab === t ? 'var(--surface-5)' : 'transparent',
                color: tab === t ? 'var(--text-primary)' : 'var(--text-subtle)',
                transition: 'background 150ms, color 150ms',
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Tab content: Desempenho */}
        {tab === 'Desempenho' && (
          <>
            <div className="animate-slide-up">
              <div className="k-section-label" style={{ marginBottom: 10 }}>MÉTRICAS — J22</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <KpiCard
                  label="Vel. máxima"
                  value={`${formatNumber(athlete.speed, 1)} km/h`}
                  delta={formatDelta(athlete.speedDelta)}
                  deltaDirection={athlete.speedDelta >= 0 ? 'up' : 'down'}
                />
                <KpiCard
                  label="Dist. sprint"
                  value={`${athlete.sprintDistance} m`}
                  delta={formatDelta(athlete.sprintDelta)}
                  deltaDirection={athlete.sprintDelta >= 0 ? 'up' : 'down'}
                />
                <KpiCard
                  label="Carga sessão"
                  value={`${athlete.weeklyLoad.toLocaleString('pt-BR')} AU`}
                  delta={formatDelta(athlete.loadDelta)}
                  deltaDirection={athlete.loadDelta > 15 ? 'down' : 'up'}
                />
                <KpiCard
                  label="PSE"
                  value={formatNumber(athlete.pse, 1)}
                  delta={formatDelta(athlete.pseDelta)}
                  deltaDirection={athlete.pseDelta > 10 ? 'down' : 'up'}
                />
              </div>
            </div>

            <div className="animate-slide-up delay-1">
              <div className="k-section-label" style={{ marginBottom: 10 }}>PERFIL FÍSICO</div>
              <div
                style={{
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 10,
                  padding: '16px 12px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <KickerRadarChart data1={radarData} label1={athlete.initials} />
              </div>
            </div>
          </>
        )}

        {/* Tab content: Histórico */}
        {tab === 'Histórico' && (
          <div className="animate-slide-up">
            <div className="k-section-label" style={{ marginBottom: 10 }}>
              EVOLUÇÃO — DISTÂNCIA SPRINT (m)
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
                data={athlete.matchHistory.map((m) => ({
                  jornada: m.jornada,
                  dist: m.sprintDist,
                  alert: m.sprintDist > 800,
                }))}
              />
            </div>

            <div style={{ marginTop: 16 }}>
              <div className="k-section-label" style={{ marginBottom: 10 }}>HISTÓRICO DE PARTIDAS</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {athlete.matchHistory.slice().reverse().map((m, i, arr) => (
                  <div
                    key={m.jornada}
                    style={{
                      padding: '11px 12px',
                      background: 'var(--surface-2)',
                      border: '1px solid var(--border-default)',
                      borderRadius: i === 0 ? '10px 10px 0 0' : i === arr.length - 1 ? '0 0 10px 10px' : 0,
                      borderBottom: i < arr.length - 1 ? 'none' : '1px solid var(--border-default)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                    }}
                  >
                    <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-subtle)', width: 24 }}>
                      {m.jornada}
                    </span>
                    <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4 }}>
                      {[
                        { label: 'Sprint', val: `${m.sprintDist}m` },
                        { label: 'Vel.', val: `${formatNumber(m.maxSpeed, 1)}` },
                        { label: 'Carga', val: m.carga.toLocaleString('pt-BR') },
                        { label: 'PSE', val: formatNumber(m.pse, 1) },
                      ].map(({ label, val }) => (
                        <div key={label} style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)' }}>{val}</div>
                          <div style={{ fontSize: 9, color: 'var(--text-subtle)', marginTop: 1 }}>{label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab content: Carga */}
        {tab === 'Carga' && (
          <div className="animate-slide-up">
            <div className="k-section-label" style={{ marginBottom: 10 }}>CARGA ACUMULADA</div>
            <div
              style={{
                background: 'var(--surface-2)',
                border: '1px solid var(--border-default)',
                borderRadius: 10,
                padding: '12px 8px 8px',
              }}
            >
              <PerformanceChart
                data={athlete.matchHistory.map((m) => ({
                  jornada: m.jornada,
                  dist: m.carga,
                  alert: m.pse > 8,
                }))}
              />
            </div>

            <div style={{ marginTop: 16 }}>
              <div className="k-section-label" style={{ marginBottom: 10 }}>PSE POR JORNADA</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {athlete.matchHistory.slice().reverse().map((m) => {
                  const pct = (m.pse / 10) * 100
                  const color = m.pse > 8
                    ? 'var(--danger)'
                    : m.pse > 7
                    ? 'var(--warning)'
                    : 'var(--chart-baseline)'
                  return (
                    <div key={m.jornada} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 11, color: 'var(--text-subtle)', width: 24, flexShrink: 0 }}>
                        {m.jornada}
                      </span>
                      <div
                        style={{
                          flex: 1,
                          height: 6,
                          background: 'var(--surface-4)',
                          borderRadius: 3,
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            height: '100%',
                            width: `${pct}%`,
                            background: color,
                            borderRadius: 3,
                            transition: 'width 600ms var(--ease-out)',
                          }}
                        />
                      </div>
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 500,
                          color,
                          width: 28,
                          textAlign: 'right',
                          flexShrink: 0,
                        }}
                      >
                        {formatNumber(m.pse, 1)}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
