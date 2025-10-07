'use client'

import { useQuery } from '@tanstack/react-query'

import { api } from '@/lib/api'

export default function DealsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['ai-deals'],
    queryFn: () => api.post('/ai/recommendations', {}),
  })

  if (isLoading) {
    return <div>Discovering opportunities...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">AI Deal Finder</h1>
        <p className="text-slate-600">Curated opportunities that match your investment criteria.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {data?.deals?.map((deal: any) => (
          <div key={`${deal.address}-${deal.price}`} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-900">{deal.address}</h3>
            <p className="text-sm text-slate-600">
              {deal.city}, {deal.state}
            </p>
            <div className="mt-4 space-y-2 text-sm text-slate-500">
              <p>Price: ${deal.price.toLocaleString?.() ?? deal.price}</p>
              <p>Cap Rate: {deal.cap_rate}%</p>
              <p>Cash-on-Cash: {deal.cash_on_cash}%</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
