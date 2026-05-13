'use client'

type RadarData = {
  velocidade: number
  resistencia: number
  explosividade: number
  carga: number
  recuperacao: number
  tecnica: number
}

interface RadarChartProps {
  data1: RadarData
  data2?: RadarData
  label1?: string
  label2?: string
}

const AXES = [
  { key: 'velocidade',   label: 'Vel.' },
  { key: 'explosividade',label: 'Explos.' },
  { key: 'carga',        label: 'Carga' },
  { key: 'tecnica',      label: 'Técnica' },
  { key: 'recuperacao',  label: 'Recup.' },
  { key: 'resistencia',  label: 'Resist.' },
] as const

const CX = 130
const CY = 120
const R  = 80
const N  = AXES.length

function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
  const rad = ((angle - 90) * Math.PI) / 180
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  }
}

function buildPolygon(data: RadarData, r: number): string {
  return AXES.map((axis, i) => {
    const angle = (360 / N) * i
    const val = (data[axis.key] / 100) * r
    const pt = polarToCartesian(CX, CY, val, angle)
    return `${pt.x},${pt.y}`
  }).join(' ')
}

export function KickerRadarChart({ data1, data2, label1 = 'A', label2 = 'B' }: RadarChartProps) {
  const rings = [20, 40, 60, 80, 100]

  return (
    <div>
      <svg viewBox="0 0 260 240" style={{ width: '100%', maxWidth: 280 }}>
        {/* Grid rings */}
        {rings.map((pct) => {
          const r = (pct / 100) * R
          const points = Array.from({ length: N }, (_, i) => {
            const pt = polarToCartesian(CX, CY, r, (360 / N) * i)
            return `${pt.x},${pt.y}`
          }).join(' ')
          return (
            <polygon
              key={pct}
              points={points}
              fill="none"
              stroke={pct === 100 ? '#2a2a2a' : '#1a1a1a'}
              strokeWidth="1"
            />
          )
        })}

        {/* Axis lines */}
        {AXES.map((axis, i) => {
          const angle = (360 / N) * i
          const outer = polarToCartesian(CX, CY, R, angle)
          return (
            <line
              key={axis.key}
              x1={CX} y1={CY}
              x2={outer.x} y2={outer.y}
              stroke="#1f1f1f"
              strokeWidth="1"
            />
          )
        })}

        {/* Data polygon 1 */}
        <polygon
          points={buildPolygon(data1, R)}
          fill={data2 ? 'rgba(218,165,32,0.18)' : 'rgba(93,202,165,0.20)'}
          stroke={data2 ? '#DAA520' : 'var(--chart-baseline-soft)'}
          strokeWidth="1.5"
        />

        {/* Data polygon 2 */}
        {data2 && (
          <polygon
            points={buildPolygon(data2, R)}
            fill="rgba(93,202,165,0.14)"
            stroke="var(--chart-baseline-soft)"
            strokeWidth="1.5"
          />
        )}

        {/* Axis labels */}
        {AXES.map((axis, i) => {
          const angle = (360 / N) * i
          const pt = polarToCartesian(CX, CY, R + 18, angle)
          return (
            <text
              key={axis.key}
              x={pt.x}
              y={pt.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="10"
              fill="var(--text-muted)"
              fontFamily="var(--font-sans)"
              fontWeight="500"
            >
              {axis.label}
            </text>
          )
        })}
      </svg>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{
            width: 20,
            height: 2,
            background: data2 ? '#DAA520' : 'var(--chart-baseline-soft)',
            borderRadius: 2,
            display: 'block',
          }} />
          <span style={{ fontSize: 10, color: 'var(--text-subtle)', fontWeight: 500 }}>{label1}</span>
        </div>
        {data2 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{
              width: 20,
              height: 2,
              background: 'var(--chart-baseline-soft)',
              borderRadius: 2,
              display: 'block',
            }} />
            <span style={{ fontSize: 10, color: 'var(--text-subtle)', fontWeight: 500 }}>{label2}</span>
          </div>
        )}
      </div>
    </div>
  )
}
