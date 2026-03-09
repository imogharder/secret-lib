import { useState, useEffect } from 'react'

const TYPE_OPTIONS = [
  { value: 'note',  icon: '📝', label: 'Note'  },
  { value: 'link',  icon: '🔗', label: 'Link'  },
  { value: 'post',  icon: '📄', label: 'Post'  },
]

const ICONS = ['📁','🧠','🦴','⚡','🔬','📊','💡','🎯','🔥','⚗️','🌐','🏆','💎','🔴','🔵','💊','♟','📚','🧬','✨','💈']

export const EntryEditor = ({ entry, niches, categories, tags, activeNicheId, onSave, onClose }) => {
  const [type,       setType]       = useState(entry?.type || 'note')
  const [title,      setTitle]      = useState(entry?.title || '')
  const [summary,    setSummary]    = useState(entry?.summary || '')
  const [content,    setContent]    = useState(entry?.content || '')
  const [url,        setUrl]        = useState(entry?.url || '')
  const [nicheId,    setNicheId]    = useState(entry?.nicheId || activeNicheId || '')
  const [categoryId, setCategoryId] = useState(entry?.categoryId || '')
  const [tagIds,     setTagIds]     = useState(entry?.tagIds || [])
  const [status,     setStatus]     = useState(entry?.status || 'published')

  // Filter categories by selected niche
  const filteredCats = categories.filter(c => c.nicheId === nicheId)

  useEffect(() => {
    if (nicheId && !filteredCats.find(c => c.id === categoryId)) {
      setCategoryId('')
    }
  }, [nicheId])

  const valid = title.trim() && content.trim() && nicheId

  const handleSave = () => {
    if (!valid) return
    onSave({
      type, title: title.trim(), summary: summary.trim(),
      content: content.trim(), url: url.trim(),
      nicheId, categoryId, tagIds, status,
    })
  }

  const toggleTag = (id) => {
    setTagIds(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id])
  }

  return (
    <div className="overlay" onClick={onClose}>
      <div
        className="anim-fade-up"
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 740,
          maxHeight: '92vh', overflowY: 'auto',
          background: 'var(--bg-modal)',
          border: '1px solid var(--border-soft)',
          borderRadius: 'var(--radius-xl)',
          padding: '28px 30px',
          boxShadow: 'var(--shadow-modal)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent)', letterSpacing: 3 }}>
            {entry?.id ? 'EDIT ENTRY' : 'NEW ENTRY'}
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm">✕</button>
        </div>

        {/* Type selector */}
        <div style={{ marginBottom: 20 }}>
          <label className="mono-label">TYPE</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {TYPE_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => setType(opt.value)}
                style={{
                  flex: 1, padding: '9px 12px', borderRadius: 'var(--radius-md)',
                  background: type === opt.value ? 'var(--accent-dim)' : 'var(--bg-input)',
                  border: `1px solid ${type === opt.value ? 'var(--accent-dim)' : 'var(--border-soft)'}`,
                  color: type === opt.value ? 'var(--accent)' : 'var(--text-secondary)',
                  fontSize: 12, fontFamily: 'var(--font-mono)', transition: 'var(--transition)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                }}
              >
                {opt.icon} {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Niche + Category row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
          <div>
            <label className="mono-label">NICHE *</label>
            <select
              className="input"
              value={nicheId}
              onChange={e => setNicheId(e.target.value)}
              style={{ color: nicheId ? 'var(--text-primary)' : 'var(--text-dim)' }}
            >
              <option value="">Select niche...</option>
              {niches.map(n => <option key={n.id} value={n.id}>{n.icon} {n.name}</option>)}
            </select>
          </div>
          <div>
            <label className="mono-label">CATEGORY</label>
            <select
              className="input"
              value={categoryId}
              onChange={e => setCategoryId(e.target.value)}
              disabled={!nicheId}
              style={{ color: categoryId ? 'var(--text-primary)' : 'var(--text-dim)' }}
            >
              <option value="">No category</option>
              {filteredCats.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
            </select>
          </div>
        </div>

        {/* URL for links */}
        {type === 'link' && (
          <div style={{ marginBottom: 16 }}>
            <label className="mono-label">URL</label>
            <input className="input" type="url" value={url}
              onChange={e => setUrl(e.target.value)} placeholder="https://..." />
          </div>
        )}

        {/* Title */}
        <div style={{ marginBottom: 14 }}>
          <label className="mono-label">TITLE *</label>
          <input className="input" value={title}
            onChange={e => setTitle(e.target.value)} placeholder="Entry title..." />
        </div>

        {/* Summary */}
        <div style={{ marginBottom: 14 }}>
          <label className="mono-label">SUMMARY <span style={{ color: 'var(--text-dim)' }}>(one line preview)</span></label>
          <input className="input" value={summary}
            onChange={e => setSummary(e.target.value)} placeholder="Brief description for the card preview..." />
        </div>

        {/* Content */}
        <div style={{ marginBottom: 16 }}>
          <label className="mono-label">CONTENT *</label>
          <textarea
            className="input"
            rows={12}
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Full content, notes, analysis..."
            style={{ resize: 'vertical', lineHeight: 1.7 }}
          />
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <label className="mono-label">TAGS</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {tags.map(tag => {
                const selected = tagIds.includes(tag.id)
                return (
                  <button
                    key={tag.id}
                    onClick={() => toggleTag(tag.id)}
                    className="tag-pill"
                    style={{
                      background: selected ? `${tag.color}22` : 'var(--bg-input)',
                      color: selected ? tag.color : 'var(--text-dim)',
                      borderColor: selected ? `${tag.color}55` : 'var(--border-soft)',
                      cursor: 'pointer',
                      fontSize: 10,
                      padding: '4px 12px',
                    }}
                  >
                    {tag.name}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Status */}
        <div style={{ marginBottom: 24 }}>
          <label className="mono-label">STATUS</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {['published', 'draft'].map(s => (
              <button key={s} onClick={() => setStatus(s)} style={{
                padding: '7px 18px', borderRadius: 'var(--radius-sm)',
                background: status === s ? 'var(--bg-card)' : 'none',
                border: `1px solid ${status === s ? 'var(--border-soft)' : 'transparent'}`,
                color: status === s ? 'var(--text-primary)' : 'var(--text-dim)',
                fontSize: 10, fontFamily: 'var(--font-mono)', transition: 'var(--transition)',
              }}>
                {s === 'published' ? '✓ ' : '○ '}{s.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button onClick={onClose} className="btn btn-ghost">Cancel</button>
          <button onClick={handleSave} className="btn btn-primary" disabled={!valid}>
            {entry?.id ? 'Save Changes' : 'Create Entry'}
          </button>
        </div>
      </div>
    </div>
  )
}
