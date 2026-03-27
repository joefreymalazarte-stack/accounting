'use client'

import { Trash2 } from 'lucide-react'
import { useState } from 'react'

interface DeleteButtonProps {
  id: string
  onDelete: (id: string) => Promise<{ success?: boolean; error?: string }>
  title?: string
  size?: number
}

export default function DeleteButton({ id, onDelete, title = "Delete", size = 18 }: DeleteButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!confirm(`Are you sure you want to delete this ${title.toLowerCase()}? This action cannot be undone.`)) {
      return
    }

    setIsDeleting(true)
    try {
      const result = await onDelete(id)
      if (result.error) {
        alert(result.error)
      }
    } catch (err) {
      console.error('Delete error:', err)
      alert('An unexpected error occurred while deleting.')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <form onSubmit={handleDelete} style={{ display: 'inline' }}>
      <button 
        type="submit" 
        disabled={isDeleting}
        style={{ 
          background: 'transparent', 
          border: 'none', 
          color: '#ef4444', 
          cursor: isDeleting ? 'not-allowed' : 'pointer', 
          opacity: isDeleting ? 0.3 : 0.6,
          padding: 0,
          display: 'flex',
          alignItems: 'center'
        }} 
        title={title}
      >
        <Trash2 size={size} style={{ animation: isDeleting ? 'spin 1s linear infinite' : 'none' }} />
      </button>
    </form>
  )
}
