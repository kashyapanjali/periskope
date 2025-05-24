export interface Chat {
  id: string
  name: string
  last_message: string | null
  created_at: string
  label_id: string | null
  assigned_to: string | null
  label?: Label
  assigned_user?: User
  messages?: Message[]
}

export interface Message {
  id: string
  chat_id: string
  sender_id: string
  content: string
  created_at: string
  attachment_url: string | null
  attachment_type: string | null
  sender?: User
}

export interface User {
  id: string
  email: string
  full_name: string
  phone_number: string | null
  created_at: string
  avatar_url: string | null
}

export interface Label {
  id: string
  name: string
  color: string
  created_at: string
}

export interface ChatLabel {
  id: string
  chat_id: string
  label_id: string
  created_at: string
  label: Label
}
