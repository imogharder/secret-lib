import { useState } from 'react'
import { EntryCard } from './EntryCard'
import { useAuth } from '../../contexts/AuthContext'

export const CategorySection = ({ category, niche, entries, tags, onEntryClick, onAddEntry, onEditCategory, onDeleteCategory }) => {
  const [open, setOpen] = useState(true)
  const { isAdmin } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const accentColor = category.color || niche?.color || 'var(--accent)'

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      marginBottom: 12,
    }}>
      {/* Category header */}
      <div
        onClick={() => setOpen(v => !v)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '13px 18px', cursor: 'pointer',
          background: open ? `${accentColor}0a` : 'transparent',
          borderBottom: open ? '1px solid var(--border)' : 'none',
          transition: 'var(--transition)',
        }}
        onMouseEnter={e => e.currentTarget.style.background = `${accentColor}12`}
        onMouseLeave={e => e.currentTarget.style.background = open ? `${accentColor}0a` : 'transparent'}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 16 }}>{category.icon}</span>
          <span style={{ fontWeight: 600, fontSize: 13, color: accentColor, letterSpacing: 0.5 }}>
            {category.name}
          </span>
          <span style={{
            fontSize: 9, color: `${accentColor}66`,
            background: `${accentColor}12`, padding: '2px 8px',
            borderRadius: 8, fontFamily: 'var(--font-mono)',
          }}>
            {entries.length}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {isAdmin && (
            <div style={{ position: 'relative' }}>
              <button
                onClick={e => { e.stopPropagation(); setMenuOpen(v => !v) }}
                style={{
                  background: 'none', border: '1px solid transparent',
                  borderRadius: 'var(--radius-sm)', color: 'var(--text-dim)',
                  padding: '2px 8px', fontSize: 11, transition: 'var(--transition)',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-soft)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.color = 'var(--text-dim)' }}
              >
                ⋯
              </button>
              {menuOpen && (
                <div
                  style={{
                    position: 'absolute', right: 0, top: 'calc(100% + 4px)',
                    background: 'var(--bg-modal)', border: '1px solid var(--border-soft)',
                    borderRadius: 'var(--radius-md)', padding: 4, zIndex: 50, minWidth: 120,
                    boxShadow: 'var(--shadow-card)',
                  }}
                  onClick={e => e.stopPropagation()}
                  onMouseLeave={() => setMenuOpen(false)}
                >
                  <CatMenuBtn onClick={() => { onEditCategory(); setMenuOpen(false) }}>Edit Category</CatMenuBtn>
                  <CatMenuBtn onClick={() => { if (window.confirm('Delete this category?')) onDeleteCategory(); setMenuOpen(false) }} danger>Delete</CatMenuBtn>
                </div>
              )}
            </div>
          )}
          <span style={{ fontSize: 9, color: 'var(--text-dim)' }}>{open ? '▲' : '▼'}</span>
        </div>
      </div>

      {/* Entries grid */}
      {open && (
        <div style={{ padding: 14 }}>
          {entries.length > 0
            ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 10, marginBottom: 10 }}>
                {entries.map(entry => (
                  <EntryCard key={entry.id} entry={entry} niche={niche} tags={tags} onClick={() => onEntryClick(entry)} />
                ))}
              </div>
            )
            : (
              <div style={{ textAlign: 'center', padding: '20px 0 10px', color: 'var(--text-dim)', fontSize: 12, fontFamily: 'var(--font-mono)' }}>
                No entries yet
              </div>
            )
          }
          <button
            onClick={onAddEntry}
            style={{
              width: '100%', background: 'none',
              border: `1px dashed ${accentColor}22`,
              borderRadius: 'var(--radius-md)',
              color: `${accentColor}44`, padding: '8px',
              fontSize: 10, fontFamily: 'var(--font-mono)', transition: 'var(--transition)',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = `${accentColor}55`; e.currentTarget.style.color = `${accentColor}88` }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = `${accentColor}22`; e.currentTarget.style.color = `${accentColor}44` }}
          >
            + add entry to {category.name}
          </button>
        </div>
      )}
    </div>
  )
}

const CatMenuBtn = ({ children, onClick, danger }) => (
  <button
    onClick={onClick}
    style={{
      width: '100%', textAlign: 'left', background: 'none', border: 'none',
      color: danger ? 'var(--danger)' : 'var(--text-secondary)',
      padding: '7px 10px', borderRadius: 'var(--radius-sm)',
      fontSize: 11, fontFamily: 'var(--font-mono)', transition: 'var(--transition)',
    }}
    onMouseEnter={e => e.currentTarget.style.background = 'var(--border)'}
    onMouseLeave={e => e.currentTarget.style.background = 'none'}
  >
    {children}
  </button>
)
