import { createClient } from '@/utils/supabase/server'

export default async function TrialBalancePage() {
  const supabase = await createClient()

  const { data: ledgerEntries } = await supabase
    .from('ledger_entries')
    .select('*')

  // Calculate balances per account
  const accountBalances: Record<string, { debit: number, credit: number }> = {}
  ledgerEntries?.forEach((entry) => {
    if (!accountBalances[entry.account_name]) {
      accountBalances[entry.account_name] = { debit: 0, credit: 0 }
    }
    accountBalances[entry.account_name].debit += Number(entry.debit)
    accountBalances[entry.account_name].credit += Number(entry.credit)
  })

  const sortedAccounts = Object.entries(accountBalances).sort(([a], [b]) => a.localeCompare(b))
  
  let totalDebit = 0
  let totalCredit = 0

  return (
    <>
      <h1 className="page-title">Trial Balance</h1>
      <p className="page-subtitle">Preparation of Trial Balance to verify Debit and Credit balances.</p>

      <div className="content-card">
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: 600, textAlign: 'center' }}>Unadjusted Trial Balance</h2>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '1rem', fontWeight: 500 }}>Account Title</th>
                <th style={{ padding: '1rem', fontWeight: 500, textAlign: 'right' }}>Debit Balances</th>
                <th style={{ padding: '1rem', fontWeight: 500, textAlign: 'right' }}>Credit Balances</th>
              </tr>
            </thead>
            <tbody>
              {sortedAccounts.length > 0 ? (
                sortedAccounts.map(([account, balance]) => {
                  const netDebit = balance.debit > balance.credit ? balance.debit - balance.credit : 0
                  const netCredit = balance.credit > balance.debit ? balance.credit - balance.debit : 0
                  
                  totalDebit += netDebit
                  totalCredit += netCredit

                  if (netDebit === 0 && netCredit === 0) return null

                  return (
                    <tr key={account} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '1rem' }}>{account}</td>
                      <td style={{ padding: '1rem', textAlign: 'right' }}>
                        {netDebit > 0 ? `₱${netDebit.toFixed(2)}` : ''}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right' }}>
                        {netCredit > 0 ? `₱${netCredit.toFixed(2)}` : ''}
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={3} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    Awaiting account balances from the Ledger.
                  </td>
                </tr>
              )}
              <tr style={{ borderTop: '2px solid var(--border-color)', fontWeight: 700, backgroundColor: 'var(--bg-secondary)' }}>
                <td style={{ padding: '1rem' }}>Totals</td>
                <td style={{ padding: '1rem', textAlign: 'right', borderBottom: '3px double var(--text-primary)' }}>
                  ₱{totalDebit.toFixed(2)}
                </td>
                <td style={{ padding: '1rem', textAlign: 'right', borderBottom: '3px double var(--text-primary)' }}>
                  ₱{totalCredit.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <span style={{ 
            display: 'inline-block', 
            padding: '0.5rem 1rem', 
            backgroundColor: Math.abs(totalDebit - totalCredit) < 0.01 ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)', 
            color: Math.abs(totalDebit - totalCredit) < 0.01 ? '#22c55e' : '#ef4444', 
            borderRadius: '9999px', 
            fontSize: '0.875rem', 
            fontWeight: 600 
          }}>
            Status: {Math.abs(totalDebit - totalCredit) < 0.01 ? 'Balanced' : 'Out of Balance'}
          </span>
        </div>
      </div>
    </>
  )
}
