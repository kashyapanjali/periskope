"use client"

import type React from "react"

import { useRef, useEffect } from "react"
import type { Message } from "@/lib/types"
import { Avatar } from "@/components/ui/avatar"
import { AvatarFallback } from "@/components/ui/avatar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface ChatMessagesProps {
  messages: Message[]
  currentUserId: string
  messagesEndRef: React.RefObject<HTMLDivElement>
}

export function ChatMessages({ messages, currentUserId, messagesEndRef }: ChatMessagesProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [messages])

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  // Group messages by date
  const groupedMessages: { [key: string]: Message[] } = {}
  messages.forEach((message) => {
    const date = new Date(message.created_at).toDateString()
    if (!groupedMessages[date]) {
      groupedMessages[date] = []
    }
    groupedMessages[date].push(message)
  })

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => {
        const isCurrentUser = message.sender_id === currentUserId
        const senderName = message.sender?.full_name || message.sender?.email?.split("@")[0] || "Unknown"

        return (
          <div
            key={message.id}
            className={cn("flex", isCurrentUser ? "justify-end" : "justify-start")}
          >
            {!isCurrentUser && (
              <Avatar className="h-8 w-8 mr-2 mt-1">
                <AvatarFallback className="bg-green-600 text-white text-xs">
                  {getInitials(senderName)}
                </AvatarFallback>
              </Avatar>
            )}
            <div
              className={cn(
                "max-w-[70%] rounded-lg p-3",
                isCurrentUser ? "bg-green-600 text-white" : "bg-gray-100 text-gray-900",
              )}
            >
              {!isCurrentUser && (
                <div className="text-xs text-gray-500 mb-1">{senderName}</div>
              )}
              {message.attachment_url && (
                <div className="mb-2">
                  {message.attachment_type?.startsWith("image/") ? (
                    <img
                      src={message.attachment_url}
                      alt="Attachment"
                      className="max-w-full rounded-lg"
                    />
                  ) : message.attachment_type?.startsWith("video/") ? (
                    <video
                      src={message.attachment_url}
                      controls
                      className="max-w-full rounded-lg"
                    />
                  ) : (
                    <a
                      href={message.attachment_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      Download Attachment
                    </a>
                  )}
                </div>
              )}
              <div className="text-sm">{message.content}</div>
              <div
                className={cn(
                  "text-xs mt-1",
                  isCurrentUser ? "text-green-100" : "text-gray-500",
                )}
              >
                {format(new Date(message.created_at), "h:mm a")}
              </div>
            </div>
            {isCurrentUser && (
              <Avatar className="h-8 w-8 ml-2 mt-1">
                <AvatarFallback className="bg-green-600 text-white text-xs">
                  {getInitials(senderName)}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        )
      })}
      <div ref={messagesEndRef} />
    </div>
  )
}
