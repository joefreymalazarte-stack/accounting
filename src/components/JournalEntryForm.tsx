'use client'

import { useState } from 'react'
import { createJournalEntry, JournalEntryInput } from '@/app/dashboard/journal/actions'
import { X, Plus } from 'lucide-react'

export default function JournalEntryForm() {
  const [isOpen, setIsOpen] = useState(false)
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [description, setDescription] = useState('')
  const [items, setItems] = useState([
    { account_name: '', debit: 0, credit: 0 },
    { account_name: '', debit: 0, credit: 0 },
  ])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

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
      setError(`Debits (₱${totalDebit}) and Credits (₱${totalCredit}) must balance!`)
      setLoading(false)
      return
    }

    const input: JournalEntryInput = {
      date,
      description,
      items: items.filter(i => i.account_name && (i.debit > 0 || i.credit > 0))
    }

    if (input.items.length < 2) {
      setError('A journal entry must have at least two accounts.')
      setLoading(false)
      return
    }

    const result = await createJournalEntry(input)

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
        style={{ marginTop: 0, padding: '0.5rem 1rem', fontSize: '0.875rem' }}
      >
        + New Entry
      </button>
    )
  }

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div className="content-card" style={{ maxWidth: '800px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>New Journal Entry</h2>
          <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="form-group">
              <label>Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="form-input" required />
            </div>
            <div className="form-group">
              <label>Description (Narration)</label>
              <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="form-input" placeholder="e.g. Paid Rent for March" required />
            </div>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1rem' }}>
            <thead>
              <tr style={{ textAlign: 'left', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                <th style={{ padding: '0.5rem' }}>Account Name</th>
                <th style={{ padding: '0.5rem', width: '120px' }}>Debit (Dr.)</th>
                <th style={{ padding: '0.5rem', width: '120px' }}>Credit (Cr.)</th>
                <th style={{ padding: '0.5rem', width: '40px' }}></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td style={{ padding: '0.5rem' }}>
                    <input 
                      type="text" 
                      value={item.account_name} 
                      onChange={(e) => updateItem(index, 'account_name', e.target.value)} 
                      className="form-input" 
                      placeholder="e.g. Cash" 
                    />
                  </td>
                  <td style={{ padding: '0.5rem' }}>
                    <input 
                      type="number" 
                      step="0.01"
                      value={item.debit || ''} 
                      onChange={(e) => updateItem(index, 'debit', Number(e.target.value))} 
                      className="form-input" 
                    />
                  </td>
                  <td style={{ padding: '0.5rem' }}>
                    <input 
                      type="number" 
                      step="0.01"
                      value={item.credit || ''} 
                      onChange={(e) => updateItem(index, 'credit', Number(e.target.value))} 
                      className="form-input" 
                    />
                  </td>
                  <td style={{ padding: '0.5rem' }}>
                    {items.length > 2 && (
                      <button onClick={() => removeItem(index)} type="button" style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}>
                        <X size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button type="button" onClick={addItem} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '1.5rem', fontWeight: 500 }}>
            <Plus size={18} /> Add Account
          </button>

          {error && <div style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</div>}

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => setIsOpen(false)} className="auth-button" style={{ background: 'transparent', border: '1px solid var(--border-color)', width: 'auto' }}>Cancel</button>
            <button type="submit" className="auth-button" style={{ width: 'auto' }} disabled={loading}>
              {loading ? 'Saving...' : 'Save Entry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
