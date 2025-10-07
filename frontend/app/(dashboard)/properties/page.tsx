'use client'

import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { Plus } from 'lucide-react'

import { api } from '@/lib/api'

export default function PropertiesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['properties'],
    queryFn: () => api.get('/properties'),
  })

  if (isLoading) {
    return <div>Loading properties...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Properties</h1>
        <Link
          href="/properties/new"
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white shadow hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Add Property
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data?.properties?.map((property: any) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  )
}

function PropertyCard({ property }: { property: any }) {
  return (
    <Link
      href={`/properties/${property.id}`}
      className="block rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
    >
      <h3 className="text-xl font-semibold text-slate-900">
        {property.name || property.street_address}
      </h3>
      <p className="text-sm text-slate-500">
        {property.city}, {property.state} {property.zip_code}
      </p>
      <div className="mt-4 flex gap-4 text-sm text-slate-600">
        <span>🛏️ {property.bedrooms} bed</span>
        <span>🚿 {property.bathrooms} bath</span>
        <span>📐 {property.square_feet?.toLocaleString?.() ?? property.square_feet} sqft</span>
      </div>
    </Link>
  )
}
