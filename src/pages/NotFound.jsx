import React from 'react'
import { Link } from 'react-router-dom'
import { Home, HelpCircle } from 'lucide-react'

export function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
      <div className="w-20 h-20 rounded-3xl bg-blue-500/10 border border-blue-500/20 text-blue-500 flex items-center justify-center mb-6">
        <HelpCircle className="w-10 h-10" />
      </div>
      <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">404</h1>
      <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mt-2">
        Sahifa topilmadi
      </h2>
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1">
        Siz qidirayotgan sahifa o‘chirilgan yoki manzili o‘zgargan bo‘lishi mumkin.
      </p>
      <Link
        to="/dashboard"
        className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-lg shadow-blue-600/30 transition-all"
      >
        <Home className="w-4 h-4" /> Bosh sahifaga qaytish
      </Link>
    </div>
  )
}
