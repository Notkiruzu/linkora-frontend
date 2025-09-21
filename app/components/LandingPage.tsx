'use client'

import { useState, useEffect } from 'react'

interface LandingPageProps {
  onGetStarted: () => void
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  const [showPricing, setShowPricing] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className={`landing-page ${isVisible ? 'fade-in' : ''}`}>
      {/* Navigation */}
      <nav className={`navbar glass-effect ${isScrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <div className="nav-logo slide-in-left">
            <div className="logo-wrapper">
              <img src="/Logo.png" alt="Linkora" className="logo-image" />
              <span className="logo-text">Linkora</span>
            </div>
          </div>
          <div className="nav-links slide-in-right">
            <a href="#features" className="nav-link">Features</a>
            <a href="#how-it-works" className="nav-link">How it Works</a>
            <a href="#pricing" onClick={() => setShowPricing(true)} className="nav-link">Pricing</a>
            <button className="nav-cta glow-button" onClick={onGetStarted}>
              Get Started
              <span className="button-glow"></span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-background">
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
          <div className="gradient-orb orb-3"></div>
        </div>
        
        <div className="hero-container">
          <div className="hero-content slide-in-bottom">
            <h1 className="hero-title">
              Transform Your Social Media
              <span className="gradient-text"> with AI Magic</span>
            </h1>
            
            <p className="hero-subtitle">
              Boost engagement by 300% with our advanced AI that optimizes captions, 
              finds perfect posting times, and predicts viral content across all platforms.
            </p>
            
            <div className="hero-buttons">
              <button className="btn-primary pulse-animation" onClick={onGetStarted}>
                <span className="btn-text">Start Free Trial</span>
                <span className="btn-icon">→</span>
              </button>
              <button className="btn-secondary">
                <span className="play-icon">▶</span>
                Watch Demo
              </button>
            </div>
            
            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-number counter" data-target="10">10M+</div>
                <div className="stat-label">Posts Optimized</div>
              </div>
              <div className="stat-item">
                <div className="stat-number counter" data-target="300">300%</div>
                <div className="stat-label">Engagement Boost</div>
              </div>
              <div className="stat-item">
                <div className="stat-number counter" data-target="50">50K+</div>
                <div className="stat-label">Happy Creators</div>
              </div>
            </div>
          </div>
          
          <div className="hero-visual slide-in-right">
            <div className="dashboard-mockup">
              <div className="mockup-header">
                <div className="mockup-controls">
                  <span className="control red"></span>
                  <span className="control yellow"></span>
                  <span className="control green"></span>
                </div>
              </div>
              <div className="mockup-content">
                <div className="mockup-card floating">
                  <div className="card-header">
                    <span className="card-icon">📊</span>
                    <span className="card-title">Engagement Analytics</span>
                  </div>
                  <div className="line-chart">
                    <svg width="100%" height="40" viewBox="0 0 100 40">
                      <polyline 
                        points="10,30 25,20 40,15 55,25 70,10 85,18" 
                        fill="none" 
                        stroke="#fbbf24" 
                        strokeWidth="2"
                        className="chart-line"
                      />
                      <circle cx="10" cy="30" r="2" fill="#fbbf24" className="chart-dot" />
                      <circle cx="25" cy="20" r="2" fill="#fbbf24" className="chart-dot" />
                      <circle cx="40" cy="15" r="2" fill="#fbbf24" className="chart-dot" />
                      <circle cx="55" cy="25" r="2" fill="#fbbf24" className="chart-dot" />
                      <circle cx="70" cy="10" r="2" fill="#fbbf24" className="chart-dot" />
                      <circle cx="85" cy="18" r="2" fill="#fbbf24" className="chart-dot" />
                    </svg>
                  </div>
                </div>
                
                <div className="mockup-card floating" style={{animationDelay: '0.2s'}}>
                  <div className="card-header">
                    <span className="card-icon">✨</span>
                    <span className="card-title">AI Optimization</span>
                  </div>
                  <div className="optimization-preview">
                    <div className="original-text">Just posted a new photo</div>
                    <div className="arrow">↓</div>
                    <div className="optimized-text">✨ Just dropped something amazing! What do you think? 💭</div>
                    <div className="hashtags">
                      <span className="hashtag">#viral</span>
                      <span className="hashtag">#trending</span>
                      <span className="hashtag">#amazing</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">
              <span>🎯</span>
              <span>Powerful Features</span>
            </div>
            <h2 className="section-title">Everything you need to dominate social media</h2>
            <p className="section-subtitle">
              Our AI-powered platform provides all the tools you need to create viral content
            </p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card hover-lift">
              <div className="feature-icon-wrapper">
                <div className="feature-icon">🤖</div>
              </div>
              <h3>AI Caption Generation</h3>
              <p>Generate engaging, platform-specific captions that drive maximum engagement and reach.</p>
              <div className="feature-arrow">→</div>
            </div>
            
            <div className="feature-card hover-lift">
              <div className="feature-icon-wrapper">
                <div className="feature-icon">⏰</div>
              </div>
              <h3>Optimal Timing</h3>
              <p>Discover the perfect posting times based on your audience behavior and global trends.</p>
              <div className="feature-arrow">→</div>
            </div>
            
            <div className="feature-card hover-lift">
              <div className="feature-icon-wrapper">
                <div className="feature-icon">📈</div>
              </div>
              <h3>Engagement Prediction</h3>
              <p>Get accurate forecasts of how your content will perform before you hit publish.</p>
              <div className="feature-arrow">→</div>
            </div>
            
            <div className="feature-card hover-lift">
              <div className="feature-icon-wrapper">
                <div className="feature-icon">🎯</div>
              </div>
              <h3>Multi-Platform Support</h3>
              <p>Optimize for Instagram, LinkedIn, Twitter, and TikTok with platform-specific strategies.</p>
              <div className="feature-arrow">→</div>
            </div>
            
            <div className="feature-card hover-lift">
              <div className="feature-icon-wrapper">
                <div className="feature-icon">#️⃣</div>
              </div>
              <h3>Smart Hashtags</h3>
              <p>Generate trending, relevant hashtags that boost discoverability and engagement.</p>
              <div className="feature-arrow">→</div>
            </div>
            
            <div className="feature-card hover-lift">
              <div className="feature-icon-wrapper">
                <div className="feature-icon">🌍</div>
              </div>
              <h3>Global Optimization</h3>
              <p>Target specific regions and time zones to reach your ideal audience worldwide.</p>
              <div className="feature-arrow">→</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="how-it-works">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">
              <span>⚡</span>
              <span>Simple Process</span>
            </div>
            <h2 className="section-title">Get viral content in 3 simple steps</h2>
          </div>
          
          <div className="steps-container">
            <div className="step-item">
              <div className="step-number">
                <span>01</span>
              </div>
              <div className="step-content">
                <h3>Input Your Content</h3>
                <p>Paste your caption and select your target platform. Our AI analyzes your content instantly.</p>
              </div>
              <div className="step-visual">
                <div className="visual-box">
                  <div className="typing-animation">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="step-connector"></div>
            
            <div className="step-item">
              <div className="step-number">
                <span>02</span>
              </div>
              <div className="step-content">
                <h3>AI Magic Happens</h3>
                <p>Our advanced AI optimizes your content, generates hashtags, and predicts engagement.</p>
              </div>
              <div className="step-visual">
                <div className="visual-box">
                  <div className="ai-processing">
                    <div className="processing-circle"></div>
                    <div className="processing-circle"></div>
                    <div className="processing-circle"></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="step-connector"></div>
            
            <div className="step-item">
              <div className="step-number">
                <span>03</span>
              </div>
              <div className="step-content">
                <h3>Get Viral Results</h3>
                <p>Receive optimized captions, perfect timing, and engagement predictions for maximum impact.</p>
              </div>
              <div className="step-visual">
                <div className="visual-box">
                  <div className="success-animation">
                    <div className="success-icon">🚀</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Modal */}
      {showPricing && (
        <div className="modal-overlay" onClick={() => setShowPricing(false)}>
          <div className="pricing-modal glass-effect" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowPricing(false)}>×</button>
            
            <div className="pricing-header">
              <h2>Choose Your Plan</h2>
              <p>Start free, upgrade when you're ready to scale</p>
            </div>
            
            <div className="pricing-cards">
              <div className="pricing-card">
                <div className="plan-header">
                  <h3>Starter</h3>
                  <div className="price">
                    <span className="currency">$</span>
                    <span className="amount">0</span>
                    <span className="period">/month</span>
                  </div>
                </div>
                <ul className="plan-features">
                  <li><span className="check">✓</span>5 optimizations per day</li>
                  <li><span className="check">✓</span>Basic analytics</li>
                  <li><span className="check">✓</span>2 platforms</li>
                </ul>
                <button className="plan-button">Get Started</button>
              </div>
              
              <div className="pricing-card featured">
                <div className="popular-badge">Most Popular</div>
                <div className="plan-header">
                  <h3>Pro</h3>
                  <div className="price">
                    <span className="currency">$</span>
                    <span className="amount">19</span>
                    <span className="period">/month</span>
                  </div>
                </div>
                <ul className="plan-features">
                  <li><span className="check">✓</span>Unlimited optimizations</li>
                  <li><span className="check">✓</span>Advanced analytics</li>
                  <li><span className="check">✓</span>All platforms</li>
                  <li><span className="check">✓</span>Priority support</li>
                </ul>
                <button className="plan-button primary">Start Free Trial</button>
              </div>
              
              <div className="pricing-card">
                <div className="plan-header">
                  <h3>Enterprise</h3>
                  <div className="price">
                    <span className="currency">$</span>
                    <span className="amount">99</span>
                    <span className="period">/month</span>
                  </div>
                </div>
                <ul className="plan-features">
                  <li><span className="check">✓</span>Everything in Pro</li>
                  <li><span className="check">✓</span>Team collaboration</li>
                  <li><span className="check">✓</span>Custom integrations</li>
                  <li><span className="check">✓</span>Dedicated support</li>
                </ul>
                <button className="plan-button">Contact Sales</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="logo-wrapper">
                <img src="/Logo.png" alt="Linkora" className="logo-image" />
                <span className="logo-text">Linkora</span>
              </div>
              <p>Empowering creators with AI-driven social media optimization.</p>
            </div>
            
            <div className="footer-links">
              <div className="link-group">
                <h4>Product</h4>
                <a href="#features">Features</a>
                <a href="#pricing">Pricing</a>
                <a href="#demo">Demo</a>
              </div>
              <div className="link-group">
                <h4>Company</h4>
                <a href="#about">About</a>
                <a href="#careers">Careers</a>
                <a href="#contact">Contact</a>
              </div>
              <div className="link-group">
                <h4>Legal</h4>
                <a href="#privacy">Privacy</a>
                <a href="#terms">Terms</a>
                <a href="#security">Security</a>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; 2024 Linkora. All rights reserved.</p>
            <div className="social-links">
              <a href="#" className="social-link">Twitter</a>
              <a href="#" className="social-link">LinkedIn</a>
              <a href="#" className="social-link">Instagram</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}