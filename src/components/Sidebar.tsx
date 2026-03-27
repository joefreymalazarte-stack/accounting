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

type SidebarProps = {
  userEmail?: string
  profile?: any
}

export default function Sidebar({ userEmail, profile }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <Image src="/icon1.jpg" alt="Accounting Logo" width={50} height={50} style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}/>
        <span>Accounting</span>
      </div>

      <nav className="sidebar-nav" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href)
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={24} style={{ flexShrink: 0 }} />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      <div className="sidebar-footer" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <Link href="/dashboard/profile" className={`nav-item ${pathname === '/dashboard/profile' ? 'active' : ''}`} style={{ transitionDelay: '0s' }}>
          <div style={{ position: 'relative', width: 24, height: 24, flexShrink: 0 }}>
            {profile?.avatar_url ? (
               <Image src={profile.avatar_url} alt="User Avatar" fill style={{ borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
               <User size={24} />
            )}
          </div>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {profile?.username || userEmail?.split('@')[0] || 'Profile'}
          </span>
        </Link>
        <form action="/auth/signout" method="post" style={{ margin: 0 }}>
          <button type="submit" className="nav-item" style={{ width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', color: '#ef4444', transitionDelay: '0s' }}>
            <LogOut size={24} style={{ flexShrink: 0 }} />
            <span>Sign out</span>
          </button>
        </form>
      </div>
    </aside>
  )
}
