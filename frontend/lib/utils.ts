export function formatCurrency(value: number | undefined): string {
  if (value == null || Number.isNaN(value)) {
    return '$0.00'
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(value)
}

export function cn(...classes: Array<string | undefined | false | null>): string {
  return classes.filter(Boolean).join(' ')
}
