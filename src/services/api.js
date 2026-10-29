import {
  COURSES_DATA,
  TEACHERS_DATA,
  GROUPS_DATA,
  generateInitialStudents,
  generateInitialLeads,
  generateInitialPayments,
  INITIAL_SETTINGS
} from '../data/mockData'

const STORAGE_KEYS = {
  STUDENTS: 'itlive_students_clean_v1',
  COURSES: 'itlive_courses_v1',
  TEACHERS: 'itlive_teachers_v1',
  GROUPS: 'itlive_groups_v1',
  LEADS: 'itlive_leads_v1',
  PAYMENTS: 'itlive_payments_v1',
  ATTENDANCE: 'itlive_attendance_v1',
  SETTINGS: 'itlive_settings_v1',
}

// LocalStorage helpers
function getStored(key, initialFn) {
  try {
    const data = localStorage.getItem(key)
    if (data) return JSON.parse(data)
    const initData = typeof initialFn === 'function' ? initialFn() : initialFn
    localStorage.setItem(key, JSON.stringify(initData))
    return initData
  } catch (err) {
    console.error(`Error loading key ${key}:`, err)
    return typeof initialFn === 'function' ? initialFn() : initialFn
  }
}

function setStored(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (err) {
    console.error(`Error storing key ${key}:`, err)
  }
}

// Initial attendance mock
function generateInitialAttendance() {
  const attendance = {}
  // group id -> date (YYYY-MM-DD) -> { [studentId]: 'present' | 'absent' | 'excused' | 'late' }
  const today = '2026-10-29'
  attendance['g-1'] = {
    [today]: {
      's-1': 'present',
      's-2': 'present',
      's-3': 'late',
      's-4': 'absent',
      's-5': 'excused'
    }
  }
  return attendance
}

// API Service Layer (Promises mimic real async backend API)
export const api = {
  // Reset all data to factory demo defaults
  async resetAllData() {
    localStorage.removeItem(STORAGE_KEYS.STUDENTS)
    localStorage.removeItem(STORAGE_KEYS.COURSES)
    localStorage.removeItem(STORAGE_KEYS.TEACHERS)
    localStorage.removeItem(STORAGE_KEYS.GROUPS)
    localStorage.removeItem(STORAGE_KEYS.LEADS)
    localStorage.removeItem(STORAGE_KEYS.PAYMENTS)
    localStorage.removeItem(STORAGE_KEYS.ATTENDANCE)
    localStorage.removeItem(STORAGE_KEYS.SETTINGS)

    // Re-populate
    const students = generateInitialStudents()
    const courses = COURSES_DATA
    const teachers = TEACHERS_DATA
    const groups = GROUPS_DATA
    const leads = generateInitialLeads()
    const payments = generateInitialPayments()
    const attendance = generateInitialAttendance()
    const settings = INITIAL_SETTINGS

    setStored(STORAGE_KEYS.STUDENTS, students)
    setStored(STORAGE_KEYS.COURSES, courses)
    setStored(STORAGE_KEYS.TEACHERS, teachers)
    setStored(STORAGE_KEYS.GROUPS, groups)
    setStored(STORAGE_KEYS.LEADS, leads)
    setStored(STORAGE_KEYS.PAYMENTS, payments)
    setStored(STORAGE_KEYS.ATTENDANCE, attendance)
    setStored(STORAGE_KEYS.SETTINGS, settings)

    return { success: true }
  },

  // Export full backup as JSON
  async exportBackup() {
    return {
      students: getStored(STORAGE_KEYS.STUDENTS, generateInitialStudents),
      courses: getStored(STORAGE_KEYS.COURSES, COURSES_DATA),
      teachers: getStored(STORAGE_KEYS.TEACHERS, TEACHERS_DATA),
      groups: getStored(STORAGE_KEYS.GROUPS, GROUPS_DATA),
      leads: getStored(STORAGE_KEYS.LEADS, generateInitialLeads),
      payments: getStored(STORAGE_KEYS.PAYMENTS, generateInitialPayments),
      attendance: getStored(STORAGE_KEYS.ATTENDANCE, generateInitialAttendance),
      settings: getStored(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS),
      exportDate: new Date().toISOString()
    }
  },

  // Import backup from JSON
  async importBackup(data) {
    if (data.students) setStored(STORAGE_KEYS.STUDENTS, data.students)
    if (data.courses) setStored(STORAGE_KEYS.COURSES, data.courses)
    if (data.teachers) setStored(STORAGE_KEYS.TEACHERS, data.teachers)
    if (data.groups) setStored(STORAGE_KEYS.GROUPS, data.groups)
    if (data.leads) setStored(STORAGE_KEYS.LEADS, data.leads)
    if (data.payments) setStored(STORAGE_KEYS.PAYMENTS, data.payments)
    if (data.attendance) setStored(STORAGE_KEYS.ATTENDANCE, data.attendance)
    if (data.settings) setStored(STORAGE_KEYS.SETTINGS, data.settings)
    return { success: true }
  },

  // STUDENTS
  students: {
    async getAll() {
      return getStored(STORAGE_KEYS.STUDENTS, generateInitialStudents)
    },
    async getById(id) {
      const all = getStored(STORAGE_KEYS.STUDENTS, generateInitialStudents)
      return all.find(s => s.id === id) || null
    },
    async create(studentData) {
      const all = getStored(STORAGE_KEYS.STUDENTS, generateInitialStudents)
      const newStudent = {
        id: `s-${Date.now()}`,
        joinedDate: new Date().toISOString().split('T')[0],
        status: 'Active',
        paymentStatus: 'Pending',
        attendancePercent: 100,
        averageScore: 90,
        avatar: `https://images.unsplash.com/photo-${1530000000000 + Math.floor(Math.random() * 50000000)}?w=120`,
        ...studentData
      }
      all.unshift(newStudent)
      setStored(STORAGE_KEYS.STUDENTS, all)
      return newStudent
    },
    async update(id, updates) {
      const all = getStored(STORAGE_KEYS.STUDENTS, generateInitialStudents)
      const index = all.findIndex(s => s.id === id)
      if (index === -1) throw new Error('Student not found')
      all[index] = { ...all[index], ...updates }
      setStored(STORAGE_KEYS.STUDENTS, all)
      return all[index]
    },
    async delete(id) {
      const all = getStored(STORAGE_KEYS.STUDENTS, generateInitialStudents)
      const filtered = all.filter(s => s.id !== id)
      setStored(STORAGE_KEYS.STUDENTS, filtered)
      return { success: true }
    },
    async bulkDelete(ids) {
      const all = getStored(STORAGE_KEYS.STUDENTS, generateInitialStudents)
      const filtered = all.filter(s => !ids.includes(s.id))
      setStored(STORAGE_KEYS.STUDENTS, filtered)
      return { success: true, count: ids.length }
    },
    async bulkUpdateStatus(ids, status) {
      const all = getStored(STORAGE_KEYS.STUDENTS, generateInitialStudents)
      const updated = all.map(s => ids.includes(s.id) ? { ...s, status } : s)
      setStored(STORAGE_KEYS.STUDENTS, updated)
      return { success: true }
    }
  },

  // COURSES
  courses: {
    async getAll() {
      return getStored(STORAGE_KEYS.COURSES, COURSES_DATA)
    },
    async create(data) {
      const all = getStored(STORAGE_KEYS.COURSES, COURSES_DATA)
      const newCourse = { id: `c-${Date.now()}`, studentsCount: 0, ...data }
      all.push(newCourse)
      setStored(STORAGE_KEYS.COURSES, all)
      return newCourse
    },
    async update(id, updates) {
      const all = getStored(STORAGE_KEYS.COURSES, COURSES_DATA)
      const index = all.findIndex(c => c.id === id)
      if (index === -1) throw new Error('Course not found')
      all[index] = { ...all[index], ...updates }
      setStored(STORAGE_KEYS.COURSES, all)
      return all[index]
    },
    async delete(id) {
      const all = getStored(STORAGE_KEYS.COURSES, COURSES_DATA)
      const filtered = all.filter(c => c.id !== id)
      setStored(STORAGE_KEYS.COURSES, filtered)
      return { success: true }
    }
  },

  // TEACHERS
  teachers: {
    async getAll() {
      return getStored(STORAGE_KEYS.TEACHERS, TEACHERS_DATA)
    },
    async create(data) {
      const all = getStored(STORAGE_KEYS.TEACHERS, TEACHERS_DATA)
      const newTeacher = { id: `t-${Date.now()}`, groupsCount: 0, studentsCount: 0, ...data }
      all.push(newTeacher)
      setStored(STORAGE_KEYS.TEACHERS, all)
      return newTeacher
    },
    async update(id, updates) {
      const all = getStored(STORAGE_KEYS.TEACHERS, TEACHERS_DATA)
      const index = all.findIndex(t => t.id === id)
      if (index === -1) throw new Error('Teacher not found')
      all[index] = { ...all[index], ...updates }
      setStored(STORAGE_KEYS.TEACHERS, all)
      return all[index]
    },
    async delete(id) {
      const all = getStored(STORAGE_KEYS.TEACHERS, TEACHERS_DATA)
      const filtered = all.filter(t => t.id !== id)
      setStored(STORAGE_KEYS.TEACHERS, filtered)
      return { success: true }
    }
  },

  // GROUPS
  groups: {
    async getAll() {
      return getStored(STORAGE_KEYS.GROUPS, GROUPS_DATA)
    },
    async create(data) {
      const all = getStored(STORAGE_KEYS.GROUPS, GROUPS_DATA)
      const newGroup = { id: `g-${Date.now()}`, status: 'Active', ...data }
      all.push(newGroup)
      setStored(STORAGE_KEYS.GROUPS, all)
      return newGroup
    },
    async update(id, updates) {
      const all = getStored(STORAGE_KEYS.GROUPS, GROUPS_DATA)
      const index = all.findIndex(g => g.id === id)
      if (index === -1) throw new Error('Group not found')
      all[index] = { ...all[index], ...updates }
      setStored(STORAGE_KEYS.GROUPS, all)
      return all[index]
    },
    async delete(id) {
      const all = getStored(STORAGE_KEYS.GROUPS, GROUPS_DATA)
      const filtered = all.filter(g => g.id !== id)
      setStored(STORAGE_KEYS.GROUPS, filtered)
      return { success: true }
    }
  },

  // LEADS
  leads: {
    async getAll() {
      return getStored(STORAGE_KEYS.LEADS, generateInitialLeads)
    },
    async create(data) {
      const all = getStored(STORAGE_KEYS.LEADS, generateInitialLeads)
      const newLead = {
        id: `lead-${Date.now()}`,
        stage: 'new',
        createdAt: new Date().toISOString().split('T')[0],
        ...data
      }
      all.unshift(newLead)
      setStored(STORAGE_KEYS.LEADS, all)
      return newLead
    },
    async updateStage(id, stage) {
      const all = getStored(STORAGE_KEYS.LEADS, generateInitialLeads)
      const index = all.findIndex(l => l.id === id)
      if (index === -1) throw new Error('Lead not found')
      all[index].stage = stage
      setStored(STORAGE_KEYS.LEADS, all)
      return all[index]
    },
    async delete(id) {
      const all = getStored(STORAGE_KEYS.LEADS, generateInitialLeads)
      const filtered = all.filter(l => l.id !== id)
      setStored(STORAGE_KEYS.LEADS, filtered)
      return { success: true }
    }
  },

  // PAYMENTS
  payments: {
    async getAll() {
      return getStored(STORAGE_KEYS.PAYMENTS, generateInitialPayments)
    },
    async create(data) {
      const all = getStored(STORAGE_KEYS.PAYMENTS, generateInitialPayments)
      const newPayment = {
        id: `pay-${Date.now()}`,
        paidDate: new Date().toISOString().split('T')[0],
        receiptNumber: `REC-${Date.now().toString().slice(-6)}`,
        status: 'Paid',
        ...data
      }
      all.unshift(newPayment)
      setStored(STORAGE_KEYS.PAYMENTS, all)
      return newPayment
    }
  },

  // ATTENDANCE
  attendance: {
    async getByGroup(groupId) {
      const all = getStored(STORAGE_KEYS.ATTENDANCE, generateInitialAttendance)
      return all[groupId] || {}
    },
    async saveAttendance(groupId, date, records) {
      const all = getStored(STORAGE_KEYS.ATTENDANCE, generateInitialAttendance)
      if (!all[groupId]) all[groupId] = {}
      all[groupId][date] = records
      setStored(STORAGE_KEYS.ATTENDANCE, all)
      return { success: true }
    }
  },

  // SETTINGS
  settings: {
    async get() {
      return getStored(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS)
    },
    async update(updates) {
      const current = getStored(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS)
      const merged = { ...current, ...updates }
      setStored(STORAGE_KEYS.SETTINGS, merged)
      return merged
    }
  }
}
