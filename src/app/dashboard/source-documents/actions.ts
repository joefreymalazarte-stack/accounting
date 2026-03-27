'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { SourceDocumentSchema } from '@/utils/validation'

export async function createSourceDocument(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'User not authenticated' }

  const rawData = {
    type: formData.get('type') as string,
    document_number: formData.get('document_number') as string,
    date: formData.get('date') as string,
    amount: formData.get('amount') as string,
    description: formData.get('description') as string,
  }

  // Validate with Zod
  const validationResult = SourceDocumentSchema.safeParse(rawData)
  if (!validationResult.success) {
    return { error: validationResult.error.issues[0].message }
  }

  // Use validated data
  const { type, document_number, date, amount, description } = validationResult.data

  const { data, error } = await supabase
    .from('source_documents')
    .insert([{ type, document_number, date, amount, description, user_id: user.id }])

  if (error) {
    console.error(error)
    return { error: 'Failed to create document' }
  }

  revalidatePath('/dashboard/source-documents')
  return { success: true }
}

export async function deleteSourceDocument(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('source_documents').delete().eq('id', id)
  
  if (error) {
    console.error(error)
    return { error: 'Failed to delete document' }
  }

  revalidatePath('/dashboard/source-documents')
  return { success: true }
}
