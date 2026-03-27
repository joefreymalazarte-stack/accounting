export default function TrialBalancePage() {
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
              <tr>
                <td colSpan={3} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  Awaiting account balances from the Ledger.
                </td>
              </tr>
              <tr style={{ borderTop: '2px solid var(--border-color)', fontWeight: 600 }}>
                <td style={{ padding: '1rem' }}>Totals</td>
                <td style={{ padding: '1rem', textAlign: 'right', borderBottom: '3px double var(--text-primary)' }}>$0.00</td>
                <td style={{ padding: '1rem', textAlign: 'right', borderBottom: '3px double var(--text-primary)' }}>$0.00</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <span style={{ display: 'inline-block', padding: '0.5rem 1rem', backgroundColor: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 500 }}>
            Status: Balanced
          </span>
        </div>
      </div>
    </>
  )
}
