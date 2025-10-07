'use client'

import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { api } from '@/lib/api'

const propertySchema = z.object({
  name: z.string().optional(),
  property_type: z.string().min(1),
  street_address: z.string().min(1),
  city: z.string().min(1),
  state: z.string().length(2, 'Use state abbreviation'),
  zip_code: z.string().min(5),
  bedrooms: z.number().min(0).optional(),
  bathrooms: z.number().min(0).optional(),
  square_feet: z.number().min(0).optional(),
})

type PropertyFormData = z.infer<typeof propertySchema>

export default function NewPropertyPage() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      property_type: 'single_family',
    },
  })

  const createProperty = useMutation({
    mutationFn: (data: PropertyFormData) => api.post('/properties', data),
    onSuccess: () => {
      router.push('/properties')
    },
  })

  const onSubmit = (data: PropertyFormData) => {
    createProperty.mutate(data)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Add Property</h1>
        <p className="text-slate-600">Capture core information used in underwriting and portfolio tracking.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Property Information</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Name (optional)</label>
              <input
                {...register('name')}
                className="w-full rounded-lg border border-slate-200 px-4 py-2"
                placeholder="e.g., Lakeside Duplex"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Property Type</label>
              <input
                {...register('property_type')}
                className="w-full rounded-lg border border-slate-200 px-4 py-2"
                placeholder="single_family"
              />
              {errors.property_type && <p className="mt-1 text-sm text-red-500">{errors.property_type.message}</p>}
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Location</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">Street Address</label>
              <input
                {...register('street_address')}
                className="w-full rounded-lg border border-slate-200 px-4 py-2"
              />
              {errors.street_address && <p className="mt-1 text-sm text-red-500">{errors.street_address.message}</p>}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">City</label>
              <input
                {...register('city')}
                className="w-full rounded-lg border border-slate-200 px-4 py-2"
              />
              {errors.city && <p className="mt-1 text-sm text-red-500">{errors.city.message}</p>}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">State</label>
              <input
                {...register('state')}
                className="w-full rounded-lg border border-slate-200 px-4 py-2 uppercase"
              />
              {errors.state && <p className="mt-1 text-sm text-red-500">{errors.state.message}</p>}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">ZIP Code</label>
              <input
                {...register('zip_code')}
                className="w-full rounded-lg border border-slate-200 px-4 py-2"
              />
              {errors.zip_code && <p className="mt-1 text-sm text-red-500">{errors.zip_code.message}</p>}
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Details</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Bedrooms</label>
              <input
                type="number"
                {...register('bedrooms', { valueAsNumber: true })}
                className="w-full rounded-lg border border-slate-200 px-4 py-2"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Bathrooms</label>
              <input
                type="number"
                step="0.1"
                {...register('bathrooms', { valueAsNumber: true })}
                className="w-full rounded-lg border border-slate-200 px-4 py-2"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Square Feet</label>
              <input
                type="number"
                {...register('square_feet', { valueAsNumber: true })}
                className="w-full rounded-lg border border-slate-200 px-4 py-2"
              />
            </div>
          </div>
        </section>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-lg border border-slate-200 px-6 py-2 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={createProperty.isPending}
            className="rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white shadow hover:bg-blue-700 disabled:opacity-50"
          >
            {createProperty.isPending ? 'Saving…' : 'Create Property'}
          </button>
        </div>
      </form>
    </div>
  )
}
