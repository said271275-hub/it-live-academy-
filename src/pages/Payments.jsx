import React, { useState } from 'react'
import { useData } from '../store/DataContext'
import { useUI } from '../store/UIContext'
import { Badge } from '../components/common/Badge'
import { Modal } from '../components/common/Modal'
import { ReceiptModal } from '../components/payments/ReceiptModal'
import { formatCurrency, formatDate } from '../utils/formatters'
import {
  CreditCard,
  Plus,
  Download,
  Search,
  Filter,
  Printer,
  DollarSign,
  AlertTriangle,
  PieChart as PieIcon,
  CheckCircle,
  Clock
} from 'lucide-react'
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis
} from 'recharts'

export function Payments() {
  const { payments, students, addPayment } = useData()
  const { currency, addToast } = useUI()

  const [activeTab, setActiveTab] = useState('all') // all | debts
  const [search, setSearch] = useState('')
  const [selectedMethod, setSelectedMethod] = useState('ALL')

  // Modals
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [receiptPayment, setReceiptPayment] = useState(null)

  // Payment form state with discount & partial payment
  const [formData, setFormData] = useState({
    studentId: students[0]?.id || '',
    amount: '1200000',
    discount: '0',
    method: 'Payme',
    nextPaymentDate: '2026-11-25',
    note: 'Oylik to‘lov'
  })

  const handleCreatePayment = async (e) => {
    e.preventDefault()
    const student = students.find(s => s.id === formData.studentId)
    const finalAmount = Math.max(0, Number(formData.amount) - Number(formData.discount || 0))

    await addPayment({
      studentId: formData.studentId,
      studentName: student?.name || 'Talaba',
      courseName: student?.courseName || 'Kurs',
      amount: finalAmount,
      method: formData.method,
      note: formData.discount > 0 ? `${formData.note} (Chegirma: ${formData.discount} so'm)` : formData.note
    })

    setAddModalOpen(false)
  }

  // Export payments to CSV
  const handleExportCSV = () => {
    const headers = 'Chek,Oquvchi,Kurs,Summa,Sana,Usul,Status\n'
    const rows = filteredPayments.map(p =>
      `"${p.receiptNumber}","${p.studentName}","${p.courseName}","${p.amount}","${p.paidDate}","${p.method}","${p.status}"`
    ).join('\n')

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `payments_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Debtors list
  const debtors = students.filter(s => s.debtAmount > 0)

  // Filtered payments
  const filteredPayments = payments.filter(p => {
    const matchSearch = p.studentName.toLowerCase().includes(search.toLowerCase()) ||
      p.receiptNumber.toLowerCase().includes(search.toLowerCase())
    const matchMethod = selectedMethod === 'ALL' || p.method === selectedMethod
    return matchSearch && matchMethod
  })

  // Methods distribution chart data
  const methodCounts = payments.reduce((acc, p) => {
    acc[p.method] = (acc[p.method] || 0) + Number(p.amount)
    return acc
  }, {})
  const methodColors = {
    Payme: '#00CCCC',
    Click: '#0088FF',
    Naqd: '#10B981',
    Karta: '#8B5CF6'
  }
  const methodChartData = Object.keys(methodCounts).map(m => ({
    name: m,
    value: methodCounts[m],
    color: methodColors[m] || '#3B82F6'
  }))

  const totalCollected = payments.reduce((acc, p) => acc + Number(p.amount), 0)
  const totalDebt = debtors.reduce((acc, d) => acc + Number(d.debtAmount), 0)

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Moliya va To'lovlar
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Oylik tushumlar, qarzdorliklar hisobi va kvitansiyalar
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-white text-xs font-semibold border border-slate-300 dark:border-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> CSV Export
          </button>
          <button
            onClick={() => setAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/30 transition-all"
          >
            <Plus className="w-4 h-4" /> To'lov qabul qilish
          </button>
        </div>
      </div>

      {/* KPI Cards & Method Chart */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-[#111A2E] border border-slate-200 dark:border-[#1E293B] shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Jami Tushum</span>
            <h3 className="text-3xl font-extrabold text-emerald-400 mt-2">
              {formatCurrency(totalCollected, currency)}
            </h3>
            <p className="text-xs text-slate-400 mt-1">Jami {payments.length} ta operatsiya</p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-xs text-emerald-400">
            <CheckCircle className="w-4 h-4" /> Barcha to'lovlar tasdiqlangan
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-[#111A2E] border border-slate-200 dark:border-[#1E293B] shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Mavjud Qarzdorlik</span>
            <h3 className="text-3xl font-extrabold text-rose-400 mt-2">
              {formatCurrency(totalDebt, currency)}
            </h3>
            <p className="text-xs text-slate-400 mt-1">{debtors.length} ta o'quvchida kechikish</p>
          </div>
          <button
            onClick={() => setActiveTab('debts')}
            className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-rose-400 hover:underline"
          >
            <span>Qarzdorlarni ko'rish</span>
            <AlertTriangle className="w-4 h-4" />
          </button>
        </div>

        {/* Payment Methods Distribution Chart */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#111A2E] border border-slate-200 dark:border-[#1E293B] shadow-sm flex items-center justify-between">
          <div className="h-28 w-28">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={methodChartData} dataKey="value" innerRadius={28} outerRadius={42} paddingAngle={3}>
                  {methodChartData.map((e, idx) => <Cell key={idx} fill={e.color} />)}
                </Pie>
                <Tooltip formatter={(v) => formatCurrency(v, currency)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 text-[11px]">
            {methodChartData.map(m => (
              <div key={m.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: m.color }} />
                <span className="text-slate-400">{m.name}:</span>
                <span className="font-semibold text-white">{Math.round((m.value / (totalCollected || 1)) * 100)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs: Barcha to'lovlar / Qarzdorlar */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-[#1E293B] pb-3">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'all'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          Barcha to'lovlar ({payments.length})
        </button>
        <button
          onClick={() => setActiveTab('debts')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
            activeTab === 'debts'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" /> Qarzdorlar ({debtors.length})
        </button>
      </div>

      {/* Filters (Search & Method) */}
      {activeTab === 'all' && (
        <div className="p-4 rounded-2xl bg-white dark:bg-[#111A2E] border border-slate-200 dark:border-[#1E293B] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="O'quvchi yoki chek raqami..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className="text-xs text-slate-400">Usul:</span>
            <select
              value={selectedMethod}
              onChange={e => setSelectedMethod(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 text-xs text-white"
            >
              <option value="ALL">Barchasi</option>
              <option value="Payme">Payme</option>
              <option value="Click">Click</option>
              <option value="Naqd">Naqd</option>
              <option value="Karta">Karta</option>
            </select>
          </div>
        </div>
      )}

      {/* Tables based on active tab */}
      {activeTab === 'all' ? (
        <div className="bg-white dark:bg-[#111A2E] border border-slate-200 dark:border-[#1E293B] rounded-2xl shadow-sm overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-[#0B1220]/60 border-b border-slate-200 dark:border-[#1E293B] text-slate-400 font-semibold uppercase">
              <tr>
                <th className="p-4">Chek raqami</th>
                <th className="p-4">O'quvchi</th>
                <th className="p-4">Kurs</th>
                <th className="p-4">Summa</th>
                <th className="p-4">Usul</th>
                <th className="p-4">Sana</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Chek</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredPayments.slice(0, 50).map(p => (
                <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-mono text-blue-400">{p.receiptNumber}</td>
                  <td className="p-4 font-bold text-white">{p.studentName}</td>
                  <td className="p-4 text-slate-300">{p.courseName}</td>
                  <td className="p-4 font-bold text-emerald-400">{formatCurrency(p.amount, currency)}</td>
                  <td className="p-4 text-slate-300">{p.method}</td>
                  <td className="p-4 text-slate-400">{formatDate(p.paidDate)}</td>
                  <td className="p-4"><Badge variant="Paid">To'langan</Badge></td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => setReceiptPayment(p)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      title="Chekni ko'rish / Chop etish"
                    >
                      <Printer className="w-4 h-4 text-blue-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Debtors Tab */
        <div className="bg-white dark:bg-[#111A2E] border border-slate-200 dark:border-[#1E293B] rounded-2xl shadow-sm overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-[#0B1220]/60 border-b border-slate-200 dark:border-[#1E293B] text-slate-400 font-semibold uppercase">
              <tr>
                <th className="p-4">O'quvchi</th>
                <th className="p-4">Telefon</th>
                <th className="p-4">Kurs / Guruh</th>
                <th className="p-4">Qarz miqdori</th>
                <th className="p-4">Kechikish</th>
                <th className="p-4 text-right">Amal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {debtors.map((d, idx) => (
                <tr key={d.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-bold text-white">{d.name}</td>
                  <td className="p-4 font-mono text-slate-300">{d.phone}</td>
                  <td className="p-4">{d.courseName} • <span className="text-blue-400">{d.groupName}</span></td>
                  <td className="p-4 font-bold text-rose-400">{formatCurrency(d.debtAmount, currency)}</td>
                  <td className="p-4 text-amber-400 font-semibold">{7 + (idx * 3)} kun</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => {
                        setFormData({ ...formData, studentId: d.id, amount: String(d.debtAmount) })
                        setAddModalOpen(true)
                      }}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors"
                    >
                      To'lov olish
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Payment Modal (with Partial Payment & Discount) */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="To'lov qabul qilish va rasmiylashtirish"
        subtitle="Chegirma va qisman to'lov imkoniyati bilan"
      >
        <form onSubmit={handleCreatePayment} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">O'quvchi *</label>
            <select
              value={formData.studentId}
              onChange={e => setFormData({ ...formData, studentId: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
            >
              {students.length === 0 ? (
                <option value="">Hozircha o'quvchilar yo'q (avval o'quvchi qo'shing)</option>
              ) : (
                students.slice(0, 100).map(s => (
                  <option key={s.id} value={s.id}>{s.name} - {s.courseName} ({s.paymentStatus})</option>
                ))
              )}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">To'lov summasi (so'm) *</label>
              <input
                type="number"
                required
                value={formData.amount}
                onChange={e => setFormData({ ...formData, amount: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Chegirma (so'm)</label>
              <input
                type="number"
                value={formData.discount}
                onChange={e => setFormData({ ...formData, discount: e.target.value })}
                placeholder="0"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">To'lov usuli</label>
              <select
                value={formData.method}
                onChange={e => setFormData({ ...formData, method: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
              >
                <option value="Payme">Payme</option>
                <option value="Click">Click</option>
                <option value="Naqd">Naqd pul</option>
                <option value="Karta">Bank kartasi</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Keyingi to'lov sanasi</label>
              <input
                type="date"
                value={formData.nextPaymentDate}
                onChange={e => setFormData({ ...formData, nextPaymentDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setAddModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md shadow-emerald-600/30"
            >
              To'lovni tasdiqlash
            </button>
          </div>
        </form>
      </Modal>

      {/* Receipt Printable Modal */}
      <ReceiptModal
        isOpen={!!receiptPayment}
        onClose={() => setReceiptPayment(null)}
        payment={receiptPayment}
      />
    </div>
  )
}
