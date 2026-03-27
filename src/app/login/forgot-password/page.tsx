import { sendResetCode } from '@/app/auth/actions'
import Link from 'next/link'

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const errorMessage = (await searchParams).error

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Reset Password</h1>
          <p>Enter your email to receive an authentication code.</p>
        </div>

        {errorMessage && (
          <div className="error-message">
            {errorMessage}
          </div>
        )}

        <form className="auth-form" action={sendResetCode}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input 
              className="form-input" 
              id="email" 
              name="email" 
              type="email" 
              required 
              placeholder="you@example.com"
            />
          </div>
          <button className="auth-button" type="submit">
            Send Reset Code
          </button>
        </form>

        <div className="auth-footer" style={{ marginTop: '1.5rem' }}>
          Remembered your password? <Link href="/login">Back to Login</Link>
        </div>
      </div>
    </div>
  )
}
