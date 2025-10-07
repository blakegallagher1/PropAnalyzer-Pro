import Link from 'next/link'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-semibold text-slate-900">
            PropAnalyzer Pro
          </Link>
          <nav className="flex items-center gap-6 text-sm text-slate-600">
            <Link href="/properties" className="hover:text-slate-900">
              Properties
            </Link>
            <Link href="/analyses" className="hover:text-slate-900">
              Analyses
            </Link>
            <Link href="/portfolio" className="hover:text-slate-900">
              Portfolio
            </Link>
            <Link href="/deals" className="hover:text-slate-900">
              Deals
            </Link>
            <Link href="/settings" className="hover:text-slate-900">
              Settings
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  )
}
