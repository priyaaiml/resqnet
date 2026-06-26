import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import toast from 'react-hot-toast'

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const user = await login(formData.email, formData.password)
      toast.success(`Welcome back, ${user.name}!`)
      if (user.role === 'admin') navigate('/admin')
      else if (user.role === 'volunteer') navigate('/volunteer')
      else navigate('/feed')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#0A0A0F',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px', position: 'relative', overflow: 'hidden'
    }}>
      {/* Background effects */}
      <div style={{
        position: 'absolute', top: '-200px', right: '-200px',
        width: '600px', height: '600px',
        background: 'radial-gradient(circle, rgba(255,107,53,0.08) 0%, transparent 70%)',
        borderRadius: '50%'
      }} />
      <div style={{
        position: 'absolute', bottom: '-200px', left: '-200px',
        width: '600px', height: '600px',
        background: 'radial-gradient(circle, rgba(255,45,85,0.06) 0%, transparent 70%)',
        borderRadius: '50%'
      }} />

      <div style={{
        width: '100%', maxWidth: '440px',
        background: 'rgba(18,18,26,0.9)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,107,53,0.15)',
        borderRadius: '24px', padding: '48px',
        position: 'relative', zIndex: 1
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '56px', height: '56px',
            background: 'linear-gradient(135deg, #FF6B35, #FF2D55)',
            borderRadius: '16px', fontSize: '28px',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', margin: '0 auto 16px',
            boxShadow: '0 0 30px rgba(255,107,53,0.4)'
          }}>🛡️</div>
          <h1 style={{
            fontSize: '28px', fontWeight: '800',
            fontFamily: 'Space Grotesk, sans-serif',
            background: 'linear-gradient(135deg, #FF6B35, #FF2D55)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '8px'
          }}>Welcome Back</h1>
          <p style={{ color: '#98989F', fontSize: '14px' }}>
            Sign in to your ResQNet account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block', color: '#98989F',
              fontSize: '13px', fontWeight: '500',
              marginBottom: '8px', textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              required
              style={{
                width: '100%', padding: '14px 16px',
                background: 'rgba(10,10,15,0.8)',
                border: '1px solid rgba(255,107,53,0.15)',
                borderRadius: '12px', color: '#F5F5F7',
                fontSize: '15px', transition: 'all 0.2s ease',
                boxSizing: 'border-box'
              }}
              onFocus={e => {
                e.target.style.borderColor = 'rgba(255,107,53,0.5)'
                e.target.style.boxShadow = '0 0 0 3px rgba(255,107,53,0.1)'
              }}
              onBlur={e => {
                e.target.style.borderColor = 'rgba(255,107,53,0.15)'
                e.target.style.boxShadow = 'none'
              }}
            />
          </div>

          <div style={{ marginBottom: '28px' }}>
            <label style={{
              display: 'block', color: '#98989F',
              fontSize: '13px', fontWeight: '500',
              marginBottom: '8px', textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              required
              style={{
                width: '100%', padding: '14px 16px',
                background: 'rgba(10,10,15,0.8)',
                border: '1px solid rgba(255,107,53,0.15)',
                borderRadius: '12px', color: '#F5F5F7',
                fontSize: '15px', transition: 'all 0.2s ease',
                boxSizing: 'border-box'
              }}
              onFocus={e => {
                e.target.style.borderColor = 'rgba(255,107,53,0.5)'
                e.target.style.boxShadow = '0 0 0 3px rgba(255,107,53,0.1)'
              }}
              onBlur={e => {
                e.target.style.borderColor = 'rgba(255,107,53,0.15)'
                e.target.style.boxShadow = 'none'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '15px',
              background: loading
                ? 'rgba(255,107,53,0.5)'
                : 'linear-gradient(135deg, #FF6B35, #FF2D55)',
              color: 'white', borderRadius: '12px',
              fontWeight: '700', fontSize: '16px',
              cursor: loading ? 'not-allowed' : 'pointer',
              border: 'none', transition: 'all 0.2s ease',
              boxShadow: loading ? 'none' : '0 0 30px rgba(255,107,53,0.4)'
            }}>
            {loading ? 'Signing In...' : 'Sign In →'}
          </button>
        </form>

        {/* Divider */}
        <div style={{
          display: 'flex', alignItems: 'center',
          gap: '12px', margin: '24px 0'
        }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,107,53,0.1)' }} />
          <span style={{ color: '#6E6E73', fontSize: '13px' }}>or</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,107,53,0.1)' }} />
        </div>

        <p style={{ textAlign: 'center', color: '#98989F', fontSize: '14px' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{
            color: '#FF6B35', fontWeight: '600',
            textDecoration: 'none'
          }}>Create one free →</Link>
        </p>

        <p style={{ textAlign: 'center', marginTop: '16px' }}>
          <Link to="/" style={{ color: '#6E6E73', fontSize: '13px' }}>
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login