'use client'

import {
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  Tooltip,
} from 'recharts'

type RadarData = {
  velocidade: number
  resistencia: number
  explosividade: number
  carga: number
  recuperacao: number
  tecnica: number
}

interface RadarChartProps {
  data1?: RadarData
  data2?: RadarData
  label1?: string
  label2?: string
  customChartData?: Array<{ subject: string; A: number; B: number }>
}

const AXES = [
  { key: 'velocidade',   label: 'Velocidade' },
  { key: 'explosividade',label: 'Explosão' },
  { key: 'carga',        label: 'Carga' },
  { key: 'tecnica',      label: 'Técnica' },
  { key: 'recuperacao',  label: 'Recuperação' },
  { key: 'resistencia',  label: 'Resistência' },
] as const

interface TooltipPayload {
  name: string;
  value: number;
  color?: string;
  dataKey?: string | number;
  payload: {
    subject: string;
    A: number;
    B: number;
  };
}

interface TooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
}

const CustomTooltip = ({ active, payload }: TooltipProps) => {
  if (!active || !payload?.length) return null

  return (
    <div style={{ 
      background: 'var(--surface-3)', 
      border: '1px solid var(--border-emphasis)', 
      borderRadius: 12, 
      padding: '10px 14px',
      boxShadow: 'var(--shadow-3)',
      fontSize: 11,
      zIndex: 100
    }}>
      <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6, borderBottom: '1px solid var(--border-subtle)', paddingBottom: 4 }}>
        {payload[0].payload.subject}
      </p>
      {payload.map((entry, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, marginBottom: i === 0 && payload.length > 1 ? 4 : 0 }}>
          <span style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>{entry.name}:</span>
          <span style={{ fontWeight: 700, color: entry.color }}>{typeof entry.value === 'number' ? entry.value.toFixed(1) : entry.value}</span>
        </div>
      ))}
    </div>
  )
}

export function KickerRadarChart({ data1, data2, label1 = 'Atleta A', label2 = 'Atleta B', customChartData }: RadarChartProps) {
  // Map data for Recharts format if customChartData is not provided
  const chartData = customChartData || AXES.map(axis => ({
    subject: axis.label,
    A: data1 ? (data1[axis.key as keyof RadarData] || 0) : 0,
    B: data2 ? (data2[axis.key as keyof RadarData] || 0) : 0,
  }))

  // Extract dynamic keys (e.g., 'A', 'B', 'C', 'D') from customChartData if provided
  const dataKeys = customChartData && customChartData.length > 0 
    ? Object.keys(customChartData[0]).filter(k => k !== 'subject')
    : ['A', 'B'].filter(k => k === 'A' || (data2 !== undefined && k === 'B'));

  const radarColors = [
    "var(--primary)",
    "var(--success-soft)",
    "var(--danger)",
    "#9467bd" // purple fallback
  ];

  // Colors based on Kicker design system for backward compatibility
  const color1 = (data2 || customChartData) ? "var(--primary-strong)" : "var(--primary)";
  const color2 = "var(--success-soft)";

  return (
    <div style={{ width: '100%', height: 320, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={chartData} margin={{ top: 20, right: 40, bottom: 20, left: 40 }}>
          <PolarGrid stroke="var(--border-emphasis)" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: 'var(--text-subtle)', fontSize: 10, fontWeight: 500 }}
          />
          
          {customChartData ? (
            dataKeys.map((key, i) => (
              <Radar
                key={key}
                name={`Atleta ${key}`}
                dataKey={key}
                stroke={radarColors[i % radarColors.length]}
                fill={radarColors[i % radarColors.length]}
                fillOpacity={0.25}
                strokeWidth={2}
                isAnimationActive={true}
                animationDuration={800}
              />
            ))
          ) : (
            <>
              <Radar
                name={label1}
                dataKey="A"
                stroke={color1}
                fill={color1}
                fillOpacity={0.35}
                strokeWidth={2}
                isAnimationActive={true}
                animationDuration={800}
              />

              {data2 && (
                <Radar
                  name={label2}
                  dataKey="B"
                  stroke={color2}
                  fill={color2}
                  fillOpacity={0.2}
                  strokeWidth={2}
                  isAnimationActive={true}
                  animationDuration={800}
                />
              )}
            </>
          )}

          <Tooltip content={<CustomTooltip />} />
        </RadarChart>
      </ResponsiveContainer>

      {/* Manual Legend to ensure it's always visible and stylized */}
      <div style={{ 
        display: 'flex', 
        gap: 20, 
        justifyContent: 'center', 
        marginTop: 0,
        padding: '8px 16px',
        background: 'var(--surface-3)',
        borderRadius: 20,
        border: '1px solid var(--border-subtle)',
        flexWrap: 'wrap'
      }}>
        {customChartData ? (
          dataKeys.map((key, i) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: radarColors[i % radarColors.length],
                boxShadow: `0 0 8px ${radarColors[i % radarColors.length]}`
              }} />
              <span style={{ fontSize: 10, color: 'var(--text-primary)', fontWeight: 600 }}>Atleta {key}</span>
            </div>
          ))
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: color1,
                boxShadow: data2 ? '0 0 8px var(--primary)' : 'none'
              }} />
              <span style={{ fontSize: 10, color: 'var(--text-primary)', fontWeight: 600 }}>{label1}</span>
            </div>
            {data2 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: color2,
                  boxShadow: '0 0 8px var(--success-soft)'
                }} />
                <span style={{ fontSize: 10, color: 'var(--text-primary)', fontWeight: 600 }}>{label2}</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
