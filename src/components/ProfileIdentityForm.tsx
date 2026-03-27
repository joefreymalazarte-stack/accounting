'use client'

import { useState } from 'react'
import { updateProfile } from '@/app/dashboard/profile/actions'

type ProfileIdentityFormProps = {
  profile: any
  userEmail: string
}

export default function ProfileIdentityForm({ profile, userEmail }: ProfileIdentityFormProps) {
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    try {
      const res = await (updateProfile(formData) as any)
      if (res?.error) {
        alert(res.error)
      } else {
        alert('Profile preferences updated successfully!')
      }
    } catch (err) {
      alert('An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form 
      action={handleSubmit}
      className="auth-form" 
      style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}
    >
      <div className="form-group" style={{ gridColumn: '1 / -1' }}>
        <label style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email Address</label>
        <input type="text" className="form-input" disabled value={userEmail} style={{ opacity: 0.6, cursor: 'not-allowed', marginTop: '0.5rem' }} />
      </div>

      <div className="form-group">
        <label htmlFor="username" style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Display Name</label>
        <input 
          type="text" 
          id="username" 
          name="username" 
          className="form-input" 
          style={{ marginTop: '0.5rem' }}
          defaultValue={profile?.username || ''} 
          placeholder="e.g. John Doe" 
        />
      </div>

      <div className="form-group">
        <label htmlFor="currency_code" style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Base Currency / Country</label>
        <select 
          id="currency_code" 
          name="currency_code" 
          className="form-input" 
          style={{ marginTop: '0.5rem' }}
          defaultValue={profile?.currency_code || 'PHP'}
        >
          <option value="PHP">Philippines (₱ - PESO)</option>
          <option value="USD">United States ($ - DOLLAR)</option>
          <option value="EUR">European Union (€ - EURO)</option>
          <option value="JPY">Japan (¥ - YEN)</option>
          <option value="GBP">United Kingdom (£ - POUND)</option>
          <option value="AUD">Australia ($ - AUD)</option>
          <option value="CAD">Canada ($ - CAD)</option>
          <option value="SGD">Singapore ($ - SGD)</option>
          <option value="AED">United Arab Emirates (د.إ - Dirham)</option>
          <option value="SAR">Saudi Arabia (﷼ - Riyal)</option>
          <option value="CNY">China (¥ - Yuan)</option>
          <option value="KRW">South Korea (₩ - Won)</option>
        </select>
      </div>

      <div className="form-group" style={{ gridColumn: '1 / -1' }}>
         <label htmlFor="notes" style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Personal Notes</label>
         <textarea 
           id="notes" 
           name="notes" 
           className="form-input" 
           style={{ marginTop: '0.5rem' }}
           rows={4} 
           defaultValue={profile?.notes || ''} 
           placeholder="Keep extra bookkeeping notes here..." 
         />
      </div>

      <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', marginTop: '1rem' }}>
        <button type="submit" className="auth-button" style={{ padding: '0.75rem 2.5rem' }} disabled={loading}>
          {loading ? 'Updating...' : 'Update Preferences'}
        </button>
      </div>
    </form>
  )
}
