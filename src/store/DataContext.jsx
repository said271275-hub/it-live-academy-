import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { api } from '../services/api'
import { useUI } from './UIContext'

const DataContext = createContext(null)

export function DataProvider({ children }) {
  const { addToast } = useUI()
  const [loading, setLoading] = useState(true)
  const [students, setStudents] = useState([])
  const [courses, setCourses] = useState([])
  const [teachers, setTeachers] = useState([])
  const [groups, setGroups] = useState([])
  const [leads, setLeads] = useState([])
  const [payments, setPayments] = useState([])
  const [settings, setSettings] = useState(null)

  // Initial load
  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      const [sData, cData, tData, gData, lData, pData, setts] = await Promise.all([
        api.students.getAll(),
        api.courses.getAll(),
        api.teachers.getAll(),
        api.groups.getAll(),
        api.leads.getAll(),
        api.payments.getAll(),
        api.settings.get()
      ])
      setStudents(sData)
      setCourses(cData)
      setTeachers(tData)
      setGroups(gData)
      setLeads(lData)
      setPayments(pData)
      setSettings(setts)
    } catch (err) {
      console.error('Error fetching data:', err)
      addToast({ type: 'error', title: 'Xatolik', message: 'Ma‘lumotlarni yuklab bo‘lmadi' })
    } finally {
      setLoading(false)
    }
  }, [addToast])

  useEffect(() => {
    loadData()
  }, [loadData])

  // STUDENT ACTIONS
  const addStudent = async (data) => {
    try {
      const created = await api.students.create(data)
      setStudents(prev => [created, ...prev])
      addToast({ type: 'success', title: 'Muvaffaqiyatli', message: `${created.name} ro'yxatga qo'shildi` })
      return created
    } catch (e) {
      addToast({ type: 'error', title: 'Xato', message: e.message })
      throw e
    }
  }

  const updateStudent = async (id, updates) => {
    try {
      const updated = await api.students.update(id, updates)
      setStudents(prev => prev.map(s => s.id === id ? updated : s))
      addToast({ type: 'success', title: 'Muvaffaqiyatli', message: `O'quvchi ma'lumotlari yangilandi` })
      return updated
    } catch (e) {
      addToast({ type: 'error', title: 'Xato', message: e.message })
      throw e
    }
  }

  const deleteStudent = async (id) => {
    try {
      await api.students.delete(id)
      setStudents(prev => prev.filter(s => s.id !== id))
      addToast({ type: 'success', title: 'O‘chirildi', message: `O'quvchi tizimdan olib tashlandi` })
    } catch (e) {
      addToast({ type: 'error', title: 'Xato', message: e.message })
    }
  }

  const bulkDeleteStudents = async (ids) => {
    try {
      await api.students.bulkDelete(ids)
      setStudents(prev => prev.filter(s => !ids.includes(s.id)))
      addToast({ type: 'success', title: 'O‘chirildi', message: `${ids.length} ta o'quvchi o'chirildi` })
    } catch (e) {
      addToast({ type: 'error', title: 'Xato', message: e.message })
    }
  }

  const bulkUpdateStudentStatus = async (ids, status) => {
    try {
      await api.students.bulkUpdateStatus(ids, status)
      setStudents(prev => prev.map(s => ids.includes(s.id) ? { ...s, status } : s))
      addToast({ type: 'success', title: 'Yangilandi', message: `${ids.length} ta o'quvchi statusi o'zgardi` })
    } catch (e) {
      addToast({ type: 'error', title: 'Xato', message: e.message })
    }
  }

  // LEAD ACTIONS
  const addLead = async (data) => {
    try {
      const created = await api.leads.create(data)
      setLeads(prev => [created, ...prev])
      addToast({ type: 'success', title: 'Yangi Lead', message: `${created.name} qo'shildi` })
      return created
    } catch (e) {
      addToast({ type: 'error', title: 'Xato', message: e.message })
      throw e
    }
  }

  const updateLeadStage = async (id, stage) => {
    try {
      const updated = await api.leads.updateStage(id, stage)
      setLeads(prev => prev.map(l => l.id === id ? updated : l))
    } catch (e) {
      addToast({ type: 'error', title: 'Xato', message: e.message })
    }
  }

  const convertLeadToStudent = async (leadId, groupId) => {
    const lead = leads.find(l => l.id === leadId)
    if (!lead) return
    const group = groups.find(g => g.id === groupId) || groups[0]

    const newStudent = await addStudent({
      name: lead.name,
      phone: lead.phone,
      email: `${lead.name.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
      courseId: lead.courseId || group.courseId,
      courseName: lead.courseName || group.name,
      groupId: group.id,
      groupName: group.name,
      status: 'Active',
      paymentStatus: 'Pending',
      city: 'Toshkent'
    })

    await updateLeadStage(leadId, 'converted')
    addToast({ type: 'success', title: 'Konversiya!', message: `${lead.name} muvaffaqiyatli o'quvchiga aylandi` })
    return newStudent
  }

  // PAYMENT ACTIONS
  const addPayment = async (data) => {
    try {
      const payment = await api.payments.create(data)
      setPayments(prev => [payment, ...prev])

      // If studentId provided, update student payment status
      if (data.studentId) {
        setStudents(prev => prev.map(s => {
          if (s.id === data.studentId) {
            return {
              ...s,
              paymentStatus: 'Paid',
              debtAmount: Math.max(0, (s.debtAmount || 0) - Number(data.amount))
            }
          }
          return s
        }))
      }

      addToast({ type: 'success', title: 'To‘lov qabul qilindi', message: `${Number(data.amount).toLocaleString()} so'm kvitansiya №${payment.receiptNumber}` })
      return payment
    } catch (e) {
      addToast({ type: 'error', title: 'Xato', message: e.message })
      throw e
    }
  }

  // RESET & RESTORE
  const resetAllData = async () => {
    await api.resetAllData()
    await loadData()
    addToast({ type: 'info', title: 'Tiklandi', message: 'Barcha ma‘lumotlar demo holatiga qaytarildi' })
  }

  return (
    <DataContext.Provider
      value={{
        loading,
        students,
        courses,
        teachers,
        groups,
        leads,
        payments,
        settings,
        setSettings,
        addStudent,
        updateStudent,
        deleteStudent,
        bulkDeleteStudents,
        bulkUpdateStudentStatus,
        addLead,
        updateLeadStage,
        convertLeadToStudent,
        addPayment,
        resetAllData,
        refreshData: loadData
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}
