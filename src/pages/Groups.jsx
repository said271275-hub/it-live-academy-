import React, { useState } from 'react'
import { useData } from '../store/DataContext'
import { Modal } from '../components/common/Modal'
import { ConfirmDialog } from '../components/common/ConfirmDialog'
import { Badge } from '../components/common/Badge'
import { Avatar } from '../components/common/Avatar'
import { formatDate } from '../utils/formatters'
import {
  FolderKanban,
  Plus,
  Users,
  Clock,
  Calendar,
  MapPin,
  Edit,
  Trash2,
  Search,
  UserCheck,
  UserPlus
} from 'lucide-react'

export function Groups() {
  const { groups, courses, teachers, students, api, refreshData } = useData()

  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingGroup, setEditingGroup] = useState(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [groupToDelete, setGroupToDelete] = useState(null)

  // Students list inside group modal
  const [viewStudentsGroup, setViewStudentsGroup] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    courseId: courses[0]?.id || '',
    teacherId: teachers[0]?.id || '',
    days: 'Du-Chor-Jum',
    time: '14:00 - 16:00',
    room: 'Xona 101',
    capacity: 16,
    status: 'Active',
    startDate: '2026-11-01',
    endDate: '2027-05-01'
  })

  const openAddModal = () => {
    setEditingGroup(null)
    setFormData({
      name: '',
      courseId: courses[0]?.id || '',
      teacherId: teachers[0]?.id || '',
      days: 'Du-Chor-Jum',
      time: '14:00 - 16:00',
      room: 'Xona 101',
      capacity: 16,
      status: 'Active',
      startDate: '2026-11-01',
      endDate: '2027-05-01'
    })
    setModalOpen(true)
  }

  const openEditModal = (g) => {
    setEditingGroup(g)
    setFormData({
      name: g.name,
      courseId: g.courseId,
      teacherId: g.teacherId,
      days: g.days,
      time: g.time,
      room: g.room,
      capacity: g.capacity || 16,
      status: g.status,
      startDate: g.startDate,
      endDate: g.endDate
    })
    setModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (editingGroup) {
      await api.groups.update(editingGroup.id, formData)
    } else {
      await api.groups.create(formData)
    }
    setModalOpen(false)
    refreshData()
  }

  const handleDelete = async () => {
    if (!groupToDelete) return
    await api.groups.delete(groupToDelete.id)
    refreshData()
  }

  const filteredGroups = groups.filter(g =>
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    g.room.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Guruhlar boshqaruvi
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Jami {groups.length} ta dars guruhi, sig'im va xonalar taqsimoti
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/30 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Yangi guruh ochish
        </button>
      </div>

      {/* Search Input */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#111A2E] border border-slate-200 dark:border-[#1E293B] shadow-sm">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Guruh nomi yoki xonani qidirish..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGroups.map(group => {
          const course = courses.find(c => c.id === group.courseId)
          const teacher = teachers.find(t => t.id === group.teacherId)
          const groupStudents = students.filter(s => s.groupId === group.id)
          const fillPercent = Math.round((groupStudents.length / (group.capacity || 16)) * 100)

          return (
            <div
              key={group.id}
              className="group p-6 rounded-2xl bg-white dark:bg-[#111A2E] border border-slate-200 dark:border-[#1E293B] shadow-sm hover:shadow-xl hover:border-blue-500/30 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <Badge variant={group.status}>{group.status}</Badge>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(group)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      title="Tahrirlash"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => { setGroupToDelete(group); setDeleteConfirmOpen(true); }}
                      className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                      title="O'chirish"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-400 transition-colors">
                  {group.name}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">{course?.name}</p>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="flex items-center gap-1.5"><UserCheck className="w-3.5 h-3.5 text-blue-400" /> Ustoz:</span>
                    <span className="font-semibold text-white">{teacher?.name || '-'}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-purple-400" /> Kunlar:</span>
                    <span className="text-white">{group.days}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-emerald-400" /> Vaqt:</span>
                    <span className="text-white font-mono">{group.time}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-amber-400" /> Xona:</span>
                    <span className="text-white">{group.room}</span>
                  </div>
                </div>

                {/* Capacity Progress */}
                <div className="mt-4">
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-400">To'lish darajasi:</span>
                    <span className="font-semibold text-blue-400">
                      {groupStudents.length} / {group.capacity || 16} ({fillPercent}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min(100, fillPercent)}%` }} />
                  </div>
                </div>
              </div>

              {/* View group students button */}
              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => setViewStudentsGroup(group)}
                  className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-blue-600 text-slate-800 dark:text-white hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <Users className="w-3.5 h-3.5" /> O'quvchilarni ko'rish ({groupStudents.length})
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal: View Group Students */}
      {viewStudentsGroup && (
        <Modal
          isOpen={!!viewStudentsGroup}
          onClose={() => setViewStudentsGroup(null)}
          title={`${viewStudentsGroup.name} guruhi o'quvchilari`}
          subtitle={`Jami ${students.filter(s => s.groupId === viewStudentsGroup.id).length} nafar o'quvchi`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-3">
            <div className="max-h-80 overflow-y-auto divide-y divide-slate-800">
              {students.filter(s => s.groupId === viewStudentsGroup.id).map(student => (
                <div key={student.id} className="py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar src={student.avatar} name={student.name} size="sm" />
                    <div>
                      <p className="text-xs font-bold text-white">{student.name}</p>
                      <p className="text-[11px] text-slate-400">{student.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={student.status}>{student.status}</Badge>
                    <Badge variant={student.paymentStatus}>{student.paymentStatus}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}

      {/* Add / Edit Group Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingGroup ? "Guruhni tahrirlash" : "Yangi guruh ochish"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Guruh nomi *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="Masalan: F-28 (React Advanced)"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Kurs</label>
              <select
                value={formData.courseId}
                onChange={e => setFormData({ ...formData, courseId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
              >
                {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">O'qituvchi</label>
              <select
                value={formData.teacherId}
                onChange={e => setFormData({ ...formData, teacherId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
              >
                {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Dars kunlari</label>
              <select
                value={formData.days}
                onChange={e => setFormData({ ...formData, days: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
              >
                <option value="Du-Chor-Jum">Du-Chor-Jum</option>
                <option value="Se-Pay-Shan">Se-Pay-Shan</option>
                <option value="Har kuni">Har kuni</option>
                <option value="Shanba-Yakshanba">Shanba-Yakshanba</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Dars vaqti</label>
              <input
                type="text"
                value={formData.time}
                onChange={e => setFormData({ ...formData, time: e.target.value })}
                placeholder="14:00 - 16:00"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Xona</label>
              <input
                type="text"
                value={formData.room}
                onChange={e => setFormData({ ...formData, room: e.target.value })}
                placeholder="Xona 101"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
              />
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
              Saqlash
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Guruhni o'chirish"
        message={`"${groupToDelete?.name}" guruhi tizimdan o'chiriladi.`}
      />
    </div>
  )
}
