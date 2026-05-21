import { NavBar } from '@/components/kicker/nav-bar'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell">
      <div className="app-content">
        {children}
      </div>
      <NavBar />
    </div>
  )
}
