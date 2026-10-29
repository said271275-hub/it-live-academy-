import React from 'react'
import { FolderOpen } from 'lucide-react'

export function EmptyState({
  icon: Icon = FolderOpen,
  title = "Ma'lumot topilmadi",
  description = "Qidiruv shartlarini o‘zgartirib ko‘ring yoki yangi ma'lumot qo‘shing.",
  actionText,
  onAction
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4 shadow-lg shadow-blue-500/5">
        <Icon className="w-8 h-8" />
      </div>
      <h4 className="text-base font-semibold text-slate-800 dark:text-slate-200">
        {title}
      </h4>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mt-1">
        {description}
      </p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-5 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-md shadow-blue-600/30"
        >
          {actionText}
        </button>
      )}
    </div>
  )
}
