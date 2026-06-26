import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const Landing = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [scrollY, setScrollY] = useState(0)
  const heroRef = useRef(null)

  useEffect(() => {
    const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY })
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const stats = [
    { value: '10K+', label: 'Incidents Reported' },
    { value: '5K+', label: 'Active Volunteers' },
    { value: '98%', label: 'Response Rate' },
    { value: '24/7', label: 'Always Active' },
  ]

  const features = [
    { icon: '🚨', title: 'Real-Time Alerts', desc: 'Instant notifications for disasters in your area with severity levels and live updates.' },
    { icon: '🗺️', title: 'Interactive Map', desc: 'Visualize disaster zones, volunteer locations and resource distribution on live maps.' },
    { icon: '👥', title: 'Volunteer Network', desc: 'Connect skilled volunteers with those in need. Smart assignment based on skills and location.' },
    { icon: '📊', title: 'Analytics Dashboard', desc: 'Data-driven insights on disaster patterns, response times and community impact.' },
    { icon: '🛡️', title: 'Role-Based Access', desc: 'Secure access for citizens, volunteers and admins with tailored dashboards.' },
    { icon: '⚡', title: 'Instant Response', desc: 'Streamlined workflows to connect people to help within minutes of reporting.' },
  ]

  const severities = [
    { level: 'Critical', color: '#FF2D55', count: 12 },
    { level: 'High', color: '#FF6B35', count: 28 },
    { level: 'Medium', color: '#FFD60A', count: 45 },
    { level: 'Low', color: '#30D158', count: 89 },
  ]

  return (
    <div style={{ background: '#0A0A0F', minHeight: '100vh', overflow: 'hidden' }}>

      {/* Cursor glow */}
      <div style={{
        position: 'fixed',
        left: mousePos.x - 200, top: mousePos.y - 200,
        width: '400px', height: '400px',
        background: 'radial-gradient(circle, rgba(255,107,53,0.07) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
        zIndex: 0, transition: 'left 0.1s ease, top 0.1s ease'
      }} />

      {/* Navbar */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '16px 48px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: scrollY > 50 ? 'rgba(10,10,15,0.95)' : 'transparent',
        backdropFilter: scrollY > 50 ? 'blur(20px)' : 'none',
        borderBottom: scrollY > 50 ? '1px solid rgba(255,107,53,0.1)' : 'none',
        transition: 'all 0.3s ease'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px', height: '36px',
            background: 'linear-gradient(135deg, #FF6B35, #FF2D55)',
            borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '18px'
          }}>🛡️</div>
          <span style={{
            fontSize: '22px', fontWeight: '700',
            fontFamily: 'Space Grotesk, sans-serif',
            background: 'linear-gradient(135deg, #FF6B35, #FF2D55)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>ResQNet</span>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {user ? (
            <button onClick={() => navigate('/feed')} style={{
              padding: '10px 24px',
              background: 'linear-gradient(135deg, #FF6B35, #E55A2B)',
              color: 'white', borderRadius: '50px',
              fontWeight: '600', fontSize: '14px',
              cursor: 'pointer', border: 'none',
              boxShadow: '0 0 20px rgba(255,107,53,0.3)'
            }}>Go to Dashboard →</button>
          ) : (
            <>
              <button onClick={() => navigate('/login')} style={{
                padding: '10px 20px', background: 'transparent',
                color: '#98989F', border: '1px solid rgba(255,107,53,0.2)',
                borderRadius: '50px', fontWeight: '500',
                fontSize: '14px', cursor: 'pointer'
              }}>Sign In</button>
              <button onClick={() => navigate('/register')} style={{
                padding: '10px 24px',
                background: 'linear-gradient(135deg, #FF6B35, #FF2D55)',
                color: 'white', borderRadius: '50px',
                fontWeight: '600', fontSize: '14px',
                cursor: 'pointer', border: 'none',
                boxShadow: '0 0 20px rgba(255,107,53,0.4)'
              }}>Get Started</button>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section ref={heroRef} style={{
        minHeight: '100vh',
        display: 'flex', alignItems: 'center',
        justifyContent: 'center', flexDirection: 'column',
        textAlign: 'center', padding: '120px 24px 80px',
        position: 'relative'
      }}>
        {/* Grid background */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `linear-gradient(rgba(255,107,53,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,107,53,0.04) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
          maskImage: 'radial-gradient(ellipse at center, black 0%, transparent 70%)'
        }} />

        {/* Live Alert */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: 'rgba(255,45,85,0.1)',
          border: '1px solid rgba(255,45,85,0.3)',
          borderRadius: '50px', padding: '8px 20px',
          marginBottom: '32px', zIndex: 1
        }}>
          <div style={{
            width: '8px', height: '8px',
            background: '#FF2D55', borderRadius: '50%',
            animation: 'pulse 2s infinite'
          }} />
          <span style={{ color: '#FF2D55', fontSize: '14px', fontWeight: '500' }}>
            Live: 3 active emergencies in your region
          </span>
        </div>

        {/* Heading */}
        <h1 style={{
          fontSize: 'clamp(40px, 7vw, 80px)',
          fontWeight: '900',
          fontFamily: 'Space Grotesk, sans-serif',
          lineHeight: '1.1', marginBottom: '24px',
          zIndex: 1, maxWidth: '900px'
        }}>
          Community-Powered{' '}
          <span style={{
            background: 'linear-gradient(135deg, #FF6B35, #FF2D55)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>Disaster Response</span>
          {' '}Built for the Moments That Matter
        </h1>

        <p style={{
          fontSize: '18px', color: '#98989F',
          maxWidth: '600px', lineHeight: '1.7',
          marginBottom: '40px', zIndex: 1
        }}>
          Report disasters, coordinate volunteers, and track emergency response
          in real-time. Because every second counts when lives are at stake.
        </p>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center', zIndex: 1 }}>
          <button
            onClick={() => navigate('/register')}
            onMouseEnter={e => e.target.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.target.style.transform = 'translateY(0)'}
            style={{
              padding: '16px 40px',
              background: 'linear-gradient(135deg, #FF6B35, #FF2D55)',
              color: 'white', borderRadius: '50px',
              fontWeight: '700', fontSize: '16px',
              cursor: 'pointer', border: 'none',
              boxShadow: '0 0 40px rgba(255,107,53,0.5)',
              transition: 'all 0.2s ease'
            }}>🚀 Join ResQNet Free</button>
          <button
            onClick={() => navigate('/feed')}
            onMouseEnter={e => {
              e.target.style.background = 'rgba(255,107,53,0.1)'
              e.target.style.borderColor = 'rgba(255,107,53,0.4)'
            }}
            onMouseLeave={e => {
              e.target.style.background = 'transparent'
              e.target.style.borderColor = 'rgba(245,245,247,0.2)'
            }}
            style={{
              padding: '16px 40px', background: 'transparent',
              color: '#F5F5F7', border: '1px solid rgba(245,245,247,0.2)',
              borderRadius: '50px', fontWeight: '600',
              fontSize: '16px', cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}>🗺️ View Live Feed</button>
        </div>

        {/* Floating Cards */}
        <div style={{
          position: 'absolute', left: '5%', top: '30%',
          background: 'rgba(18,18,26,0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,107,53,0.15)',
          borderRadius: '16px', padding: '16px 20px',
          animation: 'float1 4s ease-in-out infinite',
          display: 'flex', alignItems: 'center', gap: '12px'
        }}>
          <div style={{
            width: '10px', height: '10px',
            background: '#FF2D55', borderRadius: '50%',
            animation: 'pulse 1.5s infinite',
            boxShadow: '0 0 10px #FF2D55'
          }} />
          <div>
            <div style={{ color: '#F5F5F7', fontSize: '13px', fontWeight: '600' }}>Flood Reported</div>
            <div style={{ color: '#98989F', fontSize: '11px' }}>Chennai • 2 min ago</div>
          </div>
        </div>

        <div style={{
          position: 'absolute', right: '5%', top: '35%',
          background: 'rgba(18,18,26,0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(48,209,88,0.15)',
          borderRadius: '16px', padding: '16px 20px',
          animation: 'float2 5s ease-in-out infinite',
          display: 'flex', alignItems: 'center', gap: '12px'
        }}>
          <span style={{ fontSize: '20px' }}>✅</span>
          <div>
            <div style={{ color: '#F5F5F7', fontSize: '13px', fontWeight: '600' }}>Volunteer Assigned</div>
            <div style={{ color: '#98989F', fontSize: '11px' }}>5 volunteers dispatched</div>
          </div>
        </div>

        <div style={{
          position: 'absolute', left: '8%', bottom: '15%',
          background: 'rgba(18,18,26,0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(48,209,88,0.2)',
          borderRadius: '16px', padding: '16px 20px',
          animation: 'float3 6s ease-in-out infinite',
        }}>
          <div style={{ color: '#30D158', fontSize: '13px', fontWeight: '600' }}>✓ Incident Resolved</div>
          <div style={{ color: '#98989F', fontSize: '11px' }}>Response time: 18 mins</div>
        </div>
      </section>

      {/* Stats */}
      <section style={{
        padding: '80px 48px',
        borderTop: '1px solid rgba(255,107,53,0.1)',
        borderBottom: '1px solid rgba(255,107,53,0.1)',
        background: 'rgba(18,18,26,0.5)'
      }}>
        <div style={{
          maxWidth: '1000px', margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '40px', textAlign: 'center'
        }}>
          {stats.map((stat, i) => (
            <div key={i}>
              <div style={{
                fontSize: '48px', fontWeight: '800',
                fontFamily: 'Space Grotesk, sans-serif',
                background: 'linear-gradient(135deg, #FF6B35, #FF2D55)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '8px'
              }}>{stat.value}</div>
              <div style={{ color: '#98989F', fontSize: '15px' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '100px 48px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 style={{
              fontSize: '42px', fontWeight: '800',
              fontFamily: 'Space Grotesk, sans-serif',
              color: '#F5F5F7', marginBottom: '16px'
            }}>
              Everything you need for{' '}
              <span style={{
                background: 'linear-gradient(135deg, #FF6B35, #FF2D55)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>effective response</span>
            </h2>
            <p style={{ color: '#98989F', fontSize: '18px', maxWidth: '500px', margin: '0 auto' }}>
              Built for communities, by communities. Every feature designed to save time when it matters most.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '24px'
          }}>
            {features.map((f, i) => (
              <div key={i}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(26,26,38,0.9)'
                  e.currentTarget.style.borderColor = 'rgba(255,107,53,0.3)'
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.4)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(26,26,38,0.5)'
                  e.currentTarget.style.borderColor = 'rgba(255,107,53,0.08)'
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
                style={{
                  background: 'rgba(26,26,38,0.5)',
                  border: '1px solid rgba(255,107,53,0.08)',
                  borderRadius: '20px', padding: '32px',
                  transition: 'all 0.3s ease', cursor: 'default'
                }}>
                <div style={{ fontSize: '36px', marginBottom: '16px' }}>{f.icon}</div>
                <h3 style={{
                  fontSize: '18px', fontWeight: '700',
                  color: '#F5F5F7', marginBottom: '12px',
                  fontFamily: 'Space Grotesk, sans-serif'
                }}>{f.title}</h3>
                <p style={{ color: '#98989F', fontSize: '14px', lineHeight: '1.7' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Stats */}
      <section style={{
        padding: '80px 48px',
        background: 'rgba(18,18,26,0.5)',
        borderTop: '1px solid rgba(255,107,53,0.1)'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{
            fontSize: '36px', fontWeight: '800',
            fontFamily: 'Space Grotesk, sans-serif',
            color: '#F5F5F7', marginBottom: '48px'
          }}>Live Incident Overview</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {severities.map((s, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '16px',
                background: 'rgba(10,10,15,0.5)',
                border: '1px solid rgba(255,107,53,0.08)',
                borderRadius: '12px', padding: '16px 24px'
              }}>
                <div style={{
                  width: '12px', height: '12px',
                  background: s.color, borderRadius: '50%',
                  boxShadow: `0 0 10px ${s.color}`
                }} />
                <span style={{ color: '#F5F5F7', fontWeight: '600', width: '80px', textAlign: 'left' }}>
                  {s.level}
                </span>
                <div style={{ flex: 1, background: 'rgba(255,107,53,0.1)', borderRadius: '50px', height: '8px' }}>
                  <div style={{
                    width: `${(s.count / 89) * 100}%`,
                    height: '100%', background: s.color,
                    borderRadius: '50px',
                    boxShadow: `0 0 10px ${s.color}`
                  }} />
                </div>
                <span style={{ color: '#98989F', fontSize: '14px', width: '40px', textAlign: 'right' }}>
                  {s.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: '120px 48px', textAlign: 'center', position: 'relative'
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at center, rgba(255,107,53,0.06) 0%, transparent 70%)'
        }} />
        <h2 style={{
          fontSize: '48px', fontWeight: '900',
          fontFamily: 'Space Grotesk, sans-serif',
          color: '#F5F5F7', marginBottom: '20px', position: 'relative'
        }}>Ready to make a difference?</h2>
        <p style={{
          color: '#98989F', fontSize: '18px',
          marginBottom: '40px', position: 'relative'
        }}>Join thousands of community members already using ResQNet.</p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', position: 'relative' }}>
          <button
            onClick={() => navigate('/register')}
            style={{
              padding: '18px 48px',
              background: 'linear-gradient(135deg, #FF6B35, #FF2D55)',
              color: 'white', borderRadius: '50px',
              fontWeight: '700', fontSize: '18px',
              cursor: 'pointer', border: 'none',
              boxShadow: '0 0 40px rgba(255,107,53,0.5)'
            }}>Get Started Free →</button>
          <button
            onClick={() => navigate('/feed')}
            style={{
              padding: '18px 48px', background: 'transparent',
              color: '#98989F', border: '1px solid rgba(255,107,53,0.2)',
              borderRadius: '50px', fontWeight: '600',
              fontSize: '18px', cursor: 'pointer'
            }}>View Live Disasters</button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '40px 48px',
        borderTop: '1px solid rgba(255,107,53,0.1)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #FF6B35, #FF2D55)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: '700', fontSize: '20px',
          fontFamily: 'Space Grotesk, sans-serif'
        }}>ResQNet</div>
        <div style={{ color: '#6E6E73', fontSize: '14px' }}>
          © 2024 ResQNet. Built for communities, by communities.
        </div>
      </footer>

      <style>{`
        @keyframes float1 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes float2 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float3 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.2); }
        }
      `}</style>
    </div>
  )
}

export default Landing