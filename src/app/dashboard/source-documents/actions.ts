'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createSourceDocument(formData: FormData) {
  const supabase = await createClient()

  const type = formData.get('type') as string
  const amount = parseFloat(formData.get('amount') as string)
  const description = formData.get('description') as string

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase.from('source_documents').insert({
    user_id: user.id,
    type,
    amount,
    description,
  })

  if (error) {
    console.error(error)
    return { error: 'Failed to create document' }
  }

  revalidatePath('/dashboard/source-documents')
  return { success: true }
}
