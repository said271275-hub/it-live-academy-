import React, { useState } from 'react'
import { useData } from '../store/DataContext'
import { useUI } from '../store/UIContext'
import { formatCurrency } from '../utils/formatters'
import {
  BarChart3,
  TrendingUp,
  Users,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Calendar,
  Award,
  Zap,
  UserCheck
} from 'lucide-react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts'

export function Analytics() {
  const { students, courses, teachers, leads, payments } = useData()
  const { currency } = useUI()

  const [period, setPeriod] = useState('30') // 7 | 30 | 365

  // Calculations
  const totalRevenue = payments.reduce((acc, p) => acc + Number(p.amount), 0)
  const convertedLeads = leads.filter(l => l.stage === 'converted').length
  const totalLeads = leads.length || 1
  const leadConversionRate = Math.round((convertedLeads / totalLeads) * 100)

  const droppedStudents = students.filter(s => s.status === 'Dropped').length
  const churnRate = Math.round((droppedStudents / (students.length || 1)) * 100) || 4

  // Popular courses data
  const popularCourses = courses
    .map(c => {
      const count = students.filter(s => s.courseId === c.id).length || c.studentsCount || 20
      return { name: c.name.split(' ')[0], full: c.name, count, price: c.price }
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 6)

  // Monthly analytics
  const dynamicGrowth = [
    { period: 'May', students: 120, leads: 40, revenue: 18500000 },
    { period: 'Iyn', students: 160, leads: 55, revenue: 23400000 },
    { period: 'Iyl', students: 210, leads: 70, revenue: 28900000 },
    { period: 'Avg', students: 260, leads: 85, revenue: 32000000 },
    { period: 'Sen', students: 310, leads: 95, revenue: 36500000 },
    { period: 'Okt', students: students.length, leads: leads.length, revenue: totalRevenue },
  ]

  const handleExportReport = () => {
    const reportData = `IT LIVE Academy - Tahliliy Hisobot
Sana: ${new Date().toLocaleDateString()}
Davr: So'nggi ${period} kun

ASOSIY KO'RSATKICHLAR:
Jami o'quvchilar: ${students.length}
Jami daromad: ${formatCurrency(totalRevenue, currency)}
Lead konversiyasi: ${leadConversionRate}%
O'quvchilar chiqib ketish (churn) darajasi: ${churnRate}%
Eng mashhur kurs: ${popularCourses[0]?.full} (${popularCourses[0]?.count} o'quvchi)
`
    const blob = new Blob([reportData], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `analytics_report_${new Date().toISOString().split('T')[0]}.txt`
    a.click()
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Tahlil va Statistika (Analytics)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            O'sish dinamikasi, konversiya, churn foizi va moliyaviy hisobotlar
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Period selector */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-[#111A2E] rounded-xl border border-slate-200 dark:border-[#1E293B] text-xs font-semibold">
            <button
              onClick={() => setPeriod('7')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${period === '7' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
            >
              7 kun
            </button>
            <button
              onClick={() => setPeriod('30')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${period === '30' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
            >
              30 kun
            </button>
            <button
              onClick={() => setPeriod('365')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${period === '365' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
            >
              1 yil
            </button>
          </div>

          <button
            onClick={handleExportReport}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/30 transition-all"
          >
            <Download className="w-3.5 h-3.5" /> Hisobotni yuklash
          </button>
        </div>
      </div>

      {/* KPI 4 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#111A2E] border border-slate-200 dark:border-[#1E293B]">
          <span className="text-xs text-slate-400 font-semibold block uppercase">Lead Konversiyasi</span>
          <h3 className="text-2xl font-black text-emerald-400 mt-1">{leadConversionRate}%</h3>
          <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1 text-emerald-400">
            <ArrowUpRight className="w-3.5 h-3.5" /> Yuqori samaradorlik
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#111A2E] border border-slate-200 dark:border-[#1E293B]">
          <span className="text-xs text-slate-400 font-semibold block uppercase">Churn Rate (Ketish)</span>
          <h3 className="text-2xl font-black text-rose-400 mt-1">{churnRate}%</h3>
          <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1 text-emerald-400">
            <ArrowDownRight className="w-3.5 h-3.5" /> Me'yordan past (yaxshi)
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#111A2E] border border-slate-200 dark:border-[#1E293B]">
          <span className="text-xs text-slate-400 font-semibold block uppercase">O'rtacha Chek</span>
          <h3 className="text-2xl font-black text-blue-400 mt-1">
            {formatCurrency(totalRevenue / (payments.length || 1), currency)}
          </h3>
          <p className="text-[11px] text-slate-400 mt-2">Bitta o'quvchi to'lovi</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#111A2E] border border-slate-200 dark:border-[#1E293B]">
          <span className="text-xs text-slate-400 font-semibold block uppercase">Faol O'quvchilar</span>
          <h3 className="text-2xl font-black text-purple-400 mt-1">
            {students.filter(s => s.status === 'Active').length} nafar
          </h3>
          <p className="text-[11px] text-slate-400 mt-2">Darsga qatnashmoqda</p>
        </div>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Courses */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#111A2E] border border-slate-200 dark:border-[#1E293B]">
          <h3 className="text-base font-bold text-white mb-1">Eng mashhur kurslar</h3>
          <p className="text-xs text-slate-400 mb-6">O'quvchilar soni bo'yicha yetakchilar</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={popularCourses} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" opacity={0.5} />
                <XAxis type="number" stroke="#64748B" fontSize={11} />
                <YAxis dataKey="name" type="category" stroke="#64748B" fontSize={11} width={80} />
                <Tooltip contentStyle={{ backgroundColor: '#111A2E', borderColor: '#1E293B', borderRadius: '12px' }} />
                <Bar dataKey="count" fill="#3B82F6" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Growth Dynamics */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#111A2E] border border-slate-200 dark:border-[#1E293B]">
          <h3 className="text-base font-bold text-white mb-1">O'sish dinamikasi</h3>
          <p className="text-xs text-slate-400 mb-6">O'quvchilar va leadlar nisbati</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dynamicGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" opacity={0.5} />
                <XAxis dataKey="period" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#111A2E', borderColor: '#1E293B', borderRadius: '12px' }} />
                <Area type="monotone" dataKey="students" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.2} name="O'quvchilar" />
                <Area type="monotone" dataKey="leads" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.2} name="Leadlar" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Teachers Performance Table */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#111A2E] border border-slate-200 dark:border-[#1E293B]">
        <h3 className="text-base font-bold text-white mb-1">O'qituvchilar samaradorligi</h3>
        <p className="text-xs text-slate-400 mb-4">Guruhlar to'lishi va talabalar faolligi</p>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/60 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-3">O'qituvchi</th>
                <th className="p-3">Mutaxassislik</th>
                <th className="p-3">O'quvchilari</th>
                <th className="p-3">Guruhlari</th>
                <th className="p-3">Reyting</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {teachers.slice(0, 6).map(t => (
                <tr key={t.id} className="hover:bg-slate-800/40">
                  <td className="p-3 font-bold text-white">{t.name}</td>
                  <td className="p-3 text-slate-400">{t.specialty}</td>
                  <td className="p-3 font-semibold text-blue-400">{t.studentsCount || 35} nafar</td>
                  <td className="p-3 text-slate-300">{t.groupsCount || 2} ta guruh</td>
                  <td className="p-3 font-bold text-emerald-400">★ 4.9</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
