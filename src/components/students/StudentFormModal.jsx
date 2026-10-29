import React, { useState, useEffect } from 'react'
import { Modal } from '../common/Modal'
import { useData } from '../../store/DataContext'
import { formatPhone } from '../../utils/formatters'

export function StudentFormModal({ isOpen, onClose, student = null }) {
  const { addStudent, updateStudent, courses, groups } = useData()
  const isEdit = !!student

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    courseId: '',
    groupId: '',
    status: 'Active',
    paymentStatus: 'Pending',
    city: 'Toshkent',
    notes: ''
  })

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name || '',
        phone: student.phone || '',
        email: student.email || '',
        courseId: student.courseId || courses[0]?.id || '',
        groupId: student.groupId || groups[0]?.id || '',
        status: student.status || 'Active',
        paymentStatus: student.paymentStatus || 'Pending',
        city: student.city || 'Toshkent',
        notes: student.notes || ''
      })
    } else {
      setFormData({
        name: '',
        phone: '+998 ',
        email: '',
        courseId: courses[0]?.id || '',
        groupId: groups[0]?.id || '',
        status: 'Active',
        paymentStatus: 'Pending',
        city: 'Toshkent',
        notes: ''
      })
    }
  }, [student, courses, groups, isOpen])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const selectedCourse = courses.find(c => c.id === formData.courseId)
    const selectedGroup = groups.find(g => g.id === formData.groupId)

    const payload = {
      ...formData,
      courseName: selectedCourse?.name || '',
      groupName: selectedGroup?.name || '',
      debtAmount: formData.paymentStatus === 'Debt' ? (selectedCourse?.price || 1200000) : 0
    }

    if (isEdit) {
      await updateStudent(student.id, payload)
    } else {
      await addStudent(payload)
    }
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "O'quvchini tahrirlash" : "Yangi o'quvchi qo'shish"}
      subtitle="Barcha maydonlarni to'ldiring"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">F.I.SH (To'liq ism) *</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            placeholder="Azizbek Karimov"
            className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-[#0B1220] border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Telefon raqami *</label>
            <input
              type="text"
              required
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+998 90 123 45 67"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-[#0B1220] border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Elektron pochta</label>
            <input
              type="email"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              placeholder="azizbek@gmail.com"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-[#0B1220] border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Kurs *</label>
            <select
              value={formData.courseId}
              onChange={e => setFormData({ ...formData, courseId: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-[#0B1220] border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
            >
              {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Guruh *</label>
            <select
              value={formData.groupId}
              onChange={e => setFormData({ ...formData, groupId: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-[#0B1220] border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
            >
              {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Status</label>
            <select
              value={formData.status}
              onChange={e => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-[#0B1220] border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
            >
              <option value="Active">Active (Faol)</option>
              <option value="Frozen">Frozen (Muzlatilgan)</option>
              <option value="Graduated">Graduated (Bitirgan)</option>
              <option value="Dropped">Dropped (Tark etgan)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">To'lov holati</label>
            <select
              value={formData.paymentStatus}
              onChange={e => setFormData({ ...formData, paymentStatus: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-[#0B1220] border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
            >
              <option value="Paid">To'langan (Paid)</option>
              <option value="Pending">Kutilmoqda (Pending)</option>
              <option value="Debt">Qarzdor (Debt)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Shahar</label>
            <input
              type="text"
              value={formData.city}
              onChange={e => setFormData({ ...formData, city: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-[#0B1220] border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Qo'shimcha izoh</label>
          <textarea
            rows="2"
            value={formData.notes}
            onChange={e => setFormData({ ...formData, notes: e.target.value })}
            placeholder="O'quvchi haqida qo'shimcha ma'lumot..."
            className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-[#0B1220] border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
          >
            Bekor qilish
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shadow-blue-600/30"
          >
            {isEdit ? "O'zgarishlarni saqlash" : "Qo'shish"}
          </button>
        </div>
      </form>
    </Modal>
  )
}
