'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => router.push('/dashboard'), 800)
  }

  return (
    <div
      style={{
        minHeight: '100dvh',
        background: 'var(--surface-0)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 24px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 320,
          display: 'flex',
          flexDirection: 'column',
          gap: 32,
        }}
      >
        {/* Logo & brand */}
        <div
          className="animate-slide-up"
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}
        >
          {/* Logo tile */}
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 14,
              background: 'var(--surface-3)',
              border: '1px solid var(--border-emphasis)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-glow-primary)',
            }}
          >
            {/* K monogram */}
            <svg viewBox="0 0 32 32" width="36" height="36" fill="none">
              <path
                d="M8 6v20M8 16l10-10M8 16l10 10"
                stroke="#FFD700"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                fontSize: 24,
                fontWeight: 500,
                color: 'var(--primary-strong)',
                letterSpacing: 4,
                lineHeight: 1,
              }}
            >
              KICKER
            </div>
            <div
              style={{
                fontSize: 11,
                color: 'var(--text-subtle)',
                marginTop: 6,
                letterSpacing: 0.3,
              }}
            >
              Análise de desempenho esportivo
            </div>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="animate-slide-up delay-2"
          style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 11, color: 'var(--text-subtle)', fontWeight: 500 }}>
              E-MAIL
            </label>
            <input
              className="k-field"
              type="email"
              placeholder="seu@clube.com.br"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 11, color: 'var(--text-subtle)', fontWeight: 500 }}>
              SENHA
            </label>
            <input
              className="k-field"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            className="k-btn-primary"
            disabled={loading}
            style={{ width: '100%', marginTop: 8 }}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        {/* Links */}
        <div
          className="animate-slide-up delay-3"
          style={{ textAlign: 'center' }}
        >
          <a
            href="#"
            style={{
              fontSize: 12,
              color: 'var(--primary-strong)',
              textDecoration: 'none',
            }}
          >
            Esqueceu a senha?
          </a>
        </div>

        {/* Divider */}
        <div
          className="animate-fade-in delay-4"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div style={{ flex: 1, height: 1, background: 'var(--border-emphasis)' }} />
          <span style={{ fontSize: 11, color: 'var(--text-subtle)' }}>ou</span>
          <div style={{ flex: 1, height: 1, background: 'var(--border-emphasis)' }} />
        </div>

        <button
          className="k-btn-outline animate-fade-in delay-5"
          style={{ width: '100%' }}
          onClick={() => router.push('/dashboard')}
        >
          Entrar como visitante
        </button>

        <p
          className="animate-fade-in delay-6"
          style={{ fontSize: 10, color: 'var(--text-subtle)', textAlign: 'center', lineHeight: 1.6 }}
        >
          Ao entrar, você concorda com os{' '}
          <a href="#" style={{ color: 'var(--primary-strong)', fontSize: 10 }}>Termos de Uso</a>
          {' '}e a{' '}
          <a href="#" style={{ color: 'var(--primary-strong)', fontSize: 10 }}>Política de Privacidade</a>
          {' '}do Kicker.
        </p>
      </div>
    </div>
  )
}
