import { createClient } from '@/utils/supabase/server'
import JournalEntryForm from '@/components/JournalEntryForm'

export default async function JournalPage() {
  const supabase = await createClient()

  // Fetch journal entries with their associated ledger items and profile
  const { data: entries } = await supabase
    .from('journal_entries')
    .select(`
      *,
      profiles (username),
      ledger_entries (*)
    `)
    .order('date', { ascending: false })
    .order('created_at', { ascending: false })

  return (
    <>
      <h1 className="page-title">Journal Entries</h1>
      <p className="page-subtitle">Recording the identified transactions in the Journal chronologically.</p>

      <div className="content-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>General Journal</h2>
          <JournalEntryForm />
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 500 }}>Date</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 500 }}>Account / Description</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 500 }}>Created By</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 500, textAlign: 'right' }}>Debit (Dr.)</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 500, textAlign: 'right' }}>Credit (Cr.)</th>
              </tr>
            </thead>
            <tbody>
              {entries && entries.length > 0 ? (
                entries.map((entry) => (
                  <tr key={entry.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem', verticalAlign: 'top', color: 'var(--text-secondary)' }}>
                      {new Date(entry.date).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      {entry.ledger_entries.map((item: any, idx: number) => (
                        <div key={idx} style={{ paddingLeft: item.credit > 0 ? '2rem' : '0', marginBottom: '0.25rem' }}>
                          {item.account_name}
                        </div>
                      ))}
                      <div style={{ fontStyle: 'italic', fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                        ({entry.description})
                      </div>
                    </td>
                    <td style={{ padding: '1rem', verticalAlign: 'top', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                      {entry.profiles?.username || 'System User'}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right', verticalAlign: 'top' }}>
                      {entry.ledger_entries.map((item: any, idx: number) => (
                        <div key={idx} style={{ marginBottom: '0.25rem' }}>
                          {item.debit > 0 ? `₱${parseFloat(item.debit).toFixed(2)}` : ''}
                        </div>
                      ))}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right', verticalAlign: 'top' }}>
                      {entry.ledger_entries.map((item: any, idx: number) => (
                        <div key={idx} style={{ marginBottom: '0.25rem' }}>
                          {item.credit > 0 ? `₱${parseFloat(item.credit).toFixed(2)}` : ''}
                        </div>
                      ))}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    No journal entries recorded.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
