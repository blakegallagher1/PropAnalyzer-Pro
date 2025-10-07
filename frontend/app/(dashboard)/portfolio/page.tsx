'use client'

import { useQuery } from '@tanstack/react-query'

import { api } from '@/lib/api'

export default function PortfolioPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['portfolio'],
    queryFn: () => api.get('/portfolio'),
  })

  if (isLoading) {
    return <div>Loading portfolio...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Portfolio Overview</h1>
        <p className="text-slate-600">Track performance across your holdings.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {data?.portfolios?.map((portfolio: any) => (
          <div key={portfolio.id} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-900">{portfolio.name}</h3>
            <p className="text-sm text-slate-600">{portfolio.description}</p>
            <p className="mt-4 text-sm text-slate-500">Properties: {portfolio.properties?.length ?? 0}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
