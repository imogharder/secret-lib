import { useNavigate, useLocation, Outlet } from 'react-router-dom'

const NAV = [
  { path: '/admin',         icon: '📊', label: 'Dashboard'  },
  { path: '/admin/users',   icon: '👥', label: 'Users'      },
  { path: '/admin/niches',  icon: '🏛️', label: 'Niches'     },
  { path: '/admin/tags',    icon: '🏷️', label: 'Tags'       },
  { path: '/admin/entries', icon: '📚', label: 'All Entries' },
]

export const AdminLayout = () => {
  const navigate  = useNavigate()
  const location  = useLocation()

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 56px)' }}>
      {/* Sidebar */}
      <aside style={{
        width: 200, flexShrink: 0,
        background: 'var(--bg-card)',
        borderRight: '1px solid var(--border)',
        padding: '20px 12px',
        position: 'sticky', top: 56, height: 'calc(100vh - 56px)', overflowY: 'auto',
      }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--accent)', letterSpacing: 3, marginBottom: 14, paddingLeft: 8 }}>
          ADMIN PANEL
        </div>
        {NAV.map(item => {
          const active = location.pathname === item.path
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 12px', borderRadius: 'var(--radius-sm)',
                background: active ? 'var(--accent-dim)' : 'none',
                border: 'none',
                color: active ? 'var(--accent)' : 'var(--text-secondary)',
                fontSize: 12, fontWeight: active ? 600 : 400,
                transition: 'var(--transition)', marginBottom: 2,
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--border)' }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'none' }}
            >
              <span style={{ fontSize: 14 }}>{item.icon}</span>
              {item.label}
            </button>
          )
        })}
      </aside>

      {/* Content */}
      <main style={{ flex: 1, padding: '28px 28px', overflowY: 'auto' }}>
        <Outlet />
      </main>
    </div>
  )
}
