import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

const DEMO_USERS = [
  {
    id: 'u-1',
    email: 'admin@itlive.uz',
    name: 'Akbar Shoh',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    title: 'Bosh Administrator'
  },
  {
    id: 'u-2',
    email: 'manager@itlive.uz',
    name: 'Zarina Karimova',
    role: 'manager',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    title: 'Katta Menejer'
  },
  {
    id: 'u-3',
    email: 'teacher@itlive.uz',
    name: 'Bobur Aliyev',
    role: 'teacher',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    title: 'Senior Frontend Mentor'
  }
]

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('itlive_auth_user')
      return saved ? JSON.parse(saved) : DEMO_USERS[0] // default admin for smooth review
    } catch {
      return DEMO_USERS[0]
    }
  })

  useEffect(() => {
    if (user) {
      localStorage.setItem('itlive_auth_user', JSON.stringify(user))
    } else {
      localStorage.removeItem('itlive_auth_user')
    }
  }, [user])

  const login = (email, password) => {
    const trimmedEmail = email.trim().toLowerCase()
    const found = DEMO_USERS.find(u => u.email.toLowerCase() === trimmedEmail)
    
    if (!found) {
      // Allow any email for demo or fallback to admin
      if (password === 'admin123') {
        const customUser = {
          id: 'u-' + Date.now(),
          email: trimmedEmail,
          name: trimmedEmail.split('@')[0],
          role: 'admin',
          avatar: DEMO_USERS[0].avatar,
          title: 'Administrator'
        }
        setUser(customUser)
        return { success: true, user: customUser }
      }
      return { success: false, error: 'Email yoki parol noto‘g‘ri' }
    }

    if (password === 'admin123' || password === 'manager123' || password === 'teacher123') {
      setUser(found)
      return { success: true, user: found }
    }

    return { success: false, error: 'Noto‘g‘ri parol' }
  }

  const logout = () => {
    setUser(null)
  }

  const switchRole = (newRole) => {
    const target = DEMO_USERS.find(u => u.role === newRole) || { ...user, role: newRole }
    setUser(target)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, switchRole, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
