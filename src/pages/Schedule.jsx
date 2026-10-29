import React, { useState } from 'react'
import { useData } from '../store/DataContext'
import { Modal } from '../components/common/Modal'
import {
  Calendar,
  Clock,
  MapPin,
  UserCheck,
  AlertTriangle,
  Plus,
  Filter
} from 'lucide-react'

export function Schedule() {
  const { groups, teachers, courses, api, refreshData } = useData()

  const [selectedRoom, setSelectedRoom] = useState('ALL')
  const [selectedTeacher, setSelectedTeacher] = useState('ALL')
  const [modalOpen, setModalOpen] = useState(false)
  const [conflictError, setConflictError] = useState('')

  const [newEvent, setNewEvent] = useState({
    name: '',
    teacherId: teachers[0]?.id || '',
    day: 'Dushanba',
    time: '14:00 - 16:00',
    room: 'Xona 101'
  })

  const daysOfWeek = ['Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba', 'Yakshanba']
  const timeSlots = ['09:00 - 11:00', '11:00 - 13:00', '14:00 - 16:00', '16:00 - 18:00', '18:30 - 20:30']
  const rooms = ['Xona 101', 'Xona 102', 'Xona 103', 'Xona 104', 'Xona 201 (iMac)', 'Xona 202', 'Xona 203']

  // Map groups to schedule events
  const dayNameMap = {
    'Du': 'Dushanba',
    'Chor': 'Chorshanba',
    'Jum': 'Juma',
    'Se': 'Seshanba',
    'Pay': 'Payshanba',
    'Shan': 'Shanba',
    'Yak': 'Yakshanba'
  }

  // Parse existing groups into scheduled slots
  const scheduledItems = []
  groups.forEach(g => {
    const daysArr = g.days.split('-')
    daysArr.forEach(shortDay => {
      const fullDay = dayNameMap[shortDay] || shortDay
      scheduledItems.push({
        id: `${g.id}-${fullDay}`,
        groupId: g.id,
        groupName: g.name,
        teacherId: g.teacherId,
        room: g.room,
        day: fullDay,
        time: g.time
      })
    })
  })

  // Filtered
  const filteredItems = scheduledItems.filter(item => {
    const matchRoom = selectedRoom === 'ALL' || item.room.includes(selectedRoom)
    const matchTeacher = selectedTeacher === 'ALL' || item.teacherId === selectedTeacher
    return matchRoom && matchTeacher
  })

  // Conflict Checker
  const handleAddSchedule = (e) => {
    e.preventDefault()
    setConflictError('')

    // Check if room or teacher has conflict at the same day and time
    const conflict = scheduledItems.find(item =>
      item.day === newEvent.day &&
      item.time === newEvent.time &&
      (item.room === newEvent.room || item.teacherId === newEvent.teacherId)
    )

    if (conflict) {
      if (conflict.room === newEvent.room) {
        setConflictError(`XATOLIK: ${newEvent.room} ushbu vaqtda (${newEvent.day} ${newEvent.time}) band! (${conflict.groupName} darsi mavjud)`)
      } else {
        const t = teachers.find(teach => teach.id === newEvent.teacherId)
        setConflictError(`XATOLIK: O'qituvchi (${t?.name}) ushbu vaqtda boshqa guruhga (${conflict.groupName}) dars o'tmoqda!`)
      }
      return
    }

    // No conflict, add
    setModalOpen(false)
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Haftalik dars jadvali
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Xonalar va o'qituvchilar bandligi, to'qnashuvlarni avtomatik aniqlash
          </p>
        </div>

        <button
          onClick={() => { setConflictError(''); setModalOpen(true); }}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/30 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Dars vaqtini rejalashtirish
        </button>
      </div>

      {/* Filters Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#111A2E] border border-slate-200 dark:border-[#1E293B] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Room filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Xona bo'yicha:</label>
            <select
              value={selectedRoom}
              onChange={e => setSelectedRoom(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 text-xs text-white"
            >
              <option value="ALL">Barcha xonalar</option>
              {rooms.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          {/* Teacher filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">O'qituvchi bo'yicha:</label>
            <select
              value={selectedTeacher}
              onChange={e => setSelectedTeacher(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 text-xs text-white"
            >
              <option value="ALL">Barcha ustozlar</option>
              {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Weekly Grid */}
      <div className="bg-white dark:bg-[#111A2E] border border-slate-200 dark:border-[#1E293B] rounded-2xl shadow-sm overflow-x-auto">
        <div className="min-w-[900px]">
          {/* Days Header */}
          <div className="grid grid-cols-7 border-b border-slate-200 dark:border-[#1E293B] text-center font-bold text-xs uppercase bg-slate-50 dark:bg-[#0B1220]/60 text-slate-400">
            {daysOfWeek.map(d => (
              <div key={d} className="p-3 border-r last:border-r-0 border-slate-200 dark:border-slate-800">
                {d}
              </div>
            ))}
          </div>

          {/* Time Slots Rows */}
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {timeSlots.map(time => (
              <div key={time} className="grid grid-cols-7 min-h-[110px]">
                {daysOfWeek.map(day => {
                  const itemsInSlot = filteredItems.filter(item => item.day === day && item.time === time)

                  return (
                    <div
                      key={day}
                      className="p-2 border-r last:border-r-0 border-slate-100 dark:border-slate-800/80 flex flex-col gap-1.5 hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors"
                    >
                      <span className="text-[10px] text-slate-500 font-mono block mb-1">{time}</span>
                      {itemsInSlot.map(slot => {
                        const t = teachers.find(teach => teach.id === slot.teacherId)

                        return (
                          <div
                            key={slot.id}
                            className="p-2.5 rounded-xl bg-blue-600/10 border border-blue-500/20 hover:border-blue-500 transition-all text-xs"
                          >
                            <h5 className="font-bold text-slate-900 dark:text-blue-400 leading-tight">
                              {slot.groupName}
                            </h5>
                            <p className="text-[10px] text-slate-400 mt-0.5">{t?.name}</p>
                            <span className="inline-block mt-1 text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                              {slot.room}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Schedule Add Modal with Conflict Warning */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Yangi dars jadvalini qo'shish"
        subtitle="To'qnashuvlarni tekshirish bilan"
      >
        <form onSubmit={handleAddSchedule} className="space-y-4">
          {conflictError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span>{conflictError}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Guruh yoki mashg'ulot nomi *</label>
            <input
              type="text"
              required
              value={newEvent.name}
              onChange={e => setNewEvent({ ...newEvent, name: e.target.value })}
              placeholder="Masalan: F-24 (React Pro)"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">O'qituvchi</label>
              <select
                value={newEvent.teacherId}
                onChange={e => setNewEvent({ ...newEvent, teacherId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
              >
                {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Xona</label>
              <select
                value={newEvent.room}
                onChange={e => setNewEvent({ ...newEvent, room: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
              >
                {rooms.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Hafta kuni</label>
              <select
                value={newEvent.day}
                onChange={e => setNewEvent({ ...newEvent, day: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
              >
                {daysOfWeek.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Vaqti</label>
              <select
                value={newEvent.time}
                onChange={e => setNewEvent({ ...newEvent, time: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
              >
                {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs"
            >
              Jadvalga kiritish
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
