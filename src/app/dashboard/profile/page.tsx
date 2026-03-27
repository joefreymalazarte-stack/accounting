import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { uploadAvatar } from './actions'
import Image from 'next/image'
import { User } from 'lucide-react'
import ChangePasswordForm from '@/components/ChangePasswordForm'
import ProfileIdentityForm from '@/components/ProfileIdentityForm'

export default async function ProfilePage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '4rem' }}>
      <h1 className="page-title">Profile Settings</h1>
      <p className="page-subtitle">Manage your account identity and system preferences.</p>

      {/* Profile Identity Card */}
      <div className="content-card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '2rem', fontWeight: 700 }}>Profile Identity</h2>
        
        <div style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '2rem', padding: '1.5rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <div style={{ width: '100px', height: '100px', borderRadius: '50%', overflow: 'hidden', background: 'var(--bg-tertiary)', border: '2px solid var(--accent-primary)', position: 'relative', boxShadow: '0 0 20px rgba(99, 102, 241, 0.2)' }}>
            {profile?.avatar_url ? (
               <Image src={profile.avatar_url} alt="Profile" fill style={{ objectFit: 'cover' }} />
            ) : (
               <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <User size={48} color="var(--text-secondary)" />
               </div>
            )}
          </div>
          
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem' }}>Avatar Image</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>Upload a square image for best results.</p>
            <form 
              action={async (formData) => {
                'use server'
                await uploadAvatar(formData)
              }} 
              style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}
            >
               <input type="file" name="avatar" accept="image/*" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', width: 'auto' }} required />
               <button type="submit" className="auth-button" style={{ marginTop: 0, padding: '0.5rem 1.25rem', fontSize: '0.75rem' }}>Change Image</button>
            </form>
          </div>
        </div>

        <ProfileIdentityForm profile={profile} userEmail={user.email || ''} />
      </div>

      {/* Security Settings Card */}
      <ChangePasswordForm />
    </div>
  )
}
