'use client'

import { useState } from 'react'
import { X, Plus } from 'lucide-react'
import { TopBar } from '@/components/kicker/top-bar'
import { Avatar } from '@/components/kicker/avatar'
import { AthletePill } from '@/components/kicker/athlete-pill'
import { KickerRadarChart } from '@/components/kicker/radar-chart'
import { athletes, type Athlete } from '@/lib/mock-data'
import { formatNumber, formatDelta } from '@/lib/utils'

type MetricKey = 'speed' | 'sprintDistance' | 'weeklyLoad' | 'pse'

const metrics: { key: MetricKey; label: string; unit: string; higherIsBetter: boolean }[] = [
  { key: 'speed',         label: 'Vel. máxima',   unit: 'km/h', higherIsBetter: true },
  { key: 'sprintDistance',label: 'Dist. sprint',  unit: 'm',    higherIsBetter: true },
  { key: 'weeklyLoad',    label: 'Carga sessão',  unit: 'AU',   higherIsBetter: false },
  { key: 'pse',           label: 'PSE',           unit: '',     higherIsBetter: false },
]

const radarLabels = ['Vel.', 'Explos.', 'Carga', 'Técnica', 'Recup.', 'Resist.']

function AthleteSlot({
  athlete,
  onSelect,
  onRemove,
  align,
}: {
  athlete?: Athlete
  onSelect: () => void
  onRemove: () => void
  align: 'left' | 'right'
}) {
  if (!athlete) {
    return (
      <button
        onClick={onSelect}
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          padding: '20px 12px',
          background: 'var(--surface-3)',
          border: '1px dashed var(--border-emphasis)',
          borderRadius: 10,
          cursor: 'pointer',
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            border: '1px dashed var(--border-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Plus size={14} color="var(--text-subtle)" />
        </div>
        <span style={{ fontSize: 11, color: 'var(--text-subtle)', fontWeight: 500 }}>
          Selecionar
        </span>
      </button>
    )
  }

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: align === 'left' ? 'flex-start' : 'flex-end',
        padding: '12px',
        background: 'var(--surface-2)',
        border: '1px solid var(--border-default)',
        borderRadius: 10,
        position: 'relative',
      }}
    >
      <button
        onClick={onRemove}
        style={{
          position: 'absolute',
          top: 6,
          right: 6,
          width: 18,
          height: 18,
          borderRadius: '50%',
          border: '1px solid var(--border-emphasis)',
          background: 'var(--surface-4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
      >
        <X size={10} color="var(--text-subtle)" />
      </button>
      <Avatar initials={athlete.initials} profile={athlete.profile} size="md" />
      <div style={{ marginTop: 8, textAlign: align === 'right' ? 'right' : 'left' }}>
        <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)', lineHeight: 1.2 }}>
          {athlete.name.split(' ')[0]}
        </div>
        <div style={{ marginTop: 3 }}>
          <AthletePill profile={athlete.profile} label={athlete.profileLabel} />
        </div>
      </div>
    </div>
  )
}

function AthletePickerModal({
  onSelect,
  onClose,
  excluded,
}: {
  onSelect: (a: Athlete) => void
  onClose: () => void
  excluded?: string
}) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
        zIndex: 50,
        display: 'flex',
        alignItems: 'flex-end',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 420,
          margin: '0 auto',
          background: 'var(--surface-1)',
          borderRadius: '16px 16px 0 0',
          padding: '20px 14px',
          maxHeight: '70vh',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 16, color: 'var(--text-primary)' }}>
          Selecionar atleta
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {athletes
            .filter((a) => a.id !== excluded)
            .map((a) => (
              <button
                key={a.id}
                onClick={() => { onSelect(a); onClose() }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 12px',
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 10,
                  cursor: 'pointer',
                  textAlign: 'left',
                  width: '100%',
                }}
              >
                <Avatar initials={a.initials} profile={a.profile} size="md" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{a.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-subtle)' }}>#{a.number} · {a.position}</div>
                </div>
                <AthletePill profile={a.profile} label={a.profileLabel} />
              </button>
            ))}
        </div>
      </div>
    </div>
  )
}

export default function CompararPage() {
  const [athlete1, setAthlete1] = useState<Athlete | undefined>(athletes[0])
  const [athlete2, setAthlete2] = useState<Athlete | undefined>(athletes[4])
  const [picker, setPicker] = useState<1 | 2 | null>(null)
  const [tab, setTab] = useState<'Desempenho' | 'Físico'>('Desempenho')

  function handleSelect(a: Athlete) {
    if (picker === 1) setAthlete1(a)
    if (picker === 2) setAthlete2(a)
  }

  function getWinner(key: MetricKey, higher: boolean): 1 | 2 | null {
    if (!athlete1 || !athlete2) return null
    const v1 = athlete1[key] as number
    const v2 = athlete2[key] as number
    if (v1 === v2) return null
    if (higher) return v1 > v2 ? 1 : 2
    return v1 < v2 ? 1 : 2
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--surface-1)' }}>
      <TopBar title="Comparar atletas" />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '16px 14px', paddingBottom: 24 }}>

        {/* Athlete slots */}
        <div className="animate-slide-up" style={{ display: 'flex', gap: 8 }}>
          <AthleteSlot
            athlete={athlete1}
            onSelect={() => setPicker(1)}
            onRemove={() => setAthlete1(undefined)}
            align="left"
          />
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 10,
              color: 'var(--text-subtle)',
              fontWeight: 500,
              flexShrink: 0,
            }}
          >
            VS
          </div>
          <AthleteSlot
            athlete={athlete2}
            onSelect={() => setPicker(2)}
            onRemove={() => setAthlete2(undefined)}
            align="right"
          />
        </div>

        {/* Tabs */}
        {(athlete1 || athlete2) && (
          <div
            className="animate-fade-in delay-1"
            style={{
              display: 'flex',
              gap: 0,
              background: 'var(--surface-3)',
              borderRadius: 10,
              padding: 3,
            }}
          >
            {(['Desempenho', 'Físico'] as const).map((t) => (
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
        )}

        {/* Radar chart */}
        {tab === 'Físico' && athlete1 && (
          <div className="animate-slide-up delay-2">
            <div className="k-section-label" style={{ marginBottom: 10 }}>RADAR — PERFIL FÍSICO</div>
            <div
              style={{
                background: 'var(--surface-2)',
                border: '1px solid var(--border-default)',
                borderRadius: 10,
                padding: 16,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <KickerRadarChart
                data1={athlete1.radar}
                data2={athlete2?.radar}
                label1={athlete1.initials}
                label2={athlete2?.initials}
              />
            </div>
          </div>
        )}

        {/* Stats comparison */}
        {tab === 'Desempenho' && (athlete1 || athlete2) && (
          <div className="animate-slide-up delay-2">
            <div className="k-section-label" style={{ marginBottom: 10 }}>COMPARATIVO — J22</div>
            <div
              style={{
                background: 'var(--surface-2)',
                border: '1px solid var(--border-default)',
                borderRadius: 10,
                overflow: 'hidden',
              }}
            >
              {metrics.map((m, i) => {
                const winner = getWinner(m.key, m.higherIsBetter)
                const v1 = athlete1 ? (athlete1[m.key] as number) : null
                const v2 = athlete2 ? (athlete2[m.key] as number) : null

                return (
                  <div
                    key={m.key}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '12px 14px',
                      borderBottom: i < metrics.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                    }}
                  >
                    {/* Value 1 */}
                    <div
                      style={{
                        flex: 1,
                        textAlign: 'left',
                        fontSize: 14,
                        fontWeight: 500,
                        color: winner === 1 ? 'var(--primary-strong)' : winner === 2 ? 'var(--text-subtle)' : 'var(--text-primary)',
                      }}
                    >
                      {v1 !== null
                        ? m.key === 'weeklyLoad'
                          ? v1.toLocaleString('pt-BR')
                          : formatNumber(v1, m.key === 'pse' ? 1 : 1)
                        : '—'}
                      {v1 !== null && m.unit && (
                        <span style={{ fontSize: 9, color: 'var(--text-subtle)', marginLeft: 2 }}>{m.unit}</span>
                      )}
                    </div>

                    {/* Label */}
                    <div
                      style={{
                        textAlign: 'center',
                        flexShrink: 0,
                        width: 90,
                      }}
                    >
                      <div style={{ fontSize: 10, color: 'var(--text-subtle)', fontWeight: 500 }}>{m.label}</div>
                    </div>

                    {/* Value 2 */}
                    <div
                      style={{
                        flex: 1,
                        textAlign: 'right',
                        fontSize: 14,
                        fontWeight: 500,
                        color: winner === 2 ? 'var(--primary-strong)' : winner === 1 ? 'var(--text-subtle)' : 'var(--text-primary)',
                      }}
                    >
                      {v2 !== null
                        ? m.key === 'weeklyLoad'
                          ? v2.toLocaleString('pt-BR')
                          : formatNumber(v2, m.key === 'pse' ? 1 : 1)
                        : '—'}
                      {v2 !== null && m.unit && (
                        <span style={{ fontSize: 9, color: 'var(--text-subtle)', marginLeft: 2 }}>{m.unit}</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Deltas */}
        {tab === 'Desempenho' && athlete1 && athlete2 && (
          <div className="animate-slide-up delay-3">
            <div className="k-section-label" style={{ marginBottom: 10 }}>TENDÊNCIA — VS JORNADA ANTERIOR</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <div
                style={{
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 10,
                  padding: '12px',
                }}
              >
                <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8 }}>
                  {athlete1.name.split(' ')[0]}
                </div>
                {[
                  { label: 'Velocidade', val: athlete1.speedDelta },
                  { label: 'Sprint', val: athlete1.sprintDelta },
                  { label: 'Carga', val: athlete1.loadDelta },
                  { label: 'PSE', val: athlete1.pseDelta },
                ].map(({ label, val }) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 11, color: 'var(--text-subtle)' }}>{label}</span>
                    <span style={{ fontSize: 11, fontWeight: 500, color: val >= 0 ? 'var(--chart-baseline)' : 'var(--danger)' }}>
                      {formatDelta(val)}
                    </span>
                  </div>
                ))}
              </div>

              <div
                style={{
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 10,
                  padding: '12px',
                }}
              >
                <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8 }}>
                  {athlete2.name.split(' ')[0]}
                </div>
                {[
                  { label: 'Velocidade', val: athlete2.speedDelta },
                  { label: 'Sprint', val: athlete2.sprintDelta },
                  { label: 'Carga', val: athlete2.loadDelta },
                  { label: 'PSE', val: athlete2.pseDelta },
                ].map(({ label, val }) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 11, color: 'var(--text-subtle)' }}>{label}</span>
                    <span style={{ fontSize: 11, fontWeight: 500, color: val >= 0 ? 'var(--chart-baseline)' : 'var(--danger)' }}>
                      {formatDelta(val)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Picker modal */}
      {picker !== null && (
        <AthletePickerModal
          onSelect={handleSelect}
          onClose={() => setPicker(null)}
          excluded={picker === 1 ? athlete2?.id : athlete1?.id}
        />
      )}
    </div>
  )
}
