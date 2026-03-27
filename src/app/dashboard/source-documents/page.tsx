import { createClient } from '@/utils/supabase/server'
import { createSourceDocument, deleteSourceDocument } from './actions'
import { formatCurrency, getCurrencySymbol } from '@/utils/currency'
import DeleteButton from '@/components/DeleteButton'

export default async function SourceDocumentsPage() {
  const supabase = await createClient()

  // Fetch the user session to get currency code
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase.from('profiles').select('currency_code').eq('id', user?.id).single()
  const currencyCode = (profile?.currency_code as string) || 'PHP'
  const symbol = getCurrencySymbol(currencyCode)

  // Fetch the data
  const { data: documents, error: fetchError } = await supabase
    .from('source_documents')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <>
      <h1 className="page-title">Source Documents</h1>
      <p className="page-subtitle">Identification of Transactions and generation of Source Documents.</p>
      
      {fetchError && (
        <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '1rem', borderRadius: '8px', marginBottom: '2rem', fontSize: '0.875rem' }}>
          <strong>Database Error:</strong> {fetchError.message === "Could not find the table 'public.source_documents' in the schema cache" 
            ? "The 'source_documents' table is missing. Please run the SQL setup in your Supabase dashboard." 
            : fetchError.message}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem', alignItems: 'start' }}>
        <div className="content-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Create New Document</h2>
          </div>
          <form 
            action={async (formData) => {
              'use server'
              await createSourceDocument(formData)
            }} 
            style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
          >
            <div className="form-group">
              <label htmlFor="type" style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Document Type</label>
              <select name="type" id="type" className="form-input" style={{ marginTop: '0.5rem' }} required>
                <option value="Receipt">Receipt</option>
                <option value="Invoice">Invoice</option>
                <option value="Purchase Order">Purchase Order</option>
                <option value="Bank Statement">Bank Statement</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="amount" style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Amount ({symbol})</label>
              <div style={{ position: 'relative', marginTop: '0.5rem' }}>
                <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>{symbol}</span>
                <input name="amount" id="amount" type="number" step="0.01" className="form-input" style={{ paddingLeft: '2.5rem' }} placeholder="0.00" required />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="description" style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Description</label>
              <textarea name="description" id="description" className="form-input" style={{ marginTop: '0.5rem' }} rows={4} placeholder="What was this transaction for?"></textarea>
            </div>
            <button type="submit" className="auth-button" style={{ width: '100%', marginTop: '0.5rem' }}>
              Post Document
            </button>
          </form>
        </div>

        <div className="content-card" style={{ padding: 0 }}>
          <div style={{ padding: '2rem 2rem 1.5rem 2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Recent Documents</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>The latest uploaded proofs of transactions.</p>
          </div>
          
          {documents && documents.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase', textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
                    <th style={{ padding: '1rem 2rem' }}>Type</th>
                    <th style={{ padding: '1rem 2rem' }}>Description</th>
                    <th style={{ padding: '1rem 2rem', textAlign: 'right' }}>Amount</th>
                    <th style={{ padding: '1rem 2rem', width: '50px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc) => (
                    <tr key={doc.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '1.25rem 2rem', fontWeight: 600 }}>{doc.type}</td>
                      <td style={{ padding: '1.25rem 2rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{doc.description}</td>
                      <td style={{ padding: '1.25rem 2rem', textAlign: 'right', fontWeight: 700 }}>{formatCurrency(doc.amount, currencyCode)}</td>
                      <td style={{ padding: '1.25rem 1rem' }}>
                        <DeleteButton 
                          id={doc.id} 
                          onDelete={deleteSourceDocument} 
                          title="Document" 
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', textAlign: 'center', padding: '4rem 2rem' }}>
              {fetchError ? "Cannot load documents." : "No source documents recorded yet."}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
