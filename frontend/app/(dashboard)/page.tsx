export default function DashboardHome() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Welcome back!</h1>
        <p className="text-slate-600">Select a module to begin analyzing properties and tracking performance.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Properties</h2>
          <p className="mt-2 text-sm text-slate-600">Manage acquisition targets and existing assets.</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Analyses</h2>
          <p className="mt-2 text-sm text-slate-600">Run detailed underwriting with comprehensive financial metrics.</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">AI Deal Finder</h2>
          <p className="mt-2 text-sm text-slate-600">Discover curated opportunities powered by machine intelligence.</p>
        </div>
      </div>
    </div>
  )
}
