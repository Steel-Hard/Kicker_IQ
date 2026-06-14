import { cn } from '@/lib/utils'
import type { AthleteProfile } from '@/lib/mock-data'
import { Disc } from 'lucide-react'

interface AvatarProps {
  id?: string
  initials: string
  profile: AthleteProfile
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Avatar({ id, initials, profile, size = 'md', className }: AvatarProps) {
  const displayId = id ? id.slice(-2) : initials
  
  return (
    <span 
      className={cn('k-avatar', `k-avatar--${size}`, `k-avatar--${profile}`, className)}
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      <div
        style={{
          position: 'absolute', 
          inset: 0, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          opacity: 0.15,
          zIndex: 0
        }}
      >
        <Disc size={size === 'lg' ? 40 : size === 'md' ? 24 : 16} />
      </div>
      
      <span style={{ position: 'relative', zIndex: 1 }}>
        {displayId}
      </span>
    </span>
  )
}
