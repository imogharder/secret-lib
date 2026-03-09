import { useAuth } from '../../contexts/AuthContext'

export const EntryDetail = ({ entry, niche, tags, onClose, onEdit, onDelete }) => {
  const { isAdmin, user } = useAuth()
  const canEdit = isAdmin || entry.authorId === user?.uid
  const entryTags = tags.filter(t => entry.tagIds?.includes(t.id))
  const accentColor = niche?.color || 'var(--accent)'

  const typeIcon = { note: '📝', link: '🔗', post: '📄' }[entry.type] || '📝'

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 300 }}
      />

      {/* Panel */}
      <div
        className="anim-slide-in"
        style={{
          position: 'fixed', top: 0, right: 0,
          width: 'min(640px, 100vw)',
          height: '100vh',
          background: 'var(--bg-modal)',
          borderLeft: `1px solid ${accentColor}33`,
          display: 'flex', flexDirection: 'column',
          zIndex: 301,
          boxShadow: `-20px 0 80px rgba(0,0,0,0.8), 0 0 60px ${accentColor}12`,
        }}
      >
        {/* Header */}
        <div style={{
          background: `linear-gradient(135deg, ${accentColor}14, transparent)`,
          borderBottom: `1px solid ${accentColor}20`,
          padding: '20px 24px',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{
                fontSize: 9, fontFamily: 'var(--font-mono)', letterSpacing: 1,
                background: `${accentColor}18`, color: accentColor,
                padding: '3px 9px', borderRadius: 20, border: `1px solid ${accentColor}33`,
              }}>
                {typeIcon} {entry.type?.toUpperCase()}
              </span>
              {niche && (
                <span style={{
                  fontSize: 9, fontFamily: 'var(--font-mono)', letterSpacing: 1,
                  background: `${accentColor}10`, color: `${accentColor}88`,
                  padding: '3px 9px', borderRadius: 20, border: `1px solid ${accentColor}20`,
                }}>
                  {niche.icon} {niche.name}
                </span>
              )}
            </div>
            <div style={{ display: 'flex', gap: 7, flexShrink: 0 }}>
              {canEdit && (
                <button
                  onClick={onEdit}
                  className="btn btn-ghost btn-sm"
                  style={{ color: `${accentColor}88`, borderColor: `${accentColor}33` }}
                  onMouseEnter={e => { e.currentTarget.style.color = accentColor; e.currentTarget.style.borderColor = accentColor }}
                  onMouseLeave={e => { e.currentTarget.style.color = `${accentColor}88`; e.currentTarget.style.borderColor = `${accentColor}33` }}
                >
                  Edit
                </button>
              )}
              <button onClick={onClose} className="btn btn-ghost btn-sm">✕</button>
            </div>
          </div>

          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#fff', lineHeight: 1.25, marginBottom: 8 }}>
            {entry.title}
          </h2>

          {entry.summary && (
            <p style={{ fontSize: 13, color: 'var(--text-muted)', fontStyle: 'italic', lineHeight: 1.5 }}>
              {entry.summary}
            </p>
          )}

          {entry.url && (
            <a href={entry.url} target="_blank" rel="noopener noreferrer" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 10,
              fontSize: 11, color: accentColor, fontFamily: 'var(--font-mono)',
              textDecoration: 'none',
            }}>
              🔗 {entry.url.length > 60 ? entry.url.slice(0, 60) + '…' : entry.url}
            </a>
          )}

          {/* Tags */}
          {entryTags.length > 0 && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 12 }}>
              {entryTags.map(tag => (
                <span key={tag.id} className="tag-pill" style={{
                  background: `${tag.color}18`, color: tag.color, borderColor: `${tag.color}40`,
                }}>
                  {tag.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          <div style={{
            whiteSpace: 'pre-wrap', fontSize: 14, lineHeight: 1.85,
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-sans)',
          }}>
            {entry.content}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          borderTop: '1px solid var(--border)',
          padding: '12px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexShrink: 0,
        }}>
          <span style={{ fontSize: 9, color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
            BY {(entry.authorName || 'Unknown').toUpperCase()}
          </span>
          {canEdit && (
            <button
              onClick={() => {
                if (window.confirm(`Delete "${entry.title}"?`)) onDelete()
              }}
              className="btn btn-danger btn-sm"
            >
              Delete Entry
            </button>
          )}
        </div>
      </div>
    </>
  )
}
