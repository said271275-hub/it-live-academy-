import React, { useState } from 'react'
import { Modal } from '../common/Modal'
import { useData } from '../../store/DataContext'
import { UploadCloud, FileSpreadsheet } from 'lucide-react'

export function StudentImportModal({ isOpen, onClose }) {
  const { addStudent, courses, groups } = useData()
  const [csvText, setCsvText] = useState('')
  const [error, setError] = useState('')

  const handleImport = async () => {
    try {
      setError('')
      const lines = csvText.trim().split('\n')
      if (lines.length < 2) {
        setError('CSV formati noto‘g‘ri. Kamida bitta sarlavha va bitta qator bo‘lishi kerak.')
        return
      }

      let importedCount = 0
      // Skip header line
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim()
        if (!line) continue
        const cols = line.split(',').map(c => c.trim().replace(/^"|"$/g, ''))
        const name = cols[0]
        const phone = cols[1] || '+998 90 000 00 00'
        const courseName = cols[2] || courses[0]?.name
        const groupName = cols[3] || groups[0]?.name

        const matchCourse = courses.find(c => c.name.toLowerCase().includes(courseName.toLowerCase())) || courses[0]
        const matchGroup = groups.find(g => g.name.toLowerCase().includes(groupName.toLowerCase())) || groups[0]

        if (name) {
          await addStudent({
            name,
            phone,
            email: `${name.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
            courseId: matchCourse?.id,
            courseName: matchCourse?.name,
            groupId: matchGroup?.id,
            groupName: matchGroup?.name,
            status: 'Active',
            paymentStatus: 'Pending',
            city: 'Toshkent'
          })
          importedCount++
        }
      }

      setCsvText('')
      onClose()
    } catch (e) {
      setError('Importda xatolik yuz berdi: ' + e.message)
    }
  }

  const loadSample = () => {
    setCsvText(`Ism,Telefon,Kurs,Guruh
Jasurbek Rustamov,+998 90 555 44 33,Frontend React,F-24 (React Pro)
Nilufar Karimova,+998 93 444 33 22,UI/UX & Product Design,UI-11 (UX & Figma)
Sardor Aliyev,+998 97 111 22 33,Backend Node.js,B-12 (Node Master)`)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="CSV orqali o'quvchilarni import qilish" maxWidth="max-w-xl">
      <div className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-400">
            CSV formatida ma'lumotlarni kiriting (vergul bilan ajratilgan):
          </p>
          <button
            type="button"
            onClick={loadSample}
            className="text-xs font-semibold text-blue-400 hover:underline"
          >
            Namunani to'ldirish
          </button>
        </div>

        <textarea
          rows="6"
          value={csvText}
          onChange={e => setCsvText(e.target.value)}
          placeholder={`Ism,Telefon,Kurs,Guruh\nAzizbek Karimov,+998 90 123 45 67,Frontend React,F-24 (React Pro)`}
          className="w-full font-mono text-xs p-3 rounded-xl bg-slate-100 dark:bg-[#0B1220] border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-200 focus:outline-none focus:border-blue-500"
        />

        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
          >
            Bekor qilish
          </button>
          <button
            type="button"
            onClick={handleImport}
            disabled={!csvText.trim()}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-xs shadow-md shadow-blue-600/30"
          >
            <UploadCloud className="w-4 h-4" /> Import qilish
          </button>
        </div>
      </div>
    </Modal>
  )
}
