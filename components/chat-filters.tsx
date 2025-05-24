"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FiSearch, FiFilter } from "react-icons/fi"
import type { Label as LabelType } from "@/lib/types"

interface ChatFiltersProps {
  labels: LabelType[]
  onSearch: (query: string) => void
  onLabelFilter: (labelId: string | null) => void
  onAssigneeFilter: (assigneeId: string | null) => void
  users: { id: string; full_name: string | null }[]
}

export function ChatFilters({ labels, onSearch, onLabelFilter, onAssigneeFilter, users }: ChatFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchQuery)
  }

  return (
    <div className="p-4 border-b">
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button type="submit">Search</Button>
      </form>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Filter by Label</Label>
          <Select onValueChange={(value) => onLabelFilter(value === "all" ? null : value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select label" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Labels</SelectItem>
              {labels.map((label) => (
                <SelectItem key={label.id} value={label.id}>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: label.color }} />
                    {label.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Filter by Assignee</Label>
          <Select onValueChange={(value) => onAssigneeFilter(value === "all" ? null : value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select assignee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Assignees</SelectItem>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.full_name || user.id}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
} 