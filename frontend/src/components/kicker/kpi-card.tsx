import { cn } from '@/lib/utils'

interface KpiCardProps {
  label: string
  value: string
  delta?: string
  deltaDirection?: 'up' | 'down' | 'neutral'
  className?: string
}

export function KpiCard({ label, value, delta, deltaDirection = 'neutral', className }: KpiCardProps) {
  return (
    <div className={cn('k-kpi', className)}>
      <span className="k-kpi__label">{label}</span>
      <span className="k-kpi__value">{value}</span>
      {delta && (
        <span className={cn('k-kpi__delta', {
          'k-kpi__delta--up':   deltaDirection === 'up',
          'k-kpi__delta--down': deltaDirection === 'down',
        })}>
          {delta}
        </span>
      )}
    </div>
  )
}
