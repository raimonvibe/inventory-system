import { useState, useEffect } from 'react'
import { 
  ShoppingCart, 
  Plus, 
  Search, 
  Filter, 
  ArrowUpDown,
  AlertTriangle,
  ArrowDownCircle,
  ArrowUpCircle,
  Eye,
  Calendar
} from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent } from './ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { Label } from './ui/label'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from './ui/tabs'

interface Transaction {
  id: number
  type: 'purchase' | 'sale'
  item_id: number
  item_name: string
  quantity: number
  price_per_unit: number
  total_price: number
  date: string
  supplier_id?: number
  supplier_name?: string
  customer_id?: number
  customer_name?: string
}

interface TransactionsProps {
  apiUrl: string
}

export const Transactions = ({ apiUrl }: TransactionsProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')
  const [sortField, setSortField] = useState('date')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [activeTab, setActiveTab] = useState('all')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newTransaction, setNewTransaction] = useState({
    type: 'sale',
    item_id: 1,
    item_name: '',
    quantity: 1,
    price_per_unit: 0,
    supplier_id: 1,
    supplier_name: '',
    customer_id: 1,
    customer_name: ''
  })
  const [items, setItems] = useState<{id: number, name: string, price: number}[]>([])
  const [suppliers, setSuppliers] = useState<{id: number, name: string}[]>([])
  const [customers, setCustomers] = useState<{id: number, name: string}[]>([])

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`${apiUrl}/transactions`)
        
        if (!response.ok) {
          throw new Error(`Error fetching transactions: ${response.status}`)
        }
        
        const data = await response.json()
        setTransactions(data)
        setFilteredTransactions(data)
        setError(null)
      } catch (err) {
        console.error('Error fetching transactions:', err)
        setError('Failed to load transactions. Using sample data instead.')
        
        const sampleTransactions = [
          {
            id: 1,
            type: 'purchase',
            item_id: 1,
            item_name: 'Smartphone',
            quantity: 10,
            price_per_unit: 699.99,
            total_price: 6999.90,
            date: '2025-01-15T10:30:00Z',
            supplier_id: 1,
            supplier_name: 'TechSuppliers Inc.'
          },
          {
            id: 2,
            type: 'purchase',
            item_id: 2,
            item_name: 'Laptop',
            quantity: 5,
            price_per_unit: 999.99,
            total_price: 4999.95,
            date: '2025-01-16T11:20:00Z',
            supplier_id: 1,
            supplier_name: 'TechSuppliers Inc.'
          },
          {
            id: 3,
            type: 'purchase',
            item_id: 3,
            item_name: 'Office Desk',
            quantity: 3,
            price_per_unit: 249.99,
            total_price: 749.97,
            date: '2025-01-17T09:15:00Z',
            supplier_id: 2,
            supplier_name: 'FurniturePro'
          },
          {
            id: 4,
            type: 'sale',
            item_id: 1,
            item_name: 'Smartphone',
            quantity: 2,
            price_per_unit: 899.99,
            total_price: 1799.98,
            date: '2025-01-18T14:45:00Z',
            customer_id: 1,
            customer_name: 'John Smith'
          },
          {
            id: 5,
            type: 'sale',
            item_id: 2,
            item_name: 'Laptop',
            quantity: 1,
            price_per_unit: 1299.99,
            total_price: 1299.99,
            date: '2025-01-19T16:30:00Z',
            customer_id: 2,
            customer_name: 'Jane Doe'
          }
        ] as Transaction[]
        
        setTransactions(sampleTransactions)
        setFilteredTransactions(sampleTransactions)
        
        setItems([
          { id: 1, name: 'Smartphone', price: 899.99 },
          { id: 2, name: 'Laptop', price: 1299.99 },
          { id: 3, name: 'Office Desk', price: 249.99 },
          { id: 4, name: 'Bookshelf', price: 199.99 },
          { id: 5, name: 'Office Chair', price: 249.99 }
        ])
        
        setSuppliers([
          { id: 1, name: 'TechSuppliers Inc.' },
          { id: 2, name: 'FurniturePro' }
        ])
        
        setCustomers([
          { id: 1, name: 'John Smith' },
          { id: 2, name: 'Jane Doe' },
          { id: 3, name: 'Company XYZ' }
        ])
      } finally {
        setIsLoading(false)
      }
    }

    fetchTransactions()
  }, [apiUrl])

  useEffect(() => {
    let result = [...transactions]
    
    if (activeTab !== 'all') {
      result = result.filter(transaction => transaction.type === activeTab)
    }
    
    if (searchTerm) {
      result = result.filter(transaction => 
        transaction.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (transaction.supplier_name && transaction.supplier_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (transaction.customer_name && transaction.customer_name.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }
    
    if (dateFilter !== 'all') {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      
      switch (dateFilter) {
        case 'today':
          result = result.filter(transaction => {
            const transactionDate = new Date(transaction.date)
            return transactionDate >= today
          })
          break
        case 'week':
          const weekAgo = new Date(today)
          weekAgo.setDate(weekAgo.getDate() - 7)
          result = result.filter(transaction => {
            const transactionDate = new Date(transaction.date)
            return transactionDate >= weekAgo
          })
          break
        case 'month':
          const monthAgo = new Date(today)
          monthAgo.setMonth(monthAgo.getMonth() - 1)
          result = result.filter(transaction => {
            const transactionDate = new Date(transaction.date)
            return transactionDate >= monthAgo
          })
          break
      }
    }
    
    result.sort((a, b) => {
      const fieldA = a[sortField as keyof Transaction]
      const fieldB = b[sortField as keyof Transaction]
      
      if (typeof fieldA === 'string' && typeof fieldB === 'string') {
        return sortDirection === 'asc' 
          ? fieldA.localeCompare(fieldB) 
          : fieldB.localeCompare(fieldA)
      } else {
        return sortDirection === 'asc' 
          ? Number(fieldA) - Number(fieldB) 
          : Number(fieldB) - Number(fieldA)
      }
    })
    
    setFilteredTransactions(result)
  }, [transactions, searchTerm, typeFilter, dateFilter, sortField, sortDirection, activeTab])

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const handleItemChange = (itemId: number) => {
    const selectedItem = items.find(item => item.id === Number(itemId))
    if (selectedItem) {
      setNewTransaction({
        ...newTransaction,
        item_id: selectedItem.id,
        item_name: selectedItem.name,
        price_per_unit: selectedItem.price
      })
    }
  }

  const handleSupplierChange = (supplierId: number) => {
    const selectedSupplier = suppliers.find(supplier => supplier.id === Number(supplierId))
    if (selectedSupplier) {
      setNewTransaction({
        ...newTransaction,
        supplier_id: selectedSupplier.id,
        supplier_name: selectedSupplier.name
      })
    }
  }

  const handleCustomerChange = (customerId: number) => {
    const selectedCustomer = customers.find(customer => customer.id === Number(customerId))
    if (selectedCustomer) {
      setNewTransaction({
        ...newTransaction,
        customer_id: selectedCustomer.id,
        customer_name: selectedCustomer.name
      })
    }
  }

  const handleAddTransaction = async () => {
    try {
      setIsLoading(true)
      
      const transactionData = {
        ...newTransaction,
        total_price: newTransaction.quantity * newTransaction.price_per_unit,
        date: new Date().toISOString()
      }
      
      const response = await fetch(`${apiUrl}/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData),
      })
      
      if (!response.ok) {
        throw new Error(`Error adding transaction: ${response.status}`)
      }
      
      const addedTransaction = await response.json()
      setTransactions([...transactions, addedTransaction])
      
      setNewTransaction({
        type: 'sale',
        item_id: 1,
        item_name: '',
        quantity: 1,
        price_per_unit: 0,
        supplier_id: 1,
        supplier_name: '',
        customer_id: 1,
        customer_name: ''
      })
      
      setIsAddDialogOpen(false)
    } catch (err) {
      console.error('Error adding transaction:', err)
      setError('Failed to add transaction. Please try again.')
      
      const newId = Math.max(...transactions.map(transaction => transaction.id)) + 1
      const fakeTransaction = {
        ...newTransaction,
        id: newId,
        total_price: newTransaction.quantity * newTransaction.price_per_unit,
        date: new Date().toISOString()
      } as Transaction
      
      setTransactions([...transactions, fakeTransaction])
      setIsAddDialogOpen(false)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const calculateTotals = () => {
    const totalSales = filteredTransactions
      .filter(t => t.type === 'sale')
      .reduce((sum, t) => sum + t.total_price, 0)
      
    const totalPurchases = filteredTransactions
      .filter(t => t.type === 'purchase')
      .reduce((sum, t) => sum + t.total_price, 0)
      
    return {
      totalSales,
      totalPurchases,
      profit: totalSales - totalPurchases
    }
  }

  const totals = calculateTotals()

  return (
    <div className="transactions-container animate-fade-in">
      <div className="transactions-header">
        <h1 className="text-3xl font-bold">Transactions</h1>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="add-transaction-button">
              <Plus className="mr-2 h-4 w-4" />
              New Transaction
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Transaction</DialogTitle>
              <DialogDescription>
                Enter the details of the new transaction.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  Type
                </Label>
                <Select
                  value={newTransaction.type}
                  onValueChange={(value) => setNewTransaction({...newTransaction, type: value as 'sale' | 'purchase'})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select transaction type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sale">Sale</SelectItem>
                    <SelectItem value="purchase">Purchase</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="item" className="text-right">
                  Item
                </Label>
                <Select
                  value={String(newTransaction.item_id)}
                  onValueChange={(value) => handleItemChange(Number(value))}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select an item" />
                  </SelectTrigger>
                  <SelectContent>
                    {items.map((item) => (
                      <SelectItem key={item.id} value={String(item.id)}>
                        {item.name} (${item.price.toFixed(2)})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="quantity" className="text-right">
                  Quantity
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={newTransaction.quantity}
                  onChange={(e) => setNewTransaction({...newTransaction, quantity: parseInt(e.target.value) || 1})}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">
                  Price Per Unit
                </Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={newTransaction.price_per_unit}
                  onChange={(e) => setNewTransaction({...newTransaction, price_per_unit: parseFloat(e.target.value) || 0})}
                  className="col-span-3"
                />
              </div>
              
              {newTransaction.type === 'purchase' ? (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="supplier" className="text-right">
                    Supplier
                  </Label>
                  <Select
                    value={String(newTransaction.supplier_id)}
                    onValueChange={(value) => handleSupplierChange(Number(value))}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a supplier" />
                    </SelectTrigger>
                    <SelectContent>
                      {suppliers.map((supplier) => (
                        <SelectItem key={supplier.id} value={String(supplier.id)}>
                          {supplier.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="customer" className="text-right">
                    Customer
                  </Label>
                  <Select
                    value={String(newTransaction.customer_id)}
                    onValueChange={(value) => handleCustomerChange(Number(value))}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={String(customer.id)}>
                          {customer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="total" className="text-right">
                  Total Price
                </Label>
                <div className="col-span-3 font-medium">
                  ${(newTransaction.quantity * newTransaction.price_per_unit).toFixed(2)}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddTransaction}>Add Transaction</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {error && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded">
          <div className="flex items-center">
            <AlertTriangle className="mr-2" />
            <p>{error}</p>
          </div>
        </div>
      )}
      
      <div className="transactions-summary">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Total Sales</h3>
                <p className="text-3xl font-bold text-green-500">${totals.totalSales.toFixed(2)}</p>
              </div>
              <ArrowUpCircle className="h-10 w-10 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Total Purchases</h3>
                <p className="text-3xl font-bold text-red-500">${totals.totalPurchases.toFixed(2)}</p>
              </div>
              <ArrowDownCircle className="h-10 w-10 text-red-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Profit</h3>
                <p className={`text-3xl font-bold ${totals.profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  ${totals.profit.toFixed(2)}
                </p>
              </div>
              <ShoppingCart className="h-10 w-10 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="transactions-filters">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="transaction-tabs">
          <TabsList>
            <TabsTrigger value="all">All Transactions</TabsTrigger>
            <TabsTrigger value="sale">Sales</TabsTrigger>
            <TabsTrigger value="purchase">Purchases</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="search-container">
          <Search className="search-icon" />
          <Input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-container">
          <Calendar className="filter-icon" />
          <Select
            value={dateFilter}
            onValueChange={setDateFilter}
          >
            <SelectTrigger className="filter-select">
              <SelectValue placeholder="Filter by date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="transactions-table-container">
          <table className="transactions-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('id')} className="cursor-pointer">
                  <div className="flex items-center">
                    ID
                    {sortField === 'id' && (
                      <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'desc' ? 'transform rotate-180' : ''}`} />
                    )}
                  </div>
                </th>
                <th onClick={() => handleSort('date')} className="cursor-pointer">
                  <div className="flex items-center">
                    Date
                    {sortField === 'date' && (
                      <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'desc' ? 'transform rotate-180' : ''}`} />
                    )}
                  </div>
                </th>
                <th onClick={() => handleSort('type')} className="cursor-pointer">
                  <div className="flex items-center">
                    Type
                    {sortField === 'type' && (
                      <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'desc' ? 'transform rotate-180' : ''}`} />
                    )}
                  </div>
                </th>
                <th onClick={() => handleSort('item_name')} className="cursor-pointer">
                  <div className="flex items-center">
                    Item
                    {sortField === 'item_name' && (
                      <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'desc' ? 'transform rotate-180' : ''}`} />
                    )}
                  </div>
                </th>
                <th onClick={() => handleSort('quantity')} className="cursor-pointer">
                  <div className="flex items-center">
                    Quantity
                    {sortField === 'quantity' && (
                      <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'desc' ? 'transform rotate-180' : ''}`} />
                    )}
                  </div>
                </th>
                <th onClick={() => handleSort('price_per_unit')} className="cursor-pointer">
                  <div className="flex items-center">
                    Price Per Unit
                    {sortField === 'price_per_unit' && (
                      <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'desc' ? 'transform rotate-180' : ''}`} />
                    )}
                  </div>
                </th>
                <th onClick={() => handleSort('total_price')} className="cursor-pointer">
                  <div className="flex items-center">
                    Total
                    {sortField === 'total_price' && (
                      <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'desc' ? 'transform rotate-180' : ''}`} />
                    )}
                  </div>
                </th>
                <th>Contact</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className={transaction.type === 'sale' ? 'sale-row' : 'purchase-row'}>
                    <td>{transaction.id}</td>
                    <td>{formatDate(transaction.date)}</td>
                    <td>
                      <span className={`transaction-type ${transaction.type}`}>
                        {transaction.type === 'sale' ? 'Sale' : 'Purchase'}
                      </span>
                    </td>
                    <td>{transaction.item_name}</td>
                    <td>{transaction.quantity}</td>
                    <td>${transaction.price_per_unit.toFixed(2)}</td>
                    <td className="font-medium">
                      ${transaction.total_price.toFixed(2)}
                    </td>
                    <td>
                      {transaction.type === 'sale' 
                        ? transaction.customer_name 
                        : transaction.supplier_name}
                    </td>
                    <td>
                      <Button variant="outline" size="icon" className="view-button">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="text-center py-4">No transactions found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
