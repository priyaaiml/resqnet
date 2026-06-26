import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { NotifProvider } from './context/NotifContext'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Feed from './pages/Feed'
import Report from './pages/Report'
import DisasterDetail from './pages/DisasterDetail'
import AdminDashboard from './pages/AdminDashboard'
import VolunteerDashboard from './pages/VolunteerDashboard'
import Analytics from './pages/Analytics'
import ProtectedRoute from './components/common/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <NotifProvider>
        <Router>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#1E293B',
                color: '#F8FAFC',
                border: '1px solid rgba(148,163,184,0.1)',
                borderRadius: '12px',
              }
            }}
          />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/disaster/:id" element={<DisasterDetail />} />
            <Route path="/report" element={
              <ProtectedRoute><Report /></ProtectedRoute>
            } />
            <Route path="/volunteer" element={
              <ProtectedRoute allowedRoles={['volunteer', 'admin']}>
                <VolunteerDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/analytics" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Analytics />
              </ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </NotifProvider>
    </AuthProvider>
  )
}

export default App