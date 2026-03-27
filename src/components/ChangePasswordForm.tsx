'use client'

import { useState } from 'react'
import { updatePassword } from '@/app/dashboard/profile/actions'
import { ShieldCheck } from 'lucide-react'

export default function ChangePasswordForm() {
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    try {
      const res = await (updatePassword(formData) as any)
      if (res?.error) {
        alert(res.error)
      } else {
        alert('Password updated successfully!')
        const form = document.querySelector('.password-form') as HTMLFormElement
        if (form) form.reset()
      }
    } catch (err) {
      alert('An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="content-card">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <ShieldCheck size={24} color="var(--accent-primary)" />
        <h2 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 700 }}>Security Settings</h2>
      </div>

      <form 
        action={handleSubmit}
        className="auth-form password-form" 
        style={{ maxWidth: '400px' }}
      >
        <div className="form-group">
          <label htmlFor="password" style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>New Password</label>
          <input 
            type="password" 
            id="password" 
            name="password" 
            className="form-input" 
            style={{ marginTop: '0.5rem' }}
            placeholder="••••••••" 
            required
          />
        </div>

        <div className="form-group" style={{ marginTop: '1rem' }}>
          <label htmlFor="confirmPassword" style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Confirm New Password</label>
          <input 
            type="password" 
            id="confirmPassword" 
            name="confirmPassword" 
            className="form-input" 
            style={{ marginTop: '0.5rem' }}
            placeholder="••••••••" 
            required
          />
        </div>

        <div style={{ marginTop: '2rem' }}>
          <button type="submit" className="auth-button" style={{ padding: '0.75rem 2.5rem' }} disabled={loading}>
            {loading ? 'Updating...' : 'Change Password'}
          </button>
        </div>
      </form>
    </div>
  )
}
