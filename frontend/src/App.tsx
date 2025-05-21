import { useState, useEffect } from 'react'
import { useTheme } from './hooks/useTheme.ts'
import { Sidebar } from './components/Sidebar.tsx'
import { Dashboard } from './components/Dashboard.tsx'
import { Inventory } from './components/Inventory.tsx'
import { Transactions } from './components/Transactions.tsx'
import { Suppliers } from './components/Suppliers.tsx'
import { Users } from './components/Users.tsx'
import { Analytics } from './components/Analytics.tsx'
import { Settings } from './components/Settings.tsx'
import './App.css'

function App() {
  const { theme, toggleTheme } = useTheme()
  const [activeView, setActiveView] = useState('dashboard')
  const [apiUrl] = useState('http://localhost:8000')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard apiUrl={apiUrl} />
      case 'inventory':
        return <Inventory apiUrl={apiUrl} />
      case 'transactions':
        return <Transactions apiUrl={apiUrl} />
      case 'suppliers':
        return <Suppliers apiUrl={apiUrl} />
      case 'users':
        return <Users apiUrl={apiUrl} />
      case 'analytics':
        return <Analytics apiUrl={apiUrl} />
      case 'settings':
        return <Settings theme={theme} toggleTheme={toggleTheme} />
      default:
        return <Dashboard apiUrl={apiUrl} />
    }
  }

  return (
    <div className={`app-container ${theme}`}>
      <Sidebar 
        activeView={activeView} 
        setActiveView={setActiveView} 
        theme={theme}
      />
      <main className="main-content">
        {renderView()}
      </main>
    </div>
  )
}

export default App
