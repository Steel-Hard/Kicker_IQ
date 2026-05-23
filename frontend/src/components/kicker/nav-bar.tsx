'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, Upload, BarChart2, Settings } from 'lucide-react'

const items = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/elenco',    icon: Users,           label: 'Elenco' },
  { href: '/importar',  icon: Upload,          label: 'Importar', primary: true },
  { href: '/comparar',  icon: BarChart2,       label: 'Comparar' },
  { href: '/config',    icon: Settings,        label: 'Config' },
] as const

export function NavBar() {
  const pathname = usePathname()

  return (
    <nav className="app-nav">
      {items.map(({ href, icon: Icon, label}) => {
        const active = pathname === href || pathname.startsWith(href + '/')

        if (items[2].primary) {
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
            <Icon
              size={20}
              style={{
                color: active ? 'var(--primary-strong)' : 'var(--text-subtle)',
                transition: 'color 200ms',
                flexShrink: 0,
              }}
            />
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
