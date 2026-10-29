import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '../../utils/cn'

export function StatCard({
  title,
  value,
  change,
  isPositive = true,
  icon: Icon,
  color = 'blue',
  subtitle = 'o‘tgan oyga nisbatan',
  className = ''
}) {
  const colorStyles = {
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20 group-hover:bg-blue-500/20',
    green: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 group-hover:bg-emerald-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20 group-hover:bg-purple-500/20',
    orange: 'bg-amber-500/10 text-amber-400 border-amber-500/20 group-hover:bg-amber-500/20',
    red: 'bg-rose-500/10 text-rose-400 border-rose-500/20 group-hover:bg-rose-500/20',
  }

  return (
    <div
      className={cn(
        'group relative p-6 rounded-2xl bg-white dark:bg-[#111A2E] border border-slate-200 dark:border-[#1E293B] shadow-sm hover:shadow-xl hover:border-blue-500/30 transition-all duration-300',
        className
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <h3 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-1.5">
            {value}
          </h3>
        </div>
        {Icon && (
          <div
            className={cn(
              'p-3.5 rounded-xl border transition-colors duration-300',
              colorStyles[color] || colorStyles.blue
            )}
          >
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>

      {change !== undefined && (
        <div className="flex items-center gap-2 mt-4 text-xs">
          <span
            className={cn(
              'inline-flex items-center gap-0.5 font-semibold px-1.5 py-0.5 rounded-md',
              isPositive
                ? 'text-emerald-400 bg-emerald-500/10'
                : 'text-rose-400 bg-rose-500/10'
            )}
          >
            {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            {change}
          </span>
          <span className="text-slate-400">{subtitle}</span>
        </div>
      )}
    </div>
  )
}
