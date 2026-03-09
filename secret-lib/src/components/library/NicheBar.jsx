import { useState } from 'react'

export const NicheBar = ({ niches, activeNicheId, onSelect }) => {
  if (!niches.length) return null

  return (
    <div style={{
      display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 28,
    }}>
      {niches.map(niche => (
        <NicheCard
          key={niche.id}
          niche={niche}
          isActive={activeNicheId === niche.id}
          onClick={() => onSelect(niche.id)}
        />
      ))}
    </div>
  )
}

const NicheCard = ({ niche, isActive, onClick }) => {
  const [hovered, setHovered] = useState(false)
  const c = niche.color || 'var(--accent)'

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: '0 0 auto',
        minWidth: 120,
        padding: '12px 18px',
        background: isActive
          ? `linear-gradient(145deg, ${c}28, ${c}0c)`
          : hovered ? `${c}0c` : 'var(--bg-card)',
        border: `1px solid ${isActive ? c + 'cc' : hovered ? c + '44' : 'var(--border)'}`,
        borderRadius: 'var(--radius-lg)',
        cursor: 'pointer',
        transition: 'all 0.22s ease',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
        transform: isActive ? 'scale(1.04)' : hovered ? 'scale(1.02)' : 'scale(1)',
        boxShadow: isActive ? `0 0 30px ${c}28, inset 0 0 20px ${c}0c` : hovered ? `0 4px 16px ${c}14` : 'none',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {isActive && (
        <div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(circle at center, ${c}12, transparent 65%)`,
          pointerEvents: 'none',
        }} />
      )}

      <span style={{ fontSize: 22, position: 'relative' }}>{niche.icon}</span>
      <span style={{
        fontSize: 9, fontFamily: 'var(--font-mono)', letterSpacing: 2, fontWeight: 700,
        color: isActive ? c : hovered ? c + '77' : 'var(--text-dim)',
        textAlign: 'center', lineHeight: 1.3, position: 'relative',
      }}>
        {niche.name.toUpperCase()}
      </span>

      {isActive && (
        <div style={{
          position: 'absolute', bottom: 7,
          width: 16, height: 2, background: c,
          borderRadius: 1, boxShadow: `0 0 8px ${c}`,
        }} />
      )}
    </button>
  )
}
