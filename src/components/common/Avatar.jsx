import React, { useState } from 'react'
import { cn } from '../../utils/cn'

export function Avatar({ src, name = 'User', size = 'md', className = '' }) {
  const [imgError, setImgError] = useState(false)

  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-xl'
  }

  const getInitials = (str) => {
    if (!str) return 'U'
    const parts = str.trim().split(/\s+/)
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    return str.slice(0, 2).toUpperCase()
  }

  // Generate pleasant background color based on name
  const colors = [
    'from-blue-600 to-indigo-600',
    'from-emerald-600 to-teal-600',
    'from-purple-600 to-pink-600',
    'from-amber-600 to-orange-600',
    'from-cyan-600 to-blue-600'
  ]
  const colorIndex = (name.charCodeAt(0) + (name.charCodeAt(1) || 0)) % colors.length
  const gradient = colors[colorIndex]

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center rounded-full overflow-hidden shrink-0 font-semibold ring-2 ring-white/10 select-none',
        sizeClasses[size] || sizeClasses.md,
        className
      )}
    >
      {src && !imgError ? (
        <img
          src={src}
          alt={name}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className={`w-full h-full flex items-center justify-center bg-gradient-to-tr ${gradient} text-white`}>
          {getInitials(name)}
        </div>
      )}
    </div>
  )
}
