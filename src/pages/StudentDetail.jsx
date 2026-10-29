import React, { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useData } from '../store/DataContext'
import { useUI } from '../store/UIContext'
import { Avatar } from '../components/common/Avatar'
import { Badge } from '../components/common/Badge'
import { Tabs } from '../components/common/Tabs'
import { Modal } from '../components/common/Modal'
import { formatCurrency, formatDate } from '../utils/formatters'
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  BookOpen,
  Award,
  CreditCard,
  UserCheck,
  PauseCircle,
  PlayCircle,
  Repeat,
  CheckCircle,
  Clock,
  MessageSquare
} from 'lucide-react'

export function StudentDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { students, groups, payments, updateStudent } = useData()
  const { currency, addToast } = useUI()

  const [activeTab, setActiveTab] = useState('profile')
  const [transferModalOpen, setTransferModalOpen] = useState(false)
  const [newGroupId, setNewGroupId] = useState('')
  const [newNote, setNewNote] = useState('')

  const student = students.find(s => s.id === id)

  if (!student) {
    return (
      <div className="text-center py-12">
        <h2 className="text-lg font-bold text-white">O'quvchi topilmadi</h2>
        <Link to="/students" className="mt-3 text-xs text-blue-400 hover:underline inline-block">
          ← O'quvchilar ro'yxatiga qaytish
        </Link>
      </div>
    )
  }

  // Student specific payments
  const studentPayments = payments.filter(p => p.studentId === student.id || p.studentName === student.name)

  // Toggle freeze/unfreeze
  const handleToggleFreeze = () => {
    const newStatus = student.status === 'Frozen' ? 'Active' : 'Frozen'
    updateStudent(student.id, { status: newStatus })
  }

  // Group transfer
  const handleTransferGroup = () => {
    const targetGroup = groups.find(g => g.id === newGroupId)
    if (!targetGroup) return
    updateStudent(student.id, {
      groupId: targetGroup.id,
      groupName: targetGroup.name,
      courseId: targetGroup.courseId
    })
    setTransferModalOpen(false)
    addToast({ type: 'success', title: 'Ko‘chirildi', message: `${targetGroup.name} guruhiga muvaffaqiyatli o'tkazildi` })
  }

  // Add note
  const handleAddNote = (e) => {
    e.preventDefault()
    if (!newNote.trim()) return
    const updatedNotes = student.notes ? `${student.notes}\n• ${newNote}` : `• ${newNote}`
    updateStudent(student.id, { notes: updatedNotes })
    setNewNote('')
    addToast({ type: 'success', title: 'Izoh saqlandi', message: 'Yangi qayd muvaffaqiyatli qo\'shildi' })
  }

  const tabs = [
    { id: 'profile', label: 'Profil ma\'lumotlari', icon: UserCheck },
    { id: 'payments', label: 'To‘lovlar tarixi', icon: CreditCard, count: studentPayments.length },
    { id: 'attendance', label: 'Davomat & Faollik', icon: Clock },
    { id: 'notes', label: 'Izoh va qaydlar', icon: MessageSquare }
  ]

  return (
    <div className="space-y-6 pb-12">
      {/* Top back button & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={() => navigate('/students')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> O'quvchilar ro'yxatiga qaytish
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => { setNewGroupId(student.groupId); setTransferModalOpen(true); }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-white text-xs font-semibold border border-slate-300 dark:border-slate-700 transition-colors"
          >
            <Repeat className="w-3.5 h-3.5 text-blue-400" /> Guruhga ko'chirish
          </button>
          <button
            onClick={handleToggleFreeze}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              student.status === 'Frozen'
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                : 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30'
            }`}
          >
            {student.status === 'Frozen' ? (
              <>
                <PlayCircle className="w-3.5 h-3.5" /> Faollashtirish
              </>
            ) : (
              <>
                <PauseCircle className="w-3.5 h-3.5" /> Kursni muzlatish
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Profile Header Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#111A2E] border border-slate-200 dark:border-[#1E293B] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <Avatar src={student.avatar} name={student.name} size="xl" />
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{student.name}</h2>
              <Badge variant={student.status}>{student.status}</Badge>
              <Badge variant={student.paymentStatus}>{student.paymentStatus}</Badge>
            </div>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-400">
              <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-blue-400" /> {student.phone}</span>
              <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-blue-400" /> {student.email}</span>
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-blue-400" /> {student.city}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800 pt-4 md:pt-0 md:pl-6">
          <div className="text-center">
            <span className="text-[11px] text-slate-400 block uppercase font-medium">Davomat</span>
            <span className="text-xl font-bold text-emerald-400">{student.attendancePercent}%</span>
          </div>
          <div className="text-center">
            <span className="text-[11px] text-slate-400 block uppercase font-medium">O'rtacha baho</span>
            <span className="text-xl font-bold text-blue-400">{student.averageScore}</span>
          </div>
          <div className="text-center">
            <span className="text-[11px] text-slate-400 block uppercase font-medium">Qarz</span>
            <span className={`text-xl font-bold ${student.debtAmount > 0 ? 'text-rose-400' : 'text-slate-400'}`}>
              {formatCurrency(student.debtAmount, currency)}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab Contents */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#111A2E] border border-slate-200 dark:border-[#1E293B] space-y-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-400" /> O'quv ma'lumotlari
            </h4>
            <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-400">Tanlangan kurs:</span>
                <span className="font-semibold text-white">{student.courseName}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-400">Joriy guruh:</span>
                <span className="font-semibold text-blue-400">{student.groupName}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-400">Qo'shilgan sana:</span>
                <span className="text-white">{formatDate(student.joinedDate)}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-400">ID raqami:</span>
                <span className="text-slate-400 font-mono">{student.id}</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#111A2E] border border-slate-200 dark:border-[#1E293B] space-y-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-400" /> Natija va ko'rsatkichlar
            </h4>
            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-400">Davomat ko'rsatkichi</span>
                  <span className="font-bold text-emerald-400">{student.attendancePercent}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${student.attendancePercent}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-400">Uyga vazifalar va baholar</span>
                  <span className="font-bold text-blue-400">{student.averageScore} ball</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${student.averageScore}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'payments' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-[#111A2E] border border-slate-200 dark:border-[#1E293B]">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
            To'lovlar tarixi
          </h4>
          {studentPayments.length === 0 ? (
            <p className="text-xs text-slate-400">Ushbu o'quvchi bo'yicha to'lovlar mavjud emas.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-slate-400 border-b border-slate-800 pb-2">
                  <tr>
                    <th className="py-2">Chek raqami</th>
                    <th className="py-2">Sana</th>
                    <th className="py-2">Summa</th>
                    <th className="py-2">Usul</th>
                    <th className="py-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {studentPayments.map(p => (
                    <tr key={p.id}>
                      <td className="py-3 font-mono text-blue-400">{p.receiptNumber}</td>
                      <td className="py-3 text-slate-300">{formatDate(p.paidDate)}</td>
                      <td className="py-3 font-bold text-emerald-400">{formatCurrency(p.amount, currency)}</td>
                      <td className="py-3 text-slate-300">{p.method}</td>
                      <td className="py-3"><Badge variant="Paid">To'langan</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'attendance' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-[#111A2E] border border-slate-200 dark:border-[#1E293B] space-y-4">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            So'nggi darslar davomati
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {['29-Okt', '27-Okt', '25-Okt', '22-Okt', '20-Okt', '18-Okt', '15-Okt', '13-Okt'].map((day, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 text-center">
                <span className="text-[11px] text-slate-400 block">{day}</span>
                <span className="inline-block mt-1 text-xs font-bold text-emerald-400">
                  {idx === 2 ? 'Kechikdi' : idx === 5 ? 'Sababli' : 'Keldi'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'notes' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-[#111A2E] border border-slate-200 dark:border-[#1E293B] space-y-4">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            O'qituvchi va mentor qaydlari
          </h4>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 whitespace-pre-line">
            {student.notes || "Hozircha hech qanday izoh yo'q."}
          </div>

          <form onSubmit={handleAddNote} className="flex gap-2 pt-2">
            <input
              type="text"
              value={newNote}
              onChange={e => setNewNote(e.target.value)}
              placeholder="Yangi izoh qo'shish..."
              className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs"
            >
              Qo'shish
            </button>
          </form>
        </div>
      )}

      {/* Transfer Group Modal */}
      <Modal
        isOpen={transferModalOpen}
        onClose={() => setTransferModalOpen(false)}
        title="O'quvchini boshqa guruhga ko'chirish"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Yangi guruhni tanlang</label>
            <select
              value={newGroupId}
              onChange={e => setNewGroupId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
            >
              {groups.map(g => (
                <option key={g.id} value={g.id}>{g.name} ({g.days} • {g.time})</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setTransferModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
            >
              Bekor qilish
            </button>
            <button
              onClick={handleTransferGroup}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
            >
              Ko'chirish
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
