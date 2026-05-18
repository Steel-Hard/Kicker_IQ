'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

interface TopBarProps {
  title: string
  subtitle?: string
  back?: boolean
  right?: React.ReactNode
}

export function TopBar({ title, subtitle, back, right }: TopBarProps) {
  const router = useRouter()

  return (
    <div
      style={{
        height: 48,
        display: 'flex',
        alignItems: 'center',
        padding: '0 14px',
        gap: 10,
        background: 'var(--surface-1)',
        borderBottom: '1px solid var(--border-subtle)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}
    >
      {back && (
        <button
          onClick={() => router.back()}
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            border: '1px solid var(--border-emphasis)',
            background: 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--text-primary)',
            flexShrink: 0,
          }}
        >
          <ArrowLeft size={14} />
        </button>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: subtitle ? 13 : 15,
            fontWeight: 500,
            color: 'var(--text-primary)',
            lineHeight: 1.2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {title}
        </div>
        {subtitle && (
          <div style={{ fontSize: 11, color: 'var(--text-subtle)', lineHeight: 1.3 }}>
            {subtitle}
          </div>
        )}
      </div>
      {right && <div style={{ flexShrink: 0 }}>{right}</div>}
    </div>
  )
}
