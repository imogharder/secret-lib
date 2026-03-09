import { useState } from 'react'

export const EntryCard = ({ entry, niche, tags, onClick }) => {
  const [hovered, setHovered] = useState(false)
  const accentColor = niche?.color || 'var(--accent)'
  const entryTags   = tags.filter(t => entry.tagIds?.includes(t.id)).slice(0, 4)
  const typeIcon    = { note: '📝', link: '🔗', post: '📄' }[entry.type] || '📝'

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? `${accentColor}08` : 'var(--bg-card)',
        border: `1px solid ${hovered ? accentColor + '30' : 'var(--border)'}`,
        borderLeft: `3px solid ${hovered ? accentColor : accentColor + '44'}`,
        borderRadius: 'var(--radius-md)',
        padding: '14px 16px',
        cursor: 'pointer',
        transition: 'var(--transition)',
        transform: hovered ? 'translateY(-1px)' : 'none',
        boxShadow: hovered ? `0 4px 20px ${accentColor}18` : 'none',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
        <div style={{
          fontSize: 13, fontWeight: 600,
          color: hovered ? '#fff' : 'var(--text-primary)',
          lineHeight: 1.3, flex: 1, marginRight: 8,
        }}>
          {entry.title}
        </div>
        <span style={{ fontSize: 12, flexShrink: 0 }}>{typeIcon}</span>
      </div>

      {entry.summary && (
        <div style={{
          fontSize: 11, color: 'var(--text-dim)', lineHeight: 1.5, marginBottom: 10,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {entry.summary}
        </div>
      )}

      {entryTags.length > 0 && (
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          {entryTags.map(tag => (
            <span key={tag.id} className="tag-pill" style={{
              background: `${tag.color}14`, color: `${tag.color}99`, borderColor: `${tag.color}22`,
              fontSize: 8,
            }}>
              {tag.name}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
