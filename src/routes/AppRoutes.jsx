import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { MainLayout } from '../layouts/MainLayout'
import { ProtectedRoute } from './ProtectedRoute'

// Pages
import { Login } from '../pages/Login'
import { Dashboard } from '../pages/Dashboard'
import { Students } from '../pages/Students'
import { StudentDetail } from '../pages/StudentDetail'
import { Leads } from '../pages/Leads'
import { Courses } from '../pages/Courses'
import { Teachers } from '../pages/Teachers'
import { Groups } from '../pages/Groups'
import { Attendance } from '../pages/Attendance'
import { Payments } from '../pages/Payments'
import { Schedule } from '../pages/Schedule'
import { Analytics } from '../pages/Analytics'
import { Settings } from '../pages/Settings'
import { NotFound } from '../pages/NotFound'

export function AppRoutes() {
  return (
    <Routes>
      {/* Public route */}
      <Route path="/login" element={<Login />} />

      {/* Protected routes wrapped in MainLayout */}
      <Route element={<ProtectedRoute allowedRoles={['admin', 'manager', 'teacher']} />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Students (Admin, Manager) */}
          <Route element={<ProtectedRoute allowedRoles={['admin', 'manager']} />}>
            <Route path="/students" element={<Students />} />
            <Route path="/students/:id" element={<StudentDetail />} />
          </Route>

          {/* Leads (Admin, Manager) */}
          <Route element={<ProtectedRoute allowedRoles={['admin', 'manager']} />}>
            <Route path="/leads" element={<Leads />} />
          </Route>

          {/* Courses (Admin, Manager) */}
          <Route element={<ProtectedRoute allowedRoles={['admin', 'manager']} />}>
            <Route path="/courses" element={<Courses />} />
          </Route>

          {/* Teachers (Admin only) */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/teachers" element={<Teachers />} />
          </Route>

          {/* Groups (Admin, Manager, Teacher) */}
          <Route path="/groups" element={<Groups />} />

          {/* Attendance (Admin, Manager, Teacher) */}
          <Route path="/attendance" element={<Attendance />} />

          {/* Payments (Admin, Manager) */}
          <Route element={<ProtectedRoute allowedRoles={['admin', 'manager']} />}>
            <Route path="/payments" element={<Payments />} />
          </Route>

          {/* Schedule (Admin, Manager, Teacher) */}
          <Route path="/schedule" element={<Schedule />} />

          {/* Analytics (Admin only) */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/analytics" element={<Analytics />} />
          </Route>

          {/* Settings */}
          <Route path="/settings" element={<Settings />} />

          {/* 404 inside layout */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>
    </Routes>
  )
}
