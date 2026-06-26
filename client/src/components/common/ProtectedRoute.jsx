import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth()

  if (loading) return (
    <div style={{
      display: 'flex', alignItems: 'center',
      justifyContent: 'center', height: '100vh',
      background: '#0F172A'
    }}>
      <div style={{
        width: '40px', height: '40px',
        border: '3px solid rgba(6,182,212,0.3)',
        borderTop: '3px solid #06B6D4',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
    </div>
  )

  if (!user) return <Navigate to="/login" />
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/feed" />
  return children
}

export default ProtectedRoute