import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import toast from 'react-hot-toast'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/')
  }

  const navLinks = [
    { label: 'Live Feed', path: '/feed', icon: '🗺️' },
    ...(user ? [{ label: 'Report', path: '/report', icon: '🚨' }] : []),
    ...(user?.role === 'volunteer' || user?.role === 'admin'
      ? [{ label: 'Volunteer', path: '/volunteer', icon: '🦺' }] : []),
    ...(user?.role === 'admin'
      ? [
          { label: 'Admin', path: '/admin', icon: '⚙️' },
          { label: 'Analytics', path: '/analytics', icon: '📊' }
        ] : []),
  ]

  const isActive = (path) => location.pathname === path

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: 'rgba(10,10,15,0.95)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,107,53,0.1)',
      padding: '0 32px', height: '64px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between'
    }}>
      {/* Logo */}
      <Link to="/" style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        textDecoration: 'none'
      }}>
        <div style={{
          width: '32px', height: '32px',
          background: 'linear-gradient(135deg, #FF6B35, #FF2D55)',
          borderRadius: '8px', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          fontSize: '16px'
        }}>🛡️</div>
        <span style={{
          fontSize: '20px', fontWeight: '700',
          fontFamily: 'Space Grotesk, sans-serif',
          background: 'linear-gradient(135deg, #FF6B35, #FF2D55)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>ResQNet</span>
      </Link>

      {/* Nav Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        {navLinks.map((link) => (
          <Link key={link.path} to={link.path} style={{
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '14px', fontWeight: '500',
            textDecoration: 'none',
            transition: 'all 0.2s ease',
            background: isActive(link.path)
              ? 'rgba(255,107,53,0.15)' : 'transparent',
            color: isActive(link.path) ? '#FF6B35' : '#98989F',
            border: isActive(link.path)
              ? '1px solid rgba(255,107,53,0.3)'
              : '1px solid transparent'
          }}>
            {link.icon} {link.label}
          </Link>
        ))}
      </div>

      {/* Right Side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {user ? (
          <>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '6px 12px',
              background: 'rgba(255,107,53,0.08)',
              border: '1px solid rgba(255,107,53,0.15)',
              borderRadius: '50px'
            }}>
              <div style={{
                width: '28px', height: '28px',
                background: 'linear-gradient(135deg, #FF6B35, #FF2D55)',
                borderRadius: '50%', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontSize: '12px', fontWeight: '700', color: 'white'
              }}>
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <span style={{ color: '#F5F5F7', fontSize: '14px', fontWeight: '500' }}>
                {user.name?.split(' ')[0]}
              </span>
              <span style={{
                fontSize: '10px', padding: '2px 8px',
                background: 'rgba(255,107,53,0.2)',
                color: '#FF6B35', borderRadius: '50px',
                fontWeight: '600', textTransform: 'uppercase'
              }}>{user.role}</span>
            </div>
            <button
              onClick={handleLogout}
              style={{
                padding: '8px 16px',
                background: 'transparent',
                border: '1px solid rgba(255,45,85,0.3)',
                borderRadius: '8px', color: '#FF2D55',
                fontSize: '13px', fontWeight: '500',
                cursor: 'pointer', transition: 'all 0.2s ease'
              }}
              onMouseEnter={e => e.target.style.background = 'rgba(255,45,85,0.1)'}
              onMouseLeave={e => e.target.style.background = 'transparent'}
            >Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{
              padding: '8px 16px',
              background: 'transparent',
              border: '1px solid rgba(255,107,53,0.2)',
              borderRadius: '8px', color: '#98989F',
              fontSize: '14px', fontWeight: '500',
              textDecoration: 'none', transition: 'all 0.2s ease'
            }}>Sign In</Link>
            <Link to="/register" style={{
              padding: '8px 20px',
              background: 'linear-gradient(135deg, #FF6B35, #FF2D55)',
              borderRadius: '8px', color: 'white',
              fontSize: '14px', fontWeight: '600',
              textDecoration: 'none',
              boxShadow: '0 0 20px rgba(255,107,53,0.3)'
            }}>Get Started</Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar