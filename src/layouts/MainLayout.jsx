import React from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from '../components/layout/Sidebar'
import { Topbar } from '../components/layout/Topbar'
import { ToastContainer } from '../components/common/ToastContainer'
import { useUI } from '../store/UIContext'
import { cn } from '../utils/cn'

export function MainLayout() {
  const { sidebarCollapsed } = useUI()

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1220] text-slate-800 dark:text-slate-100 transition-colors duration-200">
      <Sidebar />
      <div
        className={cn(
          'transition-all duration-300 min-h-screen flex flex-col',
          sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        )}
      >
        <Topbar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-fade-in">
          <Outlet />
        </main>
      </div>
      <ToastContainer />
    </div>
  )
}
