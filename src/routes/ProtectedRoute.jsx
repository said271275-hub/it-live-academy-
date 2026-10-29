import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../store/AuthContext'
import { ShieldAlert } from 'lucide-react'

export function ProtectedRoute({ allowedRoles = [] }) {
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Ruxsat berilmagan
        </h2>
        <p className="text-sm text-slate-400 max-w-sm mt-1">
          Sizning joriy rolingiz ({user.role}) ushbu sahifaga kirish huquqiga ega emas.
        </p>
      </div>
    )
  }

  return <Outlet />
}
