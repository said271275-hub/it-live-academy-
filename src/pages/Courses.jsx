import React, { useState } from 'react'
import { useData } from '../store/DataContext'
import { useUI } from '../store/UIContext'
import { Modal } from '../components/common/Modal'
import { ConfirmDialog } from '../components/common/ConfirmDialog'
import { formatCurrency } from '../utils/formatters'
import {
  GraduationCap,
  Plus,
  LayoutGrid,
  List,
  Search,
  Users,
  Clock,
  Edit,
  Trash2,
  DollarSign,
  UserCheck
} from 'lucide-react'

export function Courses() {
  const { courses, teachers, students, api, refreshData } = useData()
  const { currency, addToast } = useUI()

  const [viewMode, setViewMode] = useState('grid') // grid | list
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('ALL')

  // Modals
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [courseToDelete, setCourseToDelete] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    category: 'Development',
    price: 1500000,
    duration: '6 oy',
    lessonsCount: 72,
    mentorId: teachers[0]?.id || '',
    color: '#3B82F6'
  })

  const openAddModal = () => {
    setEditingCourse(null)
    setFormData({
      name: '',
      category: 'Development',
      price: 1500000,
      duration: '6 oy',
      lessonsCount: 72,
      mentorId: teachers[0]?.id || '',
      color: '#3B82F6'
    })
    setModalOpen(true)
  }

  const openEditModal = (c) => {
    setEditingCourse(c)
    setFormData({
      name: c.name,
      category: c.category,
      price: c.price,
      duration: c.duration,
      lessonsCount: c.lessonsCount || 48,
      mentorId: c.mentorId || teachers[0]?.id || '',
      color: c.color || '#3B82F6'
    })
    setModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingCourse) {
        await api.courses.update(editingCourse.id, formData)
        addToast({ type: 'success', title: 'Yangilandi', message: 'Kurs muvaffaqiyatli yangilandi' })
      } else {
        await api.courses.create(formData)
        addToast({ type: 'success', title: 'Qo\'shildi', message: 'Yangi kurs muvaffaqiyatli qo\'shildi' })
      }
      setModalOpen(false)
      refreshData()
    } catch (err) {
      addToast({ type: 'error', title: 'Xatolik', message: err.message })
    }
  }

  const handleDelete = async () => {
    if (!courseToDelete) return
    try {
      await api.courses.delete(courseToDelete.id)
      addToast({ type: 'success', title: 'O\'chirildi', message: 'Kurs tizimdan olib tashlandi' })
      refreshData()
    } catch (err) {
      addToast({ type: 'error', title: 'Xatolik', message: err.message })
    }
  }

  // Filtered courses
  const filteredCourses = courses.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase())
    const matchCategory = selectedCategory === 'ALL' || c.category === selectedCategory
    return matchSearch && matchCategory
  })

  const categories = ['ALL', 'Development', 'Design', 'Marketing', 'Language', 'Basic', 'Security', 'Science']

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            O'quv kurslari
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Barcha professional ta'lim yo'nalishlari va dasturlar
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/30 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Yangi kurs qo'shish
        </button>
      </div>

      {/* Controls: Search, Category Pills, View Mode */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#111A2E] border border-slate-200 dark:border-[#1E293B] shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Kurslarni qidirish..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat === 'ALL' ? 'Barchasi' : cat}
            </button>
          ))}
        </div>

        {/* Grid / List Toggle */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-[#0B1220] rounded-xl border border-slate-200 dark:border-slate-800 self-end md:self-auto">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
            title="Katak ko'rinishi"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
            title="Ro'yxat ko'rinishi"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => {
            const mentor = teachers.find(t => t.id === course.mentorId)
            const enrolledStudents = students.filter(s => s.courseId === course.id).length || course.studentsCount || 24
            const capacityPercentage = Math.min(100, Math.round((enrolledStudents / 50) * 100))

            return (
              <div
                key={course.id}
                className="group p-6 rounded-2xl bg-white dark:bg-[#111A2E] border border-slate-200 dark:border-[#1E293B] shadow-sm hover:shadow-xl hover:border-blue-500/30 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {course.category}
                    </span>
                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEditModal(course)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                        title="Tahrirlash"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => { setCourseToDelete(course); setDeleteConfirmOpen(true); }}
                        className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                        title="O'chirish"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-400 transition-colors">
                    {course.name}
                  </h3>

                  <div className="mt-3 flex items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-blue-400" /> {course.duration}</span>
                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-emerald-400" /> {enrolledStudents} o'quvchi</span>
                  </div>

                  {mentor && (
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2.5 text-xs text-slate-300">
                      <UserCheck className="w-4 h-4 text-purple-400 shrink-0" />
                      <span className="text-slate-400">Ustoz:</span>
                      <span className="font-semibold text-white">{mentor.name}</span>
                    </div>
                  )}

                  {/* Capacity Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-[11px] mb-1 text-slate-400">
                      <span>To'lish foizi</span>
                      <span className="font-semibold text-blue-400">{capacityPercentage}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${capacityPercentage}%` }} />
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block font-medium">Oylik to'lov</span>
                    <span className="text-sm font-bold text-emerald-400">
                      {formatCurrency(course.price, currency)}
                    </span>
                  </div>
                  <button
                    onClick={() => openEditModal(course)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 text-white text-xs font-semibold transition-colors"
                  >
                    Batafsil
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* List View */
        <div className="bg-white dark:bg-[#111A2E] border border-slate-200 dark:border-[#1E293B] rounded-2xl shadow-sm overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-[#0B1220]/60 border-b border-slate-200 dark:border-[#1E293B] text-slate-400 font-semibold uppercase">
              <tr>
                <th className="p-4">Kurs nomi</th>
                <th className="p-4">Kategoriya</th>
                <th className="p-4">Davomiyligi</th>
                <th className="p-4">O'qituvchi</th>
                <th className="p-4">O'quvchilar</th>
                <th className="p-4">Narxi</th>
                <th className="p-4 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredCourses.map(c => {
                const mentor = teachers.find(t => t.id === c.mentorId)
                return (
                  <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-bold text-white">{c.name}</td>
                    <td className="p-4"><span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400">{c.category}</span></td>
                    <td className="p-4 text-slate-300">{c.duration}</td>
                    <td className="p-4 text-slate-300">{mentor?.name || '-'}</td>
                    <td className="p-4 text-slate-300">{c.studentsCount || 20} ta</td>
                    <td className="p-4 font-bold text-emerald-400">{formatCurrency(c.price, currency)}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button onClick={() => openEditModal(c)} className="p-1.5 text-slate-400 hover:text-white"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => { setCourseToDelete(c); setDeleteConfirmOpen(true); }} className="p-1.5 text-rose-400 hover:text-rose-300"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Course Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCourse ? "Kursni tahrirlash" : "Yangi kurs qo'shish"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Kurs nomi *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="Masalan: Full-Stack React & Node.js"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Kategoriya</label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
              >
                {categories.filter(c => c !== 'ALL').map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Narxi (oylik)</label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Davomiyligi</label>
              <input
                type="text"
                value={formData.duration}
                onChange={e => setFormData({ ...formData, duration: e.target.value })}
                placeholder="6 oy"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">O'qituvchi</label>
              <select
                value={formData.mentorId}
                onChange={e => setFormData({ ...formData, mentorId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
              >
                {teachers.map(t => (
                  <option key={t.id} value={t.id}>{t.name} ({t.specialty})</option>
                ))}
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
        title="Kursni o'chirish"
        message={`"${courseToDelete?.name}" kursi tizimdan o'chiriladi.`}
      />
    </div>
  )
}
