import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/layout/ProtectedRoute'
import { Navbar } from './components/layout/Navbar'
import { LoginPage } from './components/auth/LoginPage'
import { RegisterPage } from './components/auth/RegisterPage'
import { PendingPage } from './components/auth/PendingPage'
import { LibraryPage } from './components/library/LibraryPage'
import { AdminLayout } from './components/admin/AdminLayout'
import { AdminDashboard } from './components/admin/AdminDashboard'
import { UserManagement } from './components/admin/UserManagement'
import { NicheManager } from './components/admin/NicheManager'
import { TagManager } from './components/admin/TagManager'
import { EntryManager } from './components/admin/EntryManager'

const AppLayout = ({ children }) => (
  <>
    <Navbar />
    {children}
  </>
)

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/pending"  element={<PendingPage />} />

          {/* Protected: Library */}
          <Route
            path="/library"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <LibraryPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          {/* Protected: Admin */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin>
                <AppLayout>
                  <AdminLayout />
                </AppLayout>
              </ProtectedRoute>
            }
          >
            <Route index           element={<AdminDashboard />} />
            <Route path="users"    element={<UserManagement />} />
            <Route path="niches"   element={<NicheManager />} />
            <Route path="tags"     element={<TagManager />} />
            <Route path="entries"  element={<EntryManager />} />
          </Route>

          {/* Default redirect */}
          <Route path="/"   element={<Navigate to="/library" replace />} />
          <Route path="*"   element={<Navigate to="/library" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
