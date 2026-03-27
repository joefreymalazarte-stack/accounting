import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Wallet, TrendingUp, TrendingDown, Clock } from 'lucide-react'
import { formatCurrency } from '@/utils/currency'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: ledgerEntries } = await supabase.from('ledger_entries').select('*')
  const { data: profile } = await supabase.from('profiles').select('username, currency_code').eq('id', user.id).single()

  const currencyCode = (profile?.currency_code as string) || 'PHP'

  // Simple calculations
  const totalDebit = ledgerEntries?.reduce((sum, e) => sum + Number(e.debit), 0) || 0
  const totalCredit = ledgerEntries?.reduce((sum, e) => sum + Number(e.credit), 0) || 0
  const netWorth = totalDebit - totalCredit

  return (
    <>
      <div style={{ marginBottom: '3rem' }}>
        <h1 className="page-title">Welcome back, {profile?.username || 'User'}!</h1>
        <p className="page-subtitle">Here is a quick snapshot of your accounting system's current status (Base: {currencyCode}).</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
        <div className="content-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Net Worth</span>
            <div style={{ padding: '0.5rem', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-primary)' }}>
              <Wallet size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>{formatCurrency(Math.abs(netWorth), currencyCode)}</div>
          <div style={{ color: netWorth >= 0 ? '#22c55e' : '#ef4444', fontSize: '0.875rem', fontWeight: 600 }}>
             {netWorth >= 0 ? '+ Active Balance' : '- Deficit Balance'}
          </div>
        </div>

        <div className="content-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Inflow (Dr.)</span>
            <div style={{ padding: '0.5rem', borderRadius: '12px', background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e' }}>
              <TrendingUp size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>{formatCurrency(totalDebit, currencyCode)}</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Across all accounts</div>
        </div>

        <div className="content-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Outflow (Cr.)</span>
            <div style={{ padding: '0.5rem', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
              <TrendingDown size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>{formatCurrency(totalCredit, currencyCode)}</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Total posting value</div>
        </div>
      </div>

      <div className="content-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Quick Actions</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
          <a href="/dashboard/source-documents" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>
             <Clock size={20} style={{ color: 'var(--accent-secondary)' }} />
             <span style={{ fontWeight: 600 }}>New Receipt</span>
          </a>
          <a href="/dashboard/journal" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>
             <Clock size={20} style={{ color: 'var(--accent-secondary)' }} />
             <span style={{ fontWeight: 600 }}>Post Journal</span>
          </a>
        </div>
      </div>
    </>
  )
}
