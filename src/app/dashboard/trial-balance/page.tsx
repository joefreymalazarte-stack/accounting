import { createClient } from '@/utils/supabase/server'
import { formatCurrency } from '@/utils/currency'

export default async function TrialBalancePage() {
  const supabase = await createClient()

  // Fetch the user session to get currency code
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase.from('profiles').select('currency_code').eq('id', user?.id).single()
  const currencyCode = (profile?.currency_code as string) || 'PHP'

  const { data: ledgerEntries } = await supabase
    .from('ledger_entries')
    .select('*')

  // Calculate balances per account
  const accountBalances: Record<string, { account: string, debit: number, credit: number }> = {}
  ledgerEntries?.forEach((entry) => {
    if (!accountBalances[entry.account_name]) {
      accountBalances[entry.account_name] = { account: entry.account_name, debit: 0, credit: 0 }
    }
    accountBalances[entry.account_name].debit += Number(entry.debit)
    accountBalances[entry.account_name].credit += Number(entry.credit)
  })

  const accounts = Object.values(accountBalances).sort((a, b) => a.account.localeCompare(b.account))
  const totalDebit = accounts.reduce((sum, a) => sum + (a.debit > a.credit ? a.debit - a.credit : 0), 0)
  const totalCredit = accounts.reduce((sum, a) => sum + (a.credit > a.debit ? a.credit - a.debit : 0), 0)
  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01

  return (
    <>
      <h1 className="page-title">Trial Balance</h1>
      <p className="page-subtitle">Verifying that the total Debits equal total Credits.</p>
      
      <div className="content-card" style={{ padding: 0 }}>
        <div style={{ padding: '2rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Unadjusted Trial Balance</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>As of {new Date().toLocaleDateString()}</p>
          </div>
          <div style={{ 
            padding: '0.5rem 1rem', 
            borderRadius: '99px', 
            background: isBalanced ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            color: isBalanced ? '#22c55e' : '#ef4444',
            fontWeight: 700,
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'currentColor' }}></div>
            {isBalanced ? 'BALANCED' : 'UNBALANCED'}
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ padding: '1rem 2rem' }}>Account Name</th>
                <th style={{ padding: '1rem 2rem', textAlign: 'right' }}>Debit (Dr.)</th>
                <th style={{ padding: '1rem 2rem', textAlign: 'right' }}>Credit (Cr.)</th>
              </tr>
            </thead>
            <tbody>
              {accounts.length > 0 ? (
                accounts.map((a) => (
                  <tr key={a.account}>
                    <td style={{ padding: '1rem 2rem', fontWeight: 600 }}>{a.account}</td>
                    <td style={{ padding: '1rem 2rem', textAlign: 'right' }}>
                      {a.debit > a.credit ? formatCurrency(a.debit - a.credit, currencyCode) : ''}
                    </td>
                    <td style={{ padding: '1rem 2rem', textAlign: 'right' }}>
                      {a.credit > a.debit ? formatCurrency(a.credit - a.debit, currencyCode) : ''}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    No ledger accounts found. Please record journal entries first.
                  </td>
                </tr>
              )}
              <tr style={{ borderTop: '2px solid var(--border-color)', background: 'rgba(255,255,255,0.02)' }}>
                <td style={{ padding: '1.5rem 2rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total</td>
                <td style={{ padding: '1.5rem 2rem', textAlign: 'right', fontWeight: 800, color: 'var(--accent-primary)' }}>
                  {formatCurrency(totalDebit, currencyCode)}
                </td>
                <td style={{ padding: '1.5rem 2rem', textAlign: 'right', fontWeight: 800, color: 'var(--accent-primary)' }}>
                  {formatCurrency(totalCredit, currencyCode)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
