import { useState, useEffect } from 'react'
import { getNiches, addNiche, updateNiche, deleteNiche, getCategories } from '../../lib/db'
import { useAuth } from '../../contexts/AuthContext'
import { ColorPicker } from '../library/ColorPicker'
import { Toast } from '../layout/Toast'
import { useToast } from '../../hooks/useToast'

const ICONS = ['🏛️','💊','🔴','🔵','💎','🧠','🦴','⚡','🔬','📊','💡','🎯','🔥','⚗️','🌐','🏆','📚','🧬','✨','💈','📈','🎨','🛡️','⚖️','🔑','🌙','☀️','🗡️','🔮','🎭']

const NicheForm = ({ niche, onSave, onClose }) => {
  const [name, setName]     = useState(niche?.name        || '')
  const [icon, setIcon]     = useState(niche?.icon        || '🏛️')
  const [color, setColor]   = useState(niche?.color       || '#c9a84c')
  const [desc,  setDesc]    = useState(niche?.description || '')

  const valid = name.trim()
  return (
    <div className="overlay" onClick={onClose}>
      <div className="anim-fade-up glass-card" onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 480, padding: '26px 28px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent)', letterSpacing: 3, marginBottom: 20 }}>
          {niche?.id ? 'EDIT NICHE' : 'NEW NICHE'}
        </div>

        <div style={{ marginBottom: 16 }}>
          <label className="mono-label">NAME *</label>
          <input className="input" autoFocus value={name} onChange={e => setName(e.target.value)} placeholder="Niche name..." />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label className="mono-label">DESCRIPTION</label>
          <input className="input" value={desc} onChange={e => setDesc(e.target.value)} placeholder="Brief description..." />
        </div>
        <div style={{ marginBottom: 18 }}>
          <label className="mono-label">ICON</label>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {ICONS.map(ic => (
              <button key={ic} onClick={() => setIcon(ic)} style={{
                width: 36, height: 36, borderRadius: 'var(--radius-sm)',
                border: `1px solid ${ic === icon ? color + '77' : 'var(--border-soft)'}`,
                background: ic === icon ? `${color}22` : 'var(--bg-input)',
                fontSize: 17, cursor: 'pointer', transition: 'var(--transition)',
              }}>{ic}</button>
            ))}
          </div>
        </div>
        <div style={{ marginBottom: 24 }}>
          <ColorPicker value={color} onChange={setColor} />
        </div>

        {/* Preview */}
        <div style={{ marginBottom: 24, padding: '12px 16px', background: `${color}0c`, border: `1px solid ${color}22`, borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 22 }}>{icon}</span>
          <div>
            <div style={{ fontWeight: 700, color, letterSpacing: 1, fontSize: 13 }}>{name || 'Preview'}</div>
            {desc && <div style={{ fontSize: 10, color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>{desc}</div>}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button onClick={onClose} className="btn btn-ghost">Cancel</button>
          <button onClick={() => valid && onSave({ name: name.trim(), icon, color, description: desc.trim() })} className="btn btn-primary" disabled={!valid}>
            {niche?.id ? 'Save Changes' : 'Create Niche'}
          </button>
        </div>
      </div>
    </div>
  )
}

export const NicheManager = () => {
  const { user } = useAuth()
  const { toast, showToast } = useToast()
  const [niches,  setNiches]  = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)   // null | 'new' | niche object

  const load = async () => {
    setLoading(true)
    setNiches(await getNiches())
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const handleSave = async (data) => {
    try {
      if (editing?.id) {
        await updateNiche(editing.id, data)
        showToast('Niche updated', 'success')
      } else {
        await addNiche(data, user.uid)
        showToast('Niche created', 'success')
      }
      setEditing(null)
      load()
    } catch (e) {
      showToast('Error saving niche', 'error')
    }
  }

  const handleDelete = async (niche) => {
    if (!window.confirm(`Delete niche "${niche.name}"? All entries in this niche will remain but lose their niche assignment.`)) return
    try {
      await deleteNiche(niche.id)
      showToast('Niche deleted', 'success')
      load()
    } catch (e) {
      showToast('Error deleting niche', 'error')
    }
  }

  return (
    <div>
      <Toast toast={toast} />
      {editing !== null && (
        <NicheForm niche={editing === 'new' ? null : editing} onSave={handleSave} onClose={() => setEditing(null)} />
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--accent)', letterSpacing: 3, marginBottom: 6 }}>STRUCTURE</div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 26, fontWeight: 300 }}>Niches</h2>
        </div>
        <button onClick={() => setEditing('new')} className="btn btn-primary">+ New Niche</button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><div className="spinner" /></div>
      ) : niches.length === 0 ? (
        <div className="glass-card" style={{ padding: 40, textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🏛️</div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>No niches yet. Create your first niche to get started.</p>
          <button onClick={() => setEditing('new')} className="btn btn-primary">Create First Niche</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
          {niches.map(niche => (
            <div key={niche.id} className="glass-card" style={{
              padding: '18px 20px',
              borderLeft: `3px solid ${niche.color}66`,
              transition: 'var(--transition)',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 22 }}>{niche.icon}</span>
                  <div>
                    <div style={{ fontWeight: 700, color: niche.color, fontSize: 14, letterSpacing: 0.5 }}>{niche.name}</div>
                    {niche.description && <div style={{ fontSize: 10, color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>{niche.description}</div>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => setEditing(niche)} className="btn btn-ghost btn-sm">Edit</button>
                  <button onClick={() => handleDelete(niche)} className="btn btn-danger btn-sm">✕</button>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 14, height: 14, borderRadius: 3, background: niche.color }} />
                <span style={{ fontSize: 9, color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>{niche.color}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
