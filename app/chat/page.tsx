import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase-server"
import ChatLayout from "@/components/chat-layout"

export default async function ChatPage() {
  const supabase = createServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/")
  }

  // Fetch initial chats data
  const { data: chats } = await supabase.from("chats").select("*").order("created_at", { ascending: false })

  // Fetch user data
  const { data: userData } = await supabase.from("users").select("*").eq("id", session.user.id).single()

  const user = userData || {
    id: session.user.id,
    email: session.user.email,
    full_name: session.user.email?.split("@")[0] || "User",
    avatar_url: null,
  }

  return <ChatLayout initialChats={chats || []} user={user} />
}
