import { createClient } from '@supabase/supabase-js'

// Kunin ang mga variables mula sa .env
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// I-initialize ang client
export const supabase = createClient(supabaseUrl, supabaseKey)