const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

// Manually parse .env.local for credentials
const envContent = fs.readFileSync('.env.local', 'utf8')
const env = {}
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=')
  if (key && value) env[key.trim()] = value.trim()
})

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

async function check() {
  const { data, error } = await supabase.from('source_documents').select('id').limit(1)
  if (error) {
    console.log('Error:', error.message)
  } else {
    console.log('Success! Table exists.')
  }
}
check()
