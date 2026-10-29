import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './store/AuthContext'
import { UIProvider } from './store/UIContext'
import { DataProvider } from './store/DataContext'
import { AppRoutes } from './routes/AppRoutes'

export function App() {
  return (
    <BrowserRouter>
      <UIProvider>
        <AuthProvider>
          <DataProvider>
            <AppRoutes />
          </DataProvider>
        </AuthProvider>
      </UIProvider>
    </BrowserRouter>
  )
}

export default App
