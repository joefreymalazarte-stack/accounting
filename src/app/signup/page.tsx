import { signup } from '@/app/actions'
import Link from 'next/link'

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const errorMessage = (await searchParams).error

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Create an Account</h1>
          <p>Start managing your finances today</p>
        </div>

        {errorMessage && (
          <div className="error-message">
            {errorMessage}
          </div>
        )}

        <form className="auth-form" action={signup}>
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
          <button className="auth-button" formAction={signup}>
            Sign Up
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link href="/login">Sign in</Link>
        </div>
      </div>
    </div>
  )
}
