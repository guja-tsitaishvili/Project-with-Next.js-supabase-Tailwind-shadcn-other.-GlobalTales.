import { createClient, type SupabaseClient } from "@supabase/supabase-js"

// Get env variables safely
const supabaseUrl: string = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseAnonKey: string = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

// Create client
const client: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey)

export default client
