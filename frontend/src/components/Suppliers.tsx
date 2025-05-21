import { useState, useEffect } from 'react'
import { 
  Truck, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  AlertTriangle,
  Mail,
  Phone,
  MapPin,
  User
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
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'

interface Supplier {
  id: number
  name: string
  contact_person: string
  email: string
  phone: string
  address: string
  created_at: string
  updated_at: string
}

interface SuppliersProps {
  apiUrl: string
}

export const Suppliers = ({ apiUrl }: SuppliersProps) => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null)
  const [newSupplier, setNewSupplier] = useState({
    name: '',
    contact_person: '',
    email: '',
    phone: '',
    address: ''
  })

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`${apiUrl}/suppliers`)
        
        if (!response.ok) {
          throw new Error(`Error fetching suppliers: ${response.status}`)
        }
        
        const data = await response.json()
        setSuppliers(data)
        setFilteredSuppliers(data)
        setError(null)
      } catch (err) {
        console.error('Error fetching suppliers:', err)
        setError('Failed to load suppliers. Using sample data instead.')
        
        const sampleSuppliers = [
          {
            id: 1,
            name: 'TechSuppliers Inc.',
            contact_person: 'Michael Johnson',
            email: 'michael@techsuppliers.com',
            phone: '(555) 123-4567',
            address: '123 Tech Blvd, San Francisco, CA 94107',
            created_at: '2025-01-15T10:30:00Z',
            updated_at: '2025-01-15T10:30:00Z'
          },
          {
            id: 2,
            name: 'FurniturePro',
            contact_person: 'Sarah Williams',
            email: 'sarah@furniturepro.com',
            phone: '(555) 987-6543',
            address: '456 Furniture Ave, Chicago, IL 60601',
            created_at: '2025-01-16T11:20:00Z',
            updated_at: '2025-01-16T11:20:00Z'
          },
          {
            id: 3,
            name: 'Global Electronics',
            contact_person: 'David Chen',
            email: 'david@globalelectronics.com',
            phone: '(555) 456-7890',
            address: '789 Electronics Way, New York, NY 10001',
            created_at: '2025-01-17T09:15:00Z',
            updated_at: '2025-01-17T09:15:00Z'
          },
          {
            id: 4,
            name: 'Office Supplies Co.',
            contact_person: 'Jennifer Lee',
            email: 'jennifer@officesupplies.com',
            phone: '(555) 234-5678',
            address: '321 Office Park, Austin, TX 78701',
            created_at: '2025-01-18T14:45:00Z',
            updated_at: '2025-01-18T14:45:00Z'
          },
          {
            id: 5,
            name: 'Fashion Wholesale',
            contact_person: 'Robert Garcia',
            email: 'robert@fashionwholesale.com',
            phone: '(555) 876-5432',
            address: '555 Fashion Blvd, Los Angeles, CA 90028',
            created_at: '2025-01-19T16:30:00Z',
            updated_at: '2025-01-19T16:30:00Z'
          }
        ]
        
        setSuppliers(sampleSuppliers)
        setFilteredSuppliers(sampleSuppliers)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSuppliers()
  }, [apiUrl])

  useEffect(() => {
    let result = [...suppliers]
    
    if (searchTerm) {
      result = result.filter(supplier => 
        supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.contact_person.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.phone.includes(searchTerm) ||
        supplier.address.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    result.sort((a, b) => {
      const fieldA = a[sortField as keyof Supplier]
      const fieldB = b[sortField as keyof Supplier]
      
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
    
    setFilteredSuppliers(result)
  }, [suppliers, searchTerm, sortField, sortDirection])

  // const handleSort = (field: string) => {
  //   if (field === sortField) {
  //     setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
  //   } else {
  //     setSortField(field)
  //     setSortDirection('asc')
  //   }
  // }

  const handleAddSupplier = async () => {
    try {
      setIsLoading(true)
      
      const response = await fetch(`${apiUrl}/suppliers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSupplier),
      })
      
      if (!response.ok) {
        throw new Error(`Error adding supplier: ${response.status}`)
      }
      
      const addedSupplier = await response.json()
      setSuppliers([...suppliers, addedSupplier])
      
      setNewSupplier({
        name: '',
        contact_person: '',
        email: '',
        phone: '',
        address: ''
      })
      
      setIsAddDialogOpen(false)
    } catch (err) {
      console.error('Error adding supplier:', err)
      setError('Failed to add supplier. Please try again.')
      
      const newId = Math.max(...suppliers.map(supplier => supplier.id)) + 1
      const fakeSupplier = {
        ...newSupplier,
        id: newId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      } as Supplier
      
      setSuppliers([...suppliers, fakeSupplier])
      setIsAddDialogOpen(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditSupplier = async () => {
    if (!selectedSupplier) return
    
    try {
      setIsLoading(true)
      
      const response = await fetch(`${apiUrl}/suppliers/${selectedSupplier.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: selectedSupplier.name,
          contact_person: selectedSupplier.contact_person,
          email: selectedSupplier.email,
          phone: selectedSupplier.phone,
          address: selectedSupplier.address
        }),
      })
      
      if (!response.ok) {
        throw new Error(`Error updating supplier: ${response.status}`)
      }
      
      const updatedSupplier = await response.json()
      setSuppliers(suppliers.map(supplier => 
        supplier.id === selectedSupplier.id ? updatedSupplier : supplier
      ))
      
      setIsEditDialogOpen(false)
    } catch (err) {
      console.error('Error updating supplier:', err)
      setError('Failed to update supplier. Please try again.')
      
      setSuppliers(suppliers.map(supplier => 
        supplier.id === selectedSupplier.id ? {
          ...selectedSupplier,
          updated_at: new Date().toISOString()
        } : supplier
      ))
      
      setIsEditDialogOpen(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteSupplier = async (id: number) => {
    try {
      setIsLoading(true)
      
      const response = await fetch(`${apiUrl}/suppliers/${id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error(`Error deleting supplier: ${response.status}`)
      }
      
      setSuppliers(suppliers.filter(supplier => supplier.id !== id))
    } catch (err) {
      console.error('Error deleting supplier:', err)
      setError('Failed to delete supplier. Please try again.')
      
      setSuppliers(suppliers.filter(supplier => supplier.id !== id))
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="suppliers-container animate-fade-in">
      <div className="suppliers-header">
        <h1 className="text-3xl font-bold">Suppliers</h1>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="add-supplier-button">
              <Plus className="mr-2 h-4 w-4" />
              Add Supplier
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Supplier</DialogTitle>
              <DialogDescription>
                Enter the details of the new supplier.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Company Name
                </Label>
                <Input
                  id="name"
                  value={newSupplier.name}
                  onChange={(e) => setNewSupplier({...newSupplier, name: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="contact_person" className="text-right">
                  Contact Person
                </Label>
                <Input
                  id="contact_person"
                  value={newSupplier.contact_person}
                  onChange={(e) => setNewSupplier({...newSupplier, contact_person: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={newSupplier.email}
                  onChange={(e) => setNewSupplier({...newSupplier, email: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Phone
                </Label>
                <Input
                  id="phone"
                  value={newSupplier.phone}
                  onChange={(e) => setNewSupplier({...newSupplier, phone: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right">
                  Address
                </Label>
                <Textarea
                  id="address"
                  value={newSupplier.address}
                  onChange={(e) => setNewSupplier({...newSupplier, address: e.target.value})}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddSupplier}>Add Supplier</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {selectedSupplier && (
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Edit Supplier</DialogTitle>
                <DialogDescription>
                  Update the details of the supplier.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-name" className="text-right">
                    Company Name
                  </Label>
                  <Input
                    id="edit-name"
                    value={selectedSupplier.name}
                    onChange={(e) => setSelectedSupplier({...selectedSupplier, name: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-contact_person" className="text-right">
                    Contact Person
                  </Label>
                  <Input
                    id="edit-contact_person"
                    value={selectedSupplier.contact_person}
                    onChange={(e) => setSelectedSupplier({...selectedSupplier, contact_person: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={selectedSupplier.email}
                    onChange={(e) => setSelectedSupplier({...selectedSupplier, email: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-phone" className="text-right">
                    Phone
                  </Label>
                  <Input
                    id="edit-phone"
                    value={selectedSupplier.phone}
                    onChange={(e) => setSelectedSupplier({...selectedSupplier, phone: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-address" className="text-right">
                    Address
                  </Label>
                  <Textarea
                    id="edit-address"
                    value={selectedSupplier.address}
                    onChange={(e) => setSelectedSupplier({...selectedSupplier, address: e.target.value})}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleEditSupplier}>Update Supplier</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
      
      {error && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded">
          <div className="flex items-center">
            <AlertTriangle className="mr-2" />
            <p>{error}</p>
          </div>
        </div>
      )}
      
      <div className="suppliers-filters">
        <div className="search-container">
          <Search className="search-icon" />
          <Input
            type="text"
            placeholder="Search suppliers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          <div className="suppliers-grid">
            {filteredSuppliers.length > 0 ? (
              filteredSuppliers.map((supplier) => (
                <Card key={supplier.id} className="supplier-card">
                  <CardContent className="p-6">
                    <div className="supplier-card-header">
                      <h2 className="text-xl font-bold">{supplier.name}</h2>
                      <div className="supplier-card-actions">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="edit-button"
                          onClick={() => {
                            setSelectedSupplier(supplier)
                            setIsEditDialogOpen(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="delete-button"
                          onClick={() => handleDeleteSupplier(supplier.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="supplier-info">
                      <div className="supplier-info-item">
                        <User className="supplier-info-icon" />
                        <span>{supplier.contact_person}</span>
                      </div>
                      <div className="supplier-info-item">
                        <Mail className="supplier-info-icon" />
                        <a href={`mailto:${supplier.email}`} className="text-primary hover:underline">
                          {supplier.email}
                        </a>
                      </div>
                      <div className="supplier-info-item">
                        <Phone className="supplier-info-icon" />
                        <a href={`tel:${supplier.phone}`} className="hover:underline">
                          {supplier.phone}
                        </a>
                      </div>
                      <div className="supplier-info-item">
                        <MapPin className="supplier-info-icon" />
                        <span>{supplier.address}</span>
                      </div>
                    </div>
                    
                    <div className="supplier-footer">
                      <span className="text-sm text-muted-foreground">
                        Added: {formatDate(supplier.created_at)}
                      </span>
                      <Button variant="outline" size="sm">View Orders</Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <Truck className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No suppliers found</h3>
                <p className="text-muted-foreground mb-4">Try adjusting your search or add a new supplier.</p>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Supplier
                </Button>
              </div>
            )}
          </div>
          
          <div className="suppliers-summary">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">Total Suppliers</h3>
                    <p className="text-3xl font-bold">{filteredSuppliers.length}</p>
                  </div>
                  <Truck className="h-10 w-10 text-primary" />
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
