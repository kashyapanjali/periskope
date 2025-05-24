"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FiSend, FiPaperclip } from "react-icons/fi"

interface ChatInputProps {
  onSendMessage: (content: string, file?: File) => void
}

export function ChatInput({ onSendMessage }: ChatInputProps) {
  const [message, setMessage] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() || selectedFile) {
      onSendMessage(message, selectedFile || undefined)
      setMessage("")
      setSelectedFile(null)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleFileClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <form onSubmit={handleSubmit} className="flex-1 flex items-center space-x-2">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={handleFileClick}
        className="flex-shrink-0"
      >
        <FiPaperclip className="h-5 w-5" />
      </Button>
      <Input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        className="flex-1"
      />
      <Button
        type="submit"
        variant="ghost"
        size="icon"
        disabled={!message.trim() && !selectedFile}
        className="flex-shrink-0"
      >
        <FiSend className="h-5 w-5" />
      </Button>
    </form>
  )
}
