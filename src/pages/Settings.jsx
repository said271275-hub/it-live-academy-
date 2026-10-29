import React, { useState } from 'react'
import { useAuth } from '../store/AuthContext'
import { useUI } from '../store/UIContext'
import { useData } from '../store/DataContext'
import { Modal } from '../components/common/Modal'
import { ConfirmDialog } from '../components/common/ConfirmDialog'
import {
  Settings as SettingsIcon,
  User,
  Building,
  Palette,
  Shield,
  RotateCcw,
  Download,
  Upload,
  Check,
  Globe,
  DollarSign,
  Moon,
  Sun
} from 'lucide-react'

export function Settings() {
  const { user } = useAuth()
  const { theme, setTheme, currency, setCurrency, lang, setLang, addToast, t } = useUI()
  const { settings, setSettings, resetAllData, api, refreshData } = useData()

  const [activeSection, setActiveSection] = useState('center') // center | appearance | profile | data
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false)

  // Center form state
  const [centerForm, setCenterForm] = useState({
    centerName: settings?.centerName || 'IT LIVE Academy',
    centerPhone: settings?.centerPhone || '+998 (71) 200-00-55',
    centerEmail: settings?.centerEmail || 'info@itlive.uz',
    centerAddress: settings?.centerAddress || 'Toshkent sh., Yunusobod tumani, Amir Temur ko‘chasi, 107-B bino',
    website: settings?.website || 'https://itlive.uz',
    taxNumber: settings?.taxNumber || '308945612'
  })

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: ''
  })

  // Save center settings
  const handleSaveCenter = async (e) => {
    e.preventDefault()
    await api.settings.update(centerForm)
    setSettings(centerForm)
    addToast({ type: 'success', title: t('save'), message: t('centerInfoTab') })
  }

  // Save profile
  const handleSaveProfile = (e) => {
    e.preventDefault()
    addToast({ type: 'success', title: t('profileSettings'), message: t('save') })
  }

  // Backup JSON Export
  const handleExportBackup = async () => {
    const backup = await api.exportBackup()
    const jsonStr = JSON.stringify(backup, null, 2)
    const blob = new Blob([jsonStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `itlive_backup_${new Date().toISOString().split('T')[0]}.json`
    link.click()
    addToast({ type: 'success', title: t('downloadBackup'), message: t('backupRestore') })
  }

  // Restore JSON Import
  const handleImportBackup = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = async (event) => {
      try {
        const data = JSON.parse(event.target.result)
        await api.importBackup(data)
        await refreshData()
        addToast({ type: 'success', title: t('restoreFromFile'), message: t('backupRestore') })
      } catch (err) {
        addToast({ type: 'error', title: 'Xatolik', message: 'JSON format xato' })
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          {t('settingsTitle')}
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          {t('settingsSubtitle')}
        </p>
      </div>

      {/* Main Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Navigation Tabs */}
        <div className="space-y-1 bg-white dark:bg-[#111A2E] p-2 rounded-2xl border border-slate-200 dark:border-[#1E293B] shadow-sm self-start">
          <button
            onClick={() => setActiveSection('center')}
            className={`w-full text-left flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
              activeSection === 'center' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Building className="w-4 h-4" /> {t('centerInfoTab')}
          </button>
          <button
            onClick={() => setActiveSection('appearance')}
            className={`w-full text-left flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
              activeSection === 'appearance' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Palette className="w-4 h-4" /> {t('appearanceTab')}
          </button>
          <button
            onClick={() => setActiveSection('profile')}
            className={`w-full text-left flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
              activeSection === 'profile' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <User className="w-4 h-4" /> {t('profileTab')}
          </button>
          <button
            onClick={() => setActiveSection('data')}
            className={`w-full text-left flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
              activeSection === 'data' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <RotateCcw className="w-4 h-4" /> {t('dataManagementTab')}
          </button>
        </div>

        {/* Section Contents */}
        <div className="md:col-span-3 space-y-6">
          {/* CENTER SETTINGS */}
          {activeSection === 'center' && (
            <div className="p-6 rounded-2xl bg-white dark:bg-[#111A2E] border border-slate-200 dark:border-[#1E293B] shadow-sm">
              <h3 className="text-base font-bold text-white mb-4">{t('centerInfoTab')}</h3>
              <form onSubmit={handleSaveCenter} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">{t('name')}</label>
                    <input
                      type="text"
                      value={centerForm.centerName}
                      onChange={e => setCenterForm({ ...centerForm, centerName: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">{t('phone')}</label>
                    <input
                      type="text"
                      value={centerForm.centerPhone}
                      onChange={e => setCenterForm({ ...centerForm, centerPhone: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">{t('email')}</label>
                    <input
                      type="email"
                      value={centerForm.centerEmail}
                      onChange={e => setCenterForm({ ...centerForm, centerEmail: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Veb-sayt</label>
                    <input
                      type="text"
                      value={centerForm.website}
                      onChange={e => setCenterForm({ ...centerForm, website: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">{t('city')} & Manzil</label>
                  <input
                    type="text"
                    value={centerForm.centerAddress}
                    onChange={e => setCenterForm({ ...centerForm, centerAddress: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                  />
                </div>

                <div className="flex justify-end pt-3">
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shadow-blue-600/30"
                  >
                    {t('save')}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* APPEARANCE & THEME */}
          {activeSection === 'appearance' && (
            <div className="p-6 rounded-2xl bg-white dark:bg-[#111A2E] border border-slate-200 dark:border-[#1E293B] shadow-sm space-y-6">
              <div>
                <h3 className="text-base font-bold text-white mb-1">{t('systemTheme')}</h3>
                <p className="text-xs text-slate-400 mb-4">{t('appearanceTab')}</p>
                <div className="grid grid-cols-2 gap-4 max-w-md">
                  <button
                    type="button"
                    onClick={() => setTheme('dark')}
                    className={`p-4 rounded-2xl border text-center transition-all ${
                      theme === 'dark' ? 'border-blue-500 bg-blue-500/10 text-white ring-2 ring-blue-500/30' : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Moon className="w-6 h-6 mx-auto mb-2 text-blue-400" />
                    <span className="text-xs font-bold block">{t('darkTheme')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTheme('light')}
                    className={`p-4 rounded-2xl border text-center transition-all ${
                      theme === 'light' ? 'border-blue-500 bg-blue-500/10 text-slate-900 ring-2 ring-blue-500/30' : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Sun className="w-6 h-6 mx-auto mb-2 text-amber-400" />
                    <span className="text-xs font-bold block">{t('lightTheme')}</span>
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <h3 className="text-base font-bold text-white mb-3">{t('appearanceTab')}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">{t('mainCurrency')}</label>
                    <select
                      value={currency}
                      onChange={e => setCurrency(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                    >
                      <option value="UZS">UZS - So'm</option>
                      <option value="USD">USD - Dollar ($)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">{t('interfaceLanguage')}</label>
                    <select
                      value={lang}
                      onChange={e => setLang(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                    >
                      <option value="uz">🇺🇿 O'zbek tili</option>
                      <option value="ru">🇷🇺 Русский язык</option>
                      <option value="en">🇬🇧 English</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PROFILE & SECURITY */}
          {activeSection === 'profile' && (
            <div className="p-6 rounded-2xl bg-white dark:bg-[#111A2E] border border-slate-200 dark:border-[#1E293B] shadow-sm">
              <h3 className="text-base font-bold text-white mb-4">{t('profileTab')}</h3>
              <form onSubmit={handleSaveProfile} className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">{t('name')}</label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">{t('email')}</label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={e => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                  />
                </div>
                <div className="pt-2 border-t border-slate-800">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Parol</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={profileForm.currentPassword}
                    onChange={e => setProfileForm({ ...profileForm, currentPassword: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white mb-3"
                  />
                </div>
                <div className="flex justify-end pt-3">
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shadow-blue-600/30"
                  >
                    {t('save')}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* DATA MANAGEMENT (RESET & BACKUP) */}
          {activeSection === 'data' && (
            <div className="p-6 rounded-2xl bg-white dark:bg-[#111A2E] border border-slate-200 dark:border-[#1E293B] shadow-sm space-y-6">
              <div>
                <h3 className="text-base font-bold text-white mb-1">{t('backupRestore')}</h3>
                <p className="text-xs text-slate-400 mb-4">{t('backupDesc')}</p>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleExportBackup}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors border border-slate-700"
                  >
                    <Download className="w-4 h-4 text-blue-400" /> {t('downloadBackup')}
                  </button>

                  <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors border border-slate-700 cursor-pointer">
                    <Upload className="w-4 h-4 text-emerald-400" /> {t('restoreFromFile')}
                    <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-800">
                <h3 className="text-base font-bold text-rose-400 mb-1">{t('resetDemoData')}</h3>
                <p className="text-xs text-slate-400 mb-4">{t('resetDesc')}</p>
                <button
                  onClick={() => setResetConfirmOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/30 text-xs font-semibold transition-colors"
                >
                  <RotateCcw className="w-4 h-4" /> {t('resetDemoData')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reset Confirmation */}
      <ConfirmDialog
        isOpen={resetConfirmOpen}
        onClose={() => setResetConfirmOpen(false)}
        onConfirm={resetAllData}
        title={t('resetDemoData')}
        message={t('resetDesc')}
        confirmText={t('confirm')}
      />
    </div>
  )
}
