'use client'

import { useState, useEffect } from 'react'
import LoadingScreen from './components/LoadingScreen'
import LandingPage from './components/LandingPage'
import LoginPage from './components/LoginPage'
import Dashboard from './components/Dashboard'

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [currentView, setCurrentView] = useState<'landing' | 'login' | 'dashboard'>('landing')

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2500)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <>
      {currentView === 'landing' && (
        <LandingPage onGetStarted={() => setCurrentView('login')} />
      )}
      {currentView === 'login' && (
        <LoginPage 
          onLogin={() => setCurrentView('dashboard')}
          onBackToHome={() => setCurrentView('landing')}
        />
      )}
      {currentView === 'dashboard' && (
        <Dashboard onBackToHome={() => setCurrentView('landing')} />
      )}
    </>
  )
}