import { useState, useEffect } from 'react'
import { 
  Users as UsersIcon, 
  Search, 
  Edit, 
  Trash2, 
  AlertTriangle,
  ArrowUpDown,
  Shield,
  UserPlus,
  Key
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
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'

interface User {
  id: number
  username: string
  email: string
  role: string
  created_at: string
  updated_at: string
}

interface UsersProps {
  apiUrl: string
}

export const Users = ({ apiUrl }: UsersProps) => {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [sortField, setSortField] = useState('username')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    role: 'staff'
  })

  const roles = ['admin', 'manager', 'staff']
  
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      case 'manager':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'staff':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
    }
  }

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`${apiUrl}/users`)
        
        if (!response.ok) {
          throw new Error(`Error fetching users: ${response.status}`)
        }
        
        const data = await response.json()
        setUsers(data)
        setFilteredUsers(data)
        setError(null)
      } catch (err) {
        console.error('Error fetching users:', err)
        setError('Failed to load users. Using sample data instead.')
        
        const sampleUsers = [
          {
            id: 1,
            username: 'admin',
            email: 'admin@example.com',
            role: 'admin',
            created_at: '2025-01-15T10:30:00Z',
            updated_at: '2025-01-15T10:30:00Z'
          },
          {
            id: 2,
            username: 'manager1',
            email: 'manager1@example.com',
            role: 'manager',
            created_at: '2025-01-16T11:20:00Z',
            updated_at: '2025-01-16T11:20:00Z'
          },
          {
            id: 3,
            username: 'manager2',
            email: 'manager2@example.com',
            role: 'manager',
            created_at: '2025-01-17T09:15:00Z',
            updated_at: '2025-01-17T09:15:00Z'
          },
          {
            id: 4,
            username: 'staff1',
            email: 'staff1@example.com',
            role: 'staff',
            created_at: '2025-01-18T14:45:00Z',
            updated_at: '2025-01-18T14:45:00Z'
          },
          {
            id: 5,
            username: 'staff2',
            email: 'staff2@example.com',
            role: 'staff',
            created_at: '2025-01-19T16:30:00Z',
            updated_at: '2025-01-19T16:30:00Z'
          }
        ]
        
        setUsers(sampleUsers)
        setFilteredUsers(sampleUsers)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [apiUrl])

  useEffect(() => {
    let result = [...users]
    
    if (searchTerm) {
      result = result.filter(user => 
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    if (roleFilter !== 'all') {
      result = result.filter(user => user.role === roleFilter)
    }
    
    result.sort((a, b) => {
      const fieldA = a[sortField as keyof User]
      const fieldB = b[sortField as keyof User]
      
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
    
    setFilteredUsers(result)
  }, [users, searchTerm, roleFilter, sortField, sortDirection])

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const handleAddUser = async () => {
    try {
      setIsLoading(true)
      
      const response = await fetch(`${apiUrl}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      })
      
      if (!response.ok) {
        throw new Error(`Error adding user: ${response.status}`)
      }
      
      const addedUser = await response.json()
      setUsers([...users, addedUser])
      
      setNewUser({
        username: '',
        email: '',
        password: '',
        role: 'staff'
      })
      
      setIsAddDialogOpen(false)
    } catch (err) {
      console.error('Error adding user:', err)
      setError('Failed to add user. Please try again.')
      
      const newId = Math.max(...users.map(user => user.id)) + 1
      const fakeUser = {
        ...newUser,
        id: newId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      } as User
      
      setUsers([...users, fakeUser])
      setIsAddDialogOpen(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteUser = async (id: number) => {
    try {
      setIsLoading(true)
      
      const response = await fetch(`${apiUrl}/users/${id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error(`Error deleting user: ${response.status}`)
      }
      
      setUsers(users.filter(user => user.id !== id))
    } catch (err) {
      console.error('Error deleting user:', err)
      setError('Failed to delete user. Please try again.')
      
      setUsers(users.filter(user => user.id !== id))
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

  const getInitials = (username: string) => {
    return username.substring(0, 2).toUpperCase()
  }

  return (
    <div className="users-container animate-fade-in">
      <div className="users-header">
        <h1 className="text-3xl font-bold">User Management</h1>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="add-user-button">
              <UserPlus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>
                Enter the details of the new user.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Username
                </Label>
                <Input
                  id="username"
                  value={newUser.username}
                  onChange={(e) => setNewUser({...newUser, username: e.target.value})}
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
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  Role
                </Label>
                <Select
                  value={newUser.role}
                  onValueChange={(value) => setNewUser({...newUser, role: value})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddUser}>Add User</Button>
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
      
      <div className="users-filters">
        <div className="search-container">
          <Search className="search-icon" />
          <Input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-container">
          <Shield className="filter-icon" />
          <Select
            value={roleFilter}
            onValueChange={setRoleFilter}
          >
            <SelectTrigger className="filter-select">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {roles.map((role) => (
                <SelectItem key={role} value={role}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
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
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Avatar</th>
                <th onClick={() => handleSort('username')} className="cursor-pointer">
                  <div className="flex items-center">
                    Username
                    {sortField === 'username' && (
                      <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'desc' ? 'transform rotate-180' : ''}`} />
                    )}
                  </div>
                </th>
                <th onClick={() => handleSort('email')} className="cursor-pointer">
                  <div className="flex items-center">
                    Email
                    {sortField === 'email' && (
                      <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'desc' ? 'transform rotate-180' : ''}`} />
                    )}
                  </div>
                </th>
                <th onClick={() => handleSort('role')} className="cursor-pointer">
                  <div className="flex items-center">
                    Role
                    {sortField === 'role' && (
                      <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'desc' ? 'transform rotate-180' : ''}`} />
                    )}
                  </div>
                </th>
                <th onClick={() => handleSort('created_at')} className="cursor-pointer">
                  <div className="flex items-center">
                    Created
                    {sortField === 'created_at' && (
                      <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'desc' ? 'transform rotate-180' : ''}`} />
                    )}
                  </div>
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <Avatar>
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.username}`} alt={user.username} />
                        <AvatarFallback>{getInitials(user.username)}</AvatarFallback>
                      </Avatar>
                    </td>
                    <td>{user.username}</td>
                    <td>
                      <a href={`mailto:${user.email}`} className="text-primary hover:underline">
                        {user.email}
                      </a>
                    </td>
                    <td>
                      <Badge className={getRoleColor(user.role)}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </Badge>
                    </td>
                    <td>{formatDate(user.created_at)}</td>
                    <td>
                      <div className="action-buttons">
                        <Button variant="outline" size="icon" className="edit-button">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="delete-button"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="reset-password-button">
                          <Key className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-4">No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      
      <div className="users-summary">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Total Users</h3>
                <p className="text-3xl font-bold">{filteredUsers.length}</p>
              </div>
              <UsersIcon className="h-10 w-10 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Admins</h3>
                <p className="text-3xl font-bold">{filteredUsers.filter(user => user.role === 'admin').length}</p>
              </div>
              <Shield className="h-10 w-10 text-red-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Staff</h3>
                <p className="text-3xl font-bold">{filteredUsers.filter(user => user.role === 'staff').length}</p>
              </div>
              <UsersIcon className="h-10 w-10 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
