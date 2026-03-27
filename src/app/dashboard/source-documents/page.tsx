export default function SourceDocumentsPage() {
  return (
    <>
      <h1 className="page-title">Source Documents</h1>
      <p className="page-subtitle">Identification of Transactions and generation of Source Documents.</p>
      
      <div className="content-card">
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', fontWeight: 600 }}>Create New Document</h2>
        <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label>Document Type</label>
            <select className="form-input" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
              <option>Receipt</option>
              <option>Invoice</option>
              <option>Purchase Order</option>
              <option>Bank Statement</option>
            </select>
          </div>
          <div className="form-group">
            <label>Amount (USD)</label>
            <input type="number" step="0.01" className="form-input" placeholder="0.00" />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea className="form-input" rows={3} placeholder="Describe the transaction..."></textarea>
          </div>
          <button type="button" className="auth-button" style={{ width: 'fit-content' }}>
            Upload Document
          </button>
        </form>
      </div>

      <div className="content-card">
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', fontWeight: 600 }}>Recent Documents</h2>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', textAlign: 'center', padding: '2rem' }}>
          No source documents recorded yet.
        </div>
      </div>
    </>
  )
}
