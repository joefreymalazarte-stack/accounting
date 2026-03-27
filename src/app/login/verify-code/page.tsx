import { verifyResetCode } from '@/app/auth/actions'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import OtpTimer from '@/components/OtpTimer'

export default async function VerifyCodePage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; error?: string }>
}) {
  const params = await searchParams
  const email = params.email
  const errorMessage = params.error

  if (!email) {
    redirect('/login/forgot-password')
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Verify Code</h1>
          <p>Enter the 6-digit code sent to <br/><strong>{email}</strong></p>
        </div>

        {errorMessage && (
          <div className="error-message">
            {errorMessage}
          </div>
        )}

        <form className="auth-form" action={verifyResetCode}>
          <input type="hidden" name="email" value={email} />
          <div className="form-group">
            <label htmlFor="code">Authentication Code</label>
            <input 
              className="form-input" 
              id="code" 
              name="code" 
              type="text" 
              required 
              placeholder="123456"
              maxLength={10}
              style={{ textAlign: 'center', letterSpacing: '0.2em', fontSize: '1.25rem' }}
            />
          </div>
          
          <OtpTimer />

          <button className="auth-button" type="submit" style={{ marginTop: '1.5rem' }}>
            Verify & Continue
          </button>
        </form>

        <div className="auth-footer" style={{ marginTop: '1.5rem' }}>
          Didn't get the code? <Link href={`/login/forgot-password?email=${encodeURIComponent(email)}`}>Try again</Link>
        </div>
      </div>
    </div>
  )
}
