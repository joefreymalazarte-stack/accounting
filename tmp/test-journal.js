const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

const envContent = fs.readFileSync('.env.local', 'utf8')
const env = {}
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=')
  if (key && value) env[key.trim()] = value.trim()
})

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

async function testInsert() {
  console.log('Testing Journal Entry insertion...')
  
  // Try to find a user first
  const { data: { users } } = await supabase.auth.admin.listUsers()
  const user = users?.[0]
  
  if (!user) {
    console.log('No users found. Trying a plain insert...')
  }

  const { data, error } = await supabase
    .from('journal_entries')
    .insert({
      date: '2026-03-20',
      description: 'Test entry',
    })
    .select()

  if (error) {
    console.error('Insert Error:', error.message, error.code, error.details)
  } else {
    console.log('Success!', data)
  }
}

testInsert()
