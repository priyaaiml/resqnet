import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import toast from 'react-hot-toast'

const Register = () => {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'user'
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    try {
      const user = await register(formData.name, formData.email, formData.password, formData.role)
      toast.success(`Welcome to ResQNet, ${user.name}!`)
      if (user.role === 'admin') navigate('/admin')
      else navigate('/feed')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const roles = [
    { value: 'user', label: '👤 Citizen', desc: 'Report disasters and stay informed' },
    { value: 'volunteer', label: '🦺 Volunteer', desc: 'Help respond to emergencies' },
  ]

  const inputStyle = {
    width: '100%', padding: '14px 16px',
    background: 'rgba(10,10,15,0.8)',
    border: '1px solid rgba(255,107,53,0.15)',
    borderRadius: '12px', color: '#F5F5F7',
    fontSize: '15px', transition: 'all 0.2s ease',
    boxSizing: 'border-box'
  }

  const labelStyle = {
    display: 'block', color: '#98989F',
    fontSize: '13px', fontWeight: '500',
    marginBottom: '8px', textTransform: 'uppercase',
    letterSpacing: '0.5px'
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#0A0A0F',
      display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '24px',
      position: 'relative', overflow: 'hidden'
    }}>
      {/* Background effects */}
      <div style={{
        position: 'absolute', top: '-200px', left: '-200px',
        width: '600px', height: '600px',
        background: 'radial-gradient(circle, rgba(255,107,53,0.08) 0%, transparent 70%)',
        borderRadius: '50%'
      }} />
      <div style={{
        position: 'absolute', bottom: '-200px', right: '-200px',
        width: '600px', height: '600px',
        background: 'radial-gradient(circle, rgba(255,45,85,0.06) 0%, transparent 70%)',
        borderRadius: '50%'
      }} />

      <div style={{
        width: '100%', maxWidth: '480px',
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
          }}>Join ResQNet</h1>
          <p style={{ color: '#98989F', fontSize: '14px' }}>
            Create your account and start making a difference
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Role Selection */}
          <div style={{ marginBottom: '24px' }}>
            <label style={labelStyle}>I want to join as</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {roles.map(r => (
                <div
                  key={r.value}
                  onClick={() => setFormData({ ...formData, role: r.value })}
                  style={{
                    padding: '16px', borderRadius: '12px', cursor: 'pointer',
                    border: formData.role === r.value
                      ? '2px solid #FF6B35'
                      : '1px solid rgba(255,107,53,0.15)',
                    background: formData.role === r.value
                      ? 'rgba(255,107,53,0.1)'
                      : 'rgba(10,10,15,0.5)',
                    transition: 'all 0.2s ease',
                    textAlign: 'center'
                  }}>
                  <div style={{ fontSize: '24px', marginBottom: '6px' }}>
                    {r.label.split(' ')[0]}
                  </div>
                  <div style={{
                    color: formData.role === r.value ? '#FF6B35' : '#F5F5F7',
                    fontWeight: '600', fontSize: '14px', marginBottom: '4px'
                  }}>
                    {r.label.split(' ')[1]}
                  </div>
                  <div style={{ color: '#6E6E73', fontSize: '11px', lineHeight: '1.4' }}>
                    {r.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Name */}
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              required
              style={inputStyle}
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

          {/* Email */}
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              required
              style={inputStyle}
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

          {/* Password */}
          <div style={{ marginBottom: '28px' }}>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              placeholder="Min. 6 characters"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              required
              style={inputStyle}
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
            {loading ? 'Creating Account...' : 'Create Account →'}
          </button>
        </form>

        <div style={{
          display: 'flex', alignItems: 'center',
          gap: '12px', margin: '24px 0'
        }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,107,53,0.1)' }} />
          <span style={{ color: '#6E6E73', fontSize: '13px' }}>or</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,107,53,0.1)' }} />
        </div>

        <p style={{ textAlign: 'center', color: '#98989F', fontSize: '14px' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#FF6B35', fontWeight: '600' }}>
            Sign in →
          </Link>
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

export default Register