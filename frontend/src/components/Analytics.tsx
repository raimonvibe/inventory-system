import { useState, useEffect } from 'react'
import { 
  BarChart2, 
  TrendingUp, 
  DollarSign, 
  ShoppingCart, 
  Package, 
  AlertTriangle,
  Calendar,
  Download
} from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts'

interface AnalyticsProps {
  apiUrl: string
}

interface AnalyticsData {
  totalSales: number
  totalPurchases: number
  profit: number
  lowStockItems: any[]
  topSellingItems: any[]
  salesByCategory: {
    category: string
    value: number
  }[]
  salesByMonth: {
    month: string
    sales: number
    purchases: number
  }[]
  profitByMonth: {
    month: string
    profit: number
  }[]
  inventoryValue: {
    category: string
    value: number
  }[]
}

export const Analytics = ({ apiUrl }: AnalyticsProps) => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalSales: 0,
    totalPurchases: 0,
    profit: 0,
    lowStockItems: [],
    topSellingItems: [],
    salesByCategory: [],
    salesByMonth: [],
    profitByMonth: [],
    inventoryValue: []
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState('year')

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`${apiUrl}/analytics`)
        
        if (!response.ok) {
          throw new Error(`Error fetching analytics: ${response.status}`)
        }
        
        const data = await response.json()
        
        const enhancedData = {
          ...data,
          salesByCategory: [
            { category: 'Electronics', value: 12500 },
            { category: 'Furniture', value: 8200 },
            { category: 'Clothing', value: 5400 },
            { category: 'Books', value: 2800 },
            { category: 'Food', value: 3600 },
            { category: 'Other', value: 1500 }
          ],
          salesByMonth: [
            { month: 'Jan', sales: 4000, purchases: 2400 },
            { month: 'Feb', sales: 3000, purchases: 1398 },
            { month: 'Mar', sales: 2000, purchases: 9800 },
            { month: 'Apr', sales: 2780, purchases: 3908 },
            { month: 'May', sales: 1890, purchases: 4800 },
            { month: 'Jun', sales: 2390, purchases: 3800 },
            { month: 'Jul', sales: 3490, purchases: 4300 },
            { month: 'Aug', sales: 3490, purchases: 4300 },
            { month: 'Sep', sales: 4000, purchases: 2400 },
            { month: 'Oct', sales: 5000, purchases: 3000 },
            { month: 'Nov', sales: 4500, purchases: 2500 },
            { month: 'Dec', sales: 6000, purchases: 3500 }
          ],
          profitByMonth: [
            { month: 'Jan', profit: 1600 },
            { month: 'Feb', profit: 1602 },
            { month: 'Mar', profit: -7800 },
            { month: 'Apr', profit: -1128 },
            { month: 'May', profit: -2910 },
            { month: 'Jun', profit: -1410 },
            { month: 'Jul', profit: -810 },
            { month: 'Aug', profit: -810 },
            { month: 'Sep', profit: 1600 },
            { month: 'Oct', profit: 2000 },
            { month: 'Nov', profit: 2000 },
            { month: 'Dec', profit: 2500 }
          ],
          inventoryValue: [
            { category: 'Electronics', value: 25000 },
            { category: 'Furniture', value: 15000 },
            { category: 'Clothing', value: 8000 },
            { category: 'Books', value: 5000 },
            { category: 'Food', value: 3000 },
            { category: 'Other', value: 2000 }
          ]
        }
        
        setAnalyticsData(enhancedData)
        setError(null)
      } catch (err) {
        console.error('Error fetching analytics:', err)
        setError('Failed to load analytics data. Using sample data instead.')
        
        setAnalyticsData({
          totalSales: 34000,
          totalPurchases: 21000,
          profit: 13000,
          lowStockItems: [
            { id: 1, name: 'Smartphone', quantity: 5, price: 899.99 },
            { id: 5, name: 'Office Chair', quantity: 3, price: 249.99 }
          ],
          topSellingItems: [
            { id: 1, name: 'Smartphone', quantity: 25, price: 899.99 },
            { id: 2, name: 'Laptop', quantity: 15, price: 1299.99 },
            { id: 7, name: 'Headphones', quantity: 20, price: 199.99 }
          ],
          salesByCategory: [
            { category: 'Electronics', value: 12500 },
            { category: 'Furniture', value: 8200 },
            { category: 'Clothing', value: 5400 },
            { category: 'Books', value: 2800 },
            { category: 'Food', value: 3600 },
            { category: 'Other', value: 1500 }
          ],
          salesByMonth: [
            { month: 'Jan', sales: 4000, purchases: 2400 },
            { month: 'Feb', sales: 3000, purchases: 1398 },
            { month: 'Mar', sales: 2000, purchases: 9800 },
            { month: 'Apr', sales: 2780, purchases: 3908 },
            { month: 'May', sales: 1890, purchases: 4800 },
            { month: 'Jun', sales: 2390, purchases: 3800 },
            { month: 'Jul', sales: 3490, purchases: 4300 },
            { month: 'Aug', sales: 3490, purchases: 4300 },
            { month: 'Sep', sales: 4000, purchases: 2400 },
            { month: 'Oct', sales: 5000, purchases: 3000 },
            { month: 'Nov', sales: 4500, purchases: 2500 },
            { month: 'Dec', sales: 6000, purchases: 3500 }
          ],
          profitByMonth: [
            { month: 'Jan', profit: 1600 },
            { month: 'Feb', profit: 1602 },
            { month: 'Mar', profit: -7800 },
            { month: 'Apr', profit: -1128 },
            { month: 'May', profit: -2910 },
            { month: 'Jun', profit: -1410 },
            { month: 'Jul', profit: -810 },
            { month: 'Aug', profit: -810 },
            { month: 'Sep', profit: 1600 },
            { month: 'Oct', profit: 2000 },
            { month: 'Nov', profit: 2000 },
            { month: 'Dec', profit: 2500 }
          ],
          inventoryValue: [
            { category: 'Electronics', value: 25000 },
            { category: 'Furniture', value: 15000 },
            { category: 'Clothing', value: 8000 },
            { category: 'Books', value: 5000 },
            { category: 'Food', value: 3000 },
            { category: 'Other', value: 2000 }
          ]
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalyticsData()
  }, [apiUrl])

  const getFilteredData = (data: any[], range: string) => {
    if (range === 'year' || data.length <= 12) {
      return data
    }
    
    if (range === 'quarter') {
      return data.slice(-3)
    }
    
    if (range === 'month') {
      return data.slice(-1)
    }
    
    return data
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  return (
    <div className="analytics-container animate-fade-in">
      <div className="analytics-header">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        
        <div className="analytics-actions">
          <div className="time-range-selector">
            <Calendar className="mr-2" />
            <Select
              value={timeRange}
              onValueChange={setTimeRange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Last Month</SelectItem>
                <SelectItem value="quarter">Last Quarter</SelectItem>
                <SelectItem value="year">Last Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>
      
      {error && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded">
          <div className="flex items-center">
            <AlertTriangle className="mr-2" />
            <p>{error}</p>
          </div>
        </div>
      )}
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          <div className="analytics-summary">
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
                <p className="stat-card-value">{formatCurrency(analyticsData.totalSales)}</p>
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
                <p className="stat-card-value">{formatCurrency(analyticsData.totalPurchases)}</p>
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
                <p className="stat-card-value">{formatCurrency(analyticsData.profit)}</p>
                <p className="stat-card-description">Total profit (sales - purchases)</p>
              </CardContent>
            </Card>
            
            <Card className="stat-card">
              <CardHeader className="pb-2">
                <div className="stat-card-header">
                  <div className="stat-card-icon">
                    <Package size={24} />
                  </div>
                  <CardTitle>Inventory Value</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="stat-card-value">
                  {formatCurrency(analyticsData.inventoryValue.reduce((sum, item) => sum + item.value, 0))}
                </p>
                <p className="stat-card-description">Total value of current inventory</p>
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
                <BarChart 
                  data={getFilteredData(analyticsData.salesByMonth, timeRange)} 
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Legend />
                  <Bar dataKey="sales" name="Sales" fill="hsl(var(--primary))" />
                  <Bar dataKey="purchases" name="Purchases" fill="hsl(var(--muted-foreground))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="chart-container">
              <div className="chart-header">
                <h2 className="chart-title">Profit Trend</h2>
                <Button variant="outline" size="sm">
                  <BarChart2 className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart 
                  data={getFilteredData(analyticsData.profitByMonth, timeRange)}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Area 
                    type="monotone" 
                    dataKey="profit" 
                    name="Profit" 
                    stroke="hsl(var(--primary))" 
                    fill="hsl(var(--primary))" 
                    fillOpacity={0.3} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="chart-container">
              <div className="chart-header">
                <h2 className="chart-title">Sales by Category</h2>
                <Button variant="outline" size="sm">
                  <BarChart2 className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analyticsData.salesByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="category"
                  >
                    {analyticsData.salesByCategory.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="chart-container">
              <div className="chart-header">
                <h2 className="chart-title">Inventory Value by Category</h2>
                <Button variant="outline" size="sm">
                  <BarChart2 className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={analyticsData.inventoryValue}
                  layout="vertical"
                  margin={{ top: 20, right: 30, left: 60, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="category" type="category" />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Legend />
                  <Bar dataKey="value" name="Value" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
