'use client'

import { useState, useEffect, use } from 'react'
import { Share2, Loader2, BrainCircuit } from 'lucide-react'
import { TopBar } from '@/components/kicker/top-bar'
import { Avatar } from '@/components/kicker/avatar'
import { AthletePill } from '@/components/kicker/athlete-pill'
import { KpiCard } from '@/components/kicker/kpi-card'
import { KickerRadarChart } from '@/components/kicker/radar-chart'
import type { Athlete } from '@/lib/mock-data'
import { formatNumber, formatDelta } from '@/lib/utils'
import { useAthletes } from '@/context/AthleteContext'

const tabs = ['Desempenho', 'Análise IA', 'Histórico', 'Carga'] as const
type Tab = (typeof tabs)[number]

interface PredictionResult {
  clusterName: string;
  confidence: string;
  allScores: Array<{ cluster: string; score: string }>;
}

export default function AtletaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { getAthleteById, predictMatch } = useAthletes()
  
  const [athlete, setAthlete] = useState<Athlete | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tab, setTab] = useState<Tab>('Desempenho')
  
  const [prediction, setPrediction] = useState<PredictionResult | null>(null)
  const [predicting, setPredicting] = useState(false)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const data = await getAthleteById(id)
      if (data) {
        setAthlete(data)
      } else {
        setError('Atleta não localizado no sistema.')
      }
      setLoading(false)
    }
    load()
  }, [id, getAthleteById])

  const handlePredictSession = async () => {
    if (!athlete || !athlete.metrics) return
    setPredicting(true)
    const result = await predictMatch({
      distanceM: athlete.metrics.distanceM,
      highIntensityRunningM: athlete.metrics.highIntensityRunningM,
      highIntensityEvents: athlete.metrics.noHighIntensityEvents,
      sprintDistanceM: athlete.sprintDistance,
      numberOfSprints: athlete.metrics.noSprints,
      topSpeedKph: athlete.speed,
      avgSpeedKph: athlete.metrics.avgSpeedKph,
      accelerations: athlete.metrics.accelerations,
      decelerations: athlete.metrics.decelerations,
      metresPerMinuteM: athlete.metrics.metresPerMinuteM,
      workloadIntensity: athlete.metrics.workloadIntensity || 0
    })
    setPrediction(result)
    setPredicting(false)
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--surface-1)' }}>
        <TopBar title="Carregando..." back />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-subtle)' }}>
          <Loader2 className="animate-spin" size={24} />
        </div>
      </div>
    )
  }

  if (!athlete) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--surface-1)' }}>
        <TopBar title="Erro" back />
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--danger)' }}>
          {error || 'Atleta não encontrado'}
        </div>
      </div>
    )
  }

  const radarData = {
    velocidade:    athlete.radar.velocidade,
    resistencia:   athlete.radar.resistencia,
    explosividade: athlete.radar.explosividade,
    carga:         athlete.radar.carga,
    recuperacao:   athlete.radar.recuperacao,
    tecnica:       athlete.radar.tecnica,
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%', width: '100%', background: 'var(--surface-1)' }}>
      <TopBar
        title={`ID: ${athlete.id} · ${athlete.position}`}
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
          <Avatar id={athlete.id} initials={athlete.initials} profile={athlete.profile} size="lg" />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 17, fontWeight: 500, color: 'var(--text-primary)', lineHeight: 1.2, marginBottom: 6 }}>
              ID: {athlete.id}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              <AthletePill profile={athlete.profile} label={athlete.profileLabel} />
              <span style={{ fontSize: 11, color: 'var(--text-subtle)' }}>
                {athlete.position} · {athlete.group || 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 0, background: 'var(--surface-3)', borderRadius: 10, padding: 3 }}>
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
                fontSize: 11,
                fontWeight: 500,
                background: tab === t ? 'var(--surface-5)' : 'transparent',
                color: tab === t ? 'var(--text-primary)' : 'var(--text-subtle)',
                transition: 'background 150ms',
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Tab content: Desempenho */}
        {tab === 'Desempenho' && (
          <>
            <div>
              <div className="k-section-label" style={{ marginBottom: 10 }}>MÉTRICAS — ÚLTIMA SESSÃO</div>
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
                  label="Distância Total"
                  value={`${formatNumber(athlete.metrics?.distanceM || 0, 0)} m`}
                  delta={""}
                />
              </div>
            </div>

            <div>
              <div className="k-section-label" style={{ marginBottom: 10 }}>RADAR FÍSICO</div>
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
                <KickerRadarChart data1={radarData} label1={`ID ${athlete.id.slice(-2)}`} />
              </div>
            </div>
          </>
        )}

        {/* Tab content: Análise IA */}
        {tab === 'Análise IA' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <div className="k-section-label" style={{ marginBottom: 10 }}>COMPOSIÇÃO HISTÓRICA DO PERFIL</div>
              <div style={{ background: 'var(--surface-2)', padding: 16, borderRadius: 12, border: '1px solid var(--border-default)' }}>
                {athlete.clusterScores ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {Object.entries(athlete.clusterScores).sort((a, b) => b[1] - a[1]).map(([key, score]) => (
                      <div key={key}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)' }}>{key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' ')}</span>
                          <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)' }}>{score}%</span>
                        </div>
                        <div style={{ height: 6, background: 'var(--surface-4)', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${score}%`, background: 'var(--primary)', borderRadius: 3 }} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-subtle)', fontSize: 12 }}>Dados insuficientes para análise histórica.</div>
                )}
              </div>
            </div>

            <div>
              <div className="k-section-label" style={{ marginBottom: 10 }}>PREDIÇÃO DA SESSÃO ATUAL</div>
              <div style={{ background: 'var(--surface-2)', padding: 16, borderRadius: 12, border: '1px solid var(--border-default)', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <button 
                  className="k-btn-outline" 
                  onClick={handlePredictSession} 
                  disabled={predicting}
                  style={{ display: 'flex', gap: 8, justifyContent: 'center' }}
                >
                  {predicting ? <Loader2 size={16} className="animate-spin" /> : <BrainCircuit size={16} />}
                  Executar Análise de IA
                </button>

                {prediction && (
                  <div style={{ marginTop: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                      <div>
                        <div style={{ fontSize: 10, color: 'var(--text-subtle)' }}>RESULTADO DA CLASSIFICAÇÃO</div>
                        <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--primary-strong)' }}>{prediction.clusterName.replace('_', ' ').toUpperCase()}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 10, color: 'var(--text-subtle)' }}>CONFIANÇA</div>
                        <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--success)' }}>{prediction.confidence}</div>
                      </div>
                    </div>
                    
                    <div className="k-section-label" style={{ fontSize: 9, marginBottom: 8 }}>PONTUAÇÃO POR CLUSTER</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      {prediction.allScores.map((s) => (
                        <div key={s.cluster} style={{ background: 'var(--surface-3)', padding: '8px 10px', borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
                          <div style={{ fontSize: 9, color: 'var(--text-subtle)', marginBottom: 2 }}>{s.cluster.toUpperCase()}</div>
                          <div style={{ fontSize: 13, fontWeight: 500 }}>{s.score}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Histórico e Carga (simplificados) */}
        {(tab === 'Histórico' || tab === 'Carga') && (
          <div style={{ background: 'var(--surface-2)', padding: 20, borderRadius: 12, textAlign: 'center', color: 'var(--text-subtle)', fontSize: 13 }}>
            Visualização em desenvolvimento para este perfil de dados.
          </div>
        )}

      </div>
    </div>
  )
}
