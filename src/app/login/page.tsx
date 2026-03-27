import { login } from '@/app/actions'
import Link from 'next/link'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>
}) {
  const params = await searchParams
  const errorMessage = params.error
  const successMessage = params.message

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Login to your Accounting Dashboard</p>
        </div>

        {errorMessage && (
          <div className="error-message">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.2)', color: '#22c55e', padding: '1rem', borderRadius: '8px', marginBottom: '2rem', fontSize: '0.875rem', textAlign: 'center' }}>
            {successMessage}
          </div>
        )}

        <form className="auth-form" action={login} autoComplete="off">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              className="form-input" 
              id="email" 
              name="email" 
              type="email" 
              required 
              placeholder="you@example.com"
              autoComplete="off"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              className="form-input" 
              id="password" 
              name="password" 
              type="password" 
              required 
              placeholder="••••••••"
              autoComplete="off"
            />
          </div>
          
          <button className="auth-button" type="submit">
            Sign In
          </button>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', fontSize: '0.8125rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--text-secondary)' }}>
              <input type="checkbox" name="remember" style={{ accentColor: 'var(--accent-primary)' }} />
              Remember Me
            </label>
            
            <Link href="/login/forgot-password" style={{ color: 'var(--accent-secondary)', fontWeight: 600, textDecoration: 'none' }}>
              Forgot password?
            </Link>
          </div>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link href="/signup">Sign up</Link>
        </div>
      </div>
    </div>
  )
}
