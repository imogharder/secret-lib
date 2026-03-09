import { useState } from 'react'
import { ColorPicker } from './ColorPicker'

const ICONS = ['📁','🧠','🦴','⚡','🔬','📊','💡','🎯','🔥','⚗️','🌐','🏆','💎','🔴','🔵','💊','♟','📚','🧬','✨','💈','📈','🎨','🛡️','⚖️','🔑']

export const CategoryEditor = ({ category, nicheColor, onSave, onClose }) => {
  const [name,  setName]  = useState(category?.name  || '')
  const [icon,  setIcon]  = useState(category?.icon  || '📁')
  const [color, setColor] = useState(category?.color || nicheColor || '#c9a84c')

  const valid = name.trim()

  return (
    <div className="overlay" onClick={onClose}>
      <div className="anim-fade-up glass-card" onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 420, padding: '24px 26px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent)', letterSpacing: 3, marginBottom: 20 }}>
          {category?.id ? 'EDIT CATEGORY' : 'NEW CATEGORY'}
        </div>

        <div style={{ marginBottom: 16 }}>
          <label className="mono-label">NAME</label>
          <input
            className="input"
            autoFocus
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Category name..."
            onKeyDown={e => e.key === 'Enter' && valid && onSave({ name: name.trim(), icon, color })}
          />
        </div>

        <div style={{ marginBottom: 18 }}>
          <label className="mono-label">ICON</label>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {ICONS.map(ic => (
              <button
                key={ic}
                onClick={() => setIcon(ic)}
                style={{
                  width: 34, height: 34, borderRadius: 'var(--radius-sm)',
                  border: `1px solid ${ic === icon ? color + '77' : 'var(--border-soft)'}`,
                  background: ic === icon ? `${color}22` : 'var(--bg-input)',
                  fontSize: 16, cursor: 'pointer', transition: 'var(--transition)',
                }}
              >
                {ic}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <ColorPicker value={color} onChange={setColor} />
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button onClick={onClose} className="btn btn-ghost">Cancel</button>
          <button
            onClick={() => valid && onSave({ name: name.trim(), icon, color })}
            className="btn btn-primary"
            disabled={!valid}
          >
            {category?.id ? 'Save' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  )
}
