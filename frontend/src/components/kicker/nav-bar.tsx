'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, CalendarDays, Bell } from 'lucide-react'

const items = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/elenco',    icon: Users,           label: 'Elenco' },
  { href: '/partidas',  icon: CalendarDays,    label: 'Partidas' },
  { href: '/alertas',   icon: Bell,            label: 'Alertas' },
] as const

export function NavBar() {
  const pathname = usePathname()

  return (
    <nav className="app-nav">
      {items.map(({ href, icon: Icon, label }) => {
        const active = pathname === href || pathname.startsWith(href + '/')

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

