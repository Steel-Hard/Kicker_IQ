'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Bell, Users, Upload, BarChart2, Settings } from 'lucide-react'
import { useAlerts } from '@/context/AlertContext'

const items = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/alertas',   icon: Bell,            label: 'Alertas', hasBadge: true },
  { href: '/elenco',    icon: Users,           label: 'Elenco' },
  { href: '/importar',  icon: Upload,          label: 'Importar', primary: true },
  { href: '/comparar',  icon: BarChart2,       label: 'Comparar' },
  { href: '/config',    icon: Settings,        label: 'Config' },
] as const

export function NavBar() {
  const pathname = usePathname()
  let activeCount = 0
  try {
    const alertCtx = useAlerts()
    activeCount = alertCtx.activeCount
  } catch {
    // AlertProvider may not be mounted yet
  }

  return (
    <nav className="app-nav">
      {items.map(({ href, icon: Icon, label, ...rest }) => {
        const active = pathname === href || pathname.startsWith(href + '/')
        const hasBadge = 'hasBadge' in rest && rest.hasBadge
        const isPrimary = 'primary' in rest && rest.primary

        if (isPrimary) {
          return (
            <Link key={href} href={href} className="app-nav-link">
              <span
                className="app-nav-primary-icon"
                style={{
                  background: active ? 'var(--primary)' : 'var(--surface-3)',
                  border: active ? 'none' : '1px solid var(--border-emphasis)',
                  transition: 'background 200ms',
                }}
              >
                <Icon size={18} style={{ color: active ? '#000' : 'var(--text-secondary)' }} />
              </span>
              <span
                className="app-nav-label"
                style={{ color: active ? 'var(--primary-strong)' : 'var(--text-subtle)', transition: 'color 200ms' }}
              >
                {label}
              </span>
            </Link>
          )
        }

        return (
          <Link key={href} href={href} className="app-nav-link">
            <span className={hasBadge ? 'app-nav-badge' : undefined}>
              <Icon
                size={20}
                style={{
                  color: active ? 'var(--primary-strong)' : 'var(--text-subtle)',
                  transition: 'color 200ms',
                  flexShrink: 0,
                }}
              />
              {hasBadge && activeCount > 0 && (
                <span className="app-nav-badge__count">
                  {activeCount > 9 ? '9+' : activeCount}
                </span>
              )}
            </span>
            <span
              className="app-nav-label"
              style={{ color: active ? 'var(--primary-strong)' : 'var(--text-subtle)', transition: 'color 200ms' }}
            >
              {label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
