import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import api from '../services/api'
import { useAuth } from '../hooks/useAuth'
import { formatDateTime, timeAgo } from '../utils/formatDate'
import toast from 'react-hot-toast'

const severityConfig = {
  low: { color: '#30D158', label: 'Low' },
  medium: { color: '#FFD60A', label: 'Medium' },
  high: { color: '#FF6B35', label: 'High' },
  critical: { color: '#FF2D55', label: 'Critical' },
}

const statusConfig = {
  reported: { color: '#0A84FF', label: 'Reported' },
  'in-progress': { color: '#FFD60A', label: 'In Progress' },
  resolved: { color: '#30D158', label: 'Resolved' },
}

const DisasterDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [disaster, setDisaster] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [updateMsg, setUpdateMsg] = useState('')
  const [newStatus, setNewStatus] = useState('')

  useEffect(() => {
    fetchDisaster()
  }, [id])

  const fetchDisaster = async () => {
    try {
      const { data } = await api.get(`/disasters/${id}`)
      setDisaster(data)
      setNewStatus(data.status)
    } catch (error) {
      toast.error('Failed to load disaster details')
      navigate('/feed')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async () => {
    if (!updateMsg.trim()) {
      toast.error('Please add an update message')
      return
    }
    setUpdating(true)
    try {
      await api.put(`/disasters/${id}/status`, {
        status: newStatus, message: updateMsg
      })
      toast.success('Status updated!')
      setUpdateMsg('')
      fetchDisaster()
    } catch (error) {
      toast.error('Failed to update status')
    } finally {
      setUpdating(false)
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
    </div>
  )

  if (!disaster) return null

  const sev = severityConfig[disaster.severity] || severityConfig.low
  const sta = statusConfig[disaster.status] || statusConfig.reported
  const canUpdate = user && (user.role === 'admin' || user.role === 'volunteer')

  return (
    <div style={{ background: '#0A0A0F', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ paddingTop: '64px', maxWidth: '900px', margin: '0 auto', padding: '80px 32px' }}>

        {/* Back */}
        <button
          onClick={() => navigate('/feed')}
          style={{
            marginBottom: '24px', padding: '8px 16px',
            background: 'transparent',
            border: '1px solid rgba(255,107,53,0.2)',
            borderRadius: '8px', color: '#98989F',
            fontSize: '14px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '6px'
          }}>← Back to Feed</button>

        {/* Header */}
        <div style={{
          background: 'rgba(18,18,26,0.9)',
          border: '1px solid rgba(255,107,53,0.15)',
          borderRadius: '24px', padding: '40px',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <span style={{
              padding: '6px 16px', borderRadius: '50px',
              fontSize: '13px', fontWeight: '700',
              background: `${sev.color}15`, color: sev.color,
              border: `1px solid ${sev.color}33`
            }}>{sev.label} Severity</span>
            <span style={{
              padding: '6px 16px', borderRadius: '50px',
              fontSize: '13px', fontWeight: '700',
              background: `${sta.color}15`, color: sta.color,
              border: `1px solid ${sta.color}33`
            }}>{sta.label}</span>
            <span style={{
              padding: '6px 16px', borderRadius: '50px',
              fontSize: '13px', fontWeight: '600',
              background: 'rgba(255,107,53,0.08)', color: '#98989F',
              border: '1px solid rgba(255,107,53,0.1)',
              textTransform: 'capitalize'
            }}>{disaster.type}</span>
          </div>

          <h1 style={{
            fontSize: '32px', fontWeight: '800',
            fontFamily: 'Space Grotesk, sans-serif',
            color: '#F5F5F7', marginBottom: '16px'
          }}>{disaster.title}</h1>

          <p style={{
            color: '#98989F', fontSize: '16px',
            lineHeight: '1.7', marginBottom: '24px'
          }}>{disaster.description}</p>

          {/* Meta */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px', paddingTop: '24px',
            borderTop: '1px solid rgba(255,107,53,0.1)'
          }}>
            {[
              { icon: '📍', label: 'Location', value: disaster.location?.address },
              { icon: '👤', label: 'Reported by', value: disaster.reportedBy?.name },
              { icon: '🕐', label: 'Reported', value: timeAgo(disaster.createdAt) },
              { icon: '👥', label: 'Affected People', value: disaster.affectedPeople || 0 },
              { icon: '🦺', label: 'Volunteers', value: disaster.assignedVolunteers?.length || 0 },
              { icon: '📅', label: 'Last Updated', value: formatDateTime(disaster.updatedAt) },
            ].map((m, i) => (
              <div key={i}>
                <div style={{ color: '#6E6E73', fontSize: '12px', marginBottom: '4px' }}>
                  {m.icon} {m.label}
                </div>
                <div style={{ color: '#F5F5F7', fontSize: '14px', fontWeight: '600' }}>
                  {m.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Images */}
        {disaster.images?.length > 0 && (
          <div style={{
            background: 'rgba(18,18,26,0.9)',
            border: '1px solid rgba(255,107,53,0.15)',
            borderRadius: '24px', padding: '32px',
            marginBottom: '24px'
          }}>
            <h3 style={{
              color: '#F5F5F7', fontSize: '18px',
              fontWeight: '700', marginBottom: '16px',
              fontFamily: 'Space Grotesk, sans-serif'
            }}>📸 Images</h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '12px'
            }}>
              {disaster.images.map((img, i) => (
                <img key={i} src={img} alt={`disaster-${i}`}
                  style={{
                    width: '100%', height: '160px',
                    objectFit: 'cover', borderRadius: '12px',
                    border: '1px solid rgba(255,107,53,0.1)'
                  }} />
              ))}
            </div>
          </div>
        )}

        {/* Status Update (Admin/Volunteer) */}
        {canUpdate && (
          <div style={{
            background: 'rgba(18,18,26,0.9)',
            border: '1px solid rgba(255,107,53,0.15)',
            borderRadius: '24px', padding: '32px',
            marginBottom: '24px'
          }}>
            <h3 style={{
              color: '#F5F5F7', fontSize: '18px',
              fontWeight: '700', marginBottom: '20px',
              fontFamily: 'Space Grotesk, sans-serif'
            }}>⚙️ Update Status</h3>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
              {Object.entries(statusConfig).map(([key, val]) => (
                <button
                  key={key}
                  onClick={() => setNewStatus(key)}
                  style={{
                    flex: 1, padding: '10px',
                    borderRadius: '10px', cursor: 'pointer',
                    border: newStatus === key
                      ? `1px solid ${val.color}`
                      : '1px solid rgba(255,107,53,0.1)',
                    background: newStatus === key
                      ? `${val.color}15` : 'rgba(10,10,15,0.8)',
                    color: newStatus === key ? val.color : '#98989F',
                    fontSize: '13px', fontWeight: '600',
                    transition: 'all 0.2s ease'
                  }}>{val.label}</button>
              ))}
            </div>

            <textarea
              value={updateMsg}
              onChange={e => setUpdateMsg(e.target.value)}
              placeholder="Add an update message..."
              rows={3}
              style={{
                width: '100%', padding: '14px 16px',
                background: 'rgba(10,10,15,0.8)',
                border: '1px solid rgba(255,107,53,0.15)',
                borderRadius: '12px', color: '#F5F5F7',
                fontSize: '14px', outline: 'none',
                resize: 'vertical', lineHeight: '1.6',
                boxSizing: 'border-box', marginBottom: '12px'
              }}
            />

            <button
              onClick={handleStatusUpdate}
              disabled={updating}
              style={{
                padding: '12px 28px',
                background: updating
                  ? 'rgba(255,107,53,0.5)'
                  : 'linear-gradient(135deg, #FF6B35, #FF2D55)',
                color: 'white', borderRadius: '10px',
                fontWeight: '700', fontSize: '14px',
                cursor: updating ? 'not-allowed' : 'pointer',
                border: 'none',
                boxShadow: updating ? 'none' : '0 0 20px rgba(255,107,53,0.3)'
              }}>
              {updating ? 'Updating...' : 'Update Status'}
            </button>
          </div>
        )}

        {/* Activity Timeline */}
        {disaster.updates?.length > 0 && (
          <div style={{
            background: 'rgba(18,18,26,0.9)',
            border: '1px solid rgba(255,107,53,0.15)',
            borderRadius: '24px', padding: '32px'
          }}>
            <h3 style={{
              color: '#F5F5F7', fontSize: '18px',
              fontWeight: '700', marginBottom: '24px',
              fontFamily: 'Space Grotesk, sans-serif'
            }}>📋 Activity Timeline</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {disaster.updates.map((u, i) => (
                <div key={i} style={{
                  display: 'flex', gap: '16px',
                  paddingBottom: '16px',
                  borderBottom: i < disaster.updates.length - 1
                    ? '1px solid rgba(255,107,53,0.08)' : 'none'
                }}>
                  <div style={{
                    width: '32px', height: '32px', flexShrink: 0,
                    background: 'linear-gradient(135deg, #FF6B35, #FF2D55)',
                    borderRadius: '50%', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    fontSize: '14px'
                  }}>📝</div>
                  <div>
                    <p style={{ color: '#F5F5F7', fontSize: '14px', marginBottom: '4px' }}>
                      {u.message}
                    </p>
                    <span style={{ color: '#6E6E73', fontSize: '12px' }}>
                      {formatDateTime(u.updatedAt)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

export default DisasterDetail