import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, profile, loading } = useAuth()

  if (loading) return <PageLoader />

  if (!user) return <Navigate to="/login" replace />

  if (profile?.role === 'pending') return <Navigate to="/pending" replace />

  if (requireAdmin && profile?.role !== 'admin') {
    return <Navigate to="/library" replace />
  }

  return children
}

const PageLoader = () => (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--bg-root)',
    flexDirection: 'column',
    gap: 16,
  }}>
    <div style={{
      fontFamily: 'var(--font-serif)',
      fontSize: 28,
      color: 'var(--accent)',
      letterSpacing: 3,
    }}>
      SECRET LIBRARY
    </div>
    <div className="spinner" />
  </div>
)
