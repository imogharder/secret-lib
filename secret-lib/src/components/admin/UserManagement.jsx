import { useState, useEffect } from 'react'
import { getAllUsers, updateUserRole, deleteUserDoc } from '../../lib/db'
import { useAuth } from '../../contexts/AuthContext'
import { Toast } from '../layout/Toast'
import { useToast } from '../../hooks/useToast'

const ROLE_COLORS = { admin: 'var(--accent)', member: '#27AE60', pending: '#F1C40F' }
const ROLE_ICONS  = { admin: '⚡', member: '✓', pending: '⏳' }

export const UserManagement = () => {
  const { user: currentUser } = useAuth()
  const { toast, showToast }  = useToast()
  const [users,   setUsers]   = useState([])
  const [loading, setLoading] = useState(true)
  const [filter,  setFilter]  = useState('all')

  const load = async () => {
    setLoading(true)
    const data = await getAllUsers()
    setUsers(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleRole = async (uid, role) => {
    await updateUserRole(uid, role)
    showToast(`User set to ${role}`, 'success')
    load()
  }

  const handleDelete = async (uid, email) => {
    if (!window.confirm(`Remove ${email} from the library? This cannot be undone.`)) return
    await deleteUserDoc(uid)
    showToast('User removed', 'success')
    load()
  }

  const filtered = users.filter(u => filter === 'all' ? true : u.role === filter)

  const counts = {
    all:     users.length,
    pending: users.filter(u => u.role === 'pending').length,
    member:  users.filter(u => u.role === 'member').length,
    admin:   users.filter(u => u.role === 'admin').length,
  }

  return (
    <div>
      <Toast toast={toast} />

      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--accent)', letterSpacing: 3, marginBottom: 6 }}>MEMBERS</div>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 26, fontWeight: 300 }}>User Management</h2>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
        {Object.entries(counts).map(([key, count]) => (
          <button key={key} onClick={() => setFilter(key)} style={{
            padding: '6px 16px', borderRadius: 20, fontSize: 10, fontFamily: 'var(--font-mono)',
            background: filter === key ? 'var(--accent-dim)' : 'var(--bg-card)',
            border: `1px solid ${filter === key ? 'var(--accent-dim)' : 'var(--border-soft)'}`,
            color: filter === key ? 'var(--accent)' : 'var(--text-secondary)',
            transition: 'var(--transition)',
          }}>
            {key.toUpperCase()} ({count})
          </button>
        ))}
      </div>

      {/* Pending notice */}
      {counts.pending > 0 && (
        <div style={{ background: 'rgba(241,196,15,0.08)', border: '1px solid rgba(241,196,15,0.3)', borderRadius: 'var(--radius-md)', padding: '12px 16px', marginBottom: 18, display: 'flex', gap: 10, alignItems: 'center' }}>
          <span>⚠️</span>
          <span style={{ fontSize: 12, color: '#F1C40F' }}>
            {counts.pending} user{counts.pending > 1 ? 's' : ''} waiting for approval
          </span>
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><div className="spinner" /></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map(u => {
            const isSelf  = u.id === currentUser?.uid
            const roleColor = ROLE_COLORS[u.role] || 'var(--text-dim)'
            return (
              <div key={u.id} className="glass-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
                {/* Avatar */}
                {u.photoURL
                  ? <img src={u.photoURL} style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0 }} alt="" />
                  : <div style={{ width: 36, height: 36, borderRadius: '50%', background: `${roleColor}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: roleColor, flexShrink: 0 }}>
                      {(u.displayName || u.email || 'U')[0].toUpperCase()}
                    </div>
                }

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    {u.displayName || 'No name'}
                    {isSelf && <span style={{ fontSize: 8, background: 'var(--accent-dim)', color: 'var(--accent)', padding: '1px 6px', borderRadius: 8, fontFamily: 'var(--font-mono)' }}>YOU</span>}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{u.email}</div>
                </div>

                {/* Role badge */}
                <span style={{
                  fontSize: 9, fontFamily: 'var(--font-mono)', fontWeight: 700,
                  background: `${roleColor}18`, color: roleColor,
                  padding: '4px 12px', borderRadius: 20, border: `1px solid ${roleColor}33`,
                }}>
                  {ROLE_ICONS[u.role]} {u.role?.toUpperCase()}
                </span>

                {/* Actions */}
                {!isSelf && (
                  <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                    {u.role === 'pending' && (
                      <button onClick={() => handleRole(u.id, 'member')} className="btn btn-sm" style={{ background: 'rgba(39,174,96,0.15)', border: '1px solid rgba(39,174,96,0.4)', color: '#27AE60', fontSize: 10 }}>
                        ✓ Approve
                      </button>
                    )}
                    {u.role === 'member' && (
                      <button onClick={() => handleRole(u.id, 'admin')} className="btn btn-sm" style={{ background: 'var(--accent-dim)', border: '1px solid var(--accent-dim)', color: 'var(--accent)', fontSize: 10 }}>
                        ⚡ Make Admin
                      </button>
                    )}
                    {u.role === 'admin' && (
                      <button onClick={() => handleRole(u.id, 'member')} className="btn btn-ghost btn-sm">
                        Demote
                      </button>
                    )}
                    {u.role !== 'pending' && (
                      <button onClick={() => handleRole(u.id, 'pending')} className="btn btn-ghost btn-sm">
                        Suspend
                      </button>
                    )}
                    <button onClick={() => handleDelete(u.id, u.email)} className="btn btn-danger btn-sm">
                      ✕
                    </button>
                  </div>
                )}
              </div>
            )
          })}
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '36px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
              No users in this category
            </div>
          )}
        </div>
      )}
    </div>
  )
}
