export interface Property {
  id: string
  name?: string
  street_address: string
  city: string
  state: string
  zip_code: string
  bedrooms?: number
  bathrooms?: number
  square_feet?: number
}

export interface AnalysisMetrics {
  monthly_cash_flow: number
  cap_rate: number
  cash_on_cash_return: number
  irr: number
  dscr: number
}

export interface AnalysisSummary {
  id: string
  name: string
  deal_type: string
  metrics: AnalysisMetrics
}
