import { cn } from '@/lib/utils'
import type { AthleteProfile } from '@/lib/mock-data'

interface AvatarProps {
  initials: string
  profile: AthleteProfile
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Avatar({ initials, profile, size = 'md', className }: AvatarProps) {
  return (
    <span className={cn('k-avatar', `k-avatar--${size}`, `k-avatar--${profile}`, className)}>
      {initials}
    </span>
  )
}
