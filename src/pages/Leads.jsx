import React, { useState } from 'react'
import { useData } from '../store/DataContext'
import { useUI } from '../store/UIContext'
import { Modal } from '../components/common/Modal'
import { formatDate } from '../utils/formatters'
import {
  Target,
  Plus,
  Phone,
  Calendar,
  UserCheck,
  Trash2,
  Sparkles,
  ArrowRight,
  MoveRight
} from 'lucide-react'

export function Leads() {
  const { leads, courses, groups, addLead, updateLeadStage, convertLeadToStudent, api, refreshData } = useData()
  const { t } = useUI()

  const [addModalOpen, setAddModalOpen] = useState(false)
  const [convertModalOpen, setConvertModalOpen] = useState(false)
  const [leadToConvert, setLeadToConvert] = useState(null)
  const [targetGroupId, setTargetGroupId] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    phone: '+998 ',
    courseId: courses[0]?.id || '',
    source: 'Instagram',
    nextCallDate: new Date().toISOString().split('T')[0],
    notes: ''
  })

  // Drag & drop state
  const [draggedLeadId, setDraggedLeadId] = useState(null)

  const columns = [
    { id: 'new', title: t('stageNew'), color: 'border-blue-500/40 text-blue-400 bg-blue-500/5' },
    { id: 'contacted', title: t('stageContacted'), color: 'border-purple-500/40 text-purple-400 bg-purple-500/5' },
    { id: 'trial', title: t('stageTrial'), color: 'border-amber-500/40 text-amber-400 bg-amber-500/5' },
    { id: 'waiting_payment', title: t('stageWaitingPayment'), color: 'border-orange-500/40 text-orange-400 bg-orange-500/5' },
    { id: 'converted', title: t('stageConverted'), color: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/5' },
    { id: 'rejected', title: t('stageRejected'), color: 'border-rose-500/40 text-rose-400 bg-rose-500/5' }
  ]

  const handleDragStart = (e, id) => {
    setDraggedLeadId(id)
    e.dataTransfer.setData('text/plain', id)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e, stageId) => {
    e.preventDefault()
    const id = e.dataTransfer.getData('text/plain') || draggedLeadId
    if (id) {
      updateLeadStage(id, stageId)
      setDraggedLeadId(null)
    }
  }

  const handleCreateLead = async (e) => {
    e.preventDefault()
    const selectedCourse = courses.find(c => c.id === formData.courseId)
    await addLead({
      ...formData,
      courseName: selectedCourse?.name || ''
    })
    setAddModalOpen(false)
  }

  const handleConvert = async () => {
    if (!leadToConvert) return
    await convertLeadToStudent(leadToConvert.id, targetGroupId || groups[0]?.id)
    setConvertModalOpen(false)
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Leads (Sotuv voronkasi)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Murojaatlarni boshqarish va o'quvchiga aylantirish (Kanban doskasi)
          </p>
        </div>

        <button
          onClick={() => setAddModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/30 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Yangi lead qo'shish
        </button>
      </div>

      {/* Kanban Board Container */}
      <div className="flex gap-4 overflow-x-auto pb-6 min-h-[calc(100vh-250px)] select-none">
        {columns.map(col => {
          const colLeads = leads.filter(l => l.stage === col.id)

          return (
            <div
              key={col.id}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.id)}
              className="flex-shrink-0 w-80 rounded-2xl bg-white dark:bg-[#111A2E] border border-slate-200 dark:border-[#1E293B] shadow-sm flex flex-col"
            >
              {/* Column Header */}
              <div className={`p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between rounded-t-2xl ${col.color}`}>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-current" />
                  <h3 className="font-bold text-xs uppercase tracking-wider">{col.title}</h3>
                </div>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-white/10">
                  {colLeads.length}
                </span>
              </div>

              {/* Cards List */}
              <div className="p-3 flex-1 space-y-3 overflow-y-auto max-h-[70vh]">
                {colLeads.length === 0 ? (
                  <div className="h-32 flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800/80 rounded-xl text-xs text-slate-500">
                    Lead yo'q
                  </div>
                ) : (
                  colLeads.map(lead => (
                    <div
                      key={lead.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, lead.id)}
                      className="group p-4 rounded-xl bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-[#1E293B] hover:border-blue-500/40 shadow-sm cursor-grab active:cursor-grabbing transition-all space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                          {lead.name}
                        </h4>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-400 shrink-0">
                          {lead.source}
                        </span>
                      </div>

                      <p className="text-[11px] font-medium text-blue-400">
                        {lead.courseName}
                      </p>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                        <span className="flex items-center gap-1 font-mono">
                          <Phone className="w-3 h-3 text-slate-500" /> {lead.phone}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-500" /> {formatDate(lead.nextCallDate, 'dd.MM')}
                        </span>
                      </div>

                      {lead.notes && (
                        <p className="text-[10px] text-slate-500 line-clamp-2 italic bg-slate-100 dark:bg-slate-900/40 p-1.5 rounded-lg">
                          "{lead.notes}"
                        </p>
                      )}

                      {/* Convert to Student Button */}
                      {col.id !== 'converted' && col.id !== 'rejected' && (
                        <button
                          onClick={() => { setLeadToConvert(lead); setConvertModalOpen(true); }}
                          className="w-full mt-2 py-1.5 rounded-lg bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 text-[11px] font-bold border border-emerald-500/20 flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <UserCheck className="w-3.5 h-3.5" /> O'quvchiga aylantirish
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Add Lead Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Yangi Lead qo'shish"
        subtitle="Murojaat qiluvchi ma'lumotlari"
      >
        <form onSubmit={handleCreateLead} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">To'liq ismi *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="Masalan: Sardor Komilov"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Telefon raqami *</label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+998 90 123 45 67"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Manba</label>
              <select
                value={formData.source}
                onChange={e => setFormData({ ...formData, source: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
              >
                <option value="Instagram">Instagram</option>
                <option value="Telegram">Telegram</option>
                <option value="Tavsiya">Tavsiya</option>
                <option value="Sayt">Sayt</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Qiziqqan kursi</label>
              <select
                value={formData.courseId}
                onChange={e => setFormData({ ...formData, courseId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
              >
                {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Qo'ng'iroq sanasi</label>
              <input
                type="date"
                value={formData.nextCallDate}
                onChange={e => setFormData({ ...formData, nextCallDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Izoh</label>
            <textarea
              rows="2"
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Qiziqishlari, so'ragan vaqtlari..."
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
            />
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
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs"
            >
              Qo'shish
            </button>
          </div>
        </form>
      </Modal>

      {/* Convert Lead to Student Modal */}
      <Modal
        isOpen={convertModalOpen}
        onClose={() => setConvertModalOpen(false)}
        title="Leadni o'quvchiga aylantirish"
        subtitle={`${leadToConvert?.name} ni guruhga biriktirish`}
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-300">
            Ushbu lead to'g'ridan-to'g'ri o'quvchilar bazasiga qo'shiladi va holati "Active" qilib belgilanadi.
          </p>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Biriktiriladigan guruh:</label>
            <select
              value={targetGroupId}
              onChange={e => setTargetGroupId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
            >
              {groups.map(g => (
                <option key={g.id} value={g.id}>{g.name} ({g.days} • {g.time})</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setConvertModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
            >
              Bekor qilish
            </button>
            <button
              type="button"
              onClick={handleConvert}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md shadow-emerald-600/30"
            >
              Aylantirish va Saqlash
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
