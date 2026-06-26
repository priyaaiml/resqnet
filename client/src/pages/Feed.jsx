import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import api from '../services/api'
import { timeAgo } from '../utils/formatDate'

const severityConfig = {
  low: { color: '#30D158', bg: 'rgba(48,209,88,0.1)', label: 'Low' },
  medium: { color: '#FFD60A', bg: 'rgba(255,214,10,0.1)', label: 'Medium' },
  high: { color: '#FF6B35', bg: 'rgba(255,107,53,0.1)', label: 'High' },
  critical: { color: '#FF2D55', bg: 'rgba(255,45,85,0.1)', label: 'Critical' },
}

const statusConfig = {
  reported: { color: '#0A84FF', bg: 'rgba(10,132,255,0.1)', label: 'Reported' },
  'in-progress': { color: '#FFD60A', bg: 'rgba(255,214,10,0.1)', label: 'In Progress' },
  resolved: { color: '#30D158', bg: 'rgba(48,209,88,0.1)', label: 'Resolved' },
}

const Feed = () => {
  const navigate = useNavigate()
  const [disasters, setDisasters] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ status: '', severity: '', type: '', search: '' })
  const [stats, setStats] = useState({ total: 0, active: 0, resolved: 0, critical: 0 })

  useEffect(() => {
    fetchDisasters()
  }, [filters])

  const fetchDisasters = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filters.status) params.append('status', filters.status)
      if (filters.severity) params.append('severity', filters.severity)
      if (filters.type) params.append('type', filters.type)
      if (filters.search) params.append('search', filters.search)
      const { data } = await api.get(`/disasters?${params}`)
      setDisasters(data.disasters || [])
      setStats({
        total: data.total || 0,
        active: (data.disasters || []).filter(d => d.status === 'in-progress').length,
        resolved: (data.disasters || []).filter(d => d.status === 'resolved').length,
        critical: (data.disasters || []).filter(d => d.severity === 'critical').length,
      })
    } catch (error) {
      console.error('Failed to fetch disasters')
      setDisasters([])
    } finally {
      setLoading(false)
    }
  }

  const disasterTypes = ['flood', 'earthquake', 'fire', 'storm', 'landslide', 'accident', 'medical', 'other']

  return (
    <div style={{ background: '#0A0A0F', minHeight: '100vh' }}>
      <Navbar />

      <div style={{ paddingTop: '64px' }}>

        {/* Header */}
        <div style={{
          padding: '48px 32px 32px',
          borderBottom: '1px solid rgba(255,107,53,0.1)',
          background: 'rgba(18,18,26,0.5)'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
              <div>
                <h1 style={{
                  fontSize: '36px', fontWeight: '800',
                  fontFamily: 'Space Grotesk, sans-serif',
                  color: '#F5F5F7', marginBottom: '8px'
                }}>
                  🗺️ Live Disaster Feed
                </h1>
                <p style={{ color: '#98989F', fontSize: '16px' }}>
                  Real-time community disaster reports and updates
                </p>
              </div>
              <button
                onClick={() => navigate('/report')}
                style={{
                  padding: '12px 28px',
                  background: 'linear-gradient(135deg, #FF6B35, #FF2D55)',
                  color: 'white', borderRadius: '12px',
                  fontWeight: '700', fontSize: '15px',
                  cursor: 'pointer', border: 'none',
                  boxShadow: '0 0 20px rgba(255,107,53,0.4)'
                }}>
                🚨 Report Disaster
              </button>
            </div>

            {/* Stats Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
              {[
                { label: 'Total Reports', value: stats.total, color: '#FF6B35' },
                { label: 'Active', value: stats.active, color: '#FFD60A' },
                { label: 'Resolved', value: stats.resolved, color: '#30D158' },
                { label: 'Critical', value: stats.critical, color: '#FF2D55' },
              ].map((s, i) => (
                <div key={i} style={{
                  background: 'rgba(10,10,15,0.6)',
                  border: '1px solid rgba(255,107,53,0.1)',
                  borderRadius: '12px', padding: '16px 20px',
                  display: 'flex', alignItems: 'center', gap: '12px'
                }}>
                  <div style={{
                    width: '8px', height: '8px',
                    background: s.color, borderRadius: '50%',
                    boxShadow: `0 0 8px ${s.color}`
                  }} />
                  <div>
                    <div style={{ color: s.color, fontSize: '24px', fontWeight: '800' }}>{s.value}</div>
                    <div style={{ color: '#6E6E73', fontSize: '12px' }}>{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px' }}>

          {/* Filters */}
          <div style={{
            display: 'flex', gap: '12px', marginBottom: '32px', flexWrap: 'wrap'
          }}>
            <input
              type="text"
              placeholder="🔍 Search disasters..."
              value={filters.search}
              onChange={e => setFilters({ ...filters, search: e.target.value })}
              style={{
                flex: 1, minWidth: '200px', padding: '12px 16px',
                background: 'rgba(18,18,26,0.9)',
                border: '1px solid rgba(255,107,53,0.15)',
                borderRadius: '10px', color: '#F5F5F7',
                fontSize: '14px', outline: 'none'
              }}
            />
            {[
              { key: 'status', options: ['', 'reported', 'in-progress', 'resolved'], placeholder: 'All Status' },
              { key: 'severity', options: ['', 'low', 'medium', 'high', 'critical'], placeholder: 'All Severity' },
              { key: 'type', options: ['', ...disasterTypes], placeholder: 'All Types' },
            ].map((f) => (
              <select
                key={f.key}
                value={filters[f.key]}
                onChange={e => setFilters({ ...filters, [f.key]: e.target.value })}
                style={{
                  padding: '12px 16px',
                  background: 'rgba(18,18,26,0.9)',
                  border: '1px solid rgba(255,107,53,0.15)',
                  borderRadius: '10px', color: '#F5F5F7',
                  fontSize: '14px', outline: 'none', cursor: 'pointer'
                }}>
                <option value="">{f.placeholder}</option>
                {f.options.filter(o => o).map(o => (
                  <option key={o} value={o} style={{ background: '#12121A' }}>
                    {o.charAt(0).toUpperCase() + o.slice(1)}
                  </option>
                ))}
              </select>
            ))}
            <button
              onClick={() => setFilters({ status: '', severity: '', type: '', search: '' })}
              style={{
                padding: '12px 20px',
                background: 'transparent',
                border: '1px solid rgba(255,107,53,0.2)',
                borderRadius: '10px', color: '#98989F',
                fontSize: '14px', cursor: 'pointer'
              }}>Clear</button>
          </div>

          {/* Disaster Cards */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '80px', color: '#98989F' }}>
              <div style={{
                width: '40px', height: '40px',
                border: '3px solid rgba(255,107,53,0.3)',
                borderTop: '3px solid #FF6B35',
                borderRadius: '50%', margin: '0 auto 16px',
                animation: 'spin 1s linear infinite'
              }} />
              Loading disasters...
            </div>
          ) : disasters.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '80px',
              background: 'rgba(18,18,26,0.5)',
              border: '1px solid rgba(255,107,53,0.1)',
              borderRadius: '20px'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🌍</div>
              <h3 style={{ color: '#F5F5F7', marginBottom: '8px' }}>No disasters found</h3>
              <p style={{ color: '#98989F' }}>Be the first to report an incident in your area</p>
              <button
                onClick={() => navigate('/report')}
                style={{
                  marginTop: '24px', padding: '12px 28px',
                  background: 'linear-gradient(135deg, #FF6B35, #FF2D55)',
                  color: 'white', borderRadius: '10px',
                  fontWeight: '600', cursor: 'pointer', border: 'none'
                }}>Report Now</button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '20px' }}>
              {disasters.map((d) => {
                const sev = severityConfig[d.severity] || severityConfig.low
                const sta = statusConfig[d.status] || statusConfig.reported
                return (
                  <div
                    key={d._id}
                    onClick={() => navigate(`/disaster/${d._id}`)}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = 'rgba(255,107,53,0.3)'
                      e.currentTarget.style.transform = 'translateY(-2px)'
                      e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.4)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'rgba(255,107,53,0.1)'
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                    style={{
                      background: 'rgba(18,18,26,0.8)',
                      border: '1px solid rgba(255,107,53,0.1)',
                      borderRadius: '16px', padding: '24px',
                      cursor: 'pointer', transition: 'all 0.2s ease'
                    }}>

                    {/* Card Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{
                          padding: '4px 12px', borderRadius: '50px',
                          fontSize: '12px', fontWeight: '600',
                          background: sev.bg, color: sev.color,
                          border: `1px solid ${sev.color}33`
                        }}>{sev.label}</span>
                        <span style={{
                          padding: '4px 12px', borderRadius: '50px',
                          fontSize: '12px', fontWeight: '600',
                          background: sta.bg, color: sta.color,
                          border: `1px solid ${sta.color}33`
                        }}>{sta.label}</span>
                      </div>
                      <span style={{ color: '#6E6E73', fontSize: '12px' }}>
                        {timeAgo(d.createdAt)}
                      </span>
                    </div>

                    {/* Image */}
                    {d.images?.[0] && (
                      <img
                        src={d.images[0]}
                        alt={d.title}
                        style={{
                          width: '100%', height: '160px',
                          objectFit: 'cover', borderRadius: '10px',
                          marginBottom: '16px'
                        }}
                      />
                    )}

                    {/* Title */}
                    <h3 style={{
                      color: '#F5F5F7', fontSize: '17px',
                      fontWeight: '700', marginBottom: '8px',
                      fontFamily: 'Space Grotesk, sans-serif'
                    }}>{d.title}</h3>

                    <p style={{
                      color: '#98989F', fontSize: '14px',
                      lineHeight: '1.6', marginBottom: '16px',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>{d.description}</p>

                    {/* Footer */}
                    <div style={{
                      display: 'flex', justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingTop: '16px',
                      borderTop: '1px solid rgba(255,107,53,0.08)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '12px' }}>📍</span>
                        <span style={{ color: '#6E6E73', fontSize: '13px' }}>
                          {d.location?.address || 'Unknown location'}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{
                          width: '20px', height: '20px',
                          background: 'linear-gradient(135deg, #FF6B35, #FF2D55)',
                          borderRadius: '50%', display: 'flex',
                          alignItems: 'center', justifyContent: 'center',
                          fontSize: '10px', color: 'white', fontWeight: '700'
                        }}>
                          {d.reportedBy?.name?.charAt(0) || 'U'}
                        </div>
                        <span style={{ color: '#6E6E73', fontSize: '13px' }}>
                          {d.reportedBy?.name || 'Unknown'}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        select option { background: #12121A; color: #F5F5F7; }
      `}</style>
    </div>
  )
}

export default Feed