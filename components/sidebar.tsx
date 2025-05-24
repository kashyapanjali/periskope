"use client"

import { useState } from "react"
import type { Chat, User } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar } from "@/components/ui/avatar"
import { AvatarFallback } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
import { Search, Filter, Home, MessageSquare, BarChart2, List, Users, LogOut } from "lucide-react"

interface SidebarProps {
  chats: Chat[]
  activeChat: Chat | null
  onChatSelect: (chat: Chat) => void
  onLogout: () => void
  user: User
}

export function Sidebar({ chats, activeChat, onChatSelect, onLogout, user }: SidebarProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredChats = chats.filter((chat) => chat.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <div className="w-80 border-r flex flex-col h-full bg-white">
      <div className="p-4 border-b">
        <div className="flex items-center space-x-2 mb-4">
          <Avatar className="h-8 w-8 bg-green-600">
            <AvatarFallback>P</AvatarFallback>
          </Avatar>
          <span className="font-semibold text-sm">Inbox</span>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="text-xs flex-1 justify-start">
            <Filter className="h-3.5 w-3.5 mr-2" />
            Custom Filter
          </Button>
          <Button variant="outline" size="sm" className="text-xs px-2">
            Save
          </Button>
        </div>

        <div className="mt-3 relative">
          <Search className="h-4 w-4 absolute left-2.5 top-2.5 text-gray-400" />
          <Input
            placeholder="Search..."
            className="pl-9 h-9 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button variant="ghost" size="sm" className="absolute right-1 top-1 h-7 w-7 p-0">
            <Filter className="h-4 w-4 text-gray-400" />
          </Button>
        </div>
      </div>

      <div className="overflow-y-auto flex-1">
        {filteredChats.map((chat) => (
          <div
            key={chat.id}
            className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${activeChat?.id === chat.id ? "bg-gray-50" : ""}`}
            onClick={() => onChatSelect(chat)}
          >
            <div className="flex items-start">
              <Avatar className="h-10 w-10 mr-3 mt-0.5">
                <AvatarFallback className="bg-gray-200 text-gray-600 text-xs">{getInitials(chat.name)}</AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-sm truncate">{chat.name}</h3>
                  <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                    {chat.created_at && formatDistanceToNow(new Date(chat.created_at), { addSuffix: false })}
                  </span>
                </div>

                <p className="text-xs text-gray-500 truncate mt-0.5">{chat.last_message || "No messages yet"}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t p-2">
        <div className="grid grid-cols-6 gap-1">
          <Button variant="ghost" size="sm" className="h-10 w-10 p-0">
            <Home className="h-5 w-5 text-gray-500" />
          </Button>
          <Button variant="ghost" size="sm" className="h-10 w-10 p-0">
            <MessageSquare className="h-5 w-5 text-green-600" />
          </Button>
          <Button variant="ghost" size="sm" className="h-10 w-10 p-0">
            <BarChart2 className="h-5 w-5 text-gray-500" />
          </Button>
          <Button variant="ghost" size="sm" className="h-10 w-10 p-0">
            <List className="h-5 w-5 text-gray-500" />
          </Button>
          <Button variant="ghost" size="sm" className="h-10 w-10 p-0">
            <Users className="h-5 w-5 text-gray-500" />
          </Button>
          <Button variant="ghost" size="sm" className="h-10 w-10 p-0" onClick={onLogout}>
            <LogOut className="h-5 w-5 text-gray-500" />
          </Button>
        </div>
      </div>
    </div>
  )
}
