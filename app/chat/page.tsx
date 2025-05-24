import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase-server"
import ChatLayout from "@/components/chat-layout"

export default async function ChatPage() {
  try {
    const supabase = await createServerClient()
    
    // Get authenticated user
    const { data: { user }, error: userAuthError } = await supabase.auth.getUser()
    
    if (userAuthError) {
      console.error("Auth error:", userAuthError.message)
      redirect("/")
    }

    if (!user) {
      console.error("No authenticated user found")
      redirect("/")
    }

    // Fetch initial chats data
    const { data: chats, error: chatsError } = await supabase
      .from("chats")
      .select(`
        *,
        participants:chat_participants!inner(user_id)
      `)
      .eq('chat_participants.user_id', user.id)
      .order("created_at", { ascending: false })

    if (chatsError) {
      console.error("Chats error:", chatsError.message)
    }

    // No need to filter chats since we're using inner join
    const userChats = chats || []

    // Fetch user data
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single()

    if (userError) {
      console.error("User error:", userError.message)
    }

    // If user profile doesn't exist, create it
    if (!userData) {
      try {
        const { data: newUser, error: createError } = await supabase
          .from("users")
          .insert([
            {
              id: user.id,
              email: user.email,
              full_name: user.user_metadata?.full_name || user.email?.split("@")[0] || "User",
              avatar_url: null,
            }
          ])
          .select()
          .single()

        if (createError) {
          console.error("Error creating user profile:", createError.message)
        } else {
          console.log("Successfully created user profile:", newUser)
        }
      } catch (error: any) {
        console.error("Exception while creating user profile:", error.message)
      }
    }

    const userProfile = userData || {
      id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name || user.email?.split("@")[0] || "User",
      avatar_url: null,
    }

    return <ChatLayout initialChats={userChats} user={userProfile} />
  } catch (error: any) {
    console.error("Chat page error:", error.message)
    redirect("/")
  }
}
