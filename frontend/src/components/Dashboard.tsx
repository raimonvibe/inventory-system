import { useState, useEffect } from 'react'
import { 
  BarChart2, 
  DollarSign, 
  ShoppingCart, 
  Package, 
  AlertTriangle,
  TrendingUp
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts'

interface Item {
  id: number
  name: string
  quantity: number
  price: number
}

interface StatsData {
  totalSales: number
  totalPurchases: number
  profit: number
  lowStockItems: Item[]
  topSellingItems: Item[]
}

interface DashboardProps {
  apiUrl: string
}

export const Dashboard = ({ apiUrl }: DashboardProps) => {
  const [stats, setStats] = useState<StatsData>({
    totalSales: 0,
    totalPurchases: 0,
    profit: 0,
    lowStockItems: [],
    topSellingItems: []
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const salesData = [
    { name: 'Jan', sales: 4000, purchases: 2400 },
    { name: 'Feb', sales: 3000, purchases: 1398 },
    { name: 'Mar', sales: 2000, purchases: 9800 },
    { name: 'Apr', sales: 2780, purchases: 3908 },
    { name: 'May', sales: 1890, purchases: 4800 },
    { name: 'Jun', sales: 2390, purchases: 3800 },
    { name: 'Jul', sales: 3490, purchases: 4300 },
  ]

  const sampleStats = {
    totalSales: 24560.75,
    totalPurchases: 15230.50,
    profit: 9330.25,
    lowStockItems: [
      { id: 1, name: 'Smartphone', quantity: 5, price: 899.99 },
      { id: 5, name: 'Office Chair', quantity: 3, price: 249.99 }
    ],
    topSellingItems: [
      { id: 1, name: 'Smartphone', quantity: 25, price: 899.99 },
      { id: 2, name: 'Laptop', quantity: 15, price: 1299.99 },
      { id: 7, name: 'Headphones', quantity: 20, price: 199.99 }
    ]
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 5000)
        
        const response = await fetch(`${apiUrl}/analytics`, {
          signal: controller.signal
        }).catch(err => {
          if (err.name === 'AbortError') {
            throw new Error('Request timed out after 5 seconds')
          }
          throw err
        })
        
        clearTimeout(timeoutId)
        
        if (!response.ok) {
          throw new Error(`Error fetching analytics: ${response.status}`)
        }
        
        const data = await response.json()
        setStats(data)
        setError(null)
      } catch (err) {
        console.error('Error fetching analytics:', err)
        setError('Failed to load analytics data. Using sample data instead.')
        setStats(sampleStats)
      } finally {
        setIsLoading(false)
      }
    }

    const timer = setTimeout(() => {
      fetchData()
    }, 100)
    
    return () => clearTimeout(timer)
  }, [apiUrl])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false)
        setError('Loading took too long. Using sample data instead.')
        setStats(sampleStats)
      }
    }, 3000)
    
    return () => clearTimeout(timer)
  }, [isLoading])

  return (
    <div className="dashboard animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded">
          <div className="flex items-center">
            <AlertTriangle className="mr-2" />
            <p>{error}</p>
          </div>
        </div>
      ) : (
        <>
          <div className="dashboard-grid">
            <Card className="stat-card">
              <CardHeader className="pb-2">
                <div className="stat-card-header">
                  <div className="stat-card-icon">
                    <DollarSign size={24} />
                  </div>
                  <CardTitle>Total Sales</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="stat-card-value">${stats?.totalSales?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}</p>
                <p className="stat-card-description">Total revenue from all sales</p>
              </CardContent>
            </Card>
            
            <Card className="stat-card">
              <CardHeader className="pb-2">
                <div className="stat-card-header">
                  <div className="stat-card-icon">
                    <ShoppingCart size={24} />
                  </div>
                  <CardTitle>Total Purchases</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="stat-card-value">${stats?.totalPurchases?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}</p>
                <p className="stat-card-description">Total cost of all purchases</p>
              </CardContent>
            </Card>
            
            <Card className="stat-card">
              <CardHeader className="pb-2">
                <div className="stat-card-header">
                  <div className="stat-card-icon">
                    <TrendingUp size={24} />
                  </div>
                  <CardTitle>Profit</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="stat-card-value">${stats?.profit?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}</p>
                <p className="stat-card-description">Total profit (sales - purchases)</p>
              </CardContent>
            </Card>
            
            <Card className="stat-card">
              <CardHeader className="pb-2">
                <div className="stat-card-header">
                  <div className="stat-card-icon">
                    <Package size={24} />
                  </div>
                  <CardTitle>Low Stock Items</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="stat-card-value">{stats?.lowStockItems?.length || 0}</p>
                <p className="stat-card-description">Items that need restocking</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="chart-container">
              <div className="chart-header">
                <h2 className="chart-title">Sales vs Purchases</h2>
                <Button variant="outline" size="sm">
                  <BarChart2 className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sales" name="Sales" fill="hsl(var(--primary))" />
                  <Bar dataKey="purchases" name="Purchases" fill="hsl(var(--muted-foreground))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="chart-container">
              <div className="chart-header">
                <h2 className="chart-title">Sales Trend</h2>
                <Button variant="outline" size="sm">
                  <BarChart2 className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="sales" name="Sales" stroke="hsl(var(--primary))" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="table-container">
              <div className="table-header">
                <h2 className="table-title">Low Stock Items</h2>
                <Button variant="outline" size="sm">View All</Button>
              </div>
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left py-2">Item</th>
                    <th className="text-left py-2">Quantity</th>
                    <th className="text-left py-2">Price</th>
                    <th className="text-left py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.lowStockItems?.map((item) => (
                    <tr key={item.id} className="border-t">
                      <td className="py-2">{item.name}</td>
                      <td className="py-2">{item.quantity}</td>
                      <td className="py-2">${item.price.toFixed(2)}</td>
                      <td className="py-2">
                        <Button variant="outline" size="sm">Restock</Button>
                      </td>
                    </tr>
                  ))}
                  {stats?.lowStockItems?.length === 0 && (
                    <tr className="border-t">
                      <td colSpan={4} className="py-4 text-center">No low stock items</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="table-container">
              <div className="table-header">
                <h2 className="table-title">Top Selling Items</h2>
                <Button variant="outline" size="sm">View All</Button>
              </div>
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left py-2">Item</th>
                    <th className="text-left py-2">Quantity</th>
                    <th className="text-left py-2">Price</th>
                    <th className="text-left py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.topSellingItems?.map((item) => (
                    <tr key={item.id} className="border-t">
                      <td className="py-2">{item.name}</td>
                      <td className="py-2">{item.quantity}</td>
                      <td className="py-2">${item.price.toFixed(2)}</td>
                      <td className="py-2">
                        <Button variant="outline" size="sm">View</Button>
                      </td>
                    </tr>
                  ))}
                  {stats?.topSellingItems?.length === 0 && (
                    <tr className="border-t">
                      <td colSpan={4} className="py-4 text-center">No top selling items</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
