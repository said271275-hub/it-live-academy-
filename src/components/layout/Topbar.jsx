import React, { useState, useRef, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../store/AuthContext'
import { useUI } from '../../store/UIContext'
import { useData } from '../../store/DataContext'
import { Avatar } from '../common/Avatar'
import {
  Menu,
  Sun,
  Moon,
  Bell,
  Search,
  CheckCircle2,
  AlertTriangle,
  User,
  LogOut,
  ChevronRight,
  Sparkles,
  Globe
} from 'lucide-react'

export function Topbar() {
  const { user, logout, switchRole } = useAuth()
  const { theme, toggleTheme, setSidebarOpen, lang, setLang, t } = useUI()
  const { students, groups, teachers, leads } = useData()
  const location = useLocation()
  const navigate = useNavigate()

  // State
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showLangMenu, setShowLangMenu] = useState(false)

  const notifRef = useRef(null)
  const userRef = useRef(null)
  const langRef = useRef(null)

  // Outside click handler
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false)
      }
      if (userRef.current && !userRef.current.contains(e.target)) {
        setShowUserMenu(false)
      }
      if (langRef.current && !langRef.current.contains(e.target)) {
        setShowLangMenu(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  // Calculate notifications
  const debtors = students.filter(s => s.paymentStatus === 'Debt')
  const newLeads = leads.filter(l => l.stage === 'new')
  const totalNotifications = debtors.length + newLeads.length

  // Global search filtering
  const searchResults = searchQuery.trim() === '' ? [] : [
    ...students
      .filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .slice(0, 4)
      .map(s => ({ type: 'student', title: s.name, sub: `${s.courseName} • ${s.groupName}`, id: s.id, to: `/students/${s.id}` })),
    ...groups
      .filter(g => g.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .slice(0, 3)
      .map(g => ({ type: 'group', title: g.name, sub: `${g.days} • ${g.time}`, id: g.id, to: `/groups/${g.id}` })),
    ...teachers
      .filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .slice(0, 3)
      .map(t => ({ type: 'teacher', title: t.name, sub: t.specialty, id: t.id, to: `/teachers` }))
  ]

  // Breadcrumbs generator
  const pathParts = location.pathname.split('/').filter(Boolean)
  const currentKey = pathParts[0] || 'dashboard'
  const breadcrumbName = t(currentKey) || currentKey

  const languages = [
    { code: 'uz', label: "O'zbekcha", flag: "🇺🇿" },
    { code: 'ru', label: "Русский", flag: "🇷🇺" },
    { code: 'en', label: "English", flag: "🇬🇧" }
  ]

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-[#0B1220]/80 backdrop-blur-md border-b border-slate-200 dark:border-[#1E293B] px-4 lg:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile hamburger & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Menyu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400">
          <span className="hover:text-slate-200">IT LIVE</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="font-semibold text-slate-900 dark:text-blue-400">{breadcrumbName}</span>
          {pathParts.length > 1 && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="text-slate-300">{t('details')}</span>
            </>
          )}
        </nav>
      </div>

      {/* Middle: Global Search Input */}
      <div className="flex-1 max-w-md relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setSearchOpen(true)
            }}
            onFocus={() => setSearchOpen(true)}
            placeholder={t('searchPlaceholder')}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-100 dark:bg-[#111A2E] border border-slate-200 dark:border-[#1E293B] text-slate-900 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
        </div>

        {/* Global Search Popover */}
        {searchOpen && searchQuery.trim() !== '' && (
          <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-[#111A2E] border border-slate-200 dark:border-[#1E293B] rounded-2xl shadow-2xl p-2 z-50 animate-scale-up">
            <div className="p-2 border-b border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              {t('searchResults')} ({searchResults.length})
            </div>
            {searchResults.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-400">{t('noResults')}</div>
            ) : (
              <div className="space-y-1 mt-1 max-h-64 overflow-y-auto">
                {searchResults.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      navigate(item.to)
                      setSearchOpen(false)
                      setSearchQuery('')
                    }}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 flex items-center justify-between transition-colors"
                  >
                    <div>
                      <p className="text-xs font-semibold text-slate-900 dark:text-white">{item.title}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{item.sub}</p>
                    </div>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400">
                      {item.type}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Actions: Language, Theme, Notifications, Profile */}
      <div className="flex items-center gap-1.5 sm:gap-2.5">
        {/* Language Selector Dropdown */}
        <div className="relative" ref={langRef}>
          <button
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-blue-500 transition-all"
            title="Tilni almashtirish / Сменить язык"
          >
            <Globe className="w-3.5 h-3.5 text-blue-400" />
            <span className="uppercase">{lang}</span>
          </button>

          {showLangMenu && (
            <div className="absolute right-0 top-full mt-2 w-36 bg-white dark:bg-[#111A2E] border border-slate-200 dark:border-[#1E293B] rounded-2xl shadow-2xl p-1.5 z-50 animate-scale-up">
              {languages.map(l => (
                <button
                  key={l.code}
                  onClick={() => {
                    setLang(l.code)
                    setShowLangMenu(false)
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-left transition-colors ${
                    lang === l.code
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>{l.flag}</span>
                  <span>{l.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
          title={theme === 'dark' ? 'Yorug‘ rejim' : 'Qorong‘u rejim'}
          aria-label="Mavzuni almashtirish"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
        </button>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
            aria-label="Bildirishnomalar"
          >
            <Bell className="w-4 h-4" />
            {totalNotifications > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-[#0B1220]" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-[#111A2E] border border-slate-200 dark:border-[#1E293B] rounded-2xl shadow-2xl p-3 z-50 animate-scale-up">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-900 dark:text-white">{t('notifications')}</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400">
                  {totalNotifications} {t('newNotifications')}
                </span>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-72 overflow-y-auto mt-2">
                {debtors.length > 0 && (
                  <div
                    onClick={() => { navigate('/payments'); setShowNotifications(false); }}
                    className="py-2.5 px-2 hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-xl cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold">
                      <AlertTriangle className="w-4 h-4" /> {t('debtNotification')}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {debtors.length} {t('debtNotificationDesc')}.
                    </p>
                  </div>
                )}
                {newLeads.length > 0 && (
                  <div
                    onClick={() => { navigate('/leads'); setShowNotifications(false); }}
                    className="py-2.5 px-2 hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-xl cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold">
                      <Sparkles className="w-4 h-4" /> {t('leadNotification')}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {newLeads.length} {t('leadNotificationDesc')}.
                    </p>
                  </div>
                )}
                <div className="py-2.5 px-2 hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-xl cursor-pointer transition-colors">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                    <CheckCircle2 className="w-4 h-4" /> {t('scheduleNotification')}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {t('scheduleNotificationDesc')}.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative" ref={userRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
            aria-label="Foydalanuvchi menyusi"
          >
            <Avatar src={user?.avatar} name={user?.name || 'Admin'} size="sm" />
            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">
                {user?.name || 'Administrator'}
              </p>
              <p className="text-[10px] text-blue-400 font-medium capitalize">
                {user?.role || 'admin'}
              </p>
            </div>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-[#111A2E] border border-slate-200 dark:border-[#1E293B] rounded-2xl shadow-2xl p-2 z-50 animate-scale-up">
              <div className="p-3 border-b border-slate-100 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-900 dark:text-white">{user?.name}</p>
                <p className="text-[11px] text-slate-400">{user?.email}</p>
                <div className="mt-2 text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 inline-block">
                  {user?.title || user?.role}
                </div>
              </div>

              {/* Quick switch roles for testing */}
              <div className="py-2 border-b border-slate-100 dark:border-slate-800">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 pb-1">
                  {t('switchRoleTest')}:
                </p>
                <div className="grid grid-cols-3 gap-1 px-2">
                  {['admin', 'manager', 'teacher'].map(r => (
                    <button
                      key={r}
                      onClick={() => switchRole(r)}
                      className={`text-[11px] py-1 rounded-lg capitalize transition-colors font-medium ${
                        user?.role === r
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-1">
                <button
                  onClick={() => { navigate('/settings'); setShowUserMenu(false); }}
                  className="w-full text-left flex items-center gap-2.5 px-3 py-2 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-xl transition-colors"
                >
                  <User className="w-4 h-4 text-slate-400" /> {t('profileSettings')}
                </button>
                <button
                  onClick={() => { logout(); navigate('/login'); }}
                  className="w-full text-left flex items-center gap-2.5 px-3 py-2 text-xs text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors mt-1"
                >
                  <LogOut className="w-4 h-4" /> {t('logout')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
