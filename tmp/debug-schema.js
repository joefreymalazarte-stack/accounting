const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Manually parse .env.local
const envPath = path.resolve(process.cwd(), '.env.local')
const envContent = fs.readFileSync(envPath, 'utf8')
const env = {}
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=')
  if (key && value) {
    env[key.trim()] = value.trim()
  }
})

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function debug() {
  console.log('--- Database Debug ---')
  console.log('URL:', supabaseUrl)
  
  console.log('\n1. Checking source_documents table...')
  const { data: sdData, error: sdError } = await supabase.from('source_documents').select('*').limit(1)
  if (sdError) {
    console.error('❌ Error fetching source_documents:', sdError.message, sdError.code)
  } else {
    console.log('✅ Successfully reached source_documents. Rows found:', sdData.length)
  }

  console.log('\n2. Checking profiles table...')
  const { data: pData, error: pError } = await supabase.from('profiles').select('*').limit(1)
  if (pError) {
    console.error('❌ Error fetching profiles:', pError.message)
  } else {
    console.log('✅ Successfully reached profiles. Rows found:', pData.length)
  }
}

debug()
