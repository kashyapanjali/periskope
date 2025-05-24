export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      chats: {
        Row: {
          id: string
          name: string
          last_message: string | null
          created_at: string
          label_id: string | null
          assigned_to: string | null
        }
        Insert: {
          id?: string
          name: string
          last_message?: string | null
          created_at?: string
          label_id?: string | null
          assigned_to?: string | null
        }
        Update: {
          id?: string
          name?: string
          last_message?: string | null
          created_at?: string
          label_id?: string | null
          assigned_to?: string | null
        }
      }
      messages: {
        Row: {
          id: string
          chat_id: string
          sender_id: string
          content: string
          created_at: string
          attachment_url: string | null
          attachment_type: string | null
        }
        Insert: {
          id?: string
          chat_id: string
          sender_id: string
          content: string
          created_at?: string
          attachment_url?: string | null
          attachment_type?: string | null
        }
        Update: {
          id?: string
          chat_id?: string
          sender_id?: string
          content?: string
          created_at?: string
          attachment_url?: string | null
          attachment_type?: string | null
        }
      }
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
        }
      }
      labels: {
        Row: {
          id: string
          name: string
          color: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          color: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          color?: string
          created_at?: string
        }
      }
      chat_labels: {
        Row: {
          chat_id: string
          label_id: string
          created_at: string
        }
        Insert: {
          chat_id: string
          label_id: string
          created_at?: string
        }
        Update: {
          chat_id?: string
          label_id?: string
          created_at?: string
        }
      }
      chat_participants: {
        Row: {
          chat_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          chat_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          chat_id?: string
          user_id?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
