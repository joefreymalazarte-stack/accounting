import Sidebar from '@/components/Sidebar'
import ThemeToggle from '@/components/ThemeToggle'
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

  // Fetch the public profile
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
            {/* Title removed per user request */}
          </div>
          <div className="topbar-right">
            <ThemeToggle />
          </div>
        </header>
        <div className="page-container">
          {children}
        </div>
      </main>
    </div>
  )
}
