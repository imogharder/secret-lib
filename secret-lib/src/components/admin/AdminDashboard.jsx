import { useState, useEffect } from 'react'
import { getAllUsers, getNiches, getAllEntries, getTags } from '../../lib/db'

export const AdminDashboard = () => {
  const [stats, setStats] = useState({ users: 0, pending: 0, niches: 0, entries: 0, tags: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [users, niches, entries, tags] = await Promise.all([
          getAllUsers(), getNiches(), getAllEntries(), getTags()
        ])
        setStats({
          users:   users.filter(u => u.role !== 'pending').length,
          pending: users.filter(u => u.role === 'pending').length,
          niches:  niches.length,
          entries: entries.length,
          tags:    tags.length,
        })
      } finally { setLoading(false) }
    }
    load()
  }, [])

  const STATS = [
    { label: 'ACTIVE MEMBERS', value: stats.users,   icon: '👥', color: '#4D96FF', link: '/admin/users'   },
    { label: 'PENDING APPROVAL', value: stats.pending, icon: '⏳', color: '#F1C40F', link: '/admin/users'   },
    { label: 'NICHES',          value: stats.niches,  icon: '🏛️', color: 'var(--accent)', link: '/admin/niches'  },
    { label: 'TOTAL ENTRIES',   value: stats.entries, icon: '📚', color: '#6BCB77', link: '/admin/entries' },
    { label: 'TAGS',            value: stats.tags,    icon: '🏷️', color: '#C77DFF', link: '/admin/tags'    },
  ]

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--accent)', letterSpacing: 3, marginBottom: 6 }}>
          OVERVIEW
        </div>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 28, fontWeight: 300, letterSpacing: 1 }}>
          Admin Dashboard
        </h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14, marginBottom: 36 }}>
        {STATS.map(stat => (
          <a href={stat.link} key={stat.label} style={{ textDecoration: 'none' }}>
            <div className="glass-card" style={{
              padding: '20px 18px', transition: 'var(--transition)',
              borderLeft: `3px solid ${stat.color}55`,
            }}
            onMouseEnter={e => { e.currentTarget.style.borderLeftColor = stat.color; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { e.currentTarget.style.borderLeftColor = `${stat.color}55`; e.currentTarget.style.transform = 'none' }}
            >
              <div style={{ fontSize: 22, marginBottom: 10 }}>{stat.icon}</div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 32, color: stat.color, fontWeight: 300 }}>
                {loading ? '—' : stat.value}
              </div>
              <div style={{ fontSize: 8, fontFamily: 'var(--font-mono)', color: 'var(--text-dim)', letterSpacing: 2, marginTop: 4 }}>
                {stat.label}
              </div>
            </div>
          </a>
        ))}
      </div>

      <div className="glass-card" style={{ padding: '20px 22px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-dim)', letterSpacing: 2, marginBottom: 16 }}>
          QUICK ACTIONS
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {[
            { label: '+ Approve Users',  href: '/admin/users',   color: '#4D96FF' },
            { label: '+ Add Niche',      href: '/admin/niches',  color: 'var(--accent)' },
            { label: '+ Add Tag',        href: '/admin/tags',    color: '#C77DFF' },
            { label: '↗ View Library',   href: '/library',       color: '#6BCB77' },
          ].map(a => (
            <a key={a.label} href={a.href} style={{
              padding: '9px 18px', borderRadius: 'var(--radius-md)',
              border: `1px solid ${a.color}33`, color: a.color,
              fontSize: 11, fontFamily: 'var(--font-mono)',
              transition: 'var(--transition)', display: 'inline-block',
            }}
            onMouseEnter={e => e.currentTarget.style.background = `${a.color}12`}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >
              {a.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
