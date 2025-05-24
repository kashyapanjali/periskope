"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useSupabase } from "@/components/supabase-provider"
import { Sidebar } from "@/components/sidebar"
import { ChatHeader } from "@/components/chat-header"
import { ChatMessages } from "@/components/chat-messages"
import { ChatInput } from "@/components/chat-input"
import { ChatFilters } from "@/components/chat-filters"
import { UserManagement } from "@/components/user-management"
import { NewChat } from "@/components/new-chat"
import type { Chat, Message, User, Label } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  FiUsers, 
  FiMessageSquare, 
  FiLogOut, 
  FiSearch, 
  FiPlus,
  FiFilter,
  FiSend,
  FiPaperclip
} from "react-icons/fi"

interface ChatLayoutProps {
  initialChats: Chat[]
  user: User
}

export default function ChatLayout({ initialChats, user }: ChatLayoutProps) {
  const [chats, setChats] = useState<Chat[]>(initialChats)
  const [activeChat, setActiveChat] = useState<Chat | null>(initialChats[0] || null)
  const [messages, setMessages] = useState<Message[]>([])
  const [labels, setLabels] = useState<Label[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null)
  const [selectedAssignee, setSelectedAssignee] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"chats" | "users">("chats")
  const { supabase } = useSupabase()
  const router = useRouter()
  const { toast } = useToast()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Fetch labels
    const fetchLabels = async () => {
      const { data } = await supabase.from("labels").select("*")
      if (data) setLabels(data)
    }

    // Fetch users
    const fetchUsers = async () => {
      const { data } = await supabase.from("users").select("*")
      if (data) setUsers(data)
    }

    fetchLabels()
    fetchUsers()
  }, [supabase])

  useEffect(() => {
    if (activeChat) {
      // Fetch messages for the active chat
      const fetchMessages = async () => {
        const { data, error } = await supabase
          .from("messages")
          .select(`
            *,
            sender:users(*)
          `)
          .eq("chat_id", activeChat.id)
          .order("created_at", { ascending: true })

        if (error) {
          toast({
            title: "Error fetching messages",
            description: error.message,
            variant: "destructive",
          })
          return
        }

        setMessages(data || [])
      }

      fetchMessages()
    }
  }, [activeChat, supabase, toast])

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    // Subscribe to new messages
    const channel = supabase
      .channel("realtime-messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        async (payload) => {
          const newMessage = payload.new as Message

          if (newMessage.chat_id === activeChat?.id) {
            // Fetch sender information
            const { data: senderData } = await supabase
              .from("users")
              .select("*")
              .eq("id", newMessage.sender_id)
              .single()

            const messageWithSender = {
              ...newMessage,
              sender: senderData || undefined,
            }

            setMessages((prev) => [...prev, messageWithSender])
          }

          // Update the chat list to show the latest message
          setChats((prev) =>
            prev
              .map((chat) =>
                chat.id === newMessage.chat_id
                  ? { ...chat, last_message: newMessage.content, created_at: newMessage.created_at }
                  : chat,
              )
              .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
          )
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, activeChat])

  const handleSendMessage = async (content: string, file?: File) => {
    if (!activeChat || (!content.trim() && !file)) return

    try {
      let attachmentUrl = null
      let attachmentType = null

      if (file) {
        const fileExt = file.name.split(".").pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `${activeChat.id}/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from("attachments")
          .upload(filePath, file)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from("attachments")
          .getPublicUrl(filePath)

        attachmentUrl = publicUrl
        attachmentType = file.type
      }

      const newMessage = {
        chat_id: activeChat.id,
        content,
        sender_id: user.id,
        created_at: new Date().toISOString(),
        attachment_url: attachmentUrl,
        attachment_type: attachmentType,
      }

      const { error } = await supabase.from("messages").insert(newMessage)

      if (error) throw error

      // Update the last_message in the chat
      await supabase
        .from("chats")
        .update({ last_message: content, created_at: new Date().toISOString() })
        .eq("id", activeChat.id)
    } catch (error: any) {
      toast({
        title: "Failed to send message",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleChatSelect = (chat: Chat) => {
    setActiveChat(chat)
    setActiveTab("chats")
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    const { data } = await supabase
      .from("chats")
      .select("*")
      .ilike("name", `%${query}%`)
      .order("created_at", { ascending: false })
    if (data) setChats(data)
  }

  const handleLabelFilter = async (labelId: string | null) => {
    setSelectedLabel(labelId)
    let query = supabase.from("chats").select("*")
    if (labelId) {
      query = query.eq("label_id", labelId)
    }
    const { data } = await query.order("created_at", { ascending: false })
    if (data) setChats(data)
  }

  const handleAssigneeFilter = async (assigneeId: string | null) => {
    setSelectedAssignee(assigneeId)
    let query = supabase.from("chats").select("*")
    if (assigneeId) {
      query = query.eq("assigned_to", assigneeId)
    }
    const { data } = await query.order("created_at", { ascending: false })
    if (data) setChats(data)
  }

  const handleChatCreated = async () => {
    // Refresh the chat list
    const { data } = await supabase
      .from("chats")
      .select("*")
      .order("created_at", { ascending: false })
    if (data) {
      setChats(data)
      setActiveChat(data[0])
      setActiveTab("chats")
    }
  }

  return (
    <div className="flex h-screen bg-white">
      <div className="w-80 border-r flex flex-col">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "chats" | "users")} className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="chats" className="flex-1">
              <FiMessageSquare className="h-4 w-4 mr-2" />
              Chats
            </TabsTrigger>
            <TabsTrigger value="users" className="flex-1">
              <FiUsers className="h-4 w-4 mr-2" />
              Users
            </TabsTrigger>
          </TabsList>
          <TabsContent value="chats" className="flex-1 flex flex-col">
            <ChatFilters
              labels={labels}
              users={users}
              onSearch={handleSearch}
              onLabelFilter={handleLabelFilter}
              onAssigneeFilter={handleAssigneeFilter}
            />
            <NewChat users={users} onChatCreated={handleChatCreated} />
            <div className="flex-1 overflow-y-auto">
              {chats.map((chat) => (
                <button
                  key={chat.id}
                  className={`w-full p-4 text-left hover:bg-gray-100 ${
                    activeChat?.id === chat.id ? "bg-gray-100" : ""
                  }`}
                  onClick={() => handleChatSelect(chat)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{chat.name}</p>
                      {chat.last_message && (
                        <p className="text-xs text-gray-500 truncate">{chat.last_message}</p>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="users" className="flex-1">
            <UserManagement />
          </TabsContent>
        </Tabs>
      </div>

      <div className="flex flex-col flex-1 overflow-hidden">
        {activeChat ? (
          <>
            <ChatHeader chat={activeChat} />
            <ChatMessages 
              messages={messages} 
              currentUserId={user.id} 
              messagesEndRef={messagesEndRef as React.RefObject<HTMLDivElement>} 
            />
            <ChatInput onSendMessage={handleSendMessage} />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  )
}
