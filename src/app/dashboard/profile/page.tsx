import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { updateProfile, uploadAvatar } from './actions'
import Image from 'next/image'
import { User } from 'lucide-react'

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
    <div>
      <h1 className="page-title">Profile Settings</h1>
      <p className="page-subtitle">Manage your account settings and preferences.</p>

      <div className="content-card" style={{ maxWidth: '600px' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: 600 }}>Account Information</h2>
        
        <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {profile?.avatar_url ? (
               <Image src={profile.avatar_url} alt="Profile" width={80} height={80} style={{ objectFit: 'cover' }} />
            ) : (
               <User size={40} color="var(--text-secondary)" />
            )}
          </div>
          
          <form action={uploadAvatar} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Upload new avatar</label>
            <div style={{ display: 'flex', gap: '1rem' }}>
               <input type="file" name="avatar" accept="image/*" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }} required />
               <button type="submit" className="auth-button" style={{ marginTop: 0, padding: '0.5rem 1rem', fontSize: '0.875rem' }}>Upload</button>
            </div>
          </form>
        </div>

        <form action={updateProfile} className="auth-form">
          <div className="form-group">
            <label>Email Address</label>
            <input type="text" className="form-input" disabled value={user.email} style={{ opacity: 0.7, cursor: 'not-allowed' }} />
          </div>

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input 
              type="text" 
              id="username" 
              name="username" 
              className="form-input" 
              defaultValue={profile?.username || ''} 
              placeholder="Enter your username" 
            />
          </div>

          <div className="form-group">
             <label htmlFor="notes">Notes</label>
             <textarea 
               id="notes" 
               name="notes" 
               className="form-input" 
               rows={4} 
               defaultValue={profile?.notes || ''} 
               placeholder="Add some notes about your account..." 
             />
          </div>

          <button type="submit" className="auth-button" style={{ alignSelf: 'flex-start', padding: '0.75rem 2rem' }}>
            Save Changes
          </button>
        </form>
      </div>
    </div>
  )
}
