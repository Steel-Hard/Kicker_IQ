'use client'

import { useState, useEffect, useMemo } from 'react'
import { Bell, ChevronRight, Loader2, Brain, AlertCircle, TrendingUp, Info, X, PieChart as PieIcon } from 'lucide-react'
import Link from 'next/link'
import { KpiCard } from '@/components/kicker/kpi-card'
import { AlertBanner } from '@/components/kicker/alert-banner'
import { Avatar } from '@/components/kicker/avatar'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useAthletes } from '@/context/AthleteContext'
import { useAuth } from '@/context/AuthContext'
import { useAlerts } from '@/context/AlertContext'
import { apiService } from '@/lib/api'
import { formatNumber, formatDelta } from '@/lib/utils'
import type { Athlete } from '@/lib/mock-data'
import {
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  Cell,
  AreaChart,
  Area,
  CartesianGrid,
  PieChart,
  Pie,
  BarChart,
  Bar,
} from 'recharts'

interface DashboardSummary {
  squadRadarAvg: Array<{ subject: string; A: number }>;
  riskData: Array<{ name: string; load: number; pse: number; z: number }>;
  loadEvolution: Array<{ jornada: string; carga: number }>;
  topPerformers: Array<Athlete & { performanceScore: number }>;
  teamStats: {
    avgSpeed: number;
    avgSprintDist: number;
    avgLoad: number;
    avgPse: number;
    speedDelta: number;
    sprintDelta: number;
    loadDelta: number;
    pseDelta: number;
    alertCount: number;
    lastMatch: {
      date: string;
      jornada: string;
      result: string;
      score: string;
      opponent: string;
    };
  };
}

interface TooltipPayload {
  name: string;
  value: number | string;
  color?: string;
  dataKey?: string | number;
  payload: Record<string, unknown>;
}

interface TooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (!active || !payload?.length) return null

  return (
    <div style={{ 
      background: 'var(--surface-3)', 
      border: '1px solid var(--border-emphasis)', 
      borderRadius: 12, 
      padding: '10px 12px',
      boxShadow: 'var(--shadow-3)',
      zIndex: 100
    }}>
      <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
        {label || (payload[0]?.payload?.name as string) || 'Métrica'}
      </p>
      {payload.map((entry, i) => (
        <div key={i} style={{ fontSize: 10, color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between', gap: 12 }}>
          <span>{entry.name || (entry.dataKey as string)}:</span>
          <span style={{ fontWeight: 600, color: entry.color || 'var(--primary)' }}>
            {typeof entry.value === 'number' ? formatNumber(entry.value, 1) : entry.value}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function DashboardPage() {
  const { token, loading: authLoading } = useAuth()
  const { athletes, loading: athletesLoading } = useAthletes()
  const { alerts } = useAlerts()
  
  const [dashboardData, setDashboardData] = useState<DashboardSummary | null>(null)
  const [teamClassification, setTeamClassification] = useState<any>(null)
  const [analyticsStats, setAnalyticsStats] = useState<any>(null)
  const [analyticsAtletas, setAnalyticsAtletas] = useState<any[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [showGlossary, setShowGlossary] = useState(false)

  useEffect(() => {
    async function fetchData() {
      if (!token) return
      try {
        const [summaryResult, classificationResult, statsResult, atletasResult] = await Promise.allSettled([
          apiService.dashboard.getSummary(token),
          apiService.model.getTeamClassification(token),
          apiService.analytics.getStats(token),
          apiService.analytics.getAtletas(token)
        ])
        if (summaryResult.status === 'fulfilled') setDashboardData(summaryResult.value)
        if (classificationResult.status === 'fulfilled') setTeamClassification(classificationResult.value)
        if (statsResult.status === 'fulfilled') setAnalyticsStats(statsResult.value)
        if (atletasResult.status === 'fulfilled') setAnalyticsAtletas(atletasResult.value)
      } catch (err) {
        console.error("Failed to fetch dashboard data", err)
      } finally {
        setLoadingData(false)
      }
    }
    fetchData()
  }, [token])

  const activeAlerts = alerts.filter(a => a.status === 'active')
  const isLoading = authLoading || (athletesLoading && athletes.length === 0) || (loadingData && !dashboardData)

  const stats = useMemo(() => {
    if (dashboardData?.teamStats) return dashboardData.teamStats
    
    const count = athletes.length || 1
    return {
      avgSpeed: athletes.reduce((acc, a) => acc + a.speed, 0) / count,
      avgSprintDist: athletes.reduce((acc, a) => acc + a.sprintDistance, 0) / count,
      avgLoad: athletes.reduce((acc, a) => acc + a.weeklyLoad, 0) / count,
      avgPse: athletes.reduce((acc, a) => acc + a.pse, 0) / count,
      speedDelta: 0,
      sprintDelta: 0,
      loadDelta: 0,
      pseDelta: 0,
    }
  }, [dashboardData, athletes])

  const distributionData = useMemo(() => {
    if (!teamClassification?.percentages) return []
    return Object.entries(teamClassification.percentages).map(([key, value]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' '),
      value: value as number,
      key
    }))
  }, [teamClassification])

  const COLORS: Record<string, string> = {
    resistente: '#1d9e75',
    explosivo: '#ff7f0e',
    baixo_volume: '#2ca02c',
    moderado: '#9467bd'
  }

  const classData = useMemo(() => {
    if (!analyticsStats) return [];
    return [
      { name: 'Alta de Desempenho', value: analyticsStats.altas_desempenho, fill: 'var(--success)' },
      { name: 'Desempenho Médio', value: analyticsStats.desempenho_medio, fill: 'var(--text-subtle)' },
      { name: 'Queda de Desempenho', value: analyticsStats.quedas_desempenho, fill: 'var(--danger)' },
    ];
  }, [analyticsStats]);

  const anomalyRankData = useMemo(() => {
    if (!analyticsAtletas) return [];
    return [...analyticsAtletas]
      .sort((a, b) => b.anomalies_count - a.anomalies_count)
      .slice(0, 15)
      .map(a => ({ id: a.athlete_id, anomalias: a.anomalies_count }));
  }, [analyticsAtletas]);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', background: 'var(--surface-1)' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-subtle)', flexDirection: 'column', gap: 16 }}>
          <Loader2 className="animate-spin" size={32} strokeWidth={1.5} />
          <span style={{ fontSize: 14, fontWeight: 500, letterSpacing: 0.5 }}>SINCRONIZANDO KICKER IQ...</span>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--surface-1)', minHeight: '100vh' }}>
      {/* Top bar */}
      <div style={{
        height: 48,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 14px',
        background: 'var(--surface-1)',
        borderBottom: '1px solid var(--border-subtle)',
        position: 'sticky',
        top: 0,
        zIndex: 20,
      }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 }}>
            Dashboard
          </div>
          <div style={{ fontSize: 10, color: 'var(--text-subtle)', lineHeight: 1.3 }}>
            Sessão Ativa · {new Date().toLocaleDateString('pt-BR')}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button 
            onClick={() => setShowGlossary(true)}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'var(--text-subtle)', 
              display: 'flex', 
              cursor: 'pointer',
              padding: 4
            }}
          >
            <Info size={18} />
          </button>
          <ThemeToggle />
          <Link href="/alertas" style={{ position: 'relative', display: 'flex' }}>
            <Bell size={18} color="var(--text-secondary)" />
            {activeAlerts.length > 0 && (
              <span style={{
                position: 'absolute',
                top: -2,
                right: -2,
                width: 8,
                height: 8,
                background: 'var(--danger)',
                borderRadius: '50%',
                border: '2px solid var(--surface-1)'
              }} />
            )}
          </Link>
        </div>
      </div>

      {/* Glossary Modal */}
      {showGlossary && (
        <div 
          className="alert-modal-overlay" 
          onClick={() => setShowGlossary(false)}
          style={{ zIndex: 1000 }}
        >
          <div className="alert-modal" onClick={e => e.stopPropagation()} style={{ paddingBottom: 20 }}>
            <div className="alert-modal__header">
              <span style={{ fontSize: 14, fontWeight: 600 }}>Entendendo as Métricas</span>
              <button onClick={() => setShowGlossary(false)} className="alert-modal__close">
                <X size={16} />
              </button>
            </div>
            <div className="alert-modal__body" style={{ gap: 20 }}>
              <section>
                <h4 style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)', marginBottom: 8 }}>KPIs PRINCIPAIS</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div>
                    <strong style={{ fontSize: 11, display: 'block' }}>Velocidade Máxima (km/h)</strong>
                    <p style={{ fontSize: 10 }}>O pico de velocidade atingido pelo atleta na última sessão.</p>
                  </div>
                  <div>
                    <strong style={{ fontSize: 11, display: 'block' }}>Distância de Sprint (m)</strong>
                    <p style={{ fontSize: 10 }}>Distância percorrida em alta intensidade (acima de 25.2 km/h).</p>
                  </div>
                  <div>
                    <strong style={{ fontSize: 11, display: 'block' }}>Carga (AU)</strong>
                    <p style={{ fontSize: 10 }}>Unidades Arbitrárias. Representa o estresse físico total da sessão (Duração x Intensidade).</p>
                  </div>
                  <div>
                    <strong style={{ fontSize: 11, display: 'block' }}>PSE (Percepção de Esforço)</strong>
                    <p style={{ fontSize: 10 }}>Escala de 1 a 10 de quão cansado o atleta se sentiu após o treino.</p>
                  </div>
                </div>
              </section>
              <section>
                <h4 style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)', marginBottom: 8 }}>GRÁFICOS</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div>
                    <strong style={{ fontSize: 11, display: 'block' }}>Radar de Perfil</strong>
                    <p style={{ fontSize: 10 }}>Mostra o equilíbrio físico do elenco. Quanto mais preenchido, mais completo é o desempenho médio.</p>
                  </div>
                  <div>
                    <strong style={{ fontSize: 11, display: 'block' }}>Matriz de Risco</strong>
                    <p style={{ fontSize: 10 }}>Cruza Carga vs PSE. Pontos vermelhos indicam atletas com alta carga e alto cansaço (Risco de Lesão).</p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: '16px 14px', paddingBottom: 100 }}>
        
        {/* KPI Row */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          <KpiCard
            label="ATLETAS"
            value={String(analyticsStats?.total_atletas || 0)}
          />
          <KpiCard
            label="SESSÕES"
            value={String(analyticsStats?.total_sessoes || 0)}
          />
          <KpiCard
            label="ALTA DE DESEMPENHO"
            value={String(analyticsStats?.altas_desempenho || 0)}
          />
          <KpiCard
            label="DESEMPENHO MÉDIO"
            value={String(analyticsStats?.desempenho_medio || 0)}
          />
          <KpiCard
            label="QUEDA DE DESEMPENHO"
            value={String(analyticsStats?.quedas_desempenho || 0)}
          />
          <KpiCard
            label="ANOMALIAS (IF)"
            value={String(analyticsStats?.total_anomalias || 0)}
          />
        </section>

        {/* Alerts Banner */}
        {activeAlerts.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div className="k-section-label">ALERTAS PRIORITÁRIOS</div>
              <Link href="/alertas" style={{ fontSize: 10, color: 'var(--primary-strong)', textDecoration: 'none', fontWeight: 600 }}>
                VER TODOS →
              </Link>
            </div>
            <AlertBanner
              title={`${activeAlerts[0].athleteName} — ${activeAlerts[0].title}`}
              description={activeAlerts[0].description}
              action="Analisar"
              onAction={() => window.location.href = `/atleta/${activeAlerts[0].athleteId}`}
            />
          </div>
        )}

        {/* Main Charts Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20 }}>
          
          {/* Team Distribution & Anomaly Ranking */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            {/* Team Distribution Card */}
            <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border-default)', borderRadius: 16, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <div style={{ background: 'var(--primary-strong)', padding: 6, borderRadius: 8 }}>
                  <PieIcon size={16} color="#000" />
                </div>
                <h3 style={{ fontSize: 14, fontWeight: 600 }}>Distribuição de Classificação das Sessões</h3>
              </div>
              <div style={{ height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={classData} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="var(--border-subtle)" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-subtle)', fontSize: 10 }} width={120} />
                    <Tooltip cursor={{ fill: 'transparent' }} content={<CustomTooltip />} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                      {classData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Anomaly Ranking Card */}
            <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border-default)', borderRadius: 16, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <div style={{ background: 'var(--warning)', padding: 6, borderRadius: 8 }}>
                  <AlertCircle size={16} color="#000" />
                </div>
                <h3 style={{ fontSize: 14, fontWeight: 600 }}>Anomalias por Atleta (Isolation Forest)</h3>
              </div>
              <div style={{ height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={anomalyRankData} margin={{ top: 0, right: 0, left: -20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />
                    <XAxis dataKey="id" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-subtle)', fontSize: 10, angle: -45, textAnchor: 'end' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-subtle)', fontSize: 10 }} />
                    <Tooltip cursor={{ fill: 'transparent' }} content={<CustomTooltip />} />
                    <Bar dataKey="anomalias" fill="var(--primary-strong)" radius={[4, 4, 0, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Squad Profile & Radar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            {/* IA Profile Distribution */}
            <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border-default)', borderRadius: 16, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <div style={{ background: 'var(--primary-strong)', padding: 6, borderRadius: 8 }}>
                  <PieIcon size={16} color="#000" />
                </div>
                <h3 style={{ fontSize: 14, fontWeight: 600 }}>Distribuição de Perfis (IA)</h3>
              </div>
              
              <div style={{ height: 260, display: 'flex', alignItems: 'center' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={distributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      isAnimationActive={true}
                    >
                      {distributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[entry.key] || 'var(--primary)'} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingLeft: 10 }}>
                  {distributionData.map((entry, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: COLORS[entry.key] || 'var(--primary)' }} />
                      <span style={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 500 }}>
                        {entry.name}: <span style={{ color: 'var(--text-primary)' }}>{entry.value}%</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Squad Radar Card */}
            <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border-default)', borderRadius: 16, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <div style={{ background: 'var(--primary)', padding: 6, borderRadius: 8 }}>
                  <Brain size={16} color="#000" />
                </div>
                <h3 style={{ fontSize: 14, fontWeight: 600 }}>Perfil Físico do Elenco</h3>
              </div>
              
              <div style={{ height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={dashboardData?.squadRadarAvg || []}>
                    <PolarGrid stroke="var(--border-emphasis)" />
                    <PolarAngleAxis 
                      dataKey="subject" 
                      tick={{ fill: 'var(--text-subtle)', fontSize: 10, fontWeight: 500 }}
                    />
                    <Radar
                      name="Média Squad"
                      dataKey="A"
                      stroke="var(--primary)"
                      fill="var(--primary)"
                      fillOpacity={0.25}
                      isAnimationActive={true}
                      animationBegin={200}
                      animationDuration={1000}
                    />
                    <Tooltip content={<CustomTooltip />} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Risk Matrix Card */}
          <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border-default)', borderRadius: 16, padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{ background: 'var(--danger)', padding: 6, borderRadius: 8 }}>
                <AlertCircle size={16} color="#fff" />
              </div>
              <h3 style={{ fontSize: 14, fontWeight: 600 }}>Matriz de Risco (Carga vs PSE)</h3>
            </div>
            
            <div style={{ height: 240 }}>
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                  <XAxis 
                    type="number" 
                    dataKey="load" 
                    name="Carga" 
                    unit=" AU" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'var(--text-subtle)', fontSize: 10 }}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="pse" 
                    name="PSE" 
                    domain={[0, 10]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'var(--text-subtle)', fontSize: 10 }}
                  />
                  <ZAxis dataKey="z" range={[100, 100]} />
                  <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter name="Atletas" data={dashboardData?.riskData || []}>
                    {dashboardData?.riskData?.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.pse > 8 || entry.load > 3000 ? 'var(--danger)' : 'var(--chart-baseline)'} 
                        style={{ transition: 'all 0.3s ease' }}
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--chart-baseline)' }} />
                <span style={{ fontSize: 10, color: 'var(--text-subtle)' }}>Baixo Risco</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--danger)' }} />
                <span style={{ fontSize: 10, color: 'var(--text-subtle)' }}>Atenção</span>
              </div>
            </div>
          </div>

          {/* Load Evolution Card */}
          <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border-default)', borderRadius: 16, padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{ background: 'var(--success-soft)', padding: 6, borderRadius: 8 }}>
                <TrendingUp size={16} color="#000" />
              </div>
              <h3 style={{ fontSize: 14, fontWeight: 600 }}>Evolução de Carga Média</h3>
            </div>
            
            <div style={{ height: 240 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dashboardData?.loadEvolution || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCarga" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--success)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--success)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />
                  <XAxis 
                    dataKey="jornada" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'var(--text-subtle)', fontSize: 10 }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'var(--text-subtle)', fontSize: 10 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="carga" 
                    name="Carga (AU)"
                    stroke="var(--success)" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorCarga)" 
                    isAnimationActive={true}
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Top Performers Section */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div className="k-section-label">TOP PERFORMERS — GERAL</div>
            <Link href="/elenco" style={{ fontSize: 11, color: 'var(--text-subtle)', textDecoration: 'none', fontWeight: 500 }}>
              Ver Elenco Completo
            </Link>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {(dashboardData?.topPerformers || []).map((athlete, i) => (
              <Link
                key={athlete.id}
                href={`/atleta/${athlete.id}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 16px',
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 14,
                  textDecoration: 'none',
                  transition: 'all 0.2s var(--ease-out)',
                }}
                className="hover:border-primary/40 hover:bg-surface-3 group"
              >
                <div style={{ position: 'relative' }}>
                  <Avatar id={athlete.id} initials={athlete.initials} profile={athlete.profile} size="md" />
                  <div style={{ 
                    position: 'absolute', 
                    bottom: -2, 
                    right: -2, 
                    width: 18, 
                    height: 18, 
                    background: i === 0 ? 'var(--primary)' : 'var(--surface-4)', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontSize: 9,
                    fontWeight: 700,
                    color: i === 0 ? '#000' : 'var(--text-subtle)',
                    border: '2px solid var(--surface-2)'
                  }}>
                    {i + 1}
                  </div>
                </div>
                
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>
                    ID: {athlete.id}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-subtle)' }}>
                    {(athlete.position && athlete.position !== 'None' ? athlete.position : 'N/A')} · {(athlete.group && athlete.group !== 'None' ? athlete.group : 'Geral')}
                  </div>
                </div>

                <div style={{ textAlign: 'right', marginRight: 4 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
                    {formatNumber(athlete.speed, 1)}
                    <span style={{ fontSize: 9, color: 'var(--text-subtle)', marginLeft: 3 }}>km/h</span>
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--success-text)', fontWeight: 600 }}>
                    SCORE: {Math.round(athlete.performanceScore || 85)}
                  </div>
                </div>
                <ChevronRight size={16} color="var(--border-muted)" className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}
