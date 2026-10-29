import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../store/AuthContext'
import { Lock, Mail, ArrowRight, ShieldCheck, UserCheck, GraduationCap } from 'lucide-react'

export function Login() {
  const [email, setEmail] = useState('admin@itlive.uz')
  const [password, setPassword] = useState('admin123')
  const [rememberMe, setRememberMe] = useState(true)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    setTimeout(() => {
      const res = login(email, password)
      if (res.success) {
        navigate('/dashboard')
      } else {
        setError(res.error || 'Kirishda xatolik')
      }
      setLoading(false)
    }, 400)
  }

  const fillDemo = (demoEmail, demoPass) => {
    setEmail(demoEmail)
    setPassword(demoPass)
    setError('')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0B1220] relative overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center font-black text-white text-2xl shadow-xl shadow-blue-600/30">
              IT
            </div>
            <div className="text-left">
              <span className="font-black text-2xl text-white tracking-tight">LIVE</span>
              <span className="block text-xs uppercase tracking-widest text-blue-400 font-bold">Academy</span>
            </div>
          </div>
          <h1 className="text-xl font-bold text-white">CRM & Boshqaruv Tizimi</h1>
          <p className="text-xs text-slate-400 mt-1">Admin Dashboard paneliga kirish</p>
        </div>

        {/* Card */}
        <div className="bg-[#111A2E] border border-[#1E293B] rounded-3xl p-6 sm:p-8 shadow-2xl">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Elektron pochta
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@itlive.uz"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0B1220] border border-[#1E293B] text-white text-xs placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Maxfiy parol
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0B1220] border border-[#1E293B] text-white text-xs placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-300">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-0"
                />
                Eslab qolish
              </label>
              <span className="text-blue-400 hover:underline cursor-pointer">Parolni unutdingizmi?</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs tracking-wide shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all mt-2"
            >
              {loading ? 'Kirilmoqda...' : 'Tizimga kirish'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Logins */}
          <div className="mt-6 pt-5 border-t border-slate-800">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-center mb-3">
              Tezkor demo login:
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => fillDemo('admin@itlive.uz', 'admin123')}
                className="p-2 rounded-xl bg-slate-800/60 hover:bg-blue-600/20 border border-slate-700/60 hover:border-blue-500/40 text-center transition-all group"
              >
                <ShieldCheck className="w-4 h-4 text-blue-400 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-bold text-slate-300 block">Admin</span>
              </button>

              <button
                type="button"
                onClick={() => fillDemo('manager@itlive.uz', 'manager123')}
                className="p-2 rounded-xl bg-slate-800/60 hover:bg-emerald-600/20 border border-slate-700/60 hover:border-emerald-500/40 text-center transition-all group"
              >
                <UserCheck className="w-4 h-4 text-emerald-400 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-bold text-slate-300 block">Manager</span>
              </button>

              <button
                type="button"
                onClick={() => fillDemo('teacher@itlive.uz', 'teacher123')}
                className="p-2 rounded-xl bg-slate-800/60 hover:bg-purple-600/20 border border-slate-700/60 hover:border-purple-500/40 text-center transition-all group"
              >
                <GraduationCap className="w-4 h-4 text-purple-400 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-bold text-slate-300 block">Teacher</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
