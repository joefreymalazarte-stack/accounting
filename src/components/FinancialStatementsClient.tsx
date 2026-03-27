'use client'

import { useState } from 'react'

type AccountBalance = {
  account: string
  debit: number
  credit: number
}

export default function FinancialStatementsClient({ accounts }: { accounts: AccountBalance[] }) {
  const [activeTab, setActiveTab] = useState('pl')

  const statements = [
    { id: 'pl', name: 'Statement of Profit and Loss' },
    { id: 'bs', name: 'Balance Sheet' },
    { id: 'cf', name: 'Cash Flow Statement' },
    { id: 'ce', name: 'Statement of Changes in Equity' },
    { id: 'notes', name: 'Notes to Financial Statements' }
  ]

  // Logic to filter accounts for P&L or Balance Sheet
  // (In a real system, you'd categorize accounts: Asset, Liability, Equity, Revenue, Expense)
  // For now, we'll just show placeholders based on the data.

  const renderContent = () => {
    if (accounts.length === 0) {
      return (
        <div style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <p>No data available for the current period.</p>
          <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>Please record journal entries first.</p>
        </div>
      )
    }

    if (activeTab === 'pl') {
      return (
        <div style={{ padding: '1rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr style={{ fontWeight: 600 }}><td colSpan={2}>Revenues</td></tr>
              {accounts.map(a => a.credit > a.debit && (
                 <tr key={a.account}>
                   <td style={{ padding: '0.5rem 1rem' }}>{a.account}</td>
                   <td style={{ textAlign: 'right' }}>₱{(a.credit - a.debit).toFixed(2)}</td>
                 </tr>
              ))}
              <tr style={{ borderTop: '1px solid var(--border-color)', fontWeight: 600 }}>
                <td style={{ padding: '0.5rem' }}>Net Income / (Loss)</td>
                <td style={{ textAlign: 'right' }}>₱{accounts.reduce((sum, a) => sum + (a.credit - a.debit), 0).toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )
    }

    return (
      <div style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <p>This statement ({statements.find(s => s.id === activeTab)?.name}) is still being generated.</p>
        <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>Full financial ratios and reporting coming soon.</p>
      </div>
    )
  }

  return (
    <>
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
        {renderContent()}
      </div>
    </>
  )
}
