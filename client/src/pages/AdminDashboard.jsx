import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import api from '../services/api'
import { timeAgo } from '../utils/formatDate'
import toast from 'react-hot-toast'

const AdminDashboard = () => {
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users')
      ])
      setStats(statsRes.data)
      setUsers(usersRes.data)
    } catch (error) {
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const handleRoleUpdate = async (userId, role) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role })
      toast.success('Role updated!')
      fetchData()
    } catch (error) {
      toast.error('Failed to update role')
    }
  }

  const tabs = [
    { id: 'overview', label: '📊 Overview' },
    { id: 'users', label: '👥 Users' },
    { id: 'disasters', label: '🚨 Disasters' },
  ]

  const statCards = stats ? [
    { label: 'Total Users', value: stats.totalUsers, color: '#0A84FF', icon: '👤' },
    { label: 'Volunteers', value: stats.totalVolunteers, color: '#30D158', icon: '🦺' },
    { label: 'Total Disasters', value: stats.totalDisasters, color: '#FF6B35', icon: '🌍' },
    { label: 'Active Now', value: stats.activeDisasters, color: '#FFD60A', icon: '⚡' },
    { label: 'Resolved', value: stats.resolvedDisasters, color: '#30D158', icon: '✅' },
    { label: 'Critical', value: stats.criticalDisasters, color: '#FF2D55', icon: '🔴' },
  ] : []

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
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{
              fontSize: '32px', fontWeight: '800',
              fontFamily: 'Space Grotesk, sans-serif',
              color: '#F5F5F7', marginBottom: '8px'
            }}>⚙️ Admin Dashboard</h1>
            <p style={{ color: '#98989F', marginBottom: '24px' }}>
              Manage disasters, users and volunteers
            </p>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '4px' }}>
              {tabs.map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  style={{
                    padding: '10px 20px',
                    background: activeTab === t.id
                      ? 'rgba(255,107,53,0.15)' : 'transparent',
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

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px' }}>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div>
              {/* Stat Cards */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '16px', marginBottom: '32px'
              }}>
                {statCards.map((s, i) => (
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
                      borderRadius: '12px',
                      display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontSize: '22px'
                    }}>{s.icon}</div>
                    <div>
                      <div style={{
                        fontSize: '32px', fontWeight: '800',
                        color: s.color, fontFamily: 'Space Grotesk, sans-serif'
                      }}>{s.value}</div>
                      <div style={{ color: '#98989F', fontSize: '13px' }}>{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent Disasters */}
              <div style={{
                background: 'rgba(18,18,26,0.9)',
                border: '1px solid rgba(255,107,53,0.1)',
                borderRadius: '20px', padding: '28px'
              }}>
                <h3 style={{
                  color: '#F5F5F7', fontSize: '18px',
                  fontWeight: '700', marginBottom: '20px',
                  fontFamily: 'Space Grotesk, sans-serif'
                }}>🕐 Recent Disasters</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {stats?.recentDisasters?.map((d, i) => (
                    <div
                      key={i}
                      onClick={() => navigate(`/disaster/${d._id}`)}
                      style={{
                        display: 'flex', alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '16px',
                        background: 'rgba(10,10,15,0.6)',
                        border: '1px solid rgba(255,107,53,0.08)',
                        borderRadius: '12px', cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,107,53,0.3)'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,107,53,0.08)'}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '8px', height: '8px', borderRadius: '50%',
                          background: d.severity === 'critical' ? '#FF2D55'
                            : d.severity === 'high' ? '#FF6B35'
                            : d.severity === 'medium' ? '#FFD60A' : '#30D158',
                          boxShadow: `0 0 8px ${d.severity === 'critical' ? '#FF2D55' : '#FF6B35'}`
                        }} />
                        <div>
                          <div style={{ color: '#F5F5F7', fontSize: '14px', fontWeight: '600' }}>
                            {d.title}
                          </div>
                          <div style={{ color: '#6E6E73', fontSize: '12px' }}>
                            by {d.reportedBy?.name}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{
                          padding: '4px 10px', borderRadius: '50px',
                          fontSize: '11px', fontWeight: '600',
                          background: d.status === 'resolved'
                            ? 'rgba(48,209,88,0.1)' : 'rgba(255,214,10,0.1)',
                          color: d.status === 'resolved' ? '#30D158' : '#FFD60A'
                        }}>{d.status}</span>
                        <span style={{ color: '#6E6E73', fontSize: '12px' }}>
                          {timeAgo(d.createdAt)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Breakdown Charts */}
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr',
                gap: '24px', marginTop: '24px'
              }}>
                {/* By Type */}
                <div style={{
                  background: 'rgba(18,18,26,0.9)',
                  border: '1px solid rgba(255,107,53,0.1)',
                  borderRadius: '20px', padding: '28px'
                }}>
                  <h3 style={{
                    color: '#F5F5F7', fontSize: '16px',
                    fontWeight: '700', marginBottom: '20px',
                    fontFamily: 'Space Grotesk, sans-serif'
                  }}>Disasters by Type</h3>
                  {stats?.disastersByType?.map((t, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center',
                      gap: '12px', marginBottom: '12px'
                    }}>
                      <span style={{
                        color: '#98989F', fontSize: '13px',
                        width: '80px', textTransform: 'capitalize'
                      }}>{t._id}</span>
                      <div style={{
                        flex: 1, height: '6px',
                        background: 'rgba(255,107,53,0.1)',
                        borderRadius: '50px'
                      }}>
                        <div style={{
                          width: `${(t.count / stats.totalDisasters) * 100}%`,
                          height: '100%',
                          background: 'linear-gradient(135deg, #FF6B35, #FF2D55)',
                          borderRadius: '50px'
                        }} />
                      </div>
                      <span style={{ color: '#FF6B35', fontSize: '13px', fontWeight: '700' }}>
                        {t.count}
                      </span>
                    </div>
                  ))}
                </div>

                {/* By Severity */}
                <div style={{
                  background: 'rgba(18,18,26,0.9)',
                  border: '1px solid rgba(255,107,53,0.1)',
                  borderRadius: '20px', padding: '28px'
                }}>
                  <h3 style={{
                    color: '#F5F5F7', fontSize: '16px',
                    fontWeight: '700', marginBottom: '20px',
                    fontFamily: 'Space Grotesk, sans-serif'
                  }}>Disasters by Severity</h3>
                  {stats?.disastersBySeverity?.map((s, i) => {
                    const colors = {
                      low: '#30D158', medium: '#FFD60A',
                      high: '#FF6B35', critical: '#FF2D55'
                    }
                    const color = colors[s._id] || '#FF6B35'
                    return (
                      <div key={i} style={{
                        display: 'flex', alignItems: 'center',
                        gap: '12px', marginBottom: '12px'
                      }}>
                        <div style={{
                          width: '8px', height: '8px',
                          background: color, borderRadius: '50%',
                          boxShadow: `0 0 6px ${color}`
                        }} />
                        <span style={{
                          color: '#98989F', fontSize: '13px',
                          width: '70px', textTransform: 'capitalize'
                        }}>{s._id}</span>
                        <div style={{
                          flex: 1, height: '6px',
                          background: 'rgba(255,107,53,0.1)',
                          borderRadius: '50px'
                        }}>
                          <div style={{
                            width: `${(s.count / stats.totalDisasters) * 100}%`,
                            height: '100%', background: color,
                            borderRadius: '50px',
                            boxShadow: `0 0 6px ${color}`
                          }} />
                        </div>
                        <span style={{ color, fontSize: '13px', fontWeight: '700' }}>
                          {s.count}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div style={{
              background: 'rgba(18,18,26,0.9)',
              border: '1px solid rgba(255,107,53,0.1)',
              borderRadius: '20px', overflow: 'hidden'
            }}>
              <div style={{ padding: '24px 28px', borderBottom: '1px solid rgba(255,107,53,0.1)' }}>
                <h3 style={{
                  color: '#F5F5F7', fontSize: '18px',
                  fontWeight: '700', fontFamily: 'Space Grotesk, sans-serif'
                }}>👥 All Users ({users.length})</h3>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'rgba(10,10,15,0.5)' }}>
                      {['User', 'Email', 'Role', 'Joined', 'Actions'].map(h => (
                        <th key={h} style={{
                          padding: '14px 20px', textAlign: 'left',
                          color: '#6E6E73', fontSize: '12px',
                          fontWeight: '600', textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u, i) => (
                      <tr key={u._id} style={{
                        borderTop: '1px solid rgba(255,107,53,0.06)',
                        transition: 'background 0.2s ease'
                      }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,107,53,0.03)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <td style={{ padding: '16px 20px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                              width: '32px', height: '32px',
                              background: 'linear-gradient(135deg, #FF6B35, #FF2D55)',
                              borderRadius: '50%', display: 'flex',
                              alignItems: 'center', justifyContent: 'center',
                              fontSize: '13px', fontWeight: '700', color: 'white'
                            }}>{u.name?.charAt(0)}</div>
                            <span style={{ color: '#F5F5F7', fontSize: '14px', fontWeight: '500' }}>
                              {u.name}
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: '16px 20px', color: '#98989F', fontSize: '14px' }}>
                          {u.email}
                        </td>
                        <td style={{ padding: '16px 20px' }}>
                          <span style={{
                            padding: '4px 12px', borderRadius: '50px',
                            fontSize: '12px', fontWeight: '600',
                            background: u.role === 'admin'
                              ? 'rgba(255,45,85,0.1)'
                              : u.role === 'volunteer'
                              ? 'rgba(48,209,88,0.1)'
                              : 'rgba(255,107,53,0.1)',
                            color: u.role === 'admin' ? '#FF2D55'
                              : u.role === 'volunteer' ? '#30D158' : '#FF6B35'
                          }}>{u.role}</span>
                        </td>
                        <td style={{ padding: '16px 20px', color: '#6E6E73', fontSize: '13px' }}>
                          {timeAgo(u.createdAt)}
                        </td>
                        <td style={{ padding: '16px 20px' }}>
                          <select
                            value={u.role}
                            onChange={e => handleRoleUpdate(u._id, e.target.value)}
                            style={{
                              padding: '6px 12px',
                              background: 'rgba(10,10,15,0.8)',
                              border: '1px solid rgba(255,107,53,0.2)',
                              borderRadius: '8px', color: '#F5F5F7',
                              fontSize: '13px', cursor: 'pointer', outline: 'none'
                            }}>
                            <option value="user">User</option>
                            <option value="volunteer">Volunteer</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Disasters Tab */}
          {activeTab === 'disasters' && (
            <div style={{
              background: 'rgba(18,18,26,0.9)',
              border: '1px solid rgba(255,107,53,0.1)',
              borderRadius: '20px', overflow: 'hidden'
            }}>
              <div style={{
                padding: '24px 28px',
                borderBottom: '1px solid rgba(255,107,53,0.1)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
                <h3 style={{
                  color: '#F5F5F7', fontSize: '18px',
                  fontWeight: '700', fontFamily: 'Space Grotesk, sans-serif'
                }}>🚨 Recent Disasters</h3>
                <button
                  onClick={() => navigate('/feed')}
                  style={{
                    padding: '8px 16px',
                    background: 'linear-gradient(135deg, #FF6B35, #FF2D55)',
                    color: 'white', borderRadius: '8px',
                    fontSize: '13px', fontWeight: '600',
                    cursor: 'pointer', border: 'none'
                  }}>View All</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                {stats?.recentDisasters?.map((d, i) => (
                  <div
                    key={i}
                    onClick={() => navigate(`/disaster/${d._id}`)}
                    style={{
                      padding: '20px 28px',
                      borderBottom: '1px solid rgba(255,107,53,0.06)',
                      display: 'flex', justifyContent: 'space-between',
                      alignItems: 'center', cursor: 'pointer',
                      transition: 'background 0.2s ease'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,107,53,0.03)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <div>
                      <div style={{
                        color: '#F5F5F7', fontSize: '15px',
                        fontWeight: '600', marginBottom: '4px'
                      }}>{d.title}</div>
                      <div style={{ color: '#6E6E73', fontSize: '13px' }}>
                        📍 {d.location?.address} • by {d.reportedBy?.name}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{
                        padding: '4px 12px', borderRadius: '50px',
                        fontSize: '12px', fontWeight: '600',
                        background: d.severity === 'critical'
                          ? 'rgba(255,45,85,0.1)' : 'rgba(255,107,53,0.1)',
                        color: d.severity === 'critical' ? '#FF2D55' : '#FF6B35'
                      }}>{d.severity}</span>
                      <span style={{ color: '#6E6E73', fontSize: '12px' }}>
                        {timeAgo(d.createdAt)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

export default AdminDashboard