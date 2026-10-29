import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { translations } from '../utils/translations'

const UIContext = createContext(null)

export function UIProvider({ children }) {
  // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('itlive_theme') || 'dark'
  })

  // Settings
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('itlive_currency') || 'UZS'
  })
  const [lang, setLangState] = useState(() => {
    return localStorage.getItem('itlive_lang') || 'uz'
  })

  // Mobile sidebar open/close
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Toasts
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('itlive_theme', theme)
  }, [theme])

  useEffect(() => {
    localStorage.setItem('itlive_currency', currency)
  }, [currency])

  const setLang = (newLang) => {
    setLangState(newLang)
    localStorage.setItem('itlive_lang', newLang)
  }

  // Translation helper function
  const t = useCallback((key) => {
    const currentDict = translations[lang] || translations.uz
    if (currentDict && currentDict[key] !== undefined) {
      return currentDict[key]
    }
    // Fallback to Uzbek
    if (translations.uz && translations.uz[key] !== undefined) {
      return translations.uz[key]
    }
    return key
  }, [lang])

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))
  }

  const addToast = (toast) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9)
    const newToast = { id, type: 'info', duration: 4000, ...toast }
    setToasts(prev => [...prev, newToast])

    setTimeout(() => {
      removeToast(id)
    }, newToast.duration)
  }

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  return (
    <UIContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        currency,
        setCurrency,
        lang,
        setLang,
        t,
        sidebarOpen,
        setSidebarOpen,
        sidebarCollapsed,
        setSidebarCollapsed,
        toasts,
        addToast,
        removeToast
      }}
    >
      {children}
    </UIContext.Provider>
  )
}

export function useUI() {
  const context = useContext(UIContext)
  if (!context) {
    throw new Error('useUI must be used within a UIProvider')
  }
  return context
}
