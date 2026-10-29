import { format, parseISO, isValid } from 'date-fns'

/**
 * Format currency with UZS or USD
 */
export function formatCurrency(amount, currency = 'UZS') {
  if (amount === undefined || amount === null || isNaN(amount)) return '0'
  
  if (currency === 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount)
  }

  return new Intl.NumberFormat('uz-UZ').format(amount) + " so'm"
}

/**
 * Format date safely
 */
export function formatDate(dateString, pattern = 'dd.MM.yyyy') {
  if (!dateString) return '-'
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString
    if (!isValid(date)) return dateString
    return format(date, pattern)
  } catch {
    return dateString
  }
}

/**
 * Format Uzbek phone number (+998 XX XXX XX XX)
 */
export function formatPhone(phone) {
  if (!phone) return ''
  const clean = phone.replace(/\D/g, '')
  if (clean.length === 12 && clean.startsWith('998')) {
    return `+998 (${clean.slice(3, 5)}) ${clean.slice(5, 8)}-${clean.slice(8, 10)}-${clean.slice(10, 12)}`
  }
  if (clean.length === 9) {
    return `+998 (${clean.slice(0, 2)}) ${clean.slice(2, 5)}-${clean.slice(5, 7)}-${clean.slice(7, 9)}`
  }
  return phone
}

/**
 * Clean phone for saving
 */
export function cleanPhone(phone) {
  if (!phone) return ''
  const clean = phone.replace(/\D/g, '')
  return clean.startsWith('998') ? `+${clean}` : `+998${clean}`
}

/**
 * Status badge color helper
 */
export function getStatusColor(status) {
  const map = {
    Active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Frozen: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    Graduated: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    Dropped: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    Paid: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    Debt: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  }
  return map[status] || 'bg-slate-500/10 text-slate-400 border-slate-500/20'
}
