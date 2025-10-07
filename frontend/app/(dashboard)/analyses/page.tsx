'use client'

import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'

import { api } from '@/lib/api'

export default function AnalysesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['analyses'],
    queryFn: () => api.get('/analyses'),
  })

  if (isLoading) {
    return <div>Loading analyses...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Analyses</h1>
        <Link
          href="/analyses/new"
          className="rounded-lg bg-blue-600 px-4 py-2 text-white shadow hover:bg-blue-700"
        >
          New Analysis
        </Link>
      </div>

      <div className="grid gap-4">
        {data?.analyses?.map((analysis: any) => (
          <Link
            key={analysis.id}
            href={`/analyses/${analysis.id}`}
            className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md"
          >
            <h3 className="text-xl font-semibold text-slate-900">{analysis.name}</h3>
            <p className="text-sm text-slate-600">{analysis.deal_type}</p>
            <div className="mt-4 flex gap-6 text-sm text-slate-500">
              <span>Cash Flow: ${analysis.metrics?.monthly_cash_flow?.toFixed?.(2)}</span>
              <span>Cap Rate: {analysis.metrics?.cap_rate?.toFixed?.(2)}%</span>
              <span>CoC: {analysis.metrics?.cash_on_cash_return?.toFixed?.(2)}%</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
