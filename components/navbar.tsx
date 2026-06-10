'use client'

import { useState, useEffect, useRef } from 'react'
import { Menu, X, Zap, LayoutDashboard, LogOut, Search, Award, ChevronDown } from 'lucide-react'

type NavbarProps = {
  currentPage?: string
  onNavigate?: (page: string) => void
  isLoggedIn?: boolean
}

export default function Navbar({
  currentPage = 'home',
  onNavigate,
  isLoggedIn = false,
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [avatarOpen, setAvatarOpen] = useState(false)
  const avatarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) {
        setAvatarOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const nav = (page: string) => {
    onNavigate?.(page)
    setMenuOpen(false)
    setAvatarOpen(false)
  }

  const handleHowItWorks = () => {
    setMenuOpen(false)
    if (currentPage !== 'home') {
      onNavigate?.('home')
      setTimeout(() => {
        document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })
      }, 120)
    } else {
      document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleLogout = () => {
    setAvatarOpen(false)
    setMenuOpen(false)
    nav('home')
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'navbar-solid' : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => nav('home')}
            className="flex items-center gap-2 group"
          >
            <div className="w-8 h-8 rounded-xl bg-[var(--turquoise)] flex items-center justify-center shadow-sm">
              <Zap className="w-4 h-4 text-white" fill="white" />
            </div>
            <span className="font-heading font-700 text-lg text-foreground tracking-tight">
              Pro<span className="text-[var(--turquoise)]">Connect</span>
            </span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => nav('home')}
              className={`text-sm font-medium transition-colors hover:text-[var(--turquoise)] ${
                currentPage === 'home' ? 'text-[var(--turquoise)]' : 'text-muted-foreground'
              }`}
            >
              Inicio
            </button>
            <button
              onClick={() => nav('search')}
              className={`text-sm font-medium transition-colors hover:text-[var(--turquoise)] ${
                currentPage === 'search' ? 'text-[var(--turquoise)]' : 'text-muted-foreground'
              }`}
            >
              Explorar
            </button>
            <button
              onClick={() => nav('top-workers')}
              className={`text-sm font-medium transition-colors hover:text-[var(--turquoise)] flex items-center gap-1 ${
                currentPage === 'top-workers' ? 'text-[var(--turquoise)]' : 'text-muted-foreground'
              }`}
            >
              <Award className="w-4 h-4" />
              Mejores Trabajadores
            </button>
            <button
              onClick={handleHowItWorks}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-[var(--turquoise)]"
            >
              Cómo funciona
            </button>
          </nav>

          {/* Right CTA */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <div ref={avatarRef} className="relative">
                <button
                  onClick={() => setAvatarOpen(!avatarOpen)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-full border border-border hover:border-[var(--turquoise)] transition-all"
                >
                  <div className="w-7 h-7 rounded-full bg-[var(--turquoise)] flex items-center justify-center text-white text-xs font-bold">
                    U
                  </div>
                  <span className="text-sm font-medium text-foreground">Usuario</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${avatarOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {avatarOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-card border border-border rounded-2xl shadow-xl py-2 animate-fade-in z-50">
                    <div className="px-4 py-2 border-b border-border mb-1">
                      <p className="text-xs font-semibold text-foreground">Mi Cuenta</p>
                    </div>
                    {[
                      { icon: LayoutDashboard, label: 'Mi panel', page: 'dashboard' },
                      { icon: Search, label: 'Explorar profesionales', page: 'search' },
                      { icon: Award, label: 'Mejores Trabajadores', page: 'top-workers' },
                    ].map(({ icon: Icon, label, page }) => (
                      <button
                        key={page}
                        onClick={() => nav(page)}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      >
                        <Icon className="w-4 h-4" /> {label}
                      </button>
                    ))}
                    <div className="border-t border-border mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-[var(--coral)] hover:bg-[var(--coral)]/5 transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Cerrar sesión
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button
                  onClick={() => nav('login')}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Iniciar sesión
                </button>
                <button
                  onClick={() => nav('register')}
                  className="text-sm font-semibold px-5 py-2 rounded-full bg-[var(--turquoise)] text-white hover:opacity-90 transition-all shadow-sm"
                >
                  Registrarse
                </button>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-foreground"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Abrir menú"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-card border-b border-border shadow-lg animate-fade-in">
          <div className="px-4 py-4 flex flex-col gap-1">
            {[
              { label: 'Inicio', action: () => nav('home') },
              { label: 'Explorar', action: () => nav('search') },
              { label: 'Mejores Trabajadores', action: () => nav('top-workers'), icon: Award },
              { label: 'Cómo funciona', action: handleHowItWorks },
            ].map(({ label, action, icon: Icon }) => (
              <button
                key={label}
                onClick={action}
                className="text-left text-sm font-medium text-foreground py-2.5 px-2 rounded-xl hover:bg-muted transition-colors flex items-center gap-2"
              >
                {Icon && <Icon className="w-4 h-4" />}
                {label}
              </button>
            ))}

            <div className="flex flex-col gap-2 pt-3 mt-1 border-t border-border">
              {isLoggedIn ? (
                <>
                  <div className="flex items-center gap-3 px-2 py-2">
                    <div className="w-8 h-8 rounded-full bg-[var(--turquoise)] flex items-center justify-center text-white text-xs font-bold">
                      U
                    </div>
                    <p className="text-sm font-semibold text-foreground">Usuario</p>
                  </div>
                  <button
                    onClick={() => nav('dashboard')}
                    className="flex items-center gap-2 text-sm font-medium py-2.5 px-3 rounded-xl bg-[var(--turquoise)]/10 text-[var(--turquoise)]"
                  >
                    <LayoutDashboard className="w-4 h-4" /> Mi panel
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-sm font-medium py-2.5 px-3 rounded-xl text-[var(--coral)] hover:bg-[var(--coral)]/5 transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> Cerrar sesión
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => nav('login')}
                    className="text-sm text-center font-medium py-2.5 border border-border rounded-full text-foreground"
                  >
                    Iniciar sesión
                  </button>
                  <button
                    onClick={() => nav('register')}
                    className="text-sm text-center font-semibold py-2.5 rounded-full bg-[var(--turquoise)] text-white"
                  >
                    Registrarse gratis
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
