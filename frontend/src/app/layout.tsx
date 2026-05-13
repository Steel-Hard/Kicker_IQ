import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Kicker — Análise de Desempenho',
  description: 'Plataforma de análise de desempenho esportivo para futebol',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#000000',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body style={{ backgroundColor: '#000', minHeight: '100dvh' }}>
        {children}
      </body>
    </html>
  )
}
