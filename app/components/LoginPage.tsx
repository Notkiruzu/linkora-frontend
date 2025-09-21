'use client'

import { useState } from 'react'

interface LoginPageProps {
  onLogin: () => void
  onBackToHome: () => void
}

export default function LoginPage({ onLogin, onBackToHome }: LoginPageProps) {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="login-page">
      <div className="login-container">
        <button className="back-btn" onClick={onBackToHome}>
          ← Back to Home
        </button>
        
        <div className="login-card glass-card">
          <div className="login-header">
            <img src="/Logo.png" alt="Linkora" className="login-logo" />
            <h1>Welcome to Linkora</h1>
            <p>AI-Powered Social Media Optimization</p>
          </div>

          <div className="login-tabs">
            <button 
              className={`tab-btn ${isLogin ? 'active' : ''}`}
              onClick={() => setIsLogin(true)}
            >
              Login
            </button>
            <button 
              className={`tab-btn ${!isLogin ? 'active' : ''}`}
              onClick={() => setIsLogin(false)}
            >
              Sign Up
            </button>
          </div>

          <form className="login-form">
            {!isLogin && (
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" placeholder="Enter your full name" />
              </div>
            )}
            
            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="Enter your email" />
            </div>
            
            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="Enter your password" />
            </div>

            {!isLogin && (
              <div className="form-group">
                <label>Confirm Password</label>
                <input type="password" placeholder="Confirm your password" />
              </div>
            )}

            <button 
              type="button" 
              className="login-btn glow-button"
              onClick={onLogin}
            >
              {isLogin ? 'Login' : 'Create Account'}
              <div className="button-glow"></div>
            </button>
          </form>

          <div className="login-footer">
            <p>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                className="link-btn"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? 'Sign up' : 'Login'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}