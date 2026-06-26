import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import api from '../services/api'
import toast from 'react-hot-toast'

const Report = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState([])
  const [previews, setPreviews] = useState([])
  const [formData, setFormData] = useState({
    title: '', description: '', type: 'flood',
    severity: 'medium', address: '', lat: '', lng: '',
    affectedPeople: ''
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleImages = (e) => {
    const files = Array.from(e.target.files)
    setImages(files)
    setPreviews(files.map(f => URL.createObjectURL(f)))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const form = new FormData()
      form.append('title', formData.title)
      form.append('description', formData.description)
      form.append('type', formData.type)
      form.append('severity', formData.severity)
      form.append('affectedPeople', formData.affectedPeople || 0)
      form.append('location', JSON.stringify({
        address: formData.address,
        lat: parseFloat(formData.lat) || 0,
        lng: parseFloat(formData.lng) || 0
      }))
      images.forEach(img => form.append('images', img))

      await api.post('/disasters', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      toast.success('Disaster reported successfully!')
      navigate('/feed')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to report disaster')
    } finally {
      setLoading(false)
    }
  }

  const types = ['flood', 'earthquake', 'fire', 'storm', 'landslide', 'accident', 'medical', 'other']
  const severities = [
    { value: 'low', label: '🟢 Low', color: '#30D158' },
    { value: 'medium', label: '🟡 Medium', color: '#FFD60A' },
    { value: 'high', label: '🟠 High', color: '#FF6B35' },
    { value: 'critical', label: '🔴 Critical', color: '#FF2D55' },
  ]

  const inputStyle = {
    width: '100%', padding: '14px 16px',
    background: 'rgba(10,10,15,0.8)',
    border: '1px solid rgba(255,107,53,0.15)',
    borderRadius: '12px', color: '#F5F5F7',
    fontSize: '15px', outline: 'none',
    transition: 'all 0.2s ease',
    boxSizing: 'border-box'
  }

  const labelStyle = {
    display: 'block', color: '#98989F',
    fontSize: '13px', fontWeight: '500',
    marginBottom: '8px', textTransform: 'uppercase',
    letterSpacing: '0.5px'
  }

  return (
    <div style={{ background: '#0A0A0F', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ paddingTop: '64px', maxWidth: '800px', margin: '0 auto', padding: '80px 32px' }}>

        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{
            fontSize: '36px', fontWeight: '800',
            fontFamily: 'Space Grotesk, sans-serif',
            color: '#F5F5F7', marginBottom: '8px'
          }}>🚨 Report a Disaster</h1>
          <p style={{ color: '#98989F', fontSize: '16px' }}>
            Provide accurate details to help volunteers respond quickly
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{
            background: 'rgba(18,18,26,0.9)',
            border: '1px solid rgba(255,107,53,0.15)',
            borderRadius: '24px', padding: '40px',
            display: 'flex', flexDirection: 'column', gap: '24px'
          }}>

            {/* Title */}
            <div>
              <label style={labelStyle}>Disaster Title *</label>
              <input
                name="title" value={formData.title}
                onChange={handleChange} required
                placeholder="e.g. Severe flooding in downtown area"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'rgba(255,107,53,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,107,53,0.15)'}
              />
            </div>

            {/* Type + Severity */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Disaster Type *</label>
                <select
                  name="type" value={formData.type}
                  onChange={handleChange}
                  style={{ ...inputStyle, cursor: 'pointer' }}>
                  {types.map(t => (
                    <option key={t} value={t} style={{ background: '#12121A' }}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Severity Level *</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {severities.map(s => (
                    <div
                      key={s.value}
                      onClick={() => setFormData({ ...formData, severity: s.value })}
                      style={{
                        padding: '10px', textAlign: 'center',
                        borderRadius: '10px', cursor: 'pointer',
                        border: formData.severity === s.value
                          ? `1px solid ${s.color}`
                          : '1px solid rgba(255,107,53,0.1)',
                        background: formData.severity === s.value
                          ? `${s.color}15` : 'rgba(10,10,15,0.8)',
                        color: formData.severity === s.value ? s.color : '#98989F',
                        fontSize: '13px', fontWeight: '600',
                        transition: 'all 0.2s ease'
                      }}>{s.label}</div>
                  ))}
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label style={labelStyle}>Description *</label>
              <textarea
                name="description" value={formData.description}
                onChange={handleChange} required rows={4}
                placeholder="Describe what happened, current situation, immediate needs..."
                style={{
                  ...inputStyle, resize: 'vertical', lineHeight: '1.6'
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(255,107,53,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,107,53,0.15)'}
              />
            </div>

            {/* Location */}
            <div>
              <label style={labelStyle}>Location Address *</label>
              <input
                name="address" value={formData.address}
                onChange={handleChange} required
                placeholder="e.g. MG Road, Bangalore, Karnataka"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'rgba(255,107,53,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,107,53,0.15)'}
              />
            </div>

            {/* Lat/Lng + Affected */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Latitude</label>
                <input
                  name="lat" value={formData.lat}
                  onChange={handleChange} placeholder="12.9716"
                  type="number" step="any"
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'rgba(255,107,53,0.5)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,107,53,0.15)'}
                />
              </div>
              <div>
                <label style={labelStyle}>Longitude</label>
                <input
                  name="lng" value={formData.lng}
                  onChange={handleChange} placeholder="77.5946"
                  type="number" step="any"
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'rgba(255,107,53,0.5)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,107,53,0.15)'}
                />
              </div>
              <div>
                <label style={labelStyle}>Affected People</label>
                <input
                  name="affectedPeople" value={formData.affectedPeople}
                  onChange={handleChange} placeholder="0"
                  type="number" min="0"
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'rgba(255,107,53,0.5)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,107,53,0.15)'}
                />
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label style={labelStyle}>Upload Images (Max 5)</label>
              <label style={{
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                padding: '32px', cursor: 'pointer',
                background: 'rgba(10,10,15,0.8)',
                border: '2px dashed rgba(255,107,53,0.2)',
                borderRadius: '12px', transition: 'all 0.2s ease'
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,107,53,0.5)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,107,53,0.2)'}
              >
                <span style={{ fontSize: '32px', marginBottom: '8px' }}>📸</span>
                <span style={{ color: '#98989F', fontSize: '14px' }}>
                  Click to upload images
                </span>
                <span style={{ color: '#6E6E73', fontSize: '12px', marginTop: '4px' }}>
                  JPG, PNG, WEBP up to 5MB each
                </span>
                <input
                  type="file" multiple accept="image/*"
                  onChange={handleImages}
                  style={{ display: 'none' }}
                />
              </label>

              {/* Previews */}
              {previews.length > 0 && (
                <div style={{
                  display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)',
                  gap: '8px', marginTop: '12px'
                }}>
                  {previews.map((p, i) => (
                    <img key={i} src={p} alt={`preview-${i}`}
                      style={{
                        width: '100%', height: '70px',
                        objectFit: 'cover', borderRadius: '8px',
                        border: '1px solid rgba(255,107,53,0.2)'
                      }} />
                  ))}
                </div>
              )}
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '12px', paddingTop: '8px' }}>
              <button
                type="button"
                onClick={() => navigate('/feed')}
                style={{
                  flex: 1, padding: '16px',
                  background: 'transparent',
                  border: '1px solid rgba(255,107,53,0.2)',
                  borderRadius: '12px', color: '#98989F',
                  fontSize: '15px', fontWeight: '600',
                  cursor: 'pointer'
                }}>Cancel</button>
              <button
                type="submit" disabled={loading}
                style={{
                  flex: 2, padding: '16px',
                  background: loading
                    ? 'rgba(255,107,53,0.5)'
                    : 'linear-gradient(135deg, #FF6B35, #FF2D55)',
                  color: 'white', borderRadius: '12px',
                  fontWeight: '700', fontSize: '15px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  border: 'none',
                  boxShadow: loading ? 'none' : '0 0 30px rgba(255,107,53,0.4)'
                }}>
                {loading ? 'Submitting...' : '🚨 Submit Report'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Report