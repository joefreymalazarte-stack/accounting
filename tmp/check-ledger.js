const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

const envContent = fs.readFileSync('.env.local', 'utf8')
const env = {}
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=')
  if (key && value) env[key.trim()] = value.trim()
})

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

async function checkSchema() {
  console.log('Checking ledger_entries schema...')
  const { data, error } = await supabase.from('ledger_entries').select('*').limit(1)
  if (error) {
    console.error('Error:', error.message)
  } else {
    console.log('Sample entry:', data[0])
  }
}

checkSchema()
