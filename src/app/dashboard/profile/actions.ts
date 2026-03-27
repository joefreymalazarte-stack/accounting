'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const username = formData.get('username') as string
  const notes = formData.get('notes') as string

  // Check if profile exists
  const { data: existing } = await supabase.from('profiles').select('id').eq('id', user.id).single()
  
  let error;
  if (existing) {
    const { error: updateError } = await supabase.from('profiles').update({
      username,
      notes,
    }).eq('id', user.id)
    error = updateError
  } else {
    const { error: insertError } = await supabase.from('profiles').insert({
      id: user.id,
      username,
      notes,
    })
    error = insertError
  }

  if (error) {
    console.error(error)
    return { error: 'Failed to update profile details' }
  }

  revalidatePath('/dashboard', 'layout')
  return { success: true }
}

export async function uploadAvatar(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const file = formData.get('avatar') as File
  if (!file || file.size === 0) return { error: 'No file selected' }

  const fileExt = file.name.split('.').pop()
  const filePath = `${user.id}-${Math.random()}.${fileExt}`

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file)

  if (uploadError) {
    console.error(uploadError)
    return { error: 'Failed to upload image' }
  }

  const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(filePath)
  const avatarUrl = publicUrlData.publicUrl

  // Check if profile exists
  const { data: existing } = await supabase.from('profiles').select('id').eq('id', user.id).single()
  
  let error;
  if (existing) {
    const { error: updateError } = await supabase.from('profiles').update({
      avatar_url: avatarUrl,
    }).eq('id', user.id)
    error = updateError
  } else {
    const { error: insertError } = await supabase.from('profiles').insert({
      id: user.id,
      avatar_url: avatarUrl,
    })
    error = insertError
  }

  if (error) {
    return { error: 'Failed to update profile picture' }
  }

  revalidatePath('/dashboard', 'layout')
  return { success: true, avatar_url: avatarUrl }
}
