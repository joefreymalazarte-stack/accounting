export default function JournalPage() {
  return (
    <>
      <h1 className="page-title">Journal Entries</h1>
      <p className="page-subtitle">Recording the identified transactions in the Journal chronologically.</p>

      <div className="content-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>General Journal</h2>
          <button className="auth-button" style={{ marginTop: 0, padding: '0.5rem 1rem', fontSize: '0.875rem' }}>+ New Entry</button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 500 }}>Date</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 500 }}>Account / Description</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 500 }}>Ref</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 500, textAlign: 'right' }}>Debit (Dr.)</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 500, textAlign: 'right' }}>Credit (Cr.)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  No journal entries recorded.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
