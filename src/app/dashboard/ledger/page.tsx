import { createClient } from '@/utils/supabase/server'
import { formatCurrency } from '@/utils/currency'
import DeleteButton from '@/components/DeleteButton'
import { deleteJournalEntry } from '../journal/actions'

export default async function LedgerPage() {
  const supabase = await createClient()

  // Fetch the user session to get currency code
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase.from('profiles').select('currency_code').eq('id', user?.id).single()
  const currencyCode = (profile?.currency_code as string) || 'PHP'

  const { data: ledgerEntries } = await supabase
    .from('ledger_entries')
    .select('*')
    .order('created_at', { ascending: true })

  // Group entries by account
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
      <p className="page-subtitle">The "T-Account" view of your financial transactions.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '2rem' }}>
        {Object.entries(accounts).length > 0 ? (
          Object.entries(accounts).map(([accountName, entries]) => {
            const totalDebit = entries.reduce((sum, e) => sum + Number(e.debit), 0)
            const totalCredit = entries.reduce((sum, e) => sum + Number(e.credit), 0)
            const balance = totalDebit - totalCredit

            return (
              <div key={accountName} className="content-card" style={{ padding: 0 }}>
                <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h2 style={{ fontSize: '1.125rem', fontWeight: 700 }}>{accountName}</h2>
                  <div style={{ padding: '0.25rem 0.75rem', borderRadius: '99px', background: 'rgba(255,255,255,0.05)', fontSize: '0.875rem', fontWeight: 600 }}>
                    Bal: {formatCurrency(Math.abs(balance), currencyCode)} {balance >= 0 ? '(Dr)' : '(Cr)'}
                  </div>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.02)', fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                      <th style={{ padding: '0.5rem 1rem', width: '50%', borderRight: '1px solid var(--border-color)' }}>Debit (Dr)</th>
                      <th style={{ padding: '0.5rem 1rem' }}>Credit (Cr)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ verticalAlign: 'top', borderRight: '1px solid var(--border-color)', padding: 0 }}>
                        {entries.filter(e => Number(e.debit) > 0).map((e, idx) => (
                          <div key={idx} style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <DeleteButton 
                                id={e.journal_entry_id} 
                                onDelete={deleteJournalEntry} 
                                title="Entry" 
                                size={12} 
                              />
                              <span>{new Date(e.created_at).toLocaleDateString()}</span>
                            </div>
                            <span style={{ fontWeight: 600 }}>{formatCurrency(e.debit, currencyCode)}</span>
                          </div>
                        ))}
                      </td>
                      <td style={{ verticalAlign: 'top', padding: 0 }}>
                        {entries.filter(e => Number(e.credit) > 0).map((e, idx) => (
                          <div key={idx} style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <DeleteButton 
                                id={e.journal_entry_id} 
                                onDelete={deleteJournalEntry} 
                                title="Entry" 
                                size={12} 
                              />
                              <span>{new Date(e.created_at).toLocaleDateString()}</span>
                            </div>
                            <span style={{ fontWeight: 600 }}>{formatCurrency(e.credit, currencyCode)}</span>
                          </div>
                        ))}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )
          })
        ) : (
          <div style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            No ledger accounts found. Please record journal entries first.
          </div>
        )}
      </div>
    </>
  )
}
