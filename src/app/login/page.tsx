import { login } from '@/app/actions'
import Link from 'next/link'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const errorMessage = (await searchParams).error

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

        <form className="auth-form" action={login}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              className="form-input" 
              id="email" 
              name="email" 
              type="email" 
              required 
              placeholder="you@example.com"
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
            />
          </div>
          <button className="auth-button" formAction={login}>
            Sign In
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link href="/signup">Sign up</Link>
        </div>
      </div>
    </div>
  )
}
