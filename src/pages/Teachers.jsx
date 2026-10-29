import React, { useState } from 'react'
import { useData } from '../store/DataContext'
import { useUI } from '../store/UIContext'
import { Avatar } from '../components/common/Avatar'
import { Modal } from '../components/common/Modal'
import { ConfirmDialog } from '../components/common/ConfirmDialog'
import { formatCurrency } from '../utils/formatters'
import {
  UserCheck,
  Plus,
  Phone,
  BookOpen,
  Users,
  DollarSign,
  Edit,
  Trash2,
  Search,
  Percent,
  Briefcase
} from 'lucide-react'

export function Teachers() {
  const { teachers, groups, students, api, refreshData } = useData()
  const { currency, addToast } = useUI()

  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTeacher, setEditingTeacher] = useState(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [teacherToDelete, setTeacherToDelete] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    specialty: '',
    phone: '',
    salaryType: 'percentage', // percentage | fixed
    rate: 45,
    avatar: ''
  })

  const openAddModal = () => {
    setEditingTeacher(null)
    setFormData({
      name: '',
      specialty: 'Frontend / React',
      phone: '+998 90 ',
      salaryType: 'percentage',
      rate: 45,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120'
    })
    setModalOpen(true)
  }

  const openEditModal = (t) => {
    setEditingTeacher(t)
    setFormData({
      name: t.name,
      specialty: t.specialty,
      phone: t.phone,
      salaryType: t.salaryType,
      rate: t.rate,
      avatar: t.avatar
    })
    setModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingTeacher) {
        await api.teachers.update(editingTeacher.id, formData)
        addToast({ type: 'success', title: 'Yangilandi', message: 'O\'qituvchi muvaffaqiyatli yangilandi' })
      } else {
        await api.teachers.create(formData)
        addToast({ type: 'success', title: 'Qo\'shildi', message: 'Yangi o\'qituvchi muvaffaqiyatli qo\'shildi' })
      }
      setModalOpen(false)
      refreshData()
    } catch (err) {
      addToast({ type: 'error', title: 'Xatolik', message: err.message })
    }
  }

  const handleDelete = async () => {
    if (!teacherToDelete) return
    try {
      await api.teachers.delete(teacherToDelete.id)
      addToast({ type: 'success', title: 'O\'chirildi', message: 'O\'qituvchi tizimdan olib tashlandi' })
      refreshData()
    } catch (err) {
      addToast({ type: 'error', title: 'Xatolik', message: err.message })
    }
  }

  const filteredTeachers = teachers.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.specialty.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            O'qituvchilar va Mentorlar
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Jami {teachers.length} ta tajribali mutaxassis va ish haqi hisob-kitoblari
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/30 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Yangi o'qituvchi
        </button>
      </div>

      {/* Search Input */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#111A2E] border border-slate-200 dark:border-[#1E293B] shadow-sm flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="O'qituvchini ismi yoki mutaxassisligi bo'yicha qidirish..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Teachers Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeachers.map(teacher => {
          const teacherGroups = groups.filter(g => g.teacherId === teacher.id)
          const teacherStudentsCount = teacher.studentsCount || (teacherGroups.length * 15)

          // Approximate salary calculation
          const calculatedSalary = teacher.salaryType === 'percentage'
            ? teacherStudentsCount * 1400000 * (teacher.rate / 100)
            : teacher.rate

          return (
            <div
              key={teacher.id}
              className="group p-6 rounded-2xl bg-white dark:bg-[#111A2E] border border-slate-200 dark:border-[#1E293B] shadow-sm hover:shadow-xl hover:border-blue-500/30 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <Avatar src={teacher.avatar} name={teacher.name} size="lg" />
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-400 transition-colors">
                        {teacher.name}
                      </h3>
                      <p className="text-xs text-blue-400 font-medium">{teacher.specialty}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(teacher)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      title="Tahrirlash"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => { setTeacherToDelete(teacher); setDeleteConfirmOpen(true); }}
                      className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                      title="O'chirish"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-blue-400" /> Telefon:</span>
                    <span className="font-mono text-white">{teacher.phone}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5 text-purple-400" /> Guruhlari:</span>
                    <span className="font-semibold text-white">{teacherGroups.length || teacher.groupsCount} ta guruh</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-emerald-400" /> O'quvchilari:</span>
                    <span className="font-semibold text-white">{teacherStudentsCount} nafar</span>
                  </div>
                </div>
              </div>

              {/* Salary Section */}
              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-slate-50 dark:bg-[#0B1220]/60 -mx-6 -mb-6 p-4 rounded-b-2xl">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block font-semibold">
                    Maosh turi ({teacher.salaryType === 'percentage' ? `${teacher.rate}% foiz` : 'Fiksa'})
                  </span>
                  <span className="text-sm font-bold text-emerald-400">
                    ~{formatCurrency(calculatedSalary, currency)}
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  {teacher.salaryType === 'percentage' ? 'Ulushda' : 'Fiksa'}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Add / Edit Teacher Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingTeacher ? "O'qituvchini tahrirlash" : "Yangi o'qituvchi qo'shish"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">To'liq ismi *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="Masalan: Sardor Rahimov"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Mutaxassislik yo'nalishi *</label>
            <input
              type="text"
              required
              value={formData.specialty}
              onChange={e => setFormData({ ...formData, specialty: e.target.value })}
              placeholder="Masalan: Senior React / Next.js Mentor"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Telefon raqami *</label>
            <input
              type="text"
              required
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+998 90 123 45 67"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Maosh formati</label>
              <select
                value={formData.salaryType}
                onChange={e => setFormData({ ...formData, salaryType: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
              >
                <option value="percentage">Foiz ulushi (%)</option>
                <option value="fixed">Fiksatlangan maosh (so'm)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {formData.salaryType === 'percentage' ? 'Foiz stavkasi (%)' : 'Oylik summa (so\'m)'}
              </label>
              <input
                type="number"
                required
                value={formData.rate}
                onChange={e => setFormData({ ...formData, rate: Number(e.target.value) })}
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
        title="O'qituvchini o'chirish"
        message={`"${teacherToDelete?.name}" tizimdan o'chiriladi.`}
      />
    </div>
  )
}
