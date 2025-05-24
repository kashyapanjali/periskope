"use client"

import { useState, useEffect } from "react"
import { useSupabase } from "@/components/supabase-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import type { User } from "@/lib/types"
import { FiUserPlus, FiCheck } from "react-icons/fi"

// Types for form data
interface UserFormData {
  email: string
  fullName: string
  phoneNumber: string
}

// Default user data
const DEFAULT_USER: UserFormData = {
  email: "7808804225@periskope.com",
  fullName: "Test User",
  phoneNumber: "7808804225"
}

// Helper function to add delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Create auth user in Supabase with retry logic
const createAuthUser = async (supabase: any, userData: UserFormData, retryCount = 0) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: Math.random().toString(36).slice(-8),
      options: {
        data: {
          full_name: userData.fullName,
          phone_number: userData.phoneNumber,
        },
      },
    })
    if (error) throw error
    return data
  } catch (error: any) {
    if (error.message.includes("429") && retryCount < 3) {
      // Wait for 2 seconds before retrying
      await delay(2000)
      return createAuthUser(supabase, userData, retryCount + 1)
    }
    throw error
  }
}

// Fetch all users from the database
const fetchUsers = async (supabase: any) => {
  const { data, error } = await supabase.from("users").select("*")
  if (error) throw error
  return data
}

export function UserManagement() {
  const [formData, setFormData] = useState<UserFormData>({
    email: "",
    fullName: "",
    phoneNumber: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [lastRequestTime, setLastRequestTime] = useState(0)
  const { supabase } = useSupabase()
  const { toast } = useToast()

  // Fetch users on component mount
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchUsers(supabase)
        setUsers(data)
      } catch (error: any) {
        showError("Error fetching users", error.message)
      }
    }
    loadUsers()
  }, [supabase])

  // Show success toast
  const showSuccess = (title: string, description: string) => {
    toast({
      title,
      description,
    })
  }

  // Show error toast
  const showError = (title: string, message: string) => {
    toast({
      title,
      description: message,
      variant: "destructive",
    })
  }

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({
      ...prev,
      [id]: value
    }))
  }

  // Check if we can make a request
  const canMakeRequest = () => {
    const now = Date.now()
    const timeSinceLastRequest = now - lastRequestTime
    return timeSinceLastRequest >= 2000 // 2 seconds minimum between requests
  }

  // Handle form submission
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!canMakeRequest()) {
      showError(
        "Please wait",
        "You need to wait a few seconds between requests."
      )
      return
    }

    setIsLoading(true)
    setLastRequestTime(Date.now())

    try {
      const authData = await createAuthUser(supabase, formData)
      if (authData.user) {
        showSuccess(
          "User added successfully",
          "The user has been created and can now log in."
        )
        setFormData({ email: "", fullName: "", phoneNumber: "" })
        const updatedUsers = await fetchUsers(supabase)
        setUsers(updatedUsers)
      }
    } catch (error: any) {
      if (error.message.includes("429")) {
        showError(
          "Rate limit exceeded",
          "Please wait a few minutes before trying again."
        )
      } else {
        showError("Error adding user", error.message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Add default test user
  const addDefaultUser = async () => {
    if (!canMakeRequest()) {
      showError(
        "Please wait",
        "You need to wait a few seconds between requests."
      )
      return
    }

    setIsLoading(true)
    setLastRequestTime(Date.now())

    try {
      const authData = await createAuthUser(supabase, DEFAULT_USER)
      if (authData.user) {
        showSuccess(
          "Test user added successfully",
          "You can now start chatting with this user."
        )
        const updatedUsers = await fetchUsers(supabase)
        setUsers(updatedUsers)
      }
    } catch (error: any) {
      if (error.message.includes("429")) {
        showError(
          "Rate limit exceeded",
          "Please wait a few minutes before trying again."
        )
      } else {
        showError("Error adding test user", error.message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Render user list item
  const renderUserItem = (user: User) => (
    <div
      key={user.id}
      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
    >
      <div>
        <p className="font-medium">{user.full_name}</p>
        <p className="text-sm text-gray-500">{user.email}</p>
        {user.phone_number && (
          <p className="text-sm text-gray-500">{user.phone_number}</p>
        )}
      </div>
      <FiCheck className="h-5 w-5 text-green-500" />
    </div>
  )

  return (
    <div className="p-4 space-y-6">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Add Test User</h2>
        <Button 
          onClick={addDefaultUser} 
          disabled={isLoading || !canMakeRequest()}
          className="w-full"
        >
          <FiUserPlus className="h-4 w-4 mr-2" />
          Add Test User (7808804225)
        </Button>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Add New User</h2>
        <form onSubmit={handleAddUser} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              required
            />
          </div>
          <Button 
            type="submit" 
            disabled={isLoading || !canMakeRequest()} 
            className="w-full"
          >
            {isLoading ? "Adding..." : "Add User"}
          </Button>
        </form>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Users</h2>
        <div className="space-y-2">
          {users.map(renderUserItem)}
        </div>
      </div>
    </div>
  )
} 