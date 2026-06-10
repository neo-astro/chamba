'use client'

import { useState } from 'react'
import Navbar from '@/components/navbar'
import LandingPage from '@/components/pages/landing-page'
import SearchPage from '@/components/pages/search-page'
import ProfilePage from '@/components/pages/profile-page'
import AuthPage from '@/components/pages/auth-page'
import DashboardPage from '@/components/pages/dashboard-page'

type Page = 'home' | 'search' | 'profile' | 'login' | 'register' | 'dashboard'

export default function Page() {
  const [page, setPage] = useState<Page>('home')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPro, setSelectedPro] = useState<string | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const navigate = (next: string) => {
    setPage(next as Page)
    if (next !== 'profile') {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
    }
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleSelectPro = (id: string) => {
    setSelectedPro(id)
    setPage('profile')
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }

  const handleAuth = () => {
    setIsLoggedIn(true)
    navigate('dashboard')
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    navigate('home')
  }

  // Auth pages — full screen, no navbar
  if (page === 'login' || page === 'register') {
    return (
      <AuthPage
        mode={page}
        onNavigate={navigate}
        onAuth={handleAuth}
      />
    )
  }

  // Dashboard — has its own sidebar nav
  if (page === 'dashboard') {
    return (
      <DashboardPage
        onNavigate={navigate}
        onLogout={handleLogout}
        onSearch={handleSelectPro}
      />
    )
  }

  // Public + authenticated shared pages (landing, search, profile)
  return (
    <>
      <Navbar
        currentPage={page}
        onNavigate={navigate}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
      />

      {page === 'home' && (
        <LandingPage
          onNavigate={navigate}
          onSearch={handleSearch}
          onSelectPro={handleSelectPro}
        />
      )}

      {page === 'search' && (
        <div className="pt-16">
          <SearchPage initialQuery={searchQuery} onSelectPro={handleSelectPro} />
        </div>
      )}

      {page === 'profile' && (
        <div className="pt-16">
          <ProfilePage
            proId={selectedPro ?? '1'}
            onBack={() => navigate('search')}
            onNavigate={navigate}
            isLoggedIn={isLoggedIn}
          />
        </div>
      )}
    </>
  )
}
