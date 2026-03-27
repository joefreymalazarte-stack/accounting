'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { ProfileSchema, PasswordSchema } from '@/utils/validation'

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const rawData = {
    username: formData.get('username') as string,
    notes: formData.get('notes') as string,
    currency_code: formData.get('currency_code') as string || 'PHP',
  }

  const result = ProfileSchema.safeParse(rawData)
  if (!result.success) {
    return { error: result.error.issues[0].message }
  }

  const { username, notes, currency_code } = result.data

  // Check if profile exists
  const { data: existing } = await supabase.from('profiles').select('id').eq('id', user.id).single()
  
  let error;
  if (existing) {
    const { error: updateError } = await supabase.from('profiles').update({
      username,
      notes,
      currency_code,
    }).eq('id', user.id)
    error = updateError
  } else {
    const { error: insertError } = await supabase.from('profiles').insert({
      id: user.id,
      username,
      notes,
      currency_code,
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

export async function updatePassword(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const rawData = {
    password: formData.get('password') as string,
    confirmPassword: formData.get('confirmPassword') as string,
  }

  const result = PasswordSchema.safeParse(rawData)
  if (!result.success) {
    return { error: result.error.issues[0].message }
  }

  const { error } = await supabase.auth.updateUser({
    password: result.data.password
  })

  if (error) {
    console.error('Password update error:', error.message)
    return { error: error.message }
  }

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
