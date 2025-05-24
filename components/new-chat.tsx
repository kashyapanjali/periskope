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
      // First, create the chat
      const { data: chat, error: chatError } = await supabase
        .from("chats")
        .insert({
          name: chatName,
          created_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (chatError) {
        console.error("Chat creation error:", chatError)
        throw chatError
      }

      if (!chat) {
        throw new Error("Failed to create chat")
      }

      // Get the current user's ID
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new Error("No authenticated user found")
      }

      // Add the current user as a participant
      const { error: currentUserError } = await supabase
        .from("chat_participants")
        .insert({
          chat_id: chat.id,
          user_id: user.id,
        })

      if (currentUserError) {
        console.error("Current user participant error:", currentUserError)
        // If adding current user fails, delete the chat
        await supabase.from("chats").delete().eq("id", chat.id)
        throw currentUserError
      }

      // Add the selected user to the chat if one was selected
      if (selectedUser) {
        const { error: participantError } = await supabase
          .from("chat_participants")
          .insert({
            chat_id: chat.id,
            user_id: selectedUser,
          })

        if (participantError) {
          console.error("Selected user participant error:", participantError)
          // If adding selected user fails, delete the chat and current user participant
          await supabase.from("chat_participants").delete().eq("chat_id", chat.id)
          await supabase.from("chats").delete().eq("id", chat.id)
          throw participantError
        }
      }

      toast({
        title: "Chat created successfully",
        description: "You can now start messaging.",
      })

      setChatName("")
      setSelectedUser("")
      onChatCreated()
    } catch (error: any) {
      console.error("Chat creation error:", error)
      toast({
        title: "Error creating chat",
        description: error.message || "Failed to create chat",
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