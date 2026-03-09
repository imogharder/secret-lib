import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export const PendingPage = () => {
  const { logout, refreshProfile, isMember, user } = useAuth()
  const navigate = useNavigate()

  // Poll for approval every 10 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      await refreshProfile()
    }, 10000)
    return () => clearInterval(interval)
  }, [refreshProfile])

  useEffect(() => {
    if (isMember) navigate('/library')
  }, [isMember, navigate])

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-root)', padding: 20,
      backgroundImage: 'radial-gradient(ellipse at 50% 40%, rgba(201,168,76,0.05) 0%, transparent 60%)',
    }}>
      <div className="anim-fade-up" style={{ textAlign: 'center', maxWidth: 480 }}>
        <div style={{ fontSize: 48, marginBottom: 20 }}>⏳</div>

        <h1 style={{
          fontFamily: 'var(--font-serif)', fontSize: 32, fontWeight: 300,
          color: 'var(--accent)', letterSpacing: 3, marginBottom: 12,
        }}>
          Awaiting Approval
        </h1>

        <p style={{
          fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7,
          marginBottom: 32,
        }}>
          Your account <strong style={{ color: 'var(--text-primary)' }}>{user?.email}</strong> has been created
          and is pending review by the administrator. You'll be granted access once approved.
        </p>

        <div className="glass-card" style={{ padding: '20px 24px', marginBottom: 28, textAlign: 'left' }}>
          <div style={{ fontSize: 9, color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', letterSpacing: 2, marginBottom: 14 }}>
            WHAT HAPPENS NEXT
          </div>
          {[
            ['🔍', 'Admin reviews your request'],
            ['✅', 'Your account is approved'],
            ['🏛️', 'This page redirects automatically'],
          ].map(([icon, text]) => (
            <div key={text} style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 10, color: 'var(--text-secondary)', fontSize: 13 }}>
              <span>{icon}</span>
              <span>{text}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={async () => { await refreshProfile(); if (isMember) navigate('/library') }}
            className="btn btn-ghost btn-sm"
          >
            Check Status
          </button>
          <button
            onClick={async () => { await logout(); navigate('/login') }}
            className="btn btn-ghost btn-sm"
          >
            Sign Out
          </button>
        </div>

        <div style={{ marginTop: 28, fontSize: 9, color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', letterSpacing: 1 }}>
          PAGE CHECKS FOR APPROVAL EVERY 10 SECONDS
        </div>
      </div>
    </div>
  )
}
