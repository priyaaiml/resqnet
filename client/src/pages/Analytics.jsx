import { useState, useEffect } from 'react'
import Navbar from '../components/layout/Navbar'
import api from '../services/api'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie,
  Cell, LineChart, Line, Legend
} from 'recharts'

const COLORS = ['#FF2D55', '#FF6B35', '#FFD60A', '#30D158', '#0A84FF', '#BF5AF2']

const Analytics = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/admin/stats')
      setStats(data)
    } catch (error) {
      console.error('Failed to fetch analytics')
    } finally {
      setLoading(false)
    }
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

  const typeData = stats?.disastersByType?.map(t => ({
    name: t._id, value: t.count
  })) || []

  const severityData = stats?.disastersBySeverity?.map(s => ({
    name: s._id, value: s.count
  })) || []

  const monthlyData = stats?.monthlyDisasters?.map(m => ({
    name: `${m._id.month}/${m._id.year}`,
    disasters: m.count
  })) || []

  const summaryCards = [
    { label: 'Total Disasters', value: stats?.totalDisasters || 0, color: '#FF6B35', icon: '🌍' },
    { label: 'Active Incidents', value: stats?.activeDisasters || 0, color: '#FFD60A', icon: '⚡' },
    { label: 'Resolved', value: stats?.resolvedDisasters || 0, color: '#30D158', icon: '✅' },
    { label: 'Critical Alerts', value: stats?.criticalDisasters || 0, color: '#FF2D55', icon: '🔴' },
    { label: 'Total Users', value: stats?.totalUsers || 0, color: '#0A84FF', icon: '👤' },
    { label: 'Volunteers', value: stats?.totalVolunteers || 0, color: '#BF5AF2', icon: '🦺' },
  ]

  const customTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
      return (
        <div style={{
          background: 'rgba(18,18,26,0.95)',
          border: '1px solid rgba(255,107,53,0.2)',
          borderRadius: '10px', padding: '12px 16px'
        }}>
          <p style={{ color: '#98989F', fontSize: '12px', marginBottom: '4px' }}>{label}</p>
          {payload.map((p, i) => (
            <p key={i} style={{ color: p.color, fontSize: '14px', fontWeight: '700' }}>
              {p.value} {p.name}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div style={{ background: '#0A0A0F', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ paddingTop: '64px' }}>

        {/* Header */}
        <div style={{
          padding: '40px 32px',
          borderBottom: '1px solid rgba(255,107,53,0.1)',
          background: 'rgba(18,18,26,0.5)'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{
              fontSize: '32px', fontWeight: '800',
              fontFamily: 'Space Grotesk, sans-serif',
              color: '#F5F5F7', marginBottom: '8px'
            }}>📊 Analytics Dashboard</h1>
            <p style={{ color: '#98989F' }}>
              Data insights on disaster patterns and community response
            </p>
          </div>
        </div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px' }}>

          {/* Summary Cards */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px', marginBottom: '32px'
          }}>
            {summaryCards.map((s, i) => (
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
                    fontSize: '32px', fontWeight: '800',
                    color: s.color, fontFamily: 'Space Grotesk, sans-serif'
                  }}>{s.value}</div>
                  <div style={{ color: '#98989F', fontSize: '13px' }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Monthly Trend */}
          <div style={{
            background: 'rgba(18,18,26,0.9)',
            border: '1px solid rgba(255,107,53,0.1)',
            borderRadius: '20px', padding: '28px',
            marginBottom: '24px'
          }}>
            <h3 style={{
              color: '#F5F5F7', fontSize: '18px',
              fontWeight: '700', marginBottom: '24px',
              fontFamily: 'Space Grotesk, sans-serif'
            }}>📈 Monthly Disaster Trend</h3>
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,107,53,0.08)" />
                  <XAxis dataKey="name" stroke="#6E6E73" tick={{ fill: '#6E6E73', fontSize: 12 }} />
                  <YAxis stroke="#6E6E73" tick={{ fill: '#6E6E73', fontSize: 12 }} />
                  <Tooltip content={customTooltip} />
                  <Line
                    type="monotone" dataKey="disasters"
                    stroke="#FF6B35" strokeWidth={3}
                    dot={{ fill: '#FF6B35', strokeWidth: 2, r: 5 }}
                    activeDot={{ r: 8, fill: '#FF2D55' }}
                    name="Disasters"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div style={{
                height: '200px', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                color: '#6E6E73'
              }}>No data yet — report some disasters first!</div>
            )}
          </div>

          {/* Type + Severity Charts */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            gap: '24px', marginBottom: '24px'
          }}>
            {/* Bar Chart by Type */}
            <div style={{
              background: 'rgba(18,18,26,0.9)',
              border: '1px solid rgba(255,107,53,0.1)',
              borderRadius: '20px', padding: '28px'
            }}>
              <h3 style={{
                color: '#F5F5F7', fontSize: '16px',
                fontWeight: '700', marginBottom: '24px',
                fontFamily: 'Space Grotesk, sans-serif'
              }}>🌍 Disasters by Type</h3>
              {typeData.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={typeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,107,53,0.08)" />
                    <XAxis dataKey="name" stroke="#6E6E73" tick={{ fill: '#6E6E73', fontSize: 11 }} />
                    <YAxis stroke="#6E6E73" tick={{ fill: '#6E6E73', fontSize: 11 }} />
                    <Tooltip content={customTooltip} />
                    <Bar dataKey="value" name="Count" radius={[6, 6, 0, 0]}>
                      {typeData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6E6E73' }}>
                  No data yet
                </div>
              )}
            </div>

            {/* Pie Chart by Severity */}
            <div style={{
              background: 'rgba(18,18,26,0.9)',
              border: '1px solid rgba(255,107,53,0.1)',
              borderRadius: '20px', padding: '28px'
            }}>
              <h3 style={{
                color: '#F5F5F7', fontSize: '16px',
                fontWeight: '700', marginBottom: '24px',
                fontFamily: 'Space Grotesk, sans-serif'
              }}>⚡ Severity Distribution</h3>
              {severityData.length > 0 ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <ResponsiveContainer width="60%" height={200}>
                    <PieChart>
                      <Pie
                        data={severityData} cx="50%" cy="50%"
                        innerRadius={50} outerRadius={80}
                        dataKey="value"
                      >
                        {severityData.map((_, i) => (
                          <Cell key={i} fill={
                            ['#30D158', '#FFD60A', '#FF6B35', '#FF2D55'][i] || COLORS[i]
                          } />
                        ))}
                      </Pie>
                      <Tooltip content={customTooltip} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {severityData.map((s, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                          width: '10px', height: '10px', borderRadius: '50%',
                          background: ['#30D158', '#FFD60A', '#FF6B35', '#FF2D55'][i]
                        }} />
                        <span style={{ color: '#98989F', fontSize: '13px', textTransform: 'capitalize' }}>
                          {s.name}
                        </span>
                        <span style={{ color: '#F5F5F7', fontSize: '13px', fontWeight: '700' }}>
                          {s.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{ height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6E6E73' }}>
                  No data yet
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

export default Analytics