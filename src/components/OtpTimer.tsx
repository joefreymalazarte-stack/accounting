'use client'

import { useState, useEffect } from 'react'

export default function OtpTimer() {
  const [seconds, setSeconds] = useState(60) // 1 minute

  useEffect(() => {
    if (seconds > 0) {
      const timer = setTimeout(() => setSeconds(seconds - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [seconds])

  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  const isExpired = seconds === 0

  return (
    <div style={{ marginTop: '1rem', textAlign: 'center' }}>
      {isExpired ? (
        <span style={{ color: '#ef4444', fontWeight: 600, fontSize: '0.875rem' }}>
          Code has expired. Please request a new one.
        </span>
      ) : (
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>
          Expires in: <strong style={{ color: 'var(--accent-secondary)' }}>
            {minutes}:{remainingSeconds.toString().padStart(2, '0')}
          </strong>
        </span>
      )}
    </div>
  )
}
