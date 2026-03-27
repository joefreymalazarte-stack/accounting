'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import {
  FileText,
  BookOpen,
  BookMarked,
  Scale,
  PieChart,
  User,
  LogOut
} from 'lucide-react'

const navItems = [
  {
    name: 'Source Document',
    href: '/dashboard/source-documents',
    icon: FileText
  },
  {
    name: 'Recording in Journal',
    href: '/dashboard/journal',
    icon: BookOpen
  },
  {
    name: 'Posting to Ledger',
    href: '/dashboard/ledger',
    icon: BookMarked
  },
  {
    name: 'Trial Balance',
    href: '/dashboard/trial-balance',
    icon: Scale
  },
  {
    name: 'Financial Statements',
    href: '/dashboard/financial-statements',
    icon: PieChart
  }
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <Image src="/icon1.jpg" alt="Accounting Logo" width={50} height={50} style={{ borderRadius: '4px' }}/>
        <span>Accounting</span>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href)
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={25} style={{ flexShrink: 0 }} />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      <div className="sidebar-bottom" style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div className="nav-item">
          <User size={25} style={{ flexShrink: 0 }} />
          <span>Profile</span>
        </div>
        <form action="/auth/signout" method="post" style={{ margin: 0 }}>
          <button type="submit" className="nav-item" style={{ width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', color: 'inherit', font: 'inherit', padding: '0.75rem' }}>
            <LogOut size={25} style={{ flexShrink: 0 }} />
            <span>Sign out</span>
          </button>
        </form>
      </div>
    </aside>
  )
}
