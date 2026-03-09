import { useState, useMemo } from 'react'

export const SearchBar = ({ entries, niches, onSelect }) => {
  const [q, setQ] = 
  useState('')

  const results = useMemo(() => {
    if (q.trim().length < 2) return []
    const lower = q.toLowerCase()
    return entries.filter(e =>
      e.title?.toLowerCase().includes(lower) ||
      e.summary?.toLowerCase().includes(lower) ||
      e.content?.toLowerCase().includes(lower)
    ).slice(0, 8)
  }, [q, entries])

  const getNiche = (nicheId) => niches.find(n => n.id === nicheId)

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ position: 'relative' }}>
        <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 13, pointerEvents: 'none' }}>🔍</span>
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Search all entries..."
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-soft)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-primary)',
            padding: '8px 14px 8px 34px',
            fontSize: 11,
            fontFamily: 'var(--font-mono)',
            width: 220,
            outline: 'none',
            transition: 'border-color 0.15s',
          }}
          onFocus={e => e.target.style.borderColor = 'var(--accent-dim)'}
          onBlur={e => { e.target.style.borderColor = 'var(--border-soft)'; setTimeout(() => setQ(''), 200) }}
        />
      </div>

      {results.length > 0 && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', right: 0,
          width: 380, background: 'var(--bg-modal)',
          border: '1px solid var(--border-soft)',
          borderRadius: 'var(--radius-md)', zIndex: 200,
          maxHeight: 340, overflowY: 'auto',
          boxShadow: 'var(--shadow-modal)',
        }}>
          {results.map((entry, i) => {
            const niche = getNiche(entry.nicheId)
            return (
              <div
                key={entry.id}
                onClick={() => { onSelect(entry); setQ('') }}
                style={{
                  padding: '10px 14px',
                  borderBottom: i < results.length - 1 ? '1px solid var(--border)' : 'none',
                  cursor: 'pointer', transition: 'background 0.1s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ fontSize: 12, color: 'var(--text-primary)', marginBottom: 3 }}>
                  {entry.title}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {niche && (
                    <span style={{ fontSize: 9, color: niche.color + '88', fontFamily: 'var(--font-mono)' }}>
                      {niche.icon} {niche.name}
                    </span>
                  )}
                  <span style={{ fontSize: 9, color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                    {entry.type}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
