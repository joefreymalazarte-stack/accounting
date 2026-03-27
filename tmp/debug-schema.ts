import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

// Manually parse .env.local to get Supabase credentials
function getEnv() {
  const envPath = path.resolve(process.cwd(), '.env.local')
  if (!fs.existsSync(envPath)) return {}
  const content = fs.readFileSync(envPath, 'utf-8')
  const env: Record<string, string> = {}
  content.split('\n').forEach(line => {
    const [key, value] = line.split('=')
    if (key && value) env[key.trim()] = value.trim()
  })
  return env
}

const env = getEnv()
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function debug() {
  console.log('--- Testing source_documents Table ---')
  const { data, error } = await supabase.from('source_documents').select('*').limit(1)
  
  if (error) {
    console.error('Fetch Error:', error.message)
  } else {
    console.log('Success! Table "source_documents" is reachable.')
    console.log('Sample Data Rows:', data.length)
  }
}

debug().catch(console.error)
