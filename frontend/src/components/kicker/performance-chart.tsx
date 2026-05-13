'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Cell,
  Tooltip,
} from 'recharts'

interface DataPoint {
  jornada: string
  dist: number
  alert: boolean
}

interface PerformanceChartProps {
  data: DataPoint[]
  average?: number
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div
      style={{
        background: 'var(--surface-3)',
        border: '1px solid var(--border-emphasis)',
        borderRadius: 8,
        padding: '6px 10px',
        fontSize: 11,
        color: 'var(--text-secondary)',
      }}
    >
      <div style={{ fontWeight: 500, color: 'var(--text-primary)', marginBottom: 2 }}>{label}</div>
      <div>{payload[0].value} m</div>
    </div>
  )
}

export function PerformanceChart({ data, average }: PerformanceChartProps) {
  return (
    <ResponsiveContainer width="100%" height={140}>
      <BarChart data={data} barSize={28} margin={{ top: 8, right: 0, left: -20, bottom: 0 }}>
        <CartesianGrid
          vertical={false}
          strokeDasharray="0"
          stroke="var(--chart-grid)"
        />
        <XAxis
          dataKey="jornada"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 11, fill: 'var(--chart-axis)', fontFamily: 'var(--font-sans)' }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 10, fill: 'var(--chart-axis)', fontFamily: 'var(--font-sans)' }}
          domain={['auto', 'auto']}
        />
        {average && (
          <ReferenceLine
            y={average}
            stroke="var(--chart-baseline)"
            strokeDasharray="4 3"
            strokeWidth={1}
          />
        )}
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
        <Bar dataKey="dist" radius={[4, 4, 0, 0]}>
          {data.map((entry, i) => (
            <Cell
              key={i}
              fill={entry.alert ? 'var(--chart-alert)' : 'var(--chart-baseline-soft)'}
              opacity={0.85}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
