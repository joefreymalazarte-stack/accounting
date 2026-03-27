'use client'

import { useState } from 'react'
import { formatCurrency } from '@/utils/currency'

type AccountBalance = {
  account: string
  debit: number
  credit: number
}

export default function FinancialStatementsClient({ 
  accounts, 
  currencyCode = 'PHP' 
}: { 
  accounts: AccountBalance[],
  currencyCode?: string 
}) {
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
                   <td style={{ textAlign: 'right' }}>{formatCurrency(a.credit - a.debit, currencyCode)}</td>
                 </tr>
              ))}
              <tr style={{ borderTop: '1px solid var(--border-color)', fontWeight: 600 }}>
                <td style={{ padding: '0.5rem' }}>Net Income / (Loss)</td>
                <td style={{ textAlign: 'right' }}>{formatCurrency(accounts.reduce((sum, a) => sum + (a.credit - a.debit), 0), currencyCode)}</td>
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
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', overflowX: 'auto', paddingBottom: '0.75rem', scrollbarWidth: 'none' }}>
        {statements.map(stmt => (
          <button
            key={stmt.id}
            onClick={() => setActiveTab(stmt.id)}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: activeTab === stmt.id ? 'var(--accent-primary)' : 'rgba(255,255,255,0.03)',
              color: activeTab === stmt.id ? '#fff' : 'var(--text-secondary)',
              border: activeTab === stmt.id ? '1px solid var(--accent-primary)' : '1px solid var(--border-color)',
              borderRadius: '99px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              fontWeight: 600,
              fontSize: '0.8125rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: activeTab === stmt.id ? '0 10px 15px -3px rgba(99, 102, 241, 0.3)' : 'none'
            }}
          >
            {stmt.name}
          </button>
        ))}
      </div>

      <div className="content-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '2.5rem 2rem', borderBottom: '1px solid var(--border-color)', background: 'linear-gradient(to bottom, rgba(255,255,255,0.02), transparent)' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, textAlign: 'center', letterSpacing: '-0.025em' }}>
            {statements.find(s => s.id === activeTab)?.name}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', textAlign: 'center', marginTop: '0.5rem' }}>For the Current Accounting Period</p>
        </div>
        
        <div style={{ padding: '2rem' }}>
          {renderContent()}
        </div>
      </div>
    </>
  )
}
