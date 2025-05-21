import { useState } from 'react'
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Truck, 
  BarChart2, 
  Settings,
  Menu,
  X
} from 'lucide-react'
import { Button } from './ui/button'

interface SidebarProps {
  activeView: string
  setActiveView: (view: string) => void
  theme: string
}

export const Sidebar = ({ activeView, setActiveView, theme }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false)

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'inventory', label: 'Inventory', icon: <Package size={20} /> },
    { id: 'transactions', label: 'Transactions', icon: <ShoppingCart size={20} /> },
    { id: 'suppliers', label: 'Suppliers', icon: <Truck size={20} /> },
    { id: 'users', label: 'Users', icon: <Users size={20} /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart2 size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  ]

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        {!collapsed && (
          <h2 className="sidebar-title">
            Inventory<span className="text-primary">Pro</span>
          </h2>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setCollapsed(!collapsed)}
          className="sidebar-toggle"
        >
          {collapsed ? <Menu size={20} /> : <X size={20} />}
        </Button>
      </div>

      <nav className="sidebar-nav">
        <ul>
          {menuItems.map((item) => (
            <li key={item.id}>
              <Button
                variant={activeView === item.id ? "default" : "ghost"}
                className={`sidebar-nav-item ${activeView === item.id ? 'active' : ''}`}
                onClick={() => setActiveView(item.id)}
              >
                <span className="sidebar-icon">{item.icon}</span>
                {!collapsed && <span className="sidebar-label">{item.label}</span>}
              </Button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        {!collapsed && (
          <div className="sidebar-footer-content">
            <p className="text-xs text-muted-foreground">
              &copy; 2025 InventoryPro
            </p>
          </div>
        )}
      </div>
    </aside>
  )
}
