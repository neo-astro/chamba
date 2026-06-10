'use client'

import { Search, Star, Users, Briefcase } from 'lucide-react'
import { CATEGORIES } from '@/lib/mock-data'

type HeroProps = {
  onNavigate: (page: string) => void
  onSearch: (query: string) => void
}

export default function HeroSection({ onNavigate, onSearch }: HeroProps) {
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const input = e.currentTarget.querySelector('input') as HTMLInputElement
    onSearch(input.value)
    onNavigate('search')
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background pt-16">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-0 w-96 h-96 rounded-full bg-[var(--turquoise)] opacity-5 blur-3xl" />
        <div className="absolute bottom-20 left-0 w-80 h-80 rounded-full bg-[var(--coral)] opacity-5 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-6 text-center py-20">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--turquoise)]/10 text-[var(--turquoise)] text-sm font-medium mb-6 animate-fade-in-up">
          <Star className="w-3.5 h-3.5" fill="currentColor" />
          Más de 2,500 profesionales verificados
        </div>

        {/* Headline */}
        <h1 className="font-heading font-800 text-4xl md:text-6xl text-foreground leading-tight text-balance mb-6 animate-fade-in-up delay-100">
          Conecta con profesionales{' '}
          <span className="text-[var(--turquoise)]">confiables.</span>
          <br />
          <span className="text-[var(--coral)]">Un perfil,</span> múltiples oficios.
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-10 animate-fade-in-up delay-200">
          Encuentra niñeros, plomeros, maestros, carpinteros y más. Un mismo profesional
          puede ofrecer varios servicios — todo en una sola cuenta.
        </p>

        {/* Search bar */}
        <form
          onSubmit={handleSearch}
          className="flex items-center gap-2 max-w-xl mx-auto mb-12 animate-fade-in-up delay-300"
        >
          <div className="flex-1 flex items-center gap-3 bg-card border border-border rounded-full px-5 py-3.5 shadow-sm focus-within:ring-2 focus-within:ring-[var(--turquoise)] transition-all">
            <Search className="w-4 h-4 text-muted-foreground shrink-0" />
            <input
              type="text"
              placeholder="¿Qué profesional buscas? Ej: plomero, niñera..."
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3.5 rounded-full bg-[var(--turquoise)] text-white font-semibold text-sm hover:opacity-90 transition-all shadow-sm shrink-0"
          >
            Buscar
          </button>
        </form>

        {/* Stats */}
        <div className="flex flex-wrap items-center justify-center gap-8 animate-fade-in-up delay-400">
          {[
            { icon: Users, value: '12,000+', label: 'Usuarios activos' },
            { icon: Briefcase, value: '2,500+', label: 'Profesionales' },
            { icon: Star, value: '4.8', label: 'Valoración media' },
          ].map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[var(--turquoise)]/10 flex items-center justify-center">
                <Icon className="w-4 h-4 text-[var(--turquoise)]" />
              </div>
              <div className="text-left">
                <p className="font-heading font-700 text-lg text-foreground leading-none">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick category chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-10 animate-fade-in-up delay-500">
          <span className="text-xs text-muted-foreground mr-1">Popular:</span>
          {CATEGORIES.slice(0, 6).map((cat) => (
            <button
              key={cat.id}
              onClick={() => onNavigate('search')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-border bg-card text-xs font-medium text-foreground hover:border-[var(--turquoise)] hover:text-[var(--turquoise)] transition-all"
            >
              <span>{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
