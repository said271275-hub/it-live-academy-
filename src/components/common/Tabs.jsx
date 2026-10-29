import React from 'react'
import { cn } from '../../utils/cn'

export function Tabs({ tabs, activeTab, onChange, className = '' }) {
  return (
    <div
      className={cn(
        'flex items-center gap-1 p-1 bg-slate-100 dark:bg-[#111A2E] border border-slate-200 dark:border-[#1E293B] rounded-xl overflow-x-auto',
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id
        const Icon = tab.icon

        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              'flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200',
              isActive
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800/60'
            )}
          >
            {Icon && <Icon className="w-3.5 h-3.5" />}
            {tab.label}
            {tab.count !== undefined && (
              <span
                className={cn(
                  'ml-1 px-1.5 py-0.5 rounded-full text-[10px]',
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-700 text-slate-300'
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
