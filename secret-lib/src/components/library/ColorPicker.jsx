import { useState } from 'react'

const PRESETS = [
  '#C0392B', '#E85D26', '#D4A853', '#F1C40F',
  '#27AE60', '#16A085', '#2980B9', '#8E44AD',
  '#E84393', '#FF6B9D', '#00D2D3', '#A07AE8',
  '#E8B07A', '#7AB8F5', '#6BCB77', '#FF9F43',
]

export const ColorPicker = ({ value, onChange, label = 'COLOR' }) => {
  const [open, setOpen] = useState(false)
  const [custom, setCustom] = useState(value || '#c9a84c')

  const pick = (c) => { onChange(c); setOpen(false) }

  return (
    <div>
      {label && <label className="mono-label">{label}</label>}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        {/* Current color swatch */}
        <button
          onClick={() => setOpen(v => !v)}
          style={{
            width: 36, height: 36, borderRadius: 'var(--radius-sm)',
            background: value || custom,
            border: '2px solid var(--border-soft)',
            cursor: 'pointer', transition: 'var(--transition)',
          }}
          title="Pick color"
        />

        {/* Preset swatches */}
        {open && (
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: 6,
            padding: '10px 12px',
            background: 'var(--bg-modal)', border: '1px solid var(--border-soft)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-card)',
          }}>
            {PRESETS.map(c => (
              <button
                key={c}
                onClick={() => pick(c)}
                style={{
                  width: 22, height: 22, borderRadius: 4,
                  background: c,
                  border: `2px solid ${c === value ? '#fff' : 'transparent'}`,
                  cursor: 'pointer', transition: 'transform 0.1s',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.2)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              />
            ))}
            {/* Custom hex input */}
            <div style={{ display: 'flex', gap: 6, width: '100%', marginTop: 4 }}>
              <input
                type="color"
                value={custom}
                onChange={e => setCustom(e.target.value)}
                style={{ width: 30, height: 30, padding: 0, border: 'none', background: 'none', cursor: 'pointer' }}
              />
              <input
                className="input"
                value={custom}
                onChange={e => setCustom(e.target.value)}
                placeholder="#hex"
                style={{ flex: 1, fontSize: 11, padding: '4px 8px', fontFamily: 'var(--font-mono)' }}
              />
              <button onClick={() => pick(custom)} className="btn btn-primary btn-sm">Use</button>
            </div>
          </div>
        )}

        {!open && (
          <span style={{ fontSize: 11, color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
            {value || custom}
          </span>
        )}
      </div>
    </div>
  )
}
