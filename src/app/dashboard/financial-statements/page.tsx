'use client'

import { useState } from 'react'

const statements = [
  { id: 'pl', name: 'Statement of Profit and Loss' },
  { id: 'bs', name: 'Balance Sheet' },
  { id: 'cf', name: 'Cash Flow Statement' },
  { id: 'ce', name: 'Statement of Changes in Equity' },
  { id: 'notes', name: 'Notes to Financial Statements' }
]

export default function FinancialStatementsPage() {
  const [activeTab, setActiveTab] = useState('pl')

  return (
    <>
      <h1 className="page-title">Financial Statements</h1>
      <p className="page-subtitle">The final output of the accounting process.</p>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        {statements.map(stmt => (
          <button
            key={stmt.id}
            onClick={() => setActiveTab(stmt.id)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: activeTab === stmt.id ? 'var(--accent-primary)' : 'var(--bg-secondary)',
              color: activeTab === stmt.id ? '#fff' : 'var(--text-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              fontWeight: 500,
              fontSize: '0.875rem',
              transition: 'all 0.2s ease'
            }}
          >
            {stmt.name}
          </button>
        ))}
      </div>

      <div className="content-card">
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: 600, textAlign: 'center' }}>
          {statements.find(s => s.id === activeTab)?.name}
        </h2>
        
        <div style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <p>This statement will be generated based on the Trial Balance.</p>
          <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>No data available for the current period.</p>
        </div>
      </div>
    </>
  )
}
