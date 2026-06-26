import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import api from '../services/api'
import { useAuth } from '../hooks/useAuth'
import { timeAgo } from '../utils/formatDate'
import toast from 'react-hot-toast'

const VolunteerDashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [disasters, setDisasters] = useState([])
  const [loading, setLoading] = useState(true)
  const [registering, setRegistering] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [regForm, setRegForm] = useState({
    skills: [], bio: '', location: ''
  })

  const skillOptions = ['medical', 'rescue', 'logistics', 'communication', 'shelter', 'food', 'other']

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [profileRes, disastersRes] = await Promise.all([
        api.get('/volunteers/me').catch(() => null),
        api.get('/disasters?status=reported&limit=10')
      ])
      setProfile(profileRes?.data || null)
      setDisasters(disastersRes.data.disasters || [])
    } catch (error) {
      console.error('Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    if (regForm.skills.length === 0) {
      toast.error('Please select at least one skill')
      return
    }
    setRegistering(true)
    try {
      await api.post('/volunteers/register', regForm)
      toast.success('Registered as volunteer!')
      fetchData()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed')
    } finally {
      setRegistering(false)
    }
  }

  const toggleSkill = (skill) => {
    setRegForm(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }))
  }

  const handleAvailability = async (availability) => {
    try {
      await api.put('/volunteers/availability', { availability })
      toast.success('Availability updated!')
      fetchData()
    } catch (error) {
      toast.error('Failed to update availability')
    }
  }

  const tabs = [
    { id: 'overview', label: '📊 Overview' },
    { id: 'incidents', label: '🚨 Active Incidents' },
    { id: 'profile', label: '👤 My Profile' },
  ]

  const availabilityConfig = {
    available: { color: '#30D158', label: 'Available' },
    busy: { color: '#FFD60A', label: 'Busy' },
    offline: { color: '#6E6E73', label: 'Offline' },
  }

  if (loading) return (
    <div style={{ background: '#0A0A0F', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Navbar />
      <div style={{
        width: '40px', height: '40px',
        border: '3px solid rgba(255,107,53,0.3)',
        borderTop: '3px solid #FF6B35',
        borderRadius: '50%', animation: 'spin 1s linear infinite'
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  return (
    <div style={{ background: '#0A0A0F', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ paddingTop: '64px' }}>

        {/* Header */}
        <div style={{
          padding: '40px 32px 0',
          borderBottom: '1px solid rgba(255,107,53,0.1)',
          background: 'rgba(18,18,26,0.5)'
        }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <h1 style={{
                  fontSize: '32px', fontWeight: '800',
                  fontFamily: 'Space Grotesk, sans-serif',
                  color: '#F5F5F7', marginBottom: '8px'
                }}>🦺 Volunteer Dashboard</h1>
                <p style={{ color: '#98989F' }}>
                  Welcome back, {user?.name?.split(' ')[0]}!
                </p>
              </div>

              {/* Availability Toggle */}
              {profile && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  {Object.entries(availabilityConfig).map(([key, val]) => (
                    <button
                      key={key}
                      onClick={() => handleAvailability(key)}
                      style={{
                        padding: '8px 16px', borderRadius: '50px',
                        border: profile.availability === key
                          ? `1px solid ${val.color}`
                          : '1px solid rgba(255,107,53,0.15)',
                        background: profile.availability === key
                          ? `${val.color}15` : 'transparent',
                        color: profile.availability === key ? val.color : '#6E6E73',
                        fontSize: '13px', fontWeight: '600',
                        cursor: 'pointer', transition: 'all 0.2s ease'
                      }}>
                      {val.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '4px' }}>
              {tabs.map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  style={{
                    padding: '10px 20px', background: 'transparent',
                    border: 'none',
                    borderBottom: activeTab === t.id
                      ? '2px solid #FF6B35' : '2px solid transparent',
                    color: activeTab === t.id ? '#FF6B35' : '#98989F',
                    fontSize: '14px', fontWeight: '600',
                    cursor: 'pointer', transition: 'all 0.2s ease'
                  }}>{t.label}</button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px' }}>

          {/* Not Registered Yet */}
          {!profile && (
            <div style={{
              background: 'rgba(18,18,26,0.9)',
              border: '1px solid rgba(255,107,53,0.2)',
              borderRadius: '24px', padding: '40px',
              marginBottom: '32px', textAlign: 'center'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🦺</div>
              <h2 style={{
                color: '#F5F5F7', fontSize: '24px',
                fontWeight: '800', marginBottom: '12px',
                fontFamily: 'Space Grotesk, sans-serif'
              }}>Register as a Volunteer</h2>
              <p style={{ color: '#98989F', marginBottom: '32px', maxWidth: '400px', margin: '0 auto 32px' }}>
                Join our network of community responders. Your skills can save lives.
              </p>

              <form onSubmit={handleRegister} style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'left' }}>

                {/* Skills */}
                <div style={{ marginBottom: '24px' }}>
                  <label style={{
                    display: 'block', color: '#98989F',
                    fontSize: '13px', fontWeight: '500',
                    marginBottom: '12px', textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>Select Your Skills *</label>
                  <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px'
                  }}>
                    {skillOptions.map(skill => (
                      <div
                        key={skill}
                        onClick={() => toggleSkill(skill)}
                        style={{
                          padding: '10px', textAlign: 'center',
                          borderRadius: '10px', cursor: 'pointer',
                          border: regForm.skills.includes(skill)
                            ? '1px solid #FF6B35'
                            : '1px solid rgba(255,107,53,0.15)',
                          background: regForm.skills.includes(skill)
                            ? 'rgba(255,107,53,0.1)' : 'rgba(10,10,15,0.8)',
                          color: regForm.skills.includes(skill) ? '#FF6B35' : '#98989F',
                          fontSize: '13px', fontWeight: '500',
                          textTransform: 'capitalize',
                          transition: 'all 0.2s ease'
                        }}>{skill}</div>
                    ))}
                  </div>
                </div>

                {/* Bio */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    display: 'block', color: '#98989F',
                    fontSize: '13px', fontWeight: '500',
                    marginBottom: '8px', textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>Short Bio</label>
                  <textarea
                    value={regForm.bio}
                    onChange={e => setRegForm({ ...regForm, bio: e.target.value })}
                    placeholder="Tell us about your experience..."
                    rows={3}
                    style={{
                      width: '100%', padding: '14px 16px',
                      background: 'rgba(10,10,15,0.8)',
                      border: '1px solid rgba(255,107,53,0.15)',
                      borderRadius: '12px', color: '#F5F5F7',
                      fontSize: '14px', outline: 'none',
                      resize: 'vertical', boxSizing: 'border-box'
                    }}
                  />
                </div>

                {/* Location */}
                <div style={{ marginBottom: '24px' }}>
                  <label style={{
                    display: 'block', color: '#98989F',
                    fontSize: '13px', fontWeight: '500',
                    marginBottom: '8px', textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>Your Location</label>
                  <input
                    value={regForm.location}
                    onChange={e => setRegForm({ ...regForm, location: e.target.value })}
                    placeholder="e.g. Mumbai, Maharashtra"
                    style={{
                      width: '100%', padding: '14px 16px',
                      background: 'rgba(10,10,15,0.8)',
                      border: '1px solid rgba(255,107,53,0.15)',
                      borderRadius: '12px', color: '#F5F5F7',
                      fontSize: '14px', outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <button
                  type="submit" disabled={registering}
                  style={{
                    width: '100%', padding: '16px',
                    background: registering
                      ? 'rgba(255,107,53,0.5)'
                      : 'linear-gradient(135deg, #FF6B35, #FF2D55)',
                    color: 'white', borderRadius: '12px',
                    fontWeight: '700', fontSize: '16px',
                    cursor: registering ? 'not-allowed' : 'pointer',
                    border: 'none',
                    boxShadow: registering ? 'none' : '0 0 30px rgba(255,107,53,0.4)'
                  }}>
                  {registering ? 'Registering...' : '🦺 Join as Volunteer'}
                </button>
              </form>
            </div>
          )}

          {/* Overview Tab */}
          {activeTab === 'overview' && profile && (
            <div>
              {/* Stats */}
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '16px', marginBottom: '32px'
              }}>
                {[
                  { label: 'Assigned Disasters', value: profile.assignedDisasters?.length || 0, color: '#FF6B35', icon: '🚨' },
                  { label: 'Completed Missions', value: profile.completedMissions || 0, color: '#30D158', icon: '✅' },
                  { label: 'Status', value: profile.availability, color: availabilityConfig[profile.availability]?.color || '#FF6B35', icon: '📡' },
                ].map((s, i) => (
                  <div key={i} style={{
                    background: 'rgba(18,18,26,0.9)',
                    border: '1px solid rgba(255,107,53,0.1)',
                    borderRadius: '16px', padding: '24px',
                    display: 'flex', alignItems: 'center', gap: '16px'
                  }}>
                    <div style={{
                      width: '48px', height: '48px',
                      background: `${s.color}15`,
                      border: `1px solid ${s.color}33`,
                      borderRadius: '12px', display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      fontSize: '22px'
                    }}>{s.icon}</div>
                    <div>
                      <div style={{
                        fontSize: '28px', fontWeight: '800',
                        color: s.color, fontFamily: 'Space Grotesk, sans-serif',
                        textTransform: 'capitalize'
                      }}>{s.value}</div>
                      <div style={{ color: '#98989F', fontSize: '13px' }}>{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Skills */}
              <div style={{
                background: 'rgba(18,18,26,0.9)',
                border: '1px solid rgba(255,107,53,0.1)',
                borderRadius: '20px', padding: '28px',
                marginBottom: '24px'
              }}>
                <h3 style={{
                  color: '#F5F5F7', fontSize: '18px',
                  fontWeight: '700', marginBottom: '16px',
                  fontFamily: 'Space Grotesk, sans-serif'
                }}>🎯 My Skills</h3>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {profile.skills?.map(skill => (
                    <span key={skill} style={{
                      padding: '8px 20px', borderRadius: '50px',
                      background: 'rgba(255,107,53,0.1)',
                      border: '1px solid rgba(255,107,53,0.3)',
                      color: '#FF6B35', fontSize: '14px',
                      fontWeight: '600', textTransform: 'capitalize'
                    }}>{skill}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Active Incidents Tab */}
          {activeTab === 'incidents' && (
            <div>
              <h3 style={{
                color: '#F5F5F7', fontSize: '20px',
                fontWeight: '700', marginBottom: '20px',
                fontFamily: 'Space Grotesk, sans-serif'
              }}>🚨 Active Incidents Needing Help</h3>
              {disasters.length === 0 ? (
                <div style={{
                  textAlign: 'center', padding: '60px',
                  background: 'rgba(18,18,26,0.5)',
                  border: '1px solid rgba(255,107,53,0.1)',
                  borderRadius: '20px'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
                  <p style={{ color: '#98989F' }}>No active incidents right now. Great work!</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {disasters.map(d => (
                    <div
                      key={d._id}
                      onClick={() => navigate(`/disaster/${d._id}`)}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = 'rgba(255,107,53,0.3)'
                        e.currentTarget.style.transform = 'translateY(-2px)'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = 'rgba(255,107,53,0.1)'
                        e.currentTarget.style.transform = 'translateY(0)'
                      }}
                      style={{
                        background: 'rgba(18,18,26,0.9)',
                        border: '1px solid rgba(255,107,53,0.1)',
                        borderRadius: '16px', padding: '24px',
                        cursor: 'pointer', transition: 'all 0.2s ease',
                        display: 'flex', justifyContent: 'space-between',
                        alignItems: 'center', gap: '16px'
                      }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                          <span style={{
                            padding: '3px 10px', borderRadius: '50px',
                            fontSize: '11px', fontWeight: '700',
                            background: d.severity === 'critical'
                              ? 'rgba(255,45,85,0.1)' : 'rgba(255,107,53,0.1)',
                            color: d.severity === 'critical' ? '#FF2D55' : '#FF6B35',
                            textTransform: 'capitalize'
                          }}>{d.severity}</span>
                          <span style={{
                            padding: '3px 10px', borderRadius: '50px',
                            fontSize: '11px', fontWeight: '600',
                            background: 'rgba(10,132,255,0.1)', color: '#0A84FF',
                            textTransform: 'capitalize'
                          }}>{d.type}</span>
                        </div>
                        <h4 style={{
                          color: '#F5F5F7', fontSize: '16px',
                          fontWeight: '700', marginBottom: '6px',
                          fontFamily: 'Space Grotesk, sans-serif'
                        }}>{d.title}</h4>
                        <p style={{
                          color: '#98989F', fontSize: '13px',
                          display: '-webkit-box',
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}>{d.description}</p>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ color: '#6E6E73', fontSize: '12px', marginBottom: '8px' }}>
                          📍 {d.location?.address}
                        </div>
                        <div style={{ color: '#6E6E73', fontSize: '12px', marginBottom: '12px' }}>
                          {timeAgo(d.createdAt)}
                        </div>
                        <button style={{
                          padding: '8px 16px',
                          background: 'linear-gradient(135deg, #FF6B35, #FF2D55)',
                          color: 'white', borderRadius: '8px',
                          fontSize: '12px', fontWeight: '600',
                          border: 'none', cursor: 'pointer'
                        }}>View Details →</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && profile && (
            <div style={{
              background: 'rgba(18,18,26,0.9)',
              border: '1px solid rgba(255,107,53,0.1)',
              borderRadius: '24px', padding: '40px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px' }}>
                <div style={{
                  width: '80px', height: '80px',
                  background: 'linear-gradient(135deg, #FF6B35, #FF2D55)',
                  borderRadius: '50%', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  fontSize: '32px', fontWeight: '700', color: 'white'
                }}>{user?.name?.charAt(0)}</div>
                <div>
                  <h2 style={{
                    color: '#F5F5F7', fontSize: '24px',
                    fontWeight: '800', fontFamily: 'Space Grotesk, sans-serif'
                  }}>{user?.name}</h2>
                  <p style={{ color: '#98989F' }}>{user?.email}</p>
                  <span style={{
                    display: 'inline-block', marginTop: '8px',
                    padding: '4px 16px', borderRadius: '50px',
                    background: 'rgba(255,107,53,0.1)',
                    border: '1px solid rgba(255,107,53,0.3)',
                    color: '#FF6B35', fontSize: '12px', fontWeight: '700'
                  }}>🦺 VOLUNTEER</span>
                </div>
              </div>

              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr',
                gap: '24px'
              }}>
                {[
                  { label: 'Location', value: profile.location || 'Not set', icon: '📍' },
                  { label: 'Availability', value: profile.availability, icon: '📡' },
                  { label: 'Completed Missions', value: profile.completedMissions, icon: '✅' },
                  { label: 'Verified', value: profile.verified ? 'Yes' : 'Pending', icon: '🛡️' },
                ].map((item, i) => (
                  <div key={i} style={{
                    padding: '20px',
                    background: 'rgba(10,10,15,0.5)',
                    border: '1px solid rgba(255,107,53,0.1)',
                    borderRadius: '12px'
                  }}>
                    <div style={{ color: '#6E6E73', fontSize: '12px', marginBottom: '6px' }}>
                      {item.icon} {item.label}
                    </div>
                    <div style={{
                      color: '#F5F5F7', fontSize: '16px',
                      fontWeight: '700', textTransform: 'capitalize'
                    }}>{item.value}</div>
                  </div>
                ))}
              </div>

              {profile.bio && (
                <div style={{
                  marginTop: '24px', padding: '20px',
                  background: 'rgba(10,10,15,0.5)',
                  border: '1px solid rgba(255,107,53,0.1)',
                  borderRadius: '12px'
                }}>
                  <div style={{ color: '#6E6E73', fontSize: '12px', marginBottom: '8px' }}>
                    📝 Bio
                  </div>
                  <p style={{ color: '#F5F5F7', fontSize: '15px', lineHeight: '1.6' }}>
                    {profile.bio}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

export default VolunteerDashboard