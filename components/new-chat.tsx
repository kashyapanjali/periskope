"use client"

import { useState } from "react"
import { useSupabase } from "@/components/supabase-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import type { User } from "@/lib/types"

interface NewChatProps {
  users: User[]
  onChatCreated: () => void
}

export function NewChat({ users, onChatCreated }: NewChatProps) {
  const [chatName, setChatName] = useState("")
  const [selectedUser, setSelectedUser] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const { supabase } = useSupabase()
  const { toast } = useToast()

  const handleCreateChat = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Create the chat
      const { data: chat, error: chatError } = await supabase
        .from("chats")
        .insert({
          name: chatName,
          created_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (chatError) throw chatError

      // Add the selected user to the chat
      const { error: participantError } = await supabase
        .from("chat_participants")
        .insert({
          chat_id: chat.id,
          user_id: selectedUser,
        })

      if (participantError) throw participantError

      toast({
        title: "Chat created successfully",
        description: "You can now start messaging.",
      })

      setChatName("")
      setSelectedUser("")
      onChatCreated()
    } catch (error: any) {
      toast({
        title: "Error creating chat",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-semibold">Start New Chat</h2>
      <form onSubmit={handleCreateChat} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="chatName">Chat Name</Label>
          <Input
            id="chatName"
            value={chatName}
            onChange={(e) => setChatName(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="user">Select User</Label>
          <Select value={selectedUser} onValueChange={setSelectedUser}>
            <SelectTrigger>
              <SelectValue placeholder="Select a user" />
            </SelectTrigger>
            <SelectContent>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.full_name || user.email}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Chat"}
        </Button>
      </form>
    </div>
  )
} 