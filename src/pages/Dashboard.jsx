import React, { useState } from 'react'
import { useData } from '../store/DataContext'
import { useUI } from '../store/UIContext'
import { StatCard } from '../components/common/StatCard'
import { Badge } from '../components/common/Badge'
import { Avatar } from '../components/common/Avatar'
import { QuickStudentModal, QuickPaymentModal } from '../components/dashboard/QuickModals'
import { formatCurrency, formatDate } from '../utils/formatters'
import {
  Users,
  GraduationCap,
  DollarSign,
  Award,
  Plus,
  CreditCard,
  UserPlus,
  Calendar,
  AlertCircle,
  Clock,
  ArrowRight
} from 'lucide-react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  CartesianGrid
} from 'recharts'
import { Link } from 'react-router-dom'

export function Dashboard() {
  const { students, courses, groups, payments } = useData()
  const { currency, t, lang } = useUI()

  const [studentModalOpen, setStudentModalOpen] = useState(false)
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)
  const [revenuePeriod, setRevenuePeriod] = useState('monthly')

  // Dynamic calculations from real data
  const totalStudentsCount = students.length
  const totalCoursesCount = courses.length
  const totalRevenue = payments.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0)
  const activeStudents = students.filter(s => s.status === 'Active').length
  const completionRate = students.length > 0 ? Math.round((students.filter(s => s.status === 'Graduated').length / students.length) * 100) : 0

  // Month names based on language
  const monthsByLang = {
    uz: ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyn', 'Iyl'],
    ru: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл'],
    en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
  }
  const currentMonths = monthsByLang[lang] || monthsByLang.uz

  const studentsChartData = [
    { month: currentMonths[0], count: 120 },
    { month: currentMonths[1], count: 145 },
    { month: currentMonths[2], count: 180 },
    { month: currentMonths[3], count: 210 },
    { month: currentMonths[4], count: 260 },
    { month: currentMonths[5], count: 320 },
    { month: currentMonths[6], count: totalStudentsCount > 0 ? totalStudentsCount : 380 },
  ]

  // Category distribution
  const categoryNames = {
    Development: lang === 'ru' ? 'Разработка' : lang === 'uz' ? 'Dasturlash' : 'Development',
    Design: lang === 'ru' ? 'Дизайн' : lang === 'uz' ? 'Dizayn' : 'Design',
    Marketing: lang === 'ru' ? 'Маркетинг' : lang === 'uz' ? 'Marketing' : 'Marketing',
    Language: lang === 'ru' ? 'Языки' : lang === 'uz' ? 'Tillar' : 'Languages',
    Basic: lang === 'ru' ? 'Базовые' : lang === 'uz' ? 'Boshlang\'ich' : 'Basic',
    Security: lang === 'ru' ? 'Безопасность' : lang === 'uz' ? 'Xavfsizlik' : 'Security',
    Science: lang === 'ru' ? 'Точные науки' : lang === 'uz' ? 'Fanlar' : 'Science'
  }

  const categoryCount = courses.reduce((acc, c) => {
    const localized = categoryNames[c.category] || c.category
    acc[localized] = (acc[localized] || 0) + (c.studentsCount || 10)
    return acc
  }, {})

  const categoryColors = ['#3B82F6', '#8B5CF6', '#F97316', '#10B981', '#06B6D4', '#EF4444', '#84CC16']
  const donutData = Object.keys(categoryCount).map((key, index) => ({
    name: key,
    value: categoryCount[key],
    color: categoryColors[index % categoryColors.length]
  }))

  // Revenue chart data
  const monthlyRevenueData = [
    { name: currentMonths[4], revenue: 18500000 },
    { name: currentMonths[5], revenue: 22400000 },
    { name: currentMonths[6], revenue: totalRevenue > 0 ? totalRevenue : 28900000 },
  ]

  const weeklyRevenueData = [
    { name: lang === 'ru' ? '1-я нед' : lang === 'uz' ? '1-hafta' : 'Week 1', revenue: 7500000 },
    { name: lang === 'ru' ? '2-я нед' : lang === 'uz' ? '2-hafta' : 'Week 2', revenue: 9200000 },
    { name: lang === 'ru' ? '3-я нед' : lang === 'uz' ? '3-hafta' : 'Week 3', revenue: 11400000 },
    { name: lang === 'ru' ? '4-я нед' : lang === 'uz' ? '4-hafta' : 'Week 4', revenue: 10800000 },
  ]

  // Top 5 Debtors
  const topDebtors = students
    .filter(s => s.debtAmount > 0)
    .sort((a, b) => b.debtAmount - a.debtAmount)
    .slice(0, 5)

  // Recent payments
  const recentPayments = payments.slice(0, 5)

  // Today's classes
  const todayClasses = groups.slice(0, 4)

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            {t('dashboard')}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            IT LIVE Academy
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={() => setStudentModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/30 transition-all"
          >
            <UserPlus className="w-3.5 h-3.5" /> {t('quickStudent')}
          </button>
          <button
            onClick={() => setPaymentModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/30 transition-all"
          >
            <CreditCard className="w-3.5 h-3.5" /> {t('quickPayment')}
          </button>
          <Link
            to="/leads"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md shadow-purple-600/30 transition-all"
          >
            <Plus className="w-3.5 h-3.5" /> {t('quickLead')}
          </Link>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={t('totalStudents')}
          value={totalStudentsCount.toLocaleString()}
          change="12%"
          isPositive={true}
          icon={Users}
          color="blue"
          subtitle={t('comparedToLastMonth')}
        />
        <StatCard
          title={t('activeCourses')}
          value={totalCoursesCount}
          change="8%"
          isPositive={true}
          icon={GraduationCap}
          color="green"
          subtitle={t('comparedToLastMonth')}
        />
        <StatCard
          title={t('totalRevenue')}
          value={formatCurrency(totalRevenue, currency)}
          change="15%"
          isPositive={true}
          icon={DollarSign}
          color="purple"
          subtitle={t('comparedToLastMonth')}
        />
        <StatCard
          title={t('completionRate')}
          value={`${completionRate}%`}
          change="5%"
          isPositive={true}
          icon={Award}
          color="orange"
          subtitle={t('comparedToLastMonth')}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Overview (Area Chart) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-[#111A2E] border border-slate-200 dark:border-[#1E293B] shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">{t('revenueOverview')}</h3>
              <p className="text-xs text-slate-400">{t('revenueSubtitle')}</p>
            </div>
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-[#0B1220] rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-medium">
              <button
                onClick={() => setRevenuePeriod('monthly')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  revenuePeriod === 'monthly' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                {t('monthly')}
              </button>
              <button
                onClick={() => setRevenuePeriod('weekly')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  revenuePeriod === 'weekly' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                {t('weekly')}
              </button>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenuePeriod === 'monthly' ? monthlyRevenueData : weeklyRevenueData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" opacity={0.5} />
                <XAxis dataKey="name" stroke="#64748B" fontSize={11} />
                <YAxis
                  stroke="#64748B"
                  fontSize={11}
                  tickFormatter={val => `${(val / 1000000).toFixed(0)}M`}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111A2E', borderColor: '#1E293B', borderRadius: '12px', fontSize: '12px' }}
                  formatter={(val) => [formatCurrency(val, currency), t('totalRevenue')]}
                />
                <Area type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Courses by Category (Donut Chart) */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#111A2E] border border-slate-200 dark:border-[#1E293B] shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">{t('coursesByCategory')}</h3>
            <p className="text-xs text-slate-400 mb-4">{t('coursesCategorySub')}</p>
          </div>
          <div className="h-52 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {donutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#111A2E', borderColor: '#1E293B', borderRadius: '12px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px]">
            {donutData.slice(0, 4).map(item => (
              <div key={item.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-400 truncate">{item.name}</span>
                <span className="font-semibold text-white ml-auto">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Second Row: Students Overview Bar Chart & Today's Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Students Overview (Bar Chart) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-[#111A2E] border border-slate-200 dark:border-[#1E293B] shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">{t('studentsOverview')}</h3>
              <p className="text-xs text-slate-400">{t('studentsOverviewSub')}</p>
            </div>
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg">
              ↑ 12% {t('growth')}
            </span>
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={studentsChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" opacity={0.5} />
                <XAxis dataKey="month" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111A2E', borderColor: '#1E293B', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#3B82F6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bugungi darslar ro'yxati */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#111A2E] border border-slate-200 dark:border-[#1E293B] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">{t('todayClasses')}</h3>
              <p className="text-xs text-slate-400">{t('todayClassesSub')}</p>
            </div>
            <Link to="/schedule" className="text-xs font-semibold text-blue-400 hover:underline">
              {t('goToSchedule')} →
            </Link>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto">
            {todayClasses.map(g => (
              <div
                key={g.id}
                className="p-3 rounded-xl bg-slate-50 dark:bg-[#0B1220]/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{g.name}</h4>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-blue-400" /> {g.time}</span>
                    <span>•</span>
                    <span>{g.room}</span>
                  </div>
                </div>
                <Badge variant="Active">{t('inClass')}</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Third Row: Top 5 Debtors & Recent Payments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Qarzdorlar top-5 */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#111A2E] border border-slate-200 dark:border-[#1E293B] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">{t('topDebtors')}</h3>
              <p className="text-xs text-slate-400">{t('topDebtorsSub')}</p>
            </div>
            <Link to="/payments" className="text-xs text-blue-400 hover:underline font-semibold">
              {t('viewAll')} →
            </Link>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {topDebtors.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">{t('noResults')}</p>
            ) : (
              topDebtors.map(debtor => (
                <div key={debtor.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar src={debtor.avatar} name={debtor.name} size="sm" />
                    <div>
                      <h5 className="text-xs font-semibold text-slate-900 dark:text-white">{debtor.name}</h5>
                      <p className="text-[11px] text-slate-400">{debtor.phone} • {debtor.courseName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-rose-400 block">
                      {formatCurrency(debtor.debtAmount, currency)}
                    </span>
                    <Badge variant="Debt">{t('Debt')}</Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* So'nggi to'lovlar */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#111A2E] border border-slate-200 dark:border-[#1E293B] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">{t('recentPayments')}</h3>
              <p className="text-xs text-slate-400">{t('recentPaymentsSub')}</p>
            </div>
            <Link to="/payments" className="text-xs text-blue-400 hover:underline font-semibold">
              {t('viewAll')} →
            </Link>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {recentPayments.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">{t('noResults')}</p>
            ) : (
              recentPayments.map(p => (
                <div key={p.id} className="py-3 flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-semibold text-slate-900 dark:text-white">{p.studentName}</h5>
                    <p className="text-[11px] text-slate-400">{formatDate(p.paidDate)} • {p.method}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-400 block">
                      +{formatCurrency(p.amount, currency)}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">{p.receiptNumber}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Modals */}
      <QuickStudentModal isOpen={studentModalOpen} onClose={() => setStudentModalOpen(false)} />
      <QuickPaymentModal isOpen={paymentModalOpen} onClose={() => setPaymentModalOpen(false)} />
    </div>
  )
}
