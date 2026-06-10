'use client'

import { useState, useEffect } from 'react'
import { Star, TrendingUp, Award, MapPin, Zap } from 'lucide-react'
import ProCard from '@/components/pro-card'
import type { Professional } from '@/lib/mock-data'
import { PROFESSIONALS } from '@/lib/mock-data'

interface Props {
  onSelectPro: (proId: string) => void
}

export default function TopWorkersPage({ onSelectPro }: Props) {
  const [topWorkers, setTopWorkers] = useState<Professional[]>([])
  const [sortBy, setSortBy] = useState<'rating' | 'reviews' | 'recent'>('rating')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching top workers from backend
    // In production, this would call: GET /api/professionals/top?limit=10&sort=${sortBy}&category=${filterCategory}
    
    const filtered = PROFESSIONALS.filter(p => {
      if (filterCategory === 'all') return true
      return p.categories.includes(filterCategory)
    })

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return (b.rating || 0) - (a.rating || 0)
        case 'reviews':
          return (b.reviews || 0) - (a.reviews || 0)
        case 'recent':
          // Simulate recency by reversing order (newer first)
          return Math.random() - 0.5
        default:
          return 0
      }
    }).slice(0, 10)

    setTopWorkers(sorted)
    setLoading(false)
  }, [sortBy, filterCategory])

  const categories = ['all', ...new Set(PROFESSIONALS.flatMap(p => p.categories))]
  const avgRating = topWorkers.length > 0 
    ? (topWorkers.reduce((sum, p) => sum + (p.rating || 0), 0) / topWorkers.length).toFixed(1)
    : '0'
  const totalReviews = topWorkers.reduce((sum, p) => sum + (p.reviews || 0), 0)

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-[var(--turquoise)]/10 via-background to-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center gap-3 mb-4">
            <Award className="w-8 h-8 text-[var(--turquoise)]" />
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Mejores Trabajadores
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mb-6">
            Descubre los profesionales mejor calificados de nuestra comunidad. Clasificados por experiencia, calidad y satisfacción del cliente.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-card border border-border rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-[var(--turquoise)]" />
                <div>
                  <p className="text-sm text-muted-foreground">Profesionales Top</p>
                  <p className="text-2xl font-bold text-foreground">{topWorkers.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-card border border-border rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <Star className="w-5 h-5 text-yellow-400" />
                <div>
                  <p className="text-sm text-muted-foreground">Rating Promedio</p>
                  <p className="text-2xl font-bold text-foreground">{avgRating}</p>
                </div>
              </div>
            </div>
            <div className="bg-card border border-border rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Reseñas Totales</p>
                  <p className="text-2xl font-bold text-foreground">{totalReviews}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-8">
          {/* Category Filter */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground mb-3">Categoría</p>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    filterCategory === cat
                      ? 'bg-[var(--turquoise)] text-white'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {cat === 'all' ? 'Todas' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div className="w-full md:w-auto">
            <p className="text-sm font-medium text-foreground mb-3">Ordenar por</p>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full md:w-40 px-4 py-2 rounded-lg bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-[var(--turquoise)]"
            >
              <option value="rating">Rating (Mayor a Menor)</option>
              <option value="reviews">Reseñas (Mayor a Menor)</option>
              <option value="recent">Más Recientes</option>
            </select>
          </div>
        </div>

        {/* Rankings */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 rounded-full border-2 border-border border-t-[var(--turquoise)] animate-spin"></div>
            <p className="text-muted-foreground mt-4">Cargando mejores trabajadores...</p>
          </div>
        ) : topWorkers.length > 0 ? (
          <div className="space-y-4">
            {topWorkers.map((pro, index) => (
              <div
                key={pro.id}
                className="flex items-start gap-4 bg-card border border-border rounded-2xl p-4 hover:border-[var(--turquoise)]/50 transition-all"
              >
                {/* Position */}
                <div className="relative w-12 h-12 shrink-0 flex items-center justify-center rounded-full bg-gradient-to-br from-[var(--turquoise)]/20 to-[var(--turquoise)]/5 border border-[var(--turquoise)]/30">
                  <span className="text-xl font-bold text-[var(--turquoise)]">#{index + 1}</span>
                  {index === 0 && (
                    <Award className="w-4 h-4 text-yellow-400 absolute -top-1 -right-1" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-lg text-foreground truncate">{pro.name}</h3>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.round(pro.rating || 0)
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-muted-foreground'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-semibold text-foreground">{pro.rating}</span>
                        <span className="text-xs text-muted-foreground">({pro.reviews} reseñas)</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground whitespace-nowrap">{pro.priceUnit}</p>
                      <p className="text-xl font-bold text-foreground">${pro.price}</p>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {pro.categories.map(cat => (
                      <span
                        key={cat}
                        className="text-xs px-2.5 py-1 rounded-full bg-[var(--turquoise)]/10 text-[var(--turquoise)] font-medium"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>

                  {/* Bio preview */}
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-2">{pro.bio}</p>

                  {/* Location */}
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-2">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{pro.location}</span>
                  </div>
                </div>

                {/* CTA */}
                <button
                  onClick={() => onSelectPro(pro.id)}
                  className="shrink-0 px-4 py-2.5 rounded-lg bg-[var(--turquoise)] text-white font-medium text-sm hover:opacity-90 transition-all"
                >
                  Ver perfil
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No hay profesionales disponibles en esta categoría.</p>
          </div>
        )}
      </div>
    </main>
  )
}
