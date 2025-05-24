"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import {
  Search,
  Filter,
  Home,
  MessageSquare,
  BarChart2,
  List,
  Users,
  LogOut,
  RefreshCw,
  HelpCircle,
  Star,
  Phone,
  ChevronDown,
  Plus,
  Smile,
  Paperclip,
  ImageIcon,
  Mic,
  Send,
} from "lucide-react"

interface Chat {
  id: string
  name: string
  lastMessage: string
  time: string
  status: string
  unreadCount?: number
  avatar: string
}

interface Message {
  id: string
  content: string
  sender: string
  time: string
  isFromMe: boolean
  date: string
}

const sampleChats: Chat[] = [
  {
    id: "1",
    name: "Test El Centro",
    lastMessage: "WhatsApp, Bharat, Kumar Bansal, Periskope",
    time: "22-01-2025",
    status: "Open",
    avatar: "TC",
  },
  {
    id: "2",
    name: "Test Shape Final 6",
    lastMessage: "Subject: This doesn't go on Tuesday...",
    time: "22-01-2025",
    status: "Open",
    unreadCount: 2,
    avatar: "TS",
  },
  {
    id: "3",
    name: "Periskope Team Chat",
    lastMessage: "Periskope: Test message",
    time: "22-01-2025",
    status: "Internal",
    unreadCount: 1,
    avatar: "PT",
  },
  {
    id: "4",
    name: "+91 99999 99999",
    lastMessage: "Hi there, I'm Swapnika, Co-Founder of...",
    time: "22-01-2025",
    status: "Open",
    avatar: "91",
  },
  {
    id: "5",
    name: "Test Demo!?",
    lastMessage: "Bonjour, 123",
    time: "22-01-2025",
    status: "Connect",
    avatar: "TD",
  },
  {
    id: "6",
    name: "Test El Centro",
    lastMessage: "Bonjour, Hello, Ahmedpur!!",
    time: "22-01-2025",
    status: "Open",
    avatar: "TC",
  },
  {
    id: "7",
    name: "Testing group",
    lastMessage: "Testing 12345",
    time: "22-01-2025",
    status: "Open",
    avatar: "TG",
  },
  {
    id: "8",
    name: "Yash 3",
    lastMessage: "✨ First Bulk Message",
    time: "22-01-2025",
    status: "Sent Sent",
    avatar: "Y3",
  },
  {
    id: "9",
    name: "Test Shape Final 8473",
    lastMessage: "Testing",
    time: "22-01-2025",
    status: "Open",
    avatar: "TS",
  },
  {
    id: "10",
    name: "Skype Demo",
    lastMessage: "Test 123",
    time: "22-01-2025",
    status: "Open",
    avatar: "SD",
  },
  {
    id: "11",
    name: "Test Demo!5",
    lastMessage: "Test 123",
    time: "22-01-2025",
    status: "Open",
    avatar: "TD",
  },
]

const sampleMessages: Message[] = [
  {
    id: "1",
    content: "Hello, South East!",
    sender: "Bhavnay Arjun",
    time: "09:30",
    isFromMe: false,
    date: "23-01-2025",
  },
  {
    id: "2",
    content: "Hello, Livana!",
    sender: "Bhavnay Arjun",
    time: "10:15",
    isFromMe: false,
    date: "23-01-2025",
  },
  {
    id: "3",
    content: "CDBET",
    sender: "Bhavnay Arjun",
    time: "10:16",
    isFromMe: false,
    date: "23-01-2025",
  },
  {
    id: "4",
    content: "test el Centro",
    sender: "Periskope",
    time: "14:30",
    isFromMe: true,
    date: "23-01-2025",
  },
  {
    id: "5",
    content: "testing",
    sender: "Periskope",
    time: "15:45",
    isFromMe: true,
    date: "23-01-2025",
  },
]

export default function ChatPreview() {
  const [activeChat, setActiveChat] = useState<Chat>(sampleChats[0])
  const [messages, setMessages] = useState<Message[]>(sampleMessages)
  const [newMessage, setNewMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const filteredChats = sampleChats.filter((chat) => chat.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "open":
        return "bg-green-500"
      case "closed":
        return "bg-red-500"
      case "internal":
        return "bg-blue-500"
      case "connect":
        return "bg-orange-500"
      case "sent sent":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: "Periskope",
      time: format(new Date(), "HH:mm"),
      isFromMe: true,
      date: format(new Date(), "dd-MM-yyyy"),
    }

    setMessages((prev) => [...prev, message])
    setNewMessage("")
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Group messages by date
  const groupedMessages: { [key: string]: Message[] } = {}
  messages.forEach((message) => {
    if (!groupedMessages[message.date]) {
      groupedMessages[message.date] = []
    }
    groupedMessages[message.date].push(message)
  })

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <div className="w-80 border-r flex flex-col h-full bg-white">
        <div className="p-4 border-b">
          <div className="flex items-center space-x-2 mb-4">
            <Avatar className="h-8 w-8 bg-green-600">
              <AvatarFallback className="text-white text-xs font-semibold">P</AvatarFallback>
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
              className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                activeChat?.id === chat.id ? "bg-gray-50" : ""
              }`}
              onClick={() => setActiveChat(chat)}
            >
              <div className="flex items-start">
                <Avatar className="h-10 w-10 mr-3 mt-0.5">
                  <AvatarFallback className="bg-gray-200 text-gray-600 text-xs">{chat.avatar}</AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-sm truncate">{chat.name}</h3>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{chat.time}</span>
                  </div>

                  <p className="text-xs text-gray-500 truncate mt-0.5">{chat.lastMessage}</p>

                  <div className="flex items-center justify-between mt-1.5">
                    <div className="flex items-center">
                      <Badge variant="outline" className="text-[10px] h-5 border-none">
                        <span className={`h-2 w-2 rounded-full ${getStatusColor(chat.status)} mr-1.5`}></span>
                        {chat.status}
                      </Badge>
                    </div>

                    {chat.unreadCount && chat.unreadCount > 0 && (
                      <Badge className="bg-green-500 text-[10px] h-5">{chat.unreadCount}</Badge>
                    )}
                  </div>
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
            <Button variant="ghost" size="sm" className="h-10 w-10 p-0">
              <LogOut className="h-5 w-5 text-gray-500" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Chat Header */}
        <div className="border-b p-4 bg-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="font-medium text-sm mr-2">{activeChat.name}</h2>
              <div className="flex items-center space-x-1">
                <Badge variant="outline" className="text-[10px] h-5 border-none">
                  <span className={`h-2 w-2 rounded-full ${getStatusColor(activeChat.status)} mr-1.5`}></span>
                  {activeChat.status}
                </Badge>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <RefreshCw className="h-4 w-4 text-gray-500" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <HelpCircle className="h-4 w-4 text-gray-500" />
              </Button>
              <span className="text-xs text-gray-500 mx-1">3 / 5 agents</span>
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <Avatar key={i} className="h-6 w-6 border-2 border-white">
                    <AvatarFallback className="bg-gray-200 text-gray-600 text-[10px]">
                      {String.fromCharCode(64 + i)}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 ml-1">
                <Plus className="h-4 w-4 text-gray-500" />
              </Button>
            </div>
          </div>

          <div className="flex mt-2 justify-between">
            <div className="flex space-x-1">
              <Button variant="ghost" size="sm" className="h-8 text-xs">
                <Star className="h-3.5 w-3.5 mr-1 text-gray-500" />
                <span className="text-gray-700">CVFER</span>
              </Button>
              <Button variant="ghost" size="sm" className="h-8 text-xs">
                <span className="text-gray-700">CDBET</span>
              </Button>
            </div>

            <div className="flex space-x-1">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Phone className="h-4 w-4 text-gray-500" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Search className="h-4 w-4 text-gray-500" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {Object.entries(groupedMessages).map(([date, dateMessages]) => (
            <div key={date}>
              <div className="text-center my-4">
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{date}</span>
              </div>

              {dateMessages.map((message, index) => {
                const showAvatar = index === 0 || dateMessages[index - 1].sender !== message.sender

                return (
                  <div key={message.id} className={`flex mb-4 ${message.isFromMe ? "justify-end" : "justify-start"}`}>
                    {!message.isFromMe && showAvatar && (
                      <Avatar className="h-8 w-8 mr-2 mt-1">
                        <AvatarFallback className="bg-green-600 text-white text-xs">
                          {message.sender
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                    )}

                    {!message.isFromMe && !showAvatar && <div className="w-8 mr-2"></div>}

                    <div className={`max-w-[70%] ${message.isFromMe ? "order-1" : "order-2"}`}>
                      {showAvatar && !message.isFromMe && (
                        <div className="text-xs text-gray-500 mb-1 ml-1">{message.sender}</div>
                      )}

                      <div
                        className={`rounded-lg p-3 ${
                          message.isFromMe ? "bg-green-600 text-white" : "bg-white border text-gray-800"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                      </div>

                      <div className={`text-xs text-gray-500 mt-1 ${message.isFromMe ? "text-right mr-1" : "ml-1"}`}>
                        {message.time}
                      </div>
                    </div>

                    {message.isFromMe && showAvatar && (
                      <Avatar className="h-8 w-8 ml-2 mt-1 order-2">
                        <AvatarFallback className="bg-green-600 text-white text-xs">P</AvatarFallback>
                      </Avatar>
                    )}

                    {message.isFromMe && !showAvatar && <div className="w-8 ml-2 order-2"></div>}
                  </div>
                )
              })}
            </div>
          ))}

          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="border-t p-4 bg-white">
          <div className="flex items-center text-xs text-gray-500 mb-2">
            <span className="flex items-center">
              <span className="w-4 h-4 rounded-full bg-green-500 mr-1 flex items-center justify-center text-white text-[8px]">
                W
              </span>
              WhatsApp
            </span>
            <span className="mx-2">•</span>
            <span>Private Note</span>
            <span className="mx-2">•</span>
            <span>+</span>
          </div>

          <form onSubmit={handleSendMessage}>
            <div className="relative">
              <Textarea
                placeholder="Message..."
                className="resize-none pr-12 min-h-[60px] max-h-32"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage(e)
                  }
                }}
              />

              <div className="absolute right-3 bottom-3">
                <Button
                  type="submit"
                  size="sm"
                  className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700 rounded-full"
                  disabled={!newMessage.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </form>

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Plus className="h-4 w-4 text-gray-500" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Paperclip className="h-4 w-4 text-gray-500" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <ImageIcon className="h-4 w-4 text-gray-500" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Mic className="h-4 w-4 text-gray-500" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Smile className="h-4 w-4 text-gray-500" />
              </Button>
            </div>

            <div className="flex items-center">
              <span className="text-xs text-gray-500">Periskope</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
