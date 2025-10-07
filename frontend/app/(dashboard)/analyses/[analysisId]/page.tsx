'use client'

import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'

import { api } from '@/lib/api'
import { formatCurrency } from '@/lib/utils'

export default function AnalysisDetailPage() {
  const params = useParams<{ analysisId: string }>()
  const analysisId = params?.analysisId

  const { data, isLoading } = useQuery({
    queryKey: ['analysis', analysisId],
    queryFn: () => api.get(`/analyses/${analysisId}`),
    enabled: Boolean(analysisId),
  })

  if (isLoading || !data) {
    return <div>Loading analysis...</div>
  }

  const metrics = data.metrics ?? {}

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">{data.name}</h1>
        <p className="text-slate-600">{data.deal_type} analysis</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Key Metrics</h2>
          <dl className="mt-4 space-y-2 text-sm text-slate-600">
            <div className="flex justify-between">
              <dt>Monthly Cash Flow</dt>
              <dd>{formatCurrency(metrics.monthly_cash_flow)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Cap Rate</dt>
              <dd>{metrics.cap_rate ? `${metrics.cap_rate}%` : '—'}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Cash-on-Cash</dt>
              <dd>{metrics.cash_on_cash_return ? `${metrics.cash_on_cash_return}%` : '—'}</dd>
            </div>
            <div className="flex justify-between">
              <dt>IRR</dt>
              <dd>{metrics.irr ? `${metrics.irr}%` : '—'}</dd>
            </div>
            <div className="flex justify-between">
              <dt>DSCR</dt>
              <dd>{metrics.dscr ?? '—'}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Assumptions</h2>
          <pre className="mt-4 overflow-x-auto rounded-md bg-slate-900 p-4 text-xs text-slate-100">
            {JSON.stringify(
              {
                acquisition: data.acquisition,
                financing: data.financing,
                income: data.income,
                expenses: data.expenses,
              },
              null,
              2,
            )}
          </pre>
        </div>
      </div>
    </div>
  )
}
