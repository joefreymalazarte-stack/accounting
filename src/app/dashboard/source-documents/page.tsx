import { createClient } from '@/utils/supabase/server'
import { createSourceDocument } from './actions'

export default async function SourceDocumentsPage() {
  const supabase = await createClient()

  // Fetch the data
  const { data: documents } = await supabase
    .from('source_documents')
    .select(`
      *,
      profiles (
        username
      )
    `)
    .order('created_at', { ascending: false })

  return (
    <>
      <h1 className="page-title">Source Documents</h1>
      <p className="page-subtitle">Identification of Transactions and generation of Source Documents.</p>
      
      <div className="content-card">
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', fontWeight: 600 }}>Create New Document</h2>
        <form action={createSourceDocument} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label htmlFor="type">Document Type</label>
            <select name="type" id="type" className="form-input" style={{ backgroundColor: 'var(--bg-tertiary)' }} required>
              <option value="Receipt">Receipt</option>
              <option value="Invoice">Invoice</option>
              <option value="Purchase Order">Purchase Order</option>
              <option value="Bank Statement">Bank Statement</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="amount">Amount (₱)</label>
            <input name="amount" id="amount" type="number" step="0.01" className="form-input" placeholder="0.00" required />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea name="description" id="description" className="form-input" rows={3} placeholder="Describe the transaction..."></textarea>
          </div>
          <button type="submit" className="auth-button" style={{ width: 'fit-content' }}>
            Upload Document
          </button>
        </form>
      </div>

      <div className="content-card">
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', fontWeight: 600 }}>Recent Documents</h2>
        {documents && documents.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: '1rem' }}>Type</th>
                  <th style={{ padding: '1rem' }}>Description</th>
                  <th style={{ padding: '1rem' }}>Amount</th>
                  <th style={{ padding: '1rem' }}>Created By</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr key={doc.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem' }}>{doc.type}</td>
                    <td style={{ padding: '1rem' }}>{doc.description}</td>
                    <td style={{ padding: '1rem' }}>₱{parseFloat(doc.amount).toFixed(2)}</td>
                    <td style={{ padding: '1rem' }}>{doc.profiles?.username || 'System User'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', textAlign: 'center', padding: '2rem' }}>
            No source documents recorded yet.
          </div>
        )}
      </div>
    </>
  )
}
