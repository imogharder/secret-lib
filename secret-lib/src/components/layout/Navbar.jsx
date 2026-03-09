import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export const Navbar = () => {
  const { user, profile, isAdmin, logout } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const inAdmin = location.pathname.startsWith('/admin')

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(6,6,8,0.92)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border)',
      padding: '0 24px',
      height: 56,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      {/* Logo */}
      <div
        onClick={() => navigate('/library')}
        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}
      >
        <span style={{ fontSize: 18 }}>📚</span>
        <span style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 17,
          letterSpacing: 2,
          color: 'var(--accent)',
          fontWeight: 400,
        }}>
          SECRET LIBRARY
        </span>
      </div>

      {/* Nav links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {isAdmin && (
          <>
            <NavBtn active={!inAdmin} onClick={() => navigate('/library')}>Library</NavBtn>
            <NavBtn active={inAdmin} accent onClick={() => navigate('/admin')}>
              ⚡ Admin
            </NavBtn>
          </>
        )}

        {/* User menu */}
        <div style={{ position: 'relative', marginLeft: 8 }}>
          <button
            onClick={() => setMenuOpen(v => !v)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'var(--bg-card)',
              border: '1px solid var(--border-soft)',
              borderRadius: 'var(--radius-md)',
              padding: '6px 12px',
              color: 'var(--text-secondary)',
              fontSize: 11,
              fontFamily: 'var(--font-mono)',
              transition: 'var(--transition)',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-hover)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-soft)'}
          >
            {user?.photoURL
              ? <img src={user.photoURL} style={{ width: 20, height: 20, borderRadius: '50%' }} alt="" />
              : <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: 'var(--accent)' }}>
                  {(profile?.displayName || user?.email || 'U')[0].toUpperCase()}
                </span>
            }
            <span style={{ maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {profile?.displayName || user?.email}
            </span>
            {isAdmin && (
              <span style={{
                fontSize: 8, background: 'var(--accent-dim)', color: 'var(--accent)',
                padding: '1px 6px', borderRadius: 8, fontWeight: 700, letterSpacing: 1
              }}>ADMIN</span>
            )}
            <span style={{ fontSize: 8, color: 'var(--text-dim)' }}>▼</span>
          </button>

          {menuOpen && (
            <div
              style={{
                position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                background: 'var(--bg-modal)', border: '1px solid var(--border-soft)',
                borderRadius: 'var(--radius-md)', minWidth: 160, padding: 6,
                boxShadow: 'var(--shadow-modal)', zIndex: 200,
              }}
              onMouseLeave={() => setMenuOpen(false)}
            >
              <div style={{ padding: '6px 12px 10px', borderBottom: '1px solid var(--border)', marginBottom: 4 }}>
                <div style={{ fontSize: 11, color: 'var(--text-primary)', fontWeight: 600 }}>
                  {profile?.displayName || 'User'}
                </div>
                <div style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>
                  {user?.email}
                </div>
              </div>
              <MenuBtn onClick={handleLogout}>Sign out</MenuBtn>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

const NavBtn = ({ children, active, accent, onClick }) => (
  <button
    onClick={onClick}
    style={{
      background: active ? (accent ? 'var(--accent-dim)' : 'var(--bg-card)') : 'none',
      border: `1px solid ${active ? (accent ? 'var(--accent-dim)' : 'var(--border-soft)') : 'transparent'}`,
      borderRadius: 'var(--radius-sm)',
      color: active ? (accent ? 'var(--accent)' : 'var(--text-primary)') : 'var(--text-muted)',
      padding: '5px 14px',
      fontSize: 11,
      fontFamily: 'var(--font-mono)',
      letterSpacing: 0.5,
      transition: 'var(--transition)',
    }}
    onMouseEnter={e => { if (!active) e.currentTarget.style.color = 'var(--text-primary)' }}
    onMouseLeave={e => { if (!active) e.currentTarget.style.color = 'var(--text-muted)' }}
  >
    {children}
  </button>
)

const MenuBtn = ({ children, onClick, danger }) => (
  <button
    onClick={onClick}
    style={{
      width: '100%', textAlign: 'left',
      background: 'none', border: 'none',
      color: danger ? 'var(--danger)' : 'var(--text-secondary)',
      padding: '7px 12px', borderRadius: 'var(--radius-sm)',
      fontSize: 11, fontFamily: 'var(--font-mono)',
      transition: 'var(--transition)',
    }}
    onMouseEnter={e => e.currentTarget.style.background = 'var(--border)'}
    onMouseLeave={e => e.currentTarget.style.background = 'none'}
  >
    {children}
  </button>
)
