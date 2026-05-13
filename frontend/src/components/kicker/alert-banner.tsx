import { cn } from '@/lib/utils'
import { AlertTriangle } from 'lucide-react'

interface AlertBannerProps {
  title: string
  description?: string
  action?: string
  onAction?: () => void
  className?: string
}

export function AlertBanner({ title, description, action, onAction, className }: AlertBannerProps) {
  return (
    <div className={cn('k-alert-banner', className)}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
        <AlertTriangle
          size={14}
          style={{ color: 'var(--danger)', flexShrink: 0, marginTop: 1 }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="k-alert-banner__title">{title}</div>
          {description && (
            <div className="k-alert-banner__desc">{description}</div>
          )}
        </div>
        {action && (
          <button
            onClick={onAction}
            style={{
              fontSize: 11,
              fontWeight: 500,
              color: 'var(--danger)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              whiteSpace: 'nowrap',
              fontFamily: 'var(--font-sans)',
            }}
          >
            {action}
          </button>
        )}
      </div>
    </div>
  )
}
