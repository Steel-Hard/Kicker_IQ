import { cn } from '@/lib/utils'
import type { AthleteProfile } from '@/lib/mock-data'

interface AthletePillProps {
  profile: AthleteProfile
  label: string
  className?: string
}

export function AthletePill({ profile, label, className }: AthletePillProps) {
  return (
    <span className={cn('k-pill', `k-pill--${profile}`, className)}>
      {label}
    </span>
  )
}
