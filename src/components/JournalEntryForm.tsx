'use client'

import { useState } from 'react'
import { createJournalEntry } from '@/app/dashboard/journal/actions'
import { X, Plus } from 'lucide-react'
import { formatCurrency, getCurrencySymbol } from '@/utils/currency'

type JournalEntryFormProps = {
  currencyCode?: string
}

export default function JournalEntryForm({ currencyCode = 'PHP' }: JournalEntryFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [description, setDescription] = useState('')
  const [items, setItems] = useState([
    { account_name: '', debit: 0, credit: 0 },
    { account_name: '', debit: 0, credit: 0 },
  ])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const symbol = getCurrencySymbol(currencyCode)

  const addItem = () => {
    setItems([...items, { account_name: '', debit: 0, credit: 0 }])
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    setItems(newItems)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const totalDebit = items.reduce((sum, item) => sum + Number(item.debit), 0)
    const totalCredit = items.reduce((sum, item) => sum + Number(item.credit), 0)

    if (Math.abs(totalDebit - totalCredit) > 0.01) {
      setError(`Debits (${formatCurrency(totalDebit, currencyCode)}) and Credits (${formatCurrency(totalCredit, currencyCode)}) must balance!`)
      setLoading(false)
      return
    }

    const entries = items
      .filter(i => i.account_name && (Number(i.debit) > 0 || Number(i.credit) > 0))
      .map(i => ({
        account: i.account_name,
        debit: Number(i.debit),
        credit: Number(i.credit)
      }))

    if (entries.length < 2) {
      setError('A journal entry must have at least two accounts.')
      setLoading(false)
      return
    }

    const result = await createJournalEntry(date, description, entries)

    if (result.error) {
      setError(result.error)
    } else {
      setIsOpen(false)
      // Reset form
      setDescription('')
      setItems([{ account_name: '', debit: 0, credit: 0 }, { account_name: '', debit: 0, credit: 0 }])
    }
    setLoading(false)
  }

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="auth-button" 
        style={{ marginTop: 0, padding: '0.625rem 1.25rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
      >
        <Plus size={18} /> New Entry
      </button>
    )
  }

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div className="content-card" style={{ maxWidth: '850px', width: '100%', maxHeight: '90vh', overflowY: 'auto', border: '1px solid var(--border-color)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.025em' }}>New Journal Entry</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>Record a new financial transaction into the general journal.</p>
          </div>
          <button onClick={() => setIsOpen(false)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '0.5rem', borderRadius: '50%', display: 'flex' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem', marginBottom: '2rem' }}>
            <div className="form-group">
              <label style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="form-input" style={{ marginTop: '0.5rem' }} required />
            </div>
            <div className="form-group">
              <label style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Description (Narration)</label>
              <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="form-input" style={{ marginTop: '0.5rem' }} placeholder="e.g. Purchase of office supplies via cash" required />
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) 140px 140px 40px', gap: '1rem', padding: '0 0.5rem 0.75rem 0.5rem', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <div>Account Name</div>
              <div style={{ textAlign: 'right' }}>Debit ({symbol})</div>
              <div style={{ textAlign: 'right' }}>Credit ({symbol})</div>
              <div></div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
              {items.map((item, index) => (
                <div key={index} style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) 140px 140px 40px', gap: '1rem', alignItems: 'center' }}>
                  <input 
                    type="text" 
                    value={item.account_name} 
                    onChange={(e) => updateItem(index, 'account_name', e.target.value)} 
                    className="form-input" 
                    placeholder="Search or enter account..." 
                    style={{ padding: '0.625rem 1rem' }}
                  />
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{symbol}</span>
                    <input 
                      type="number" 
                      step="0.01"
                      value={item.debit || ''} 
                      onChange={(e) => updateItem(index, 'debit', Number(e.target.value))} 
                      className="form-input" 
                      style={{ paddingLeft: '1.75rem', textAlign: 'right' }}
                    />
                  </div>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{symbol}</span>
                    <input 
                      type="number" 
                      step="0.01"
                      value={item.credit || ''} 
                      onChange={(e) => updateItem(index, 'credit', Number(e.target.value))} 
                      className="form-input" 
                      style={{ paddingLeft: '1.75rem', textAlign: 'right' }}
                    />
                  </div>
                  <div>
                    {items.length > 2 && (
                      <button onClick={() => removeItem(index)} type="button" style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', border: 'none', cursor: 'pointer', padding: '0.5rem', borderRadius: '6px', display: 'flex' }}>
                        <X size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <button type="button" onClick={addItem} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-secondary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' }}>
              <Plus size={18} /> Add another account
            </button>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
              Total: <span style={{ color: 'var(--text-primary)', marginLeft: '1rem' }}>
                Dr. {formatCurrency(items.reduce((sum, item) => sum + Number(item.debit), 0), currencyCode)}
                <span style={{ margin: '0 1rem' }}>=</span>
                Cr. {formatCurrency(items.reduce((sum, item) => sum + Number(item.credit), 0), currencyCode)}
              </span>
            </div>
          </div>

          {error && (
            <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '1rem', borderRadius: '8px', marginBottom: '2rem', fontSize: '0.875rem', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
            <button type="button" onClick={() => setIsOpen(false)} className="nav-item" style={{ width: 'auto', border: '1px solid var(--border-color)', padding: '0.625rem 1.5rem' }}>Cancel</button>
            <button type="submit" className="auth-button" style={{ width: 'auto', padding: '0.625rem 2rem' }} disabled={loading}>
              {loading ? 'Saving Entry...' : 'Post to Journal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
