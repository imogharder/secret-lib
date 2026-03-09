import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export const LoginPage = () => {
  const { loginWithGoogle, loginWithEmail } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  const handleGoogle = async () => {
    setLoading(true); setError('')
    try {
      await loginWithGoogle()
      navigate('/library')
    } catch (e) {
      setError(e.message)
    } finally { setLoading(false) }
  }

  const handleEmail = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      await loginWithEmail(email, password)
      navigate('/library')
    } catch (e) {
      setError('Invalid email or password.')
    } finally { setLoading(false) }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-root)', padding: 20,
      backgroundImage: 'radial-gradient(ellipse at 30% 20%, rgba(201,168,76,0.06) 0%, transparent 50%)',
    }}>
      <div className="anim-fade-up" style={{ width: '100%', maxWidth: 400 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>📚</div>
          <h1 style={{
            fontFamily: 'var(--font-serif)', fontSize: 32, fontWeight: 300,
            color: 'var(--accent)', letterSpacing: 3, marginBottom: 6,
          }}>
            Secret Library
          </h1>
          <p style={{ fontSize: 11, color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', letterSpacing: 2 }}>
            RESTRICTED ACCESS · SIGN IN TO ENTER
          </p>
        </div>

        <div className="glass-card" style={{ padding: '28px 28px' }}>

          {/* Google Sign-In */}
          <button
            onClick={handleGoogle}
            disabled={loading}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 10, padding: '11px 20px',
              background: 'var(--bg-input)', border: '1px solid var(--border-soft)',
              borderRadius: 'var(--radius-md)', color: 'var(--text-primary)',
              fontSize: 13, fontWeight: 500, transition: 'var(--transition)',
              marginBottom: 20,
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-hover)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-soft)'}
          >
            <GoogleIcon />
            Continue with Google
          </button>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ flex: 1, borderTop: '1px solid var(--border)' }} />
            <span style={{ fontSize: 9, color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>OR</span>
            <div style={{ flex: 1, borderTop: '1px solid var(--border)' }} />
          </div>

          {/* Email form */}
          <form onSubmit={handleEmail} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label className="mono-label">EMAIL</label>
              <input className="input" type="email" value={email}
                onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
            </div>
            <div>
              <label className="mono-label">PASSWORD</label>
              <input className="input" type="password" value={password}
                onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
            </div>

            {error && (
              <div style={{ fontSize: 11, color: 'var(--danger)', fontFamily: 'var(--font-mono)', padding: '8px 12px', background: 'rgba(192,57,43,0.08)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(192,57,43,0.2)' }}>
                {error}
              </div>
            )}

            <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: 4 }}>
              {loading ? <span className="spinner" /> : 'Sign In'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 18, fontSize: 11, color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
            No account?{' '}
            <Link to="/register" style={{ color: 'var(--accent)', textDecoration: 'none' }}>
              Request Access →
            </Link>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 9, color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', letterSpacing: 2 }}>
          ACCESS REQUIRES ADMIN APPROVAL
        </div>
      </div>
    </div>
  )
}

const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
)
