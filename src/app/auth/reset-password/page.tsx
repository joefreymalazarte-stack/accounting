import { updatePasswordAfterReset } from '@/app/auth/actions'
import Link from 'next/link'

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const errorMessage = (await searchParams).error

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Set New Password</h1>
          <p>Choose a strong password for your account.</p>
        </div>

        {errorMessage && (
          <div className="error-message">
            {errorMessage}
          </div>
        )}

        <form className="auth-form" action={updatePasswordAfterReset}>
          <div className="form-group">
            <label htmlFor="password">New Password</label>
            <input 
              className="form-input" 
              id="password" 
              name="password" 
              type="password" 
              required 
              placeholder="••••••••"
              minLength={6}
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input 
              className="form-input" 
              id="confirmPassword" 
              name="confirmPassword" 
              type="password" 
              required 
              placeholder="••••••••"
              minLength={6}
            />
          </div>
          <button className="auth-button" type="submit">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  )
}
