'use client'

import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'

import { api } from '@/lib/api'
import { formatCurrency } from '@/lib/utils'

export default function PropertyDetailPage() {
  const params = useParams<{ propertyId: string }>()
  const propertyId = params?.propertyId

  const { data, isLoading } = useQuery({
    queryKey: ['property', propertyId],
    queryFn: () => api.get(`/properties/${propertyId}`),
    enabled: Boolean(propertyId),
  })

  if (isLoading || !data) {
    return <div>Loading property...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">{data.name || data.street_address}</h1>
        <p className="text-slate-600">
          {data.street_address}, {data.city}, {data.state} {data.zip_code}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Property Details</h2>
          <dl className="mt-4 space-y-2 text-sm text-slate-600">
            <div className="flex justify-between">
              <dt>Bedrooms</dt>
              <dd>{data.bedrooms ?? '—'}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Bathrooms</dt>
              <dd>{data.bathrooms ?? '—'}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Square Feet</dt>
              <dd>{data.square_feet?.toLocaleString?.() ?? data.square_feet ?? '—'}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Year Built</dt>
              <dd>{data.year_built ?? '—'}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Latest Analysis</h2>
          {data.analyses?.length ? (
            <dl className="mt-4 space-y-2 text-sm text-slate-600">
              <div className="flex justify-between">
                <dt>Monthly Cash Flow</dt>
                <dd>{formatCurrency(data.analyses[0].metrics?.monthly_cash_flow)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Cap Rate</dt>
                <dd>{data.analyses[0].metrics?.cap_rate}%</dd>
              </div>
              <div className="flex justify-between">
                <dt>Cash-on-Cash</dt>
                <dd>{data.analyses[0].metrics?.cash_on_cash_return}%</dd>
              </div>
            </dl>
          ) : (
            <p className="mt-4 text-sm text-slate-600">No analyses yet. Run your first deal analysis to see metrics.</p>
          )}
        </div>
      </div>
    </div>
  )
}
