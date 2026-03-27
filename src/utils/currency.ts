/**
 * Formats a numeric amount into a currency string based on the provided currency code.
 */
export function formatCurrency(amount: number | string, currencyCode: string = 'PHP') {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount
  
  if (isNaN(numericAmount)) return '0.00'

  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
    }).format(numericAmount)
  } catch (error) {
    // Fallback if currency code is invalid
    return `${currencyCode} ${numericAmount.toFixed(2)}`
  }
}

/**
 * Returns just the currency symbol for a given code.
 */
export function getCurrencySymbol(currencyCode: string = 'PHP') {
  try {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    })
    return formatter.formatToParts(0).find(part => part.type === 'currency')?.value || currencyCode
  } catch (e) {
    return currencyCode
  }
}

export const supportedCurrencies = [
  { code: 'PHP', name: 'Philippines (PESO)', country: 'Philippines' },
  { code: 'USD', name: 'United States (Dollar)', country: 'USA' },
  { code: 'EUR', name: 'European Union (Euro)', country: 'Europe' },
  { code: 'JPY', name: 'Japan (Yen)', country: 'Japan' },
  { code: 'GBP', name: 'United Kingdom (Pound)', country: 'UK' },
  { code: 'AUD', name: 'Australia (Dollar)', country: 'Australia' },
  { code: 'CAD', name: 'Canada (Dollar)', country: 'Canada' },
  { code: 'SGD', name: 'Singapore (Dollar)', country: 'Singapore' },
  { code: 'AED', name: 'United Arab Emirates (Dirham)', country: 'UAE' },
  { code: 'SAR', name: 'Saudi Arabia (Riyal)', country: 'Saudi Arabia' },
]
