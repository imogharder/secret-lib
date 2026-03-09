import { useState, useEffect } from 'react'
import { getTags, addTag, updateTag, deleteTag } from '../../lib/db'
import { useAuth } from '../../contexts/AuthContext'
import { ColorPicker } from '../library/ColorPicker'
import { Toast } from '../layout/Toast'
import { useToast } from '../../hooks/useToast'

const TagForm = ({ tag, onSave, onClose }) => {
  const [name,  setName]  = useState(tag?.name  || '')
  const [color, setColor] = useState(tag?.color || '#c9a84c')
  const valid = name.trim()

  return (
    <div className="overlay" onClick={onClose}>
      <div className="anim-fade-up glass-card" onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 380, padding: '24px 26px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent)', letterSpacing: 3, marginBottom: 20 }}>
          {tag?.id ? 'EDIT TAG' : 'NEW TAG'}
        </div>
        <div style={{ marginBottom: 18 }}>
          <label className="mono-label">TAG NAME</label>
          <input className="input" autoFocus value={name} onChange={e => setName(e.target.value)} placeholder="tag name..."
            onKeyDown={e => e.key === 'Enter' && valid && onSave({ name: name.trim(), color })} />
        </div>
        <div style={{ marginBottom: 24 }}>
          <ColorPicker value={color} onChange={setColor} />
        </div>
        {/* Preview */}
        <div style={{ marginBottom: 22, display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 9, color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>PREVIEW:</span>
          <span className="tag-pill" style={{ background: `${color}18`, color, borderColor: `${color}44`, fontSize: 11, padding: '4px 14px' }}>
            {name || 'tag'}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button onClick={onClose} className="btn btn-ghost">Cancel</button>
          <button onClick={() => valid && onSave({ name: name.trim(), color })} className="btn btn-primary" disabled={!valid}>
            {tag?.id ? 'Save' : 'Create Tag'}
          </button>
        </div>
      </div>
    </div>
  )
}

export const TagManager = () => {
  const { user }             = useAuth()
  const { toast, showToast } = useToast()
  const [tags,    setTags]    = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)

  const load = async () => { setLoading(true); setTags(await getTags()); setLoading(false) }
  useEffect(() => { load() }, [])

  const handleSave = async (data) => {
    try {
      if (editing?.id) { await updateTag(editing.id, data); showToast('Tag updated', 'success') }
      else             { await addTag(data, user.uid);      showToast('Tag created', 'success') }
      setEditing(null); load()
    } catch { showToast('Error saving tag', 'error') }
  }

  const handleDelete = async (tag) => {
    if (!window.confirm(`Delete tag "${tag.name}"?`)) return
    try { await deleteTag(tag.id); showToast('Tag deleted', 'success'); load() }
    catch { showToast('Error deleting tag', 'error') }
  }

  return (
    <div>
      <Toast toast={toast} />
      {editing !== null && (
        <TagForm tag={editing === 'new' ? null : editing} onSave={handleSave} onClose={() => setEditing(null)} />
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--accent)', letterSpacing: 3, marginBottom: 6 }}>TAXONOMY</div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 26, fontWeight: 300 }}>Tags</h2>
        </div>
        <button onClick={() => setEditing('new')} className="btn btn-primary">+ New Tag</button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><div className="spinner" /></div>
      ) : tags.length === 0 ? (
        <div className="glass-card" style={{ padding: 40, textAlign: 'center' }}>
          <div style={{ fontSize: 28, marginBottom: 10 }}>🏷️</div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>No tags yet. Create tags to organize entries.</p>
          <button onClick={() => setEditing('new')} className="btn btn-primary">Create First Tag</button>
        </div>
      ) : (
        <>
          {/* Tag cloud view */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 28 }}>
            {tags.map(tag => (
              <span key={tag.id} className="tag-pill" style={{
                background: `${tag.color}14`, color: tag.color, borderColor: `${tag.color}40`,
                fontSize: 12, padding: '6px 16px',
              }}>
                {tag.name}
              </span>
            ))}
          </div>

          {/* Tag list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {tags.map(tag => (
              <div key={tag.id} className="glass-card" style={{
                padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 14,
                borderLeft: `3px solid ${tag.color}55`,
              }}>
                <div style={{ width: 16, height: 16, borderRadius: 4, background: tag.color, flexShrink: 0 }} />
                <span style={{ fontWeight: 600, fontSize: 13, flex: 1 }}>{tag.name}</span>
                <span style={{ fontSize: 9, color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>{tag.color}</span>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => setEditing(tag)} className="btn btn-ghost btn-sm">Edit</button>
                  <button onClick={() => handleDelete(tag)} className="btn btn-danger btn-sm">✕</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
