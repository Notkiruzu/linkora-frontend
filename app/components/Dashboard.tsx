'use client'

import { useState, useEffect } from 'react'

interface DashboardProps {
  onBackToHome: () => void
}

interface OptimizationResult {
  original_caption: string
  optimized_caption: string
  hashtags: string[]
  best_time: any
  engagement_score: any
  platform: string
}

export default function Dashboard({ onBackToHome }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'optimizer' | 'analytics' | 'schedule'>('optimizer')
  const [caption, setCaption] = useState('')
  const [platform, setPlatform] = useState('instagram')
  const [timezone, setTimezone] = useState('America/New_York')
  const [targetAudience, setTargetAudience] = useState('global')
  const [result, setResult] = useState<OptimizationResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const optimizeCaption = async () => {
    if (!caption.trim()) {
      setError('Please enter a caption to optimize')
      return
    }

    setLoading(true)
    setError('')
    
    try {
      const apiUrl = process.env.NODE_ENV === 'production' 
        ? 'https://bz5kewcu46g2a7suhsadywfksi0wtitu.lambda-url.us-east-1.on.aws/'
        : 'http://localhost:3002/api/optimize';
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          caption,
          platform,
          timezone,
          target_audience: targetAudience
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`dashboard ${isVisible ? 'fade-in' : ''}`}>
      {/* Header */}
      <header className="dashboard-header glass-effect">
        <div className="header-container">
          <div className="header-left">
            <button className="back-btn hover-lift" onClick={onBackToHome}>
              <span className="back-icon">←</span>
              <span>Back to Home</span>
            </button>
            <div className="header-brand">
              <img src="/Logo.png" alt="Linkora" className="logo-image" />
              <span className="logo-text">Linkora</span>
            </div>
          </div>
          <div className="header-right">
            <div className="user-info">
              <div className="user-avatar">
                <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23667eea'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E" alt="User" />
              </div>
              <div className="user-details">
                <span className="user-name">John Doe</span>
                <span className="user-plan">Pro Plan</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="dashboard-nav">
        <div className="nav-container">
          <div className="nav-tabs">
            <button 
              className={`nav-tab ${activeTab === 'optimizer' ? 'active' : ''}`}
              onClick={() => setActiveTab('optimizer')}
            >
              <span className="tab-icon">✨</span>
              <span className="tab-text">Caption Optimizer</span>
              <div className="tab-indicator"></div>
            </button>
            <button 
              className={`nav-tab ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveTab('analytics')}
            >
              <span className="tab-icon">📊</span>
              <span className="tab-text">Analytics</span>
              <div className="tab-indicator"></div>
            </button>
            <button 
              className={`nav-tab ${activeTab === 'schedule' ? 'active' : ''}`}
              onClick={() => setActiveTab('schedule')}
            >
              <span className="tab-icon">📅</span>
              <span className="tab-text">Schedule</span>
              <div className="tab-indicator"></div>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="dashboard-main">
        {activeTab === 'optimizer' && (
          <div className="optimizer-section slide-in-bottom">
            <div className="section-header">
              <div className="header-content">
                <h1>Caption Optimizer</h1>
                <p>Transform your social media content with AI-powered optimization</p>
              </div>
              <div className="header-stats">
                <div className="stat-pill">
                  <span className="stat-icon">🔥</span>
                  <span>300% avg boost</span>
                </div>
                <div className="stat-pill">
                  <span className="stat-icon">⚡</span>
                  <span>2s processing</span>
                </div>
              </div>
            </div>

            <div className="optimizer-layout">
              <div className="input-panel glass-card">
                <div className="panel-header">
                  <h2>Input Your Content</h2>
                  <div className="panel-badge">Step 1</div>
                </div>
                
                <div className="form-group">
                  <label>Your Caption</label>
                  <div className="textarea-wrapper">
                    <textarea
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      placeholder="Enter your caption here... ✨"
                      rows={6}
                      className="caption-input"
                    />
                    <div className="input-counter">{caption.length}/500</div>
                  </div>
                </div>

                <div className="settings-grid">
                  <div className="form-group">
                    <label>Platform</label>
                    <div className="select-wrapper">
                      <select value={platform} onChange={(e) => setPlatform(e.target.value)}>
                        <option value="instagram">📷 Instagram</option>
                        <option value="linkedin">💼 LinkedIn</option>
                        <option value="twitter">🐦 Twitter</option>
                        <option value="tiktok">🎵 TikTok</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Timezone</label>
                    <div className="select-wrapper">
                      <select value={timezone} onChange={(e) => setTimezone(e.target.value)}>
                        <option value="America/New_York">🇺🇸 Eastern Time</option>
                        <option value="America/Chicago">🇺🇸 Central Time</option>
                        <option value="America/Denver">🇺🇸 Mountain Time</option>
                        <option value="America/Los_Angeles">🇺🇸 Pacific Time</option>
                        <option value="Europe/London">🇬🇧 London</option>
                        <option value="Europe/Paris">🇫🇷 Paris</option>
                        <option value="Asia/Tokyo">🇯🇵 Tokyo</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Target Audience</label>
                    <div className="select-wrapper">
                      <select value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)}>
                        <option value="global">🌍 Global</option>
                        <option value="us">🇺🇸 United States</option>
                        <option value="europe">🇪🇺 Europe</option>
                        <option value="asia">🌏 Asia</option>
                        <option value="local">📍 Local</option>
                      </select>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={optimizeCaption} 
                  disabled={loading || !caption.trim()}
                  className="optimize-button glow-button"
                >
                  {loading ? (
                    <>
                      <div className="loading-spinner"></div>
                      <span>Optimizing...</span>
                    </>
                  ) : (
                    <>
                      <span className="btn-icon">✨</span>
                      <span>Optimize Caption</span>
                      <span className="btn-arrow">→</span>
                    </>
                  )}
                  <div className="button-glow"></div>
                </button>

                {error && (
                  <div className="error-message slide-in-bottom">
                    <span className="error-icon">⚠️</span>
                    <span>{error}</span>
                  </div>
                )}
              </div>

              <div className="results-panel glass-card">
                <div className="panel-header">
                  <h2>Optimization Results</h2>
                  <div className="panel-badge">Step 2</div>
                </div>

                {result ? (
                  <div className="results-content slide-in-right">
                    <div className="score-section">
                      <div className="score-card">
                        <div className="score-header">
                          <h3>Engagement Score</h3>
                          <div className="score-value">
                            {typeof result.engagement_score === 'object' ? result.engagement_score.score : result.engagement_score}
                            <span className="score-max">/10</span>
                          </div>
                        </div>
                        <div className="score-bar">
                          <div 
                            className="score-fill" 
                            style={{ 
                              width: `${(typeof result.engagement_score === 'object' ? result.engagement_score.score : result.engagement_score) * 10}%` 
                            }}
                          ></div>
                        </div>
                        <div className="score-label">
                          {typeof result.engagement_score === 'object' ? result.engagement_score.explanation : 'Great potential!'}
                        </div>
                      </div>
                    </div>

                    <div className="comparison-section">
                      <div className="comparison-card original">
                        <div className="card-header">
                          <h4>Original Caption</h4>
                          <div className="card-badge">Before</div>
                        </div>
                        <div className="card-content">
                          <p>{result.original_caption}</p>
                        </div>
                      </div>
                      
                      <div className="comparison-card optimized">
                        <div className="card-header">
                          <h4>Optimized Caption</h4>
                          <div className="card-badge success">After</div>
                        </div>
                        <div className="card-content">
                          <p>{result.optimized_caption}</p>
                        </div>
                        <button 
                          className="copy-btn hover-lift" 
                          onClick={() => navigator.clipboard.writeText(result.optimized_caption)}
                        >
                          <span className="copy-icon">📋</span>
                          <span>Copy</span>
                        </button>
                      </div>
                    </div>

                    <div className="hashtags-section">
                      <h4>Suggested Hashtags</h4>
                      <div className="hashtags-grid">
                        {result.hashtags.map((tag, index) => (
                          <div key={index} className="hashtag-pill">
                            <span className="hashtag-text">{tag}</span>
                            <button className="hashtag-copy" onClick={() => navigator.clipboard.writeText(tag)}>
                              📋
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="timing-section">
                      <div className="timing-card">
                        <div className="timing-header">
                          <span className="timing-icon">⏰</span>
                          <h4>Best Posting Time</h4>
                        </div>
                        <div className="timing-content">
                          <p>{result.best_time?.tip || result.best_time?.reason || 'Optimal timing calculated for maximum engagement'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="empty-results">
                    <div className="empty-animation">
                      <div className="empty-icon">🎯</div>
                      <div className="pulse-rings">
                        <div className="pulse-ring"></div>
                        <div className="pulse-ring"></div>
                        <div className="pulse-ring"></div>
                      </div>
                    </div>
                    <h3>Ready to Optimize</h3>
                    <p>Enter your caption and settings to get AI-powered optimization results</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="analytics-section slide-in-bottom">
            <div className="section-header">
              <h1>Analytics Dashboard</h1>
              <p>Track your social media performance and optimization results</p>
            </div>

            <div className="analytics-grid">
              <div className="analytics-card hover-lift">
                <div className="card-header">
                  <h3>Total Optimizations</h3>
                  <span className="card-icon">📈</span>
                </div>
                <div className="metric-value">1,247</div>
                <div className="metric-change positive">
                  <span className="change-icon">↗</span>
                  <span>+12% this week</span>
                </div>
              </div>
              
              <div className="analytics-card hover-lift">
                <div className="card-header">
                  <h3>Avg. Engagement Boost</h3>
                  <span className="card-icon">🚀</span>
                </div>
                <div className="metric-value">285%</div>
                <div className="metric-change positive">
                  <span className="change-icon">↗</span>
                  <span>+15% this month</span>
                </div>
              </div>
              
              <div className="analytics-card hover-lift">
                <div className="card-header">
                  <h3>Best Platform</h3>
                  <span className="card-icon">🏆</span>
                </div>
                <div className="metric-value">Instagram</div>
                <div className="metric-change">
                  <span className="platform-score">92% success rate</span>
                </div>
              </div>
              
              <div className="analytics-card hover-lift">
                <div className="card-header">
                  <h3>Time Saved</h3>
                  <span className="card-icon">⏱️</span>
                </div>
                <div className="metric-value">24 hrs</div>
                <div className="metric-change">
                  <span>This month</span>
                </div>
              </div>
            </div>

            <div className="chart-section glass-card">
              <div className="chart-header">
                <h3>Performance Over Time</h3>
                <div className="chart-controls">
                  <button className="chart-btn active">7D</button>
                  <button className="chart-btn">30D</button>
                  <button className="chart-btn">90D</button>
                </div>
              </div>
              <div className="chart-container">
                <div className="chart-grid">
                  {Array.from({length: 7}, (_, i) => (
                    <div key={i} className="chart-column">
                      <div 
                        className="chart-bar animated-bar" 
                        style={{
                          height: `${Math.random() * 80 + 20}%`,
                          animationDelay: `${i * 0.1}s`
                        }}
                      ></div>
                      <span className="chart-label">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'schedule' && (
          <div className="schedule-section slide-in-bottom">
            <div className="section-header">
              <h1>Content Scheduler</h1>
              <p>Plan and schedule your optimized content across platforms</p>
            </div>

            <div className="schedule-container">
              <div className="calendar-card glass-card">
                <div className="calendar-header">
                  <div className="calendar-title">
                    <h3>December 2024</h3>
                    <div className="calendar-nav">
                      <button className="nav-btn">←</button>
                      <button className="nav-btn">→</button>
                    </div>
                  </div>
                </div>
                
                <div className="calendar-grid">
                  <div className="calendar-days">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="day-header">{day}</div>
                    ))}
                    
                    {Array.from({length: 35}, (_, i) => (
                      <div key={i} className={`calendar-day ${i > 6 && i < 28 ? 'current-month' : 'other-month'}`}>
                        <span className="day-number">{((i - 7) % 31) + 1}</span>
                        {i === 15 && (
                          <div className="scheduled-post instagram">
                            <span className="post-icon">📷</span>
                            <span className="post-text">Instagram Post</span>
                          </div>
                        )}
                        {i === 20 && (
                          <div className="scheduled-post linkedin">
                            <span className="post-icon">💼</span>
                            <span className="post-text">LinkedIn Article</span>
                          </div>
                        )}
                        {i === 25 && (
                          <div className="scheduled-post twitter">
                            <span className="post-icon">🐦</span>
                            <span className="post-text">Twitter Thread</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="schedule-sidebar">
                <div className="upcoming-posts glass-card">
                  <h3>Upcoming Posts</h3>
                  <div className="post-list">
                    <div className="post-item">
                      <div className="post-platform instagram">📷</div>
                      <div className="post-details">
                        <div className="post-title">Product Launch Announcement</div>
                        <div className="post-time">Today, 2:00 PM</div>
                      </div>
                    </div>
                    <div className="post-item">
                      <div className="post-platform linkedin">💼</div>
                      <div className="post-details">
                        <div className="post-title">Industry Insights Article</div>
                        <div className="post-time">Tomorrow, 9:00 AM</div>
                      </div>
                    </div>
                    <div className="post-item">
                      <div className="post-platform twitter">🐦</div>
                      <div className="post-details">
                        <div className="post-title">Weekly Tips Thread</div>
                        <div className="post-time">Dec 25, 3:00 PM</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}