'use client'

import { useState, useEffect, use, useMemo } from 'react'
import { Share2, Loader2, BrainCircuit } from 'lucide-react'
import { TopBar } from '@/components/kicker/top-bar'
import { Avatar } from '@/components/kicker/avatar'
import { AthletePill } from '@/components/kicker/athlete-pill'
import { KpiCard } from '@/components/kicker/kpi-card'
import { KickerRadarChart } from '@/components/kicker/radar-chart'
import type { Athlete } from '@/lib/mock-data'
import { formatNumber, formatDelta } from '@/lib/utils'
import { useAthletes } from '@/context/AthleteContext'
import { useAuth } from '@/context/AuthContext'
import { apiService } from '@/lib/api'
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ReTooltip,
  ScatterChart,
  Scatter,
  ZAxis,
  Cell,
  ComposedChart,
  Area,
  Line,
  BarChart,
  Bar
} from 'recharts'

const tabs = ['Desempenho', 'Análise IA', 'Histórico'] as const
type Tab = (typeof tabs)[number]

interface PredictionResult {
  clusterName: string;
  confidence: string;
  allScores: Array<{ cluster: string; score: string }>;
}

interface TimelinePoint {
  date: string;
  segment: string;
  clusterName: string;
  confidence: string;
}

export default function AtletaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { token } = useAuth()
  const { getAthleteById, predictMatch } = useAthletes()
  
  const [athlete, setAthlete] = useState<Athlete | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tab, setTab] = useState<Tab>('Desempenho')
  
  const [prediction, setPrediction] = useState<PredictionResult | null>(null)
  const [predicting, setPredicting] = useState(false)
  const [timeline, setTimeline] = useState<TimelinePoint[]>([])
  const [loadingTimeline, setLoadingTimeline] = useState(false)
  const [history, setHistory] = useState<any>(null)
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [similarity, setSimilarity] = useState<any[]>([])
  const [loadingSim, setLoadingSim] = useState(false)
  const [radarData, setRadarData] = useState<any>(null)
  const [loadingRadar, setLoadingRadar] = useState(false)

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

  useEffect(() => {
    async function loadRadar() {
      if (tab === 'Desempenho' && token && athlete) {
        setLoadingRadar(true)
        try {
          const features = ["Distance (m)", "Sprint Distance", "Top Speed", "Avg Speed (kph)", "Workload", "Duration (mins)"]
          const data = await apiService.analytics.getRadar([athlete.id], features, token)
          setRadarData(data)
        } catch (err) {
          console.error("Radar load failed", err)
        } finally {
          setLoadingRadar(false)
        }
      }
    }
    loadRadar()
  }, [tab, token, athlete])

  useEffect(() => {
    async function loadTimelineAndSim() {
      if (tab === 'Análise IA' && token && athlete) {
        setLoadingTimeline(true)
        setLoadingSim(true)
        try {
          const [resTl, resSim] = await Promise.all([
            apiService.model.getAthleteTimeline(athlete.id, token),
            apiService.analytics.getSimilarity(athlete.id, token, 5)
          ])
          setTimeline(resTl.timeline || [])
          setSimilarity(resSim || [])
        } catch (err) {
          console.error("Timeline/Sim load failed", err)
        } finally {
          setLoadingTimeline(false)
          setLoadingSim(false)
        }
      }
    }
    loadTimelineAndSim()
  }, [tab, token, athlete])

  useEffect(() => {
    async function loadHistory() {
      if (tab === 'Histórico' && token && athlete) {
        setLoadingHistory(true)
        try {
          const data = await apiService.analytics.getHistory(athlete.id, token)
          setHistory(data)
        } catch (err) {
          console.error("History load failed", err)
        } finally {
          setLoadingHistory(false)
        }
      }
    }
    loadHistory()
  }, [tab, token, athlete])

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

  const timelineData = useMemo(() => {
    const clusterOrder = ['baixo_volume', 'moderado', 'resistente', 'explosivo']
    return timeline.map(pt => ({
      ...pt,
      displayDate: new Date(pt.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      value: clusterOrder.indexOf(pt.clusterName) + 1,
      profile: pt.clusterName.replace('_', ' ').toUpperCase()
    }))
  }, [timeline])

  const historyChartData = useMemo(() => {
    if (!history || !history.datas) return []
    return history.datas.map((date: string, i: number) => ({
      date: new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      score: history.valores[i],
      anomaly: history.anomalias[i],
      fullDate: new Date(date).toLocaleDateString('pt-BR')
    }))
  }, [history])

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

  const radarFallbackData = {
    velocidade:    athlete.radar?.velocidade || 0,
    resistencia:   athlete.radar?.resistencia || 0,
    explosividade: athlete.radar?.explosividade || 0,
    carga:         athlete.radar?.carga || 0,
    recuperacao:   athlete.radar?.recuperacao || 0,
    tecnica:       athlete.radar?.tecnica || 0,
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
                {loadingRadar ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 320, color: 'var(--text-subtle)' }}>
                    <Loader2 className="animate-spin" size={24} />
                  </div>
                ) : (
                  <KickerRadarChart 
                    data1={radarData ? undefined : radarFallbackData} 
                    label1={`ID ${athlete.id.slice(-2)}`} 
                    customChartData={radarData ? radarData.labels.map((label: string, index: number) => {
                      const entry: any = { subject: label };
                      radarData.datasets.forEach((ds: any) => {
                        const key = ds.label.replace('Atleta ', '');
                        entry[key] = ds.data[index];
                      });
                      return entry;
                    }) : undefined}
                  />
                )}
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
              <div className="k-section-label" style={{ marginBottom: 10 }}>SUGESTÃO DE SUBSTITUTOS (SIMILARIDADE)</div>
              <div style={{ background: 'var(--surface-2)', padding: '20px 16px', borderRadius: 12, border: '1px solid var(--border-default)', minHeight: 200, position: 'relative' }}>
                {loadingSim ? (
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.2)', borderRadius: 12 }}>
                    <Loader2 className="animate-spin" size={20} />
                  </div>
                ) : similarity.length > 0 ? (
                  <div style={{ height: 200 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={similarity} layout="vertical" margin={{ top: 0, right: 0, left: 10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="var(--border-subtle)" />
                        <XAxis type="number" domain={[0, 1]} hide />
                        <YAxis dataKey="atleta_candidato" type="category" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-subtle)', fontSize: 11 }} width={80} />
                        <ReTooltip cursor={{ fill: 'transparent' }} content={({ active, payload }) => {
                          if (!active || !payload?.length) return null;
                          return (
                            <div style={{ background: 'var(--surface-3)', border: '1px solid var(--border-emphasis)', padding: '6px 10px', borderRadius: 8, fontSize: 11 }}>
                              <div style={{ color: 'var(--text-primary)' }}>ID: {payload[0].payload.atleta_candidato}</div>
                              <div style={{ color: 'var(--success)' }}>Similaridade: {(payload[0].value as number).toFixed(2)}</div>
                            </div>
                          );
                        }} />
                        <Bar dataKey="similaridade" fill="var(--success-soft)" radius={[0, 4, 4, 0]} barSize={24} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-subtle)', fontSize: 12 }}>Nenhum substituto encontrado.</div>
                )}
              </div>
            </div>

            <div>
              <div className="k-section-label" style={{ marginBottom: 10 }}>EVOLUÇÃO DO PERFIL (IA)</div>
              <div style={{ background: 'var(--surface-2)', padding: '20px 12px', borderRadius: 12, border: '1px solid var(--border-default)', minHeight: 240, position: 'relative' }}>
                {loadingTimeline ? (
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.2)', borderRadius: 12 }}>
                    <Loader2 className="animate-spin" size={20} />
                  </div>
                ) : timelineData.length > 0 ? (
                  <div style={{ height: 200 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart margin={{ top: 10, right: 20, bottom: 0, left: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />
                        <XAxis 
                          dataKey="displayDate" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: 'var(--text-subtle)', fontSize: 9 }}
                        />
                        <YAxis 
                          dataKey="value" 
                          domain={[0, 5]} 
                          ticks={[1, 2, 3, 4]}
                          axisLine={false}
                          tickLine={false}
                          tickFormatter={(val) => ['BV', 'MOD', 'RES', 'EXP'][val-1]}
                          tick={{ fill: 'var(--text-subtle)', fontSize: 9 }}
                        />
                        <ZAxis range={[60, 60]} />
                        <ReTooltip 
                          content={({ active, payload }) => {
                            if (!active || !payload?.length) return null
                            const data = payload[0].payload
                            return (
                              <div style={{ background: 'var(--surface-3)', border: '1px solid var(--border-emphasis)', padding: '8px 12px', borderRadius: 8, fontSize: 10 }}>
                                <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{new Date(data.date).toLocaleDateString()}</div>
                                <div style={{ color: 'var(--primary)' }}>Perfil: {data.profile}</div>
                                <div style={{ color: 'var(--text-subtle)' }}>Confiança: {data.confidence}</div>
                              </div>
                            )
                          }}
                        />
                        <Scatter 
                          data={timelineData} 
                          fill="var(--primary)" 
                          line={{ stroke: 'var(--primary)', strokeWidth: 2, opacity: 0.5 }}
                          isAnimationActive={true}
                        />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-subtle)', fontSize: 12 }}>Nenhum dado histórico para exibir.</div>
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

        {/* Tab content: Histórico */}
        {tab === 'Histórico' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <div className="k-section-label" style={{ marginBottom: 10 }}>EVOLUÇÃO DO IF-SCORE (DETECÇÃO DE ANOMALIA)</div>
              <div style={{ background: 'var(--surface-2)', padding: '24px 12px', borderRadius: 12, border: '1px solid var(--border-default)', minHeight: 280, position: 'relative' }}>
                {loadingHistory ? (
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.1)' }}>
                    <Loader2 className="animate-spin" size={24} />
                  </div>
                ) : historyChartData.length > 0 ? (
                  <div style={{ height: 220 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={historyChartData} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
                        <defs>
                          <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />
                        <XAxis 
                          dataKey="date" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: 'var(--text-subtle)', fontSize: 10 }}
                        />
                        <YAxis 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: 'var(--text-subtle)', fontSize: 10 }}
                          domain={['auto', 'auto']}
                        />
                        <ZAxis range={[50, 50]} />
                        <ReTooltip 
                          content={({ active, payload }) => {
                            if (!active || !payload?.length) return null
                            const d = payload[0].payload
                            return (
                              <div style={{ background: 'var(--surface-3)', border: '1px solid var(--border-emphasis)', padding: '10px', borderRadius: 8, fontSize: 11 }}>
                                <div style={{ fontWeight: 600, marginBottom: 4 }}>{d.fullDate}</div>
                                <div style={{ color: 'var(--text-primary)' }}>Score: {d.score.toFixed(3)}</div>
                                <div style={{ color: d.anomaly ? 'var(--warning)' : 'var(--primary)', fontWeight: 600, marginTop: 4 }}>
                                  {d.anomaly ? 'ANOMALIA DETECTADA' : 'SESSÃO NORMAL'}
                                </div>
                              </div>
                            )
                          }}
                        />
                        <Area type="monotone" dataKey="score" stroke="var(--primary)" strokeWidth={2} fillOpacity={1} fill="url(#colorScore)" />
                        <Scatter dataKey="score">
                          {historyChartData.map((entry: any, index: number) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={entry.anomaly ? 'var(--warning)' : 'var(--primary)'} 
                            />
                          ))}
                        </Scatter>
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-subtle)', fontSize: 13 }}>Sem histórico de anomalias para este atleta.</div>
                )}
              </div>
            </div>
            
            <div style={{ background: 'var(--surface-3)', padding: 14, borderRadius: 10, fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              <strong style={{ display: 'block', color: 'var(--text-primary)', marginBottom: 4 }}>O que é o IF-Score?</strong>
              O algoritmo Isolation Forest calcula o quão "isolado" (anômalo) um ponto está em relação ao padrão histórico do atleta. Valores mais baixos indicam maior probabilidade de anomalia física, que pode significar sobrecarga ou queda brusca de performance.
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
