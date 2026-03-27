import { createClient } from '@/utils/supabase/server'

export default async function LedgerPage() {
  const supabase = await createClient()

  const { data: ledgerEntries } = await supabase
    .from('ledger_entries')
    .select('*')
    .order('created_at', { ascending: true })

  // Group entries by account name
  const accounts: Record<string, any[]> = {}
  ledgerEntries?.forEach((entry) => {
    if (!accounts[entry.account_name]) {
      accounts[entry.account_name] = []
    }
    accounts[entry.account_name].push(entry)
  })

  return (
    <>
      <h1 className="page-title">General Ledger</h1>
      <p className="page-subtitle">Posting the journal entries to individual T-accounts.</p>

      <div className="content-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Accounts</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
          {Object.keys(accounts).length > 0 ? (
            Object.entries(accounts).map(([accountName, entries]) => {
              const totalDebit = entries.reduce((sum, e) => sum + Number(e.debit), 0)
              const totalCredit = entries.reduce((sum, e) => sum + Number(e.credit), 0)
              const balance = totalDebit - totalCredit

              return (
                <div key={accountName} style={{ border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ backgroundColor: 'var(--bg-tertiary)', padding: '0.75rem', textAlign: 'center', fontWeight: 600, borderBottom: '2px solid var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {accountName}
                  </div>
                  <div style={{ display: 'flex', flex: 1, minHeight: '150px' }}>
                    <div style={{ flex: 1, borderRight: '1px solid var(--border-color)', padding: '0.75rem' }}>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', marginBottom: '0.5rem', textAlign: 'center', fontWeight: 600 }}>DEBIT (Dr.)</div>
                      {entries.map((e, i) => e.debit > 0 && (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                          <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{new Date(e.created_at).toLocaleDateString()}</span>
                          <span>₱{parseFloat(e.debit).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ flex: 1, padding: '0.75rem' }}>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', marginBottom: '0.5rem', textAlign: 'center', fontWeight: 600 }}>CREDIT (Cr.)</div>
                      {entries.map((e, i) => e.credit > 0 && (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                          <span>₱{parseFloat(e.credit).toFixed(2)}</span>
                          <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{new Date(e.created_at).toLocaleDateString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ padding: '0.75rem', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 700 }}>
                    <span>Ending Balance:</span>
                    <span style={{ color: balance >= 0 ? 'var(--accent-primary)' : '#ef4444' }}>
                      ₱{Math.abs(balance).toFixed(2)} {balance >= 0 ? '(Dr.)' : '(Cr.)'}
                    </span>
                  </div>
                </div>
              )
            })
          ) : (
            <div style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No ledger accounts found. Please record journal entries first.
            </div>
          )}
        </div>
      </div>
    </>
  )
}
