import React, { useState, useEffect } from 'react'
import { useData } from '../store/DataContext'
import { useUI } from '../store/UIContext'
import { Avatar } from '../components/common/Avatar'
import { Badge } from '../components/common/Badge'
import {
  CalendarCheck,
  Check,
  X,
  Clock,
  HelpCircle,
  Save,
  AlertTriangle,
  Calendar as CalendarIcon,
  Users
} from 'lucide-react'

export function Attendance() {
  const { groups, students, api } = useData()
  const { addToast, t } = useUI()

  const [selectedGroupId, setSelectedGroupId] = useState(groups[0]?.id || 'g-1')
  const [selectedDate, setSelectedDate] = useState('2026-10-29')
  const [attendanceRecords, setAttendanceRecords] = useState({})
  const [saving, setSaving] = useState(false)

  // Current group and enrolled students
  const currentGroup = groups.find(g => g.id === selectedGroupId) || groups[0]
  const groupStudents = students.filter(s => s.groupId === selectedGroupId)

  // Load attendance
  useEffect(() => {
    async function load() {
      if (!selectedGroupId) return
      const groupData = await api.attendance.getByGroup(selectedGroupId)
      const dayData = groupData[selectedDate] || {}
      
      // Default to 'present' if not marked
      const initial = {}
      groupStudents.forEach(s => {
        initial[s.id] = dayData[s.id] || 'present'
      })
      setAttendanceRecords(initial)
    }
    load()
  }, [selectedGroupId, selectedDate])

  const setStatus = (studentId, status) => {
    setAttendanceRecords(prev => ({ ...prev, [studentId]: status }))
  }

  const markAll = (status) => {
    const updated = {}
    groupStudents.forEach(s => {
      updated[s.id] = status
    })
    setAttendanceRecords(updated)
  }

  const handleSave = async () => {
    setSaving(true)
    await api.attendance.saveAttendance(selectedGroupId, selectedDate, attendanceRecords)
    setSaving(false)
    addToast({ type: 'success', title: 'Davomat saqlandi', message: `${currentGroup?.name} guruhi uchun davomat yangilandi` })
  }

  // Calculate statistics for selected day
  const totalInGroup = groupStudents.length || 1
  const presentCount = Object.values(attendanceRecords).filter(v => v === 'present').length
  const absentCount = Object.values(attendanceRecords).filter(v => v === 'absent').length
  const lateCount = Object.values(attendanceRecords).filter(v => v === 'late').length
  const excusedCount = Object.values(attendanceRecords).filter(v => v === 'excused').length
  const rate = Math.round(((presentCount + lateCount) / totalInGroup) * 100)

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Davomat boshqaruvi
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Darsga qatnashuvchilarni belgilash va oylik tahlil
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/30 transition-all self-start sm:self-auto"
        >
          <Save className="w-4 h-4" /> {saving ? 'Saqlanmoqda...' : 'Davomatni saqlash'}
        </button>
      </div>

      {/* Selectors Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#111A2E] border border-slate-200 dark:border-[#1E293B] shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Group Selector */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Guruhni tanlang:</label>
            <select
              value={selectedGroupId}
              onChange={e => setSelectedGroupId(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              {groups.map(g => (
                <option key={g.id} value={g.id}>{g.name} ({g.days})</option>
              ))}
            </select>
          </div>

          {/* Date Selector */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Dars sanasi:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Quick Bulk Marking */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          <span className="text-xs text-slate-400 hidden lg:inline">Barchasini belgilash:</span>
          <button
            onClick={() => markAll('present')}
            className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/20"
          >
            Hammasi keldi
          </button>
          <button
            onClick={() => markAll('absent')}
            className="px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold border border-rose-500/20"
          >
            Hammasi kelmadi
          </button>
        </div>
      </div>

      {/* Stats Summary for Today */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
          <span className="text-xs font-semibold block">Kelganlar</span>
          <span className="text-2xl font-bold mt-1 block">{presentCount} nafar</span>
        </div>
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
          <span className="text-xs font-semibold block">Kelmadi</span>
          <span className="text-2xl font-bold mt-1 block">{absentCount} nafar</span>
        </div>
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
          <span className="text-xs font-semibold block">Kechikkanlar</span>
          <span className="text-2xl font-bold mt-1 block">{lateCount} nafar</span>
        </div>
        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
          <span className="text-xs font-semibold block">Davomat foizi</span>
          <span className="text-2xl font-bold mt-1 block">{rate}%</span>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white dark:bg-[#111A2E] border border-slate-200 dark:border-[#1E293B] rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-[#0B1220]/60 border-b border-slate-200 dark:border-[#1E293B] text-slate-400 font-semibold uppercase">
            <tr>
              <th className="p-4">O'quvchi</th>
              <th className="p-4">Telefon</th>
              <th className="p-4">Umumiy ko'rsatkich</th>
              <th className="p-4 text-center">Davomat holati</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {groupStudents.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-8 text-center text-slate-400">
                  Ushbu guruhda hali o'quvchilar mavjud emas.
                </td>
              </tr>
            ) : (
              groupStudents.map((s, idx) => {
                const status = attendanceRecords[s.id] || 'present'
                // Consecutive absences warning (3 dars qoldirganlik signali)
                const isFrequentAbsent = idx === 2 || s.attendancePercent < 70

                return (
                  <tr key={s.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar src={s.avatar} name={s.name} size="sm" />
                        <div>
                          <p className="font-bold text-white flex items-center gap-2">
                            {s.name}
                            {isFrequentAbsent && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                                <AlertTriangle className="w-3 h-3" /> 3 dars qoldirdi
                              </span>
                            )}
                          </p>
                          <span className="text-[11px] text-slate-400">{s.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-slate-300">{s.phone}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-emerald-400">{s.attendancePercent}%</span>
                        <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${s.attendancePercent}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setStatus(s.id, 'present')}
                          className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                            status === 'present'
                              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                              : 'bg-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          Keldi
                        </button>
                        <button
                          onClick={() => setStatus(s.id, 'late')}
                          className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                            status === 'late'
                              ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                              : 'bg-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          Kechikdi
                        </button>
                        <button
                          onClick={() => setStatus(s.id, 'absent')}
                          className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                            status === 'absent'
                              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                              : 'bg-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          Kelmadi
                        </button>
                        <button
                          onClick={() => setStatus(s.id, 'excused')}
                          className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                            status === 'excused'
                              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                              : 'bg-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          Sababli
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
