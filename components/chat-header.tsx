"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { FiMoreVertical, FiPhone, FiVideo } from "react-icons/fi"
import type { Chat } from "@/lib/types"

interface ChatHeaderProps {
  chat: Chat
}

export function ChatHeader({ chat }: ChatHeaderProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <div className="border-b p-4 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <Avatar>
          <AvatarFallback className="bg-green-600 text-white">
            {getInitials(chat.name)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-semibold">{chat.name}</h2>
          <p className="text-sm text-gray-500">Online</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon">
          <FiPhone className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <FiVideo className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <FiMoreVertical className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
