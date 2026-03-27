import Sidebar from '@/components/Sidebar'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  // Protect dashboard routes
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch the public profile (will be null if none exists yet)
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="dashboard-container">
      <Sidebar userEmail={user.email} profile={profile} />
      <main className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <span style={{color: 'var(--text-secondary)'}}>Accounting System Dashboard</span>
          </div>
          <div className="topbar-right"></div>
        </header>
        <div className="page-container">
          {children}
        </div>
      </main>
    </div>
  )
}
