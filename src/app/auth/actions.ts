'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const remember = formData.get('remember') === 'on'
  const supabase = await createClient(remember)

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/login?error=' + encodeURIComponent(error.message))
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    redirect('/signup?error=' + encodeURIComponent(error.message))
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}
export async function sendResetCode(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string

  const { error } = await supabase.auth.resetPasswordForEmail(email)

  if (error) {
    redirect(`/login/forgot-password?error=${encodeURIComponent(error.message)}`)
  }

  // Redirect to verification page with email in query
  redirect(`/login/verify-code?email=${encodeURIComponent(email)}`)
}

export async function verifyResetCode(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const token = formData.get('code') as string

  const { error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'recovery',
  })

  if (error) {
    redirect(`/login/verify-code?email=${encodeURIComponent(email)}&error=${encodeURIComponent(error.message)}`)
  }

  // Successfully verified, redirects to set new password
  redirect('/auth/reset-password')
}

export async function updatePasswordAfterReset(formData: FormData) {
  const supabase = await createClient()
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (password !== confirmPassword) {
    redirect('/auth/reset-password?error=' + encodeURIComponent("Passwords don't match"))
  }

  const { error } = await supabase.auth.updateUser({
    password,
  })

  if (error) {
    redirect('/auth/reset-password?error=' + encodeURIComponent(error.message))
  }

  redirect('/login?message=' + encodeURIComponent('Password updated successfully. You can now login.'))
}
