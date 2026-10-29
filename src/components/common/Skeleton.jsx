import React from 'react'
import { cn } from '../../utils/cn'

export function Skeleton({ className = '', variant = 'text' }) {
  const variantStyles = {
    text: 'h-4 w-full rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-xl',
  }

  return (
    <div
      className={cn(
        'animate-pulse bg-slate-200 dark:bg-slate-800/80',
        variantStyles[variant],
        className
      )}
    />
  )
}
