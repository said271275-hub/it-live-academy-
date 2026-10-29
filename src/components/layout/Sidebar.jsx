import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../store/AuthContext'
import { useUI } from '../../store/UIContext'
import {
  LayoutDashboard,
  Users,
  Target,
  GraduationCap,
  UserCheck,
  FolderKanban,
  CalendarCheck,
  CreditCard,
  Calendar,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldAlert
} from 'lucide-react'
import { cn } from '../../utils/cn'

export function Sidebar() {
  const { user, logout } = useAuth()
  const { sidebarCollapsed, setSidebarCollapsed, sidebarOpen, setSidebarOpen, t } = useUI()
  const navigate = useNavigate()

  // Navigation items with allowed roles and translation keys
  const navItems = [
    { to: '/dashboard', key: 'dashboard', icon: LayoutDashboard, roles: ['admin', 'manager', 'teacher'] },
    { to: '/students', key: 'students', icon: Users, roles: ['admin', 'manager'] },
    { to: '/leads', key: 'leads', icon: Target, roles: ['admin', 'manager'] },
    { to: '/courses', key: 'courses', icon: GraduationCap, roles: ['admin', 'manager'] },
    { to: '/teachers', key: 'teachers', icon: UserCheck, roles: ['admin'] },
    { to: '/groups', key: 'groups', icon: FolderKanban, roles: ['admin', 'manager', 'teacher'] },
    { to: '/attendance', key: 'attendance', icon: CalendarCheck, roles: ['admin', 'manager', 'teacher'] },
    { to: '/payments', key: 'payments', icon: CreditCard, roles: ['admin', 'manager'] },
    { to: '/schedule', key: 'schedule', icon: Calendar, roles: ['admin', 'manager', 'teacher'] },
    { to: '/analytics', key: 'analytics', icon: BarChart3, roles: ['admin'] },
    { to: '/settings', key: 'settings', icon: Settings, roles: ['admin', 'manager', 'teacher'] },
  ]

  const userRole = user?.role || 'admin'
  const filteredNav = navItems.filter(item => item.roles.includes(userRole))

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={cn(
          'fixed top-0 bottom-0 left-0 z-40 flex flex-col bg-white dark:bg-[#111A2E] border-r border-slate-200 dark:border-[#1E293B] transition-all duration-300 select-none',
          sidebarCollapsed ? 'w-20' : 'w-64',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Brand / Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-[#1E293B]">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white text-base shadow-lg shadow-blue-600/30 shrink-0">
              IT
            </div>
            {!sidebarCollapsed && (
              <div className="leading-none">
                <span className="font-extrabold text-slate-900 dark:text-white text-base tracking-tight">
                  LIVE
                </span>
                <span className="ml-1 text-xs uppercase tracking-widest text-blue-500 font-semibold block">
                  Academy
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title={sidebarCollapsed ? 'Kengaytirish' : 'Kichraytirish'}
            aria-label="Sidebar hajmini o'zgartirish"
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {filteredNav.map(item => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200',
                    isActive
                      ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/25'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  )
                }
              >
                <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
                {!sidebarCollapsed && <span>{t(item.key)}</span>}
              </NavLink>
            )
          })}
        </nav>

        {/* Role status badge */}
        {!sidebarCollapsed && (
          <div className="px-4 py-2 mx-3 mb-2 rounded-xl bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-blue-400" />
            <div className="text-[11px] leading-tight">
              <span className="text-slate-400 block">{t('currentRole')}:</span>
              <span className="font-semibold text-blue-400 capitalize">{user?.role}</span>
            </div>
          </div>
        )}

        {/* Footer / Logout */}
        <div className="p-3 border-t border-slate-200 dark:border-[#1E293B]">
          <button
            onClick={handleLogout}
            className={cn(
              'w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-rose-500 hover:bg-rose-500/10 transition-colors',
              sidebarCollapsed && 'justify-center'
            )}
            title={t('logout')}
            aria-label={t('logout')}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!sidebarCollapsed && <span>{t('logout')}</span>}
          </button>
        </div>
      </aside>
    </>
  )
}
