import { useState, useEffect } from 'react'
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  AlertTriangle,
  ArrowUpDown,
  ChevronDown,
  DollarSign
} from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent } from './ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
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

interface Item {
  id: number
  name: string
  description: string
  category: string
  price: number
  quantity: number
  supplier_id: number
  created_at: string
  updated_at: string
}

interface InventoryProps {
  apiUrl: string
}

export const Inventory = ({ apiUrl }: InventoryProps) => {
  const [items, setItems] = useState<Item[]>([])
  const [filteredItems, setFilteredItems] = useState<Item[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [sortField, setSortField] = useState('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    category: 'electronics',
    price: 0,
    quantity: 0,
    supplier_id: 1
  })

  const categories = [
    'electronics',
    'furniture',
    'clothing',
    'books',
    'food',
    'toys',
    'other'
  ]

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`${apiUrl}/items`)
        
        if (!response.ok) {
          throw new Error(`Error fetching items: ${response.status}`)
        }
        
        const data = await response.json()
        setItems(data)
        setFilteredItems(data)
        setError(null)
      } catch (err) {
        console.error('Error fetching items:', err)
        setError('Failed to load items. Using sample data instead.')
        
        const sampleItems = [
          {
            id: 1,
            name: 'Smartphone',
            description: 'Latest model smartphone with high-end features',
            category: 'electronics',
            price: 899.99,
            quantity: 25,
            supplier_id: 1,
            created_at: '2025-01-15T10:30:00Z',
            updated_at: '2025-01-15T10:30:00Z'
          },
          {
            id: 2,
            name: 'Laptop',
            description: 'Powerful laptop for professional use',
            category: 'electronics',
            price: 1299.99,
            quantity: 15,
            supplier_id: 1,
            created_at: '2025-01-16T11:20:00Z',
            updated_at: '2025-01-16T11:20:00Z'
          },
          {
            id: 3,
            name: 'Office Desk',
            description: 'Spacious desk for home office',
            category: 'furniture',
            price: 349.99,
            quantity: 10,
            supplier_id: 2,
            created_at: '2025-01-17T09:15:00Z',
            updated_at: '2025-01-17T09:15:00Z'
          },
          {
            id: 4,
            name: 'Bookshelf',
            description: 'Modern bookshelf with 5 shelves',
            category: 'furniture',
            price: 199.99,
            quantity: 8,
            supplier_id: 2,
            created_at: '2025-01-18T14:45:00Z',
            updated_at: '2025-01-18T14:45:00Z'
          },
          {
            id: 5,
            name: 'Office Chair',
            description: 'Ergonomic office chair with lumbar support',
            category: 'furniture',
            price: 249.99,
            quantity: 3,
            supplier_id: 2,
            created_at: '2025-01-19T16:30:00Z',
            updated_at: '2025-01-19T16:30:00Z'
          }
        ]
        
        setItems(sampleItems)
        setFilteredItems(sampleItems)
      } finally {
        setIsLoading(false)
      }
    }

    fetchItems()
  }, [apiUrl])

  useEffect(() => {
    let result = [...items]
    
    if (searchTerm) {
      result = result.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    if (categoryFilter !== 'all') {
      result = result.filter(item => item.category === categoryFilter)
    }
    
    result.sort((a, b) => {
      const fieldA = a[sortField as keyof Item]
      const fieldB = b[sortField as keyof Item]
      
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
    
    setFilteredItems(result)
  }, [items, searchTerm, categoryFilter, sortField, sortDirection])

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const handleAddItem = async () => {
    try {
      setIsLoading(true)
      
      const response = await fetch(`${apiUrl}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItem),
      })
      
      if (!response.ok) {
        throw new Error(`Error adding item: ${response.status}`)
      }
      
      const addedItem = await response.json()
      setItems([...items, addedItem])
      
      setNewItem({
        name: '',
        description: '',
        category: 'electronics',
        price: 0,
        quantity: 0,
        supplier_id: 1
      })
      
      setIsAddDialogOpen(false)
    } catch (err) {
      console.error('Error adding item:', err)
      setError('Failed to add item. Please try again.')
      
      const newId = Math.max(...items.map(item => item.id)) + 1
      const fakeItem = {
        ...newItem,
        id: newId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      } as Item
      
      setItems([...items, fakeItem])
      setIsAddDialogOpen(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteItem = async (id: number) => {
    try {
      setIsLoading(true)
      
      const response = await fetch(`${apiUrl}/items/${id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error(`Error deleting item: ${response.status}`)
      }
      
      setItems(items.filter(item => item.id !== id))
    } catch (err) {
      console.error('Error deleting item:', err)
      setError('Failed to delete item. Please try again.')
      
      setItems(items.filter(item => item.id !== id))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="inventory-container animate-fade-in">
      <div className="inventory-header">
        <h1 className="text-3xl font-bold">Inventory Management</h1>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="add-item-button">
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Item</DialogTitle>
              <DialogDescription>
                Enter the details of the new inventory item.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newItem.name}
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Input
                  id="description"
                  value={newItem.description}
                  onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Category
                </Label>
                <Select
                  value={newItem.category}
                  onValueChange={(value) => setNewItem({...newItem, category: value})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">
                  Price
                </Label>
                <Input
                  id="price"
                  type="number"
                  value={newItem.price}
                  onChange={(e) => setNewItem({...newItem, price: parseFloat(e.target.value)})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="quantity" className="text-right">
                  Quantity
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({...newItem, quantity: parseInt(e.target.value)})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="supplier" className="text-right">
                  Supplier ID
                </Label>
                <Input
                  id="supplier"
                  type="number"
                  value={newItem.supplier_id}
                  onChange={(e) => setNewItem({...newItem, supplier_id: parseInt(e.target.value)})}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddItem}>Add Item</Button>
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
      
      <div className="inventory-filters">
        <div className="search-container">
          <Search className="search-icon" />
          <Input
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-container">
          <Filter className="filter-icon" />
          <Select
            value={categoryFilter}
            onValueChange={setCategoryFilter}
          >
            <SelectTrigger className="filter-select">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          <div className="inventory-table-container">
            <table className="inventory-table">
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
                  <th onClick={() => handleSort('name')} className="cursor-pointer">
                    <div className="flex items-center">
                      Name
                      {sortField === 'name' && (
                        <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'desc' ? 'transform rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th>Description</th>
                  <th onClick={() => handleSort('category')} className="cursor-pointer">
                    <div className="flex items-center">
                      Category
                      {sortField === 'category' && (
                        <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'desc' ? 'transform rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th onClick={() => handleSort('price')} className="cursor-pointer">
                    <div className="flex items-center">
                      Price
                      {sortField === 'price' && (
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
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.name}</td>
                      <td className="description-cell">{item.description}</td>
                      <td>{item.category.charAt(0).toUpperCase() + item.category.slice(1)}</td>
                      <td>${item.price.toFixed(2)}</td>
                      <td className={item.quantity <= 5 ? 'low-stock' : ''}>{item.quantity}</td>
                      <td>
                        <div className="action-buttons">
                          <Button variant="outline" size="icon" className="edit-button">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="delete-button"
                            onClick={() => handleDeleteItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-4">No items found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="inventory-summary">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">Total Items</h3>
                    <p className="text-3xl font-bold">{filteredItems.length}</p>
                  </div>
                  <Package className="h-10 w-10 text-primary" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">Low Stock Items</h3>
                    <p className="text-3xl font-bold">{filteredItems.filter(item => item.quantity <= 5).length}</p>
                  </div>
                  <AlertTriangle className="h-10 w-10 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">Total Value</h3>
                    <p className="text-3xl font-bold">
                      ${filteredItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}
                    </p>
                  </div>
                  <DollarSign className="h-10 w-10 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
