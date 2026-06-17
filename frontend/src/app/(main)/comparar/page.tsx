'use client'

import { useState, useEffect, useMemo } from 'react'
import { X, Plus, Loader2 } from 'lucide-react'
import { TopBar } from '@/components/kicker/top-bar'
import { Avatar } from '@/components/kicker/avatar'
import { AthletePill } from '@/components/kicker/athlete-pill'
import { KickerRadarChart } from '@/components/kicker/radar-chart'
import type { Athlete } from '@/lib/mock-data'
import { formatNumber } from '@/lib/utils'
import { useAthletes } from '@/context/AthleteContext'
import { useAuth } from '@/context/AuthContext'
import { apiService } from '@/lib/api'

type MetricKey = 'speed' | 'sprintDistance' | 'weeklyLoad' | 'pse'

const metrics: { key: MetricKey; label: string; unit: string; higherIsBetter: boolean }[] = [
  { key: 'speed',         label: 'Vel. máxima',   unit: 'km/h', higherIsBetter: true },
  { key: 'sprintDistance',label: 'Dist. sprint',  unit: 'm',    higherIsBetter: true },
  { key: 'weeklyLoad',    label: 'Carga sessão',  unit: 'AU',   higherIsBetter: false },
  { key: 'pse',           label: 'PSE',           unit: '',     higherIsBetter: false },
]

function AthletePickerModal({
  athletes,
  onSelect,
  onClose,
  excludedIds,
}: {
  athletes: Athlete[]
  onSelect: (a: Athlete) => void
  onClose: () => void
  excludedIds: string[]
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
            .filter((a) => !excludedIds.includes(a.id))
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
                <Avatar id={a.id} initials={a.initials} profile={a.profile} size="md" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>ID: {a.id}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-subtle)' }}>{a.position} · {a.group}</div>
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
  const { athletes, loading } = useAthletes()
  const { token } = useAuth()
  
  const [selectedAthletes, setSelectedAthletes] = useState<Athlete[]>([])
  const [showPicker, setShowPicker] = useState(false)
  const [tab, setTab] = useState<'Métricas' | 'IA' | 'Físico'>('Métricas')
  const [radarData, setRadarData] = useState<any>(null)
  const [loadingRadar, setLoadingRadar] = useState(false)

  useEffect(() => {
    if (athletes.length >= 2 && selectedAthletes.length === 0) {
      setSelectedAthletes([athletes[0], athletes[1]])
    }
  }, [athletes, selectedAthletes.length])

  useEffect(() => {
    async function loadRadar() {
      if (tab === 'Físico' && token && selectedAthletes.length > 0) {
        setLoadingRadar(true)
        try {
          const ids = selectedAthletes.map(a => a.id)
          const features = [
            "Distance (m)",
            "Sprint Distance (m)",
            "Top Speed (kph)",
            "Avg Speed (kph)",
            "Workload",
            "Duration (mins)",
            "High Intensity Running (m)",
            "Accelerations",
            "Decelerations",
            "No. of Sprints"
          ]
          const data = await apiService.analytics.getRadar(ids, features, token)
          setRadarData(data)
        } catch (err) {
          console.error("Radar load failed", err)
        } finally {
          setLoadingRadar(false)
        }
      }
    }
    loadRadar()
  }, [tab, token, selectedAthletes])

  function handleSelect(a: Athlete) {
    if (selectedAthletes.length < 4) {
      setSelectedAthletes([...selectedAthletes, a])
    }
  }

  function handleRemove(id: string) {
    setSelectedAthletes(selectedAthletes.filter(a => a.id !== id))
  }

  function getBestIndices(key: MetricKey, higherIsBetter: boolean): number[] {
    if (selectedAthletes.length === 0) return []
    const values = selectedAthletes.map(a => a[key] as number)
    const validValues = values.filter(v => v !== null && v !== undefined && !isNaN(v))
    if (validValues.length === 0) return []
    const bestValue = higherIsBetter ? Math.max(...validValues) : Math.min(...validValues)
    return values.map((v, i) => v === bestValue ? i : -1).filter(i => i !== -1)
  }

  const chartData = useMemo(() => {
    if (!radarData || !radarData.labels) return []
    return radarData.labels.map((label: string, i: number) => {
      const dataPoint: any = { subject: label }
      radarData.datasets.forEach((dataset: any) => {
        const id = dataset.label.replace('Atleta ', '')
        dataPoint[id] = dataset.data[i]
      })
      return dataPoint
    })
  }, [radarData])

  if (loading && athletes.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--surface-1)' }}>
        <TopBar title="Comparar atletas" />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-subtle)' }}>
          <Loader2 className="animate-spin" size={24} />
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%', width: '100%', background: 'var(--surface-1)' }}>
      <TopBar title="Comparar atletas" />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '16px 14px', paddingBottom: 24 }}>

        {/* Athlete slots */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8, scrollbarWidth: 'none' }}>
          {selectedAthletes.map((athlete) => (
            <div
              key={athlete.id}
              style={{
                flex: '0 0 auto',
                width: 140,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '12px',
                background: 'var(--surface-2)',
                border: '1px solid var(--border-default)',
                borderRadius: 10,
                position: 'relative',
              }}
            >
              <button
                onClick={() => handleRemove(athlete.id)}
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
              <Avatar id={athlete.id} initials={athlete.initials} profile={athlete.profile} size="md" />
              <div style={{ marginTop: 8, textAlign: 'center' }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                  ID: {athlete.id}
                </div>
                <div style={{ marginTop: 3 }}>
                  <AthletePill profile={athlete.profile} label={athlete.profileLabel} />
                </div>
              </div>
            </div>
          ))}

          {selectedAthletes.length < 4 && (
            <button
              onClick={() => setShowPicker(true)}
              style={{
                flex: '0 0 auto',
                width: 100,
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
                Adicionar
              </span>
            </button>
          )}
        </div>

        {/* Tabs */}
        {selectedAthletes.length > 0 && (
          <div
            style={{
              display: 'flex',
              gap: 0,
              background: 'var(--surface-3)',
              borderRadius: 10,
              padding: 3,
            }}
          >
            {(['Métricas', 'IA', 'Físico'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  flex: 1,
                  height: 32,
                  borderRadius: 8,
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 11,
                  fontWeight: 500,
                  fontFamily: 'var(--font-sans)',
                  background: tab === t ? 'var(--surface-5)' : 'transparent',
                  color: tab === t ? 'var(--text-primary)' : 'var(--text-subtle)',
                  transition: 'background 150ms',
                }}
              >
                {t}
              </button>
            ))}
          </div>
        )}

        {/* Radar chart */}
        {tab === 'Físico' && selectedAthletes.length > 0 && (
          <div>
            <div className="k-section-label" style={{ marginBottom: 10 }}>RADAR — PERFORMANCE COMPARADA (Z-SCORE)</div>
            <div
              style={{
                background: 'var(--surface-2)',
                border: '1px solid var(--border-default)',
                borderRadius: 10,
                padding: 16,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minHeight: 340,
                position: 'relative'
              }}
            >
              {loadingRadar ? (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.1)' }}>
                  <Loader2 className="animate-spin" size={24} />
                </div>
              ) : chartData.length > 0 ? (
                <KickerRadarChart customChartData={chartData} />
              ) : (
                <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-subtle)', fontSize: 13 }}>Dados insuficientes para radar comparativo.</div>
              )}
            </div>
            <div style={{ marginTop: 12, background: 'var(--surface-3)', padding: 12, borderRadius: 10, fontSize: 10, color: 'var(--text-subtle)', lineHeight: 1.4 }}>
              * Os valores do radar representam o <strong>Z-Score</strong> (desvios padrão em relação à média do elenco). Um valor de 0 indica performance média, valores positivos indicam performance acima da média.
            </div>
          </div>
        )}

        {/* IA Comparison */}
        {tab === 'IA' && selectedAthletes.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="k-section-label">DISTRIBUIÇÃO DE PERFIL (IA)</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
              {selectedAthletes.map((a, idx) => (
                <div key={idx} style={{ background: 'var(--surface-2)', padding: 12, borderRadius: 10, border: '1px solid var(--border-default)' }}>
                  <div style={{ fontSize: 10, color: 'var(--text-subtle)', marginBottom: 8, textAlign: 'center' }}>
                    ID {a.id}
                  </div>
                  {a.clusterScores ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {Object.entries(a.clusterScores).map(([key, score]) => (
                        <div key={key}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, marginBottom: 2 }}>
                            <span style={{ color: 'var(--text-secondary)' }}>{key.replace('_', ' ')}</span>
                            <span style={{ fontWeight: 500 }}>{score}%</span>
                          </div>
                          <div style={{ height: 4, background: 'var(--surface-4)', borderRadius: 2, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${score}%`, background: 'var(--primary)', borderRadius: 2 }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-subtle)', fontSize: 10 }}>Sem dados de IA</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats comparison */}
        {tab === 'Métricas' && selectedAthletes.length > 0 && (
          <div>
            <div className="k-section-label" style={{ marginBottom: 10 }}>COMPARATIVO — MÉTRICAS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {metrics.map((m) => {
                const bestIndices = getBestIndices(m.key, m.higherIsBetter)

                return (
                  <div key={m.key} style={{ background: 'var(--surface-2)', border: '1px solid var(--border-default)', borderRadius: 10, padding: '12px 14px' }}>
                    <div style={{ fontSize: 10, color: 'var(--text-subtle)', fontWeight: 500, marginBottom: 8, textAlign: 'center' }}>{m.label}</div>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'space-around' }}>
                      {selectedAthletes.map((a, i) => {
                        const isBest = bestIndices.includes(i)
                        const val = a[m.key] as number
                        return (
                          <div key={a.id} style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 14, fontWeight: 500, color: isBest ? 'var(--primary-strong)' : 'var(--text-primary)' }}>
                              {val !== null && val !== undefined
                                ? m.key === 'weeklyLoad'
                                  ? val.toLocaleString('pt-BR')
                                  : formatNumber(val, 1)
                                : '—'}
                              {val !== null && val !== undefined && m.unit && (
                                <span style={{ fontSize: 9, color: 'var(--text-subtle)', marginLeft: 2 }}>{m.unit}</span>
                              )}
                            </div>
                            <div style={{ fontSize: 9, color: 'var(--text-subtle)', marginTop: 2 }}>ID {a.id}</div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

      </div>

      {showPicker && (
        <AthletePickerModal
          athletes={athletes}
          onSelect={handleSelect}
          onClose={() => setShowPicker(false)}
          excludedIds={selectedAthletes.map(a => a.id)}
        />
      )}
    </div>
  )
}