'use client'

import { TopBar } from '@/components/kicker/top-bar'
import { Avatar } from '@/components/kicker/avatar'
import { LogOut, Bell, Shield, HelpCircle, ChevronRight, Moon, Sun, type LucideIcon } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/components/ThemeProvider'

export default function ConfigPage() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()

  const menuItems: {
    group: string
    items: { icon: LucideIcon; label: string; desc: string; onClick?: () => void }[]
  }[] = [
    {
      group: 'PERFIL',
      items: [
        { icon: Bell,                          label: 'Notificações', desc: '2 alertas ativos' },
        { icon: theme === 'dark' ? Moon : Sun, label: 'Aparência',    desc: theme === 'dark' ? 'Escuro' : 'Claro', onClick: toggleTheme },
      ],
    },
    {
      group: 'SISTEMA',
      items: [
        { icon: Shield,     label: 'Segurança', desc: 'Alterar senha' },
        { icon: HelpCircle, label: 'Ajuda',     desc: 'Central de suporte' },
      ],
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%', width: '100%', background: 'var(--surface-1)' }}>
      <TopBar title="Configurações" />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: '16px 14px', paddingBottom: 24 }}>

        {/* Profile card */}
        <div
          style={{
            background: 'var(--surface-2)',
            border: '1px solid var(--border-default)',
            borderRadius: 10,
            padding: '16px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
          }}
        >
          <Avatar 
            initials={user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'AD'} 
            profile="baixa" 
            size="lg" 
          />
          <div>
            <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 3 }}>
              {user?.name || 'Analista Chefe'}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-subtle)' }}>São Paulo FC · Desempenho</div>
            <div style={{ fontSize: 11, color: 'var(--primary-strong)', marginTop: 4 }}>
              {user?.email || 'analista@saopaulofc.net'}
            </div>
          </div>
        </div>

        {/* Menu groups */}
        {menuItems.map((group) => (
          <div key={group.group}>
            <div className="k-section-label" style={{ marginBottom: 10 }}>{group.group}</div>
            <div
              style={{
                background: 'var(--surface-2)',
                border: '1px solid var(--border-default)',
                borderRadius: 10,
                overflow: 'hidden',
              }}
            >
              {group.items.map(({ icon: Icon, label, desc, onClick }, i, arr) => (
                <button
                  key={label}
                  onClick={onClick}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '13px 14px',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: i < arr.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: 'var(--surface-3)',
                      border: '1px solid var(--border-emphasis)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={14} color="var(--text-secondary)" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{label}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-subtle)' }}>{desc}</div>
                  </div>
                  <ChevronRight size={13} color="var(--text-subtle)" />
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Version */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 10, color: 'var(--text-subtle)' }}>
            Kicker v1.0.0 · São Paulo FC
          </div>
          <div style={{ fontSize: 9, color: 'var(--border-muted)', marginTop: 3 }}>
            Design System v1
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="k-btn-outline"
          style={{ width: '100%', color: 'var(--danger)', borderColor: 'var(--danger)', cursor: 'pointer' }}
        >
          <LogOut size={14} />
          Sair da conta
        </button>

      </div>
    </div>
  )
}
