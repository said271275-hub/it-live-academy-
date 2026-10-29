import React, { useState } from 'react'
import { Modal } from '../common/Modal'
import { useData } from '../../store/DataContext'
import { useUI } from '../../store/UIContext'

export function QuickStudentModal({ isOpen, onClose }) {
  const { addStudent, courses, groups } = useData()
  const { t } = useUI()
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    courseId: courses[0]?.id || '',
    groupId: groups[0]?.id || '',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const selectedCourse = courses.find(c => c.id === formData.courseId)
    const selectedGroup = groups.find(g => g.id === formData.groupId)
    
    await addStudent({
      name: formData.name,
      phone: formData.phone,
      courseId: formData.courseId,
      courseName: selectedCourse?.name || '',
      groupId: formData.groupId,
      groupName: selectedGroup?.name || '',
      status: 'Active',
      paymentStatus: 'Pending',
      debtAmount: selectedCourse?.price || 0
    })
    setFormData({ name: '', phone: '', courseId: courses[0]?.id || '', groupId: groups[0]?.id || '' })
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('addStudentTitle')} subtitle={t('fillAllFields')}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">{t('name')} *</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            placeholder="Azizbek Karimov"
            className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-[#0B1220] border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">{t('phone')} *</label>
          <input
            type="text"
            required
            value={formData.phone}
            onChange={e => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+998 (90) 123-45-67"
            className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-[#0B1220] border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">{t('course')}</label>
            <select
              value={formData.courseId}
              onChange={e => setFormData({ ...formData, courseId: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-[#0B1220] border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
            >
              {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">{t('group')}</label>
            <select
              value={formData.groupId}
              onChange={e => setFormData({ ...formData, groupId: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-[#0B1220] border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
            >
              {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white">{t('cancel')}</button>
          <button type="submit" className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md">{t('save')}</button>
        </div>
      </form>
    </Modal>
  )
}

export function QuickPaymentModal({ isOpen, onClose }) {
  const { addPayment, students } = useData()
  const { t } = useUI()
  const [formData, setFormData] = useState({
    studentId: students[0]?.id || '',
    amount: '1200000',
    method: 'Payme',
    note: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const student = students.find(s => s.id === formData.studentId)
    await addPayment({
      studentId: formData.studentId,
      studentName: student?.name || 'Talaba',
      courseName: student?.courseName || 'Kurs',
      amount: Number(formData.amount),
      method: formData.method,
      note: formData.note || 'To‘lov'
    })
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('receivePayment')} subtitle={t('officialReceipt')}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">{t('studentCol')}</label>
          <select
            value={formData.studentId}
            onChange={e => setFormData({ ...formData, studentId: e.target.value })}
            className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-[#0B1220] border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
          >
            {students.length === 0 ? (
              <option value="">{t('studentNotFound')}</option>
            ) : (
              students.slice(0, 50).map(s => (
                <option key={s.id} value={s.id}>{s.name} - {s.courseName} ({t(s.paymentStatus) || s.paymentStatus})</option>
              ))
            )}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">{t('amount')} (so'm)</label>
            <input
              type="number"
              required
              value={formData.amount}
              onChange={e => setFormData({ ...formData, amount: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-[#0B1220] border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">{t('method')}</label>
            <select
              value={formData.method}
              onChange={e => setFormData({ ...formData, method: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-[#0B1220] border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
            >
              <option value="Payme">Payme</option>
              <option value="Click">Click</option>
              <option value="Naqd">Naqd pul</option>
              <option value="Karta">Bank kartasi</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white">{t('cancel')}</button>
          <button type="submit" className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md">{t('confirm')}</button>
        </div>
      </form>
    </Modal>
  )
}
