import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useData } from '../store/DataContext'
import { useUI } from '../store/UIContext'
import { useTable } from '../hooks/useTable'
import { Badge } from '../components/common/Badge'
import { Avatar } from '../components/common/Avatar'
import { ConfirmDialog } from '../components/common/ConfirmDialog'
import { StudentFormModal } from '../components/students/StudentFormModal'
import { StudentImportModal } from '../components/students/StudentImportModal'
import { formatDate } from '../utils/formatters'
import {
  UserPlus,
  Search,
  Filter,
  Download,
  Upload,
  Trash2,
  Edit,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  CheckSquare
} from 'lucide-react'

export function Students() {
  const { students, courses, groups, deleteStudent, bulkDeleteStudents, bulkUpdateStudentStatus } = useData()
  const { t } = useUI()

  // Modals state
  const [formModalOpen, setFormModalOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [importModalOpen, setImportModalOpen] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [studentToDelete, setStudentToDelete] = useState(null)

  // Table management hook
  const {
    search,
    setSearch,
    filters,
    setFilter,
    resetFilters,
    sortBy,
    sortDirection,
    handleSort,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages,
    totalItems,
    data: paginatedStudents,
    allFilteredData,
    selectedIds,
    toggleSelectAll,
    toggleSelectOne,
    setSelectedIds
  } = useTable({
    data: students,
    initialPageSize: 10,
    searchKeys: ['name', 'phone', 'email', 'courseName', 'groupName']
  })

  // Export to CSV
  const handleExportCSV = () => {
    const headers = 'ID,Ism,Telefon,Kurs,Guruh,Status,To‘lov,Sana\n'
    const rows = allFilteredData.map(s =>
      `"${s.id}","${s.name}","${s.phone}","${s.courseName}","${s.groupName}","${s.status}","${s.paymentStatus}","${s.joinedDate}"`
    ).join('\n')

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `students_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Handle Bulk Status Update
  const handleBulkStatus = (newStatus) => {
    if (selectedIds.length === 0) return
    bulkUpdateStudentStatus(selectedIds, newStatus)
    setSelectedIds([])
  }

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return
    bulkDeleteStudents(selectedIds)
    setSelectedIds([])
  }

  return (
    <div className="space-y-5 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {t('studentsList')}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {t('totalLabel')} {students.length} {t('totalStudentsRegistered')}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={() => setImportModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-white hover:bg-slate-700 text-xs font-semibold border border-slate-300 dark:border-slate-700 transition-colors"
          >
            <Upload className="w-3.5 h-3.5" /> {t('csvImport')}
          </button>
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-white hover:bg-slate-700 text-xs font-semibold border border-slate-300 dark:border-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> {t('csvExport')}
          </button>
          <button
            onClick={() => { setSelectedStudent(null); setFormModalOpen(true); }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/30 transition-all"
          >
            <UserPlus className="w-3.5 h-3.5" /> {t('newStudent')}
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#111A2E] border border-slate-200 dark:border-[#1E293B] shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="lg:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t('searchStudents')}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Kurs filter */}
          <div>
            <select
              value={filters.courseId || 'ALL'}
              onChange={e => setFilter('courseId', e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">{t('allCourses')}</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          {/* Status filter */}
          <div>
            <select
              value={filters.status || 'ALL'}
              onChange={e => setFilter('status', e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">{t('allStatuses')}</option>
              <option value="Active">{t('Active')}</option>
              <option value="Frozen">{t('Frozen')}</option>
              <option value="Graduated">{t('Graduated')}</option>
              <option value="Dropped">{t('Dropped')}</option>
            </select>
          </div>

          {/* To'lov filter */}
          <div>
            <select
              value={filters.paymentStatus || 'ALL'}
              onChange={e => setFilter('paymentStatus', e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">{t('paymentStatusAll')}</option>
              <option value="Paid">{t('Paid')}</option>
              <option value="Pending">{t('Pending')}</option>
              <option value="Debt">{t('Debt')}</option>
            </select>
          </div>
        </div>

        {/* Bulk Action Bar (when items selected) */}
        {selectedIds.length > 0 && (
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-blue-600/10 border border-blue-500/20 text-xs text-blue-400 animate-fade-in">
            <span className="font-semibold">
              {selectedIds.length} {t('selectedStudents')}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleBulkStatus('Active')}
                className="px-2.5 py-1 rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 transition-colors font-medium"
              >
                {t('makeActive')}
              </button>
              <button
                onClick={() => handleBulkStatus('Frozen')}
                className="px-2.5 py-1 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 transition-colors font-medium"
              >
                {t('freeze')}
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-2.5 py-1 rounded-lg bg-rose-600/20 text-rose-400 hover:bg-rose-600/30 transition-colors font-medium flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> {t('delete')}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Students Table */}
      <div className="bg-white dark:bg-[#111A2E] border border-slate-200 dark:border-[#1E293B] rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-[#0B1220]/60 border-b border-slate-200 dark:border-[#1E293B] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
              <tr>
                <th className="p-4 w-10">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === paginatedStudents.length && paginatedStudents.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-0"
                  />
                </th>
                <th className="p-4 cursor-pointer hover:text-white" onClick={() => handleSort('name')}>
                  <div className="flex items-center gap-1">
                    {t('studentCol')}
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </div>
                </th>
                <th className="p-4">{t('phoneCol')}</th>
                <th className="p-4">{t('courseGroupCol')}</th>
                <th className="p-4">{t('statusCol')}</th>
                <th className="p-4">{t('paymentCol')}</th>
                <th className="p-4 cursor-pointer hover:text-white" onClick={() => handleSort('joinedDate')}>
                  <div className="flex items-center gap-1">
                    {t('dateCol')}
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </div>
                </th>
                <th className="p-4 text-right">{t('actionsCol')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-slate-400">
                    {t('studentNotFound')}
                  </td>
                </tr>
              ) : (
                paginatedStudents.map(student => (
                  <tr
                    key={student.id}
                    className="hover:bg-slate-50 dark:hover:bg-[#162238]/50 transition-colors"
                  >
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(student.id)}
                        onChange={() => toggleSelectOne(student.id)}
                        className="rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-0"
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar src={student.avatar} name={student.name} size="md" />
                        <div>
                          <Link
                            to={`/students/${student.id}`}
                            className="font-bold text-slate-900 dark:text-white hover:text-blue-400 transition-colors block"
                          >
                            {student.name}
                          </Link>
                          <span className="text-[11px] text-slate-400">{student.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-slate-300">{student.phone}</td>
                    <td className="p-4">
                      <p className="font-semibold text-slate-900 dark:text-white">{student.courseName}</p>
                      <span className="text-[11px] text-blue-400 font-mono">{student.groupName}</span>
                    </td>
                    <td className="p-4">
                      <Badge variant={student.status}>{t(student.status) || student.status}</Badge>
                    </td>
                    <td className="p-4">
                      <Badge variant={student.paymentStatus}>{t(student.paymentStatus) || student.paymentStatus}</Badge>
                    </td>
                    <td className="p-4 text-slate-400">{formatDate(student.joinedDate)}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/students/${student.id}`}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                          title={t('details')}
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => { setSelectedStudent(student); setFormModalOpen(true); }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                          title={t('edit')}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => { setStudentToDelete(student); setDeleteConfirmOpen(true); }}
                          className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                          title={t('delete')}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-[#1E293B] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span>{t('rowsPerPage')}:</span>
            <select
              value={pageSize}
              onChange={e => setPageSize(Number(e.target.value))}
              className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
            <span>{t('totalLabel')}: {totalItems}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-800 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 font-semibold text-white">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-800 disabled:opacity-40 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Add / Edit Student Modal */}
      <StudentFormModal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        student={selectedStudent}
      />

      {/* CSV Import Modal */}
      <StudentImportModal
        isOpen={importModalOpen}
        onClose={() => setImportModalOpen(false)}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={() => {
          if (studentToDelete) deleteStudent(studentToDelete.id)
        }}
        title={t('deleteStudentConfirm')}
        message={`"${studentToDelete?.name}" ${t('deleteStudentMessage')}`}
      />
    </div>
  )
}
