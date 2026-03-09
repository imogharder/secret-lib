import { useState, useEffect } from 'react'
import { getAllEntries, deleteEntry, getNiches } from '../../lib/db'
import { Toast } from '../layout/Toast'
import { useToast } from '../../hooks/useToast'

const TYPE_ICONS = { note: '📝', link: '🔗', post: '📄' }

export const EntryManager = () => {
  const { toast, showToast } = useToast()
  const [entries,  setEntries]  = useState([])
  const [niches,   setNiches]   = useState([])
  const [loading,  setLoading]  = useState(true)
  const [filter,   setFilter]   = useState('all')

  const load = async () => {
    setLoading(true)
    const [e, n] = await Promise.all([getAllEntries(), getNiches()])
    setEntries(e); setNiches(n); setLoading(false)
  }
  useEffect(() => { load() }, [])

  const handleDelete = async (entry) => {
    if (!window.confirm(`Delete "${entry.title}"?`)) return
    try { await deleteEntry(entry.id); showToast('Entry deleted', 'success'); load() }
    catch { showToast('Error deleting', 'error') }
  }

  const filtered = filter === 'all' ? entries : entries.filter(e => e.nicheId === filter)
  const getNiche = id => niches.find(n => n.id === id)

  return (
    <div>
      <Toast toast={toast} />
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--accent)', letterSpacing: 3, marginBottom: 6 }}>CONTENT</div>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 26, fontWeight: 300 }}>All Entries</h2>
      </div>

      {/* Filter by niche */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
        <button onClick={() => setFilter('all')} style={{
          padding: '5px 14px', borderRadius: 20, fontSize: 10, fontFamily: 'var(--font-mono)',
          background: filter === 'all' ? 'var(--accent-dim)' : 'var(--bg-card)',
          border: `1px solid ${filter === 'all' ? 'var(--accent-dim)' : 'var(--border-soft)'}`,
          color: filter === 'all' ? 'var(--accent)' : 'var(--text-secondary)',
          transition: 'var(--transition)',
        }}>
          ALL ({entries.length})
        </button>
        {niches.map(n => (
          <button key={n.id} onClick={() => setFilter(n.id)} style={{
            padding: '5px 14px', borderRadius: 20, fontSize: 10, fontFamily: 'var(--font-mono)',
            background: filter === n.id ? `${n.color}22` : 'var(--bg-card)',
            border: `1px solid ${filter === n.id ? n.color + '55' : 'var(--border-soft)'}`,
            color: filter === n.id ? n.color : 'var(--text-secondary)',
            transition: 'var(--transition)',
          }}>
            {n.icon} {n.name} ({entries.filter(e => e.nicheId === n.id).length})
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><div className="spinner" /></div>
      ) : filtered.length === 0 ? (
        <div className="glass-card" style={{ padding: 40, textAlign: 'center', color: 'var(--text-secondary)' }}>
          No entries found
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {filtered.map(entry => {
            const niche = getNiche(entry.nicheId)
            return (
              <div key={entry.id} className="glass-card" style={{
                padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap',
                borderLeft: `3px solid ${niche?.color || 'var(--border)'}55`,
              }}>
                <span style={{ fontSize: 14 }}>{TYPE_ICONS[entry.type] || '📝'}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {entry.title}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>
                    {niche ? `${niche.icon} ${niche.name}` : 'No niche'} · by {entry.authorName || 'Unknown'}
                  </div>
                </div>
                <span style={{
                  fontSize: 9, fontFamily: 'var(--font-mono)', color: entry.status === 'published' ? '#27AE60' : 'var(--text-dim)',
                  background: entry.status === 'published' ? 'rgba(39,174,96,0.1)' : 'var(--bg-card)',
                  padding: '3px 10px', borderRadius: 20,
                  border: `1px solid ${entry.status === 'published' ? 'rgba(39,174,96,0.3)' : 'var(--border-soft)'}`,
                }}>
                  {entry.status || 'published'}
                </span>
                <button onClick={() => handleDelete(entry)} className="btn btn-danger btn-sm">✕</button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
