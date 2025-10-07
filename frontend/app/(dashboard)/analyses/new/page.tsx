'use client'

import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { api } from '@/lib/api'

const analysisSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  property_id: z.string().uuid('Select a property'),
  deal_type: z.enum(['rental', 'flip', 'brrrr']),
  acquisition: z.object({
    purchase_price: z.number().min(0),
    closing_costs: z.object({
      total: z.number().min(0),
    }),
    renovation_budget: z.number().min(0).optional(),
  }),
  financing: z.object({
    down_payment_pct: z.number().min(0).max(100),
    interest_rate: z.number().min(0),
    term_years: z.number().min(1),
  }),
  income: z.object({
    rental_income: z.object({
      base_rent: z.number().min(0),
    }),
    vacancy_rate_pct: z.number().min(0).max(100),
  }),
  expenses: z.object({
    property_tax: z.number().min(0),
    insurance: z.number().min(0),
    hoa_fees: z.number().min(0).optional(),
    maintenance_pct: z.number().min(0).max(100),
    property_management_pct: z.number().min(0).max(100).optional(),
    capex_reserve_pct: z.number().min(0).max(100).optional(),
  }),
  exit_strategy: z
    .object({
      hold_period_years: z.number().min(1).max(30),
      exit_cap_rate: z.number().min(1).max(20),
    })
    .optional(),
})

type AnalysisFormData = z.infer<typeof analysisSchema>

export default function NewAnalysisPage() {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AnalysisFormData>({
    resolver: zodResolver(analysisSchema),
    defaultValues: {
      deal_type: 'rental',
      financing: {
        down_payment_pct: 25,
        interest_rate: 7.5,
        term_years: 30,
      },
      income: {
        vacancy_rate_pct: 5,
        rental_income: { base_rent: 0 },
      },
      expenses: {
        property_tax: 0,
        insurance: 0,
        maintenance_pct: 5,
      },
    },
  })

  const createAnalysis = useMutation({
    mutationFn: (data: AnalysisFormData) => api.post('/analyses', data),
    onSuccess: (data) => {
      router.push(`/analyses/${data.id}`)
    },
  })

  const onSubmit = (data: AnalysisFormData) => {
    createAnalysis.mutate(data)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">New Deal Analysis</h1>
        <p className="text-slate-600">Fill out the assumptions below to calculate projected returns.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Basic Information</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Analysis Name</label>
              <input
                {...register('name')}
                className="w-full rounded-lg border border-slate-200 px-4 py-2"
                placeholder="e.g., 123 Main St Investment"
              />
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Property ID</label>
              <input
                {...register('property_id')}
                className="w-full rounded-lg border border-slate-200 px-4 py-2"
                placeholder="Enter property UUID"
              />
              {errors.property_id && <p className="mt-1 text-sm text-red-500">{errors.property_id.message}</p>}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Deal Type</label>
              <select {...register('deal_type')} className="w-full rounded-lg border border-slate-200 px-4 py-2">
                <option value="rental">Rental Property</option>
                <option value="flip">Fix &amp; Flip</option>
                <option value="brrrr">BRRRR</option>
              </select>
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Acquisition</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Purchase Price</label>
              <input
                type="number"
                {...register('acquisition.purchase_price', { valueAsNumber: true })}
                className="w-full rounded-lg border border-slate-200 px-4 py-2"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Closing Costs</label>
              <input
                type="number"
                {...register('acquisition.closing_costs.total', { valueAsNumber: true })}
                className="w-full rounded-lg border border-slate-200 px-4 py-2"
              />
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Financing</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Down Payment %</label>
              <input
                type="number"
                {...register('financing.down_payment_pct', { valueAsNumber: true })}
                className="w-full rounded-lg border border-slate-200 px-4 py-2"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Interest Rate %</label>
              <input
                type="number"
                step="0.01"
                {...register('financing.interest_rate', { valueAsNumber: true })}
                className="w-full rounded-lg border border-slate-200 px-4 py-2"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Loan Term (years)</label>
              <input
                type="number"
                {...register('financing.term_years', { valueAsNumber: true })}
                className="w-full rounded-lg border border-slate-200 px-4 py-2"
              />
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Income</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Monthly Rent</label>
              <input
                type="number"
                {...register('income.rental_income.base_rent', { valueAsNumber: true })}
                className="w-full rounded-lg border border-slate-200 px-4 py-2"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Vacancy Rate %</label>
              <input
                type="number"
                {...register('income.vacancy_rate_pct', { valueAsNumber: true })}
                className="w-full rounded-lg border border-slate-200 px-4 py-2"
              />
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Expenses</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Property Tax (annual)</label>
              <input
                type="number"
                {...register('expenses.property_tax', { valueAsNumber: true })}
                className="w-full rounded-lg border border-slate-200 px-4 py-2"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Insurance (annual)</label>
              <input
                type="number"
                {...register('expenses.insurance', { valueAsNumber: true })}
                className="w-full rounded-lg border border-slate-200 px-4 py-2"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Maintenance %</label>
              <input
                type="number"
                {...register('expenses.maintenance_pct', { valueAsNumber: true })}
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
            disabled={createAnalysis.isPending}
            className="rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white shadow hover:bg-blue-700 disabled:opacity-50"
          >
            {createAnalysis.isPending ? 'Calculating…' : 'Create Analysis'}
          </button>
        </div>
      </form>
    </div>
  )
}
