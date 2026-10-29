import React from 'react'
import { cn } from '../../utils/cn'

const VARIANT_MAP = {
  default: 'bg-slate-800 text-slate-300 border-slate-700',
  primary: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  danger: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  Active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Frozen: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Graduated: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  Dropped: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  Paid: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  Debt: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
}

export function Badge({ children, variant = 'default', className = '' }) {
  const styles = VARIANT_MAP[variant] || VARIANT_MAP.default

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors',
        styles,
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70"></span>
      {children}
    </span>
  )
}
