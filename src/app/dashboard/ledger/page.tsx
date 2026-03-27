export default function LedgerPage() {
  return (
    <>
      <h1 className="page-title">General Ledger</h1>
      <p className="page-subtitle">Posting the journal entries to individual T-accounts.</p>

      <div className="content-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Accounts</h2>
          <input className="form-input" placeholder="Search accounts..." style={{ padding: '0.5rem 1rem' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {/* Example T-Account Placeholder */}
          <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden' }}>
            <div style={{ backgroundColor: 'var(--bg-tertiary)', padding: '0.75rem', textAlign: 'center', fontWeight: 500, borderBottom: '2px solid var(--accent-primary)' }}>
              Cash Account
            </div>
            <div style={{ display: 'flex', minHeight: '150px' }}>
              <div style={{ flex: 1, borderRight: '1px outset var(--border-color)', padding: '0.75rem' }}>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginBottom: '0.5rem', textAlign: 'center' }}>DEBIT (Dr.)</div>
                {/* Debit items */}
              </div>
              <div style={{ flex: 1, padding: '0.75rem' }}>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginBottom: '0.5rem', textAlign: 'center' }}>CREDIT (Cr.)</div>
                {/* Credit items */}
              </div>
            </div>
            <div style={{ padding: '0.75rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', fontWeight: 600 }}>
              <span>Balance:</span>
              <span style={{ color: 'var(--text-secondary)' }}>$0.00</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
