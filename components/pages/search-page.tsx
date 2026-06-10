'use client'

import { useState, useMemo, useRef } from 'react'
import { Search, SlidersHorizontal, Star, X, ChevronDown, MapPin, Rocket } from 'lucide-react'
import ProCard from '@/components/pro-card'
import { PROFESSIONALS, CATEGORIES } from '@/lib/mock-data'

type Props = {
  initialQuery?: string
  onSelectPro: (id: string) => void
}

const SORT_OPTIONS = [
  { val: 'rating', label: 'Mejor valorados' },
  { val: 'price_asc', label: 'Precio: menor a mayor' },
  { val: 'price_desc', label: 'Precio: mayor a menor' },
  { val: 'reviews', label: 'Más reseñas' },
]

export default function SearchPage({ initialQuery = '', onSelectPro }: Props) {
  const [query, setQuery] = useState(initialQuery)
  const [selectedCat, setSelectedCat] = useState<string | null>(null)
  const [sort, setSort] = useState('rating')
  const [showFilters, setShowFilters] = useState(false)
  const [minRating, setMinRating] = useState(0)
  const [maxPrice, setMaxPrice] = useState(5000)
  const [onlyAvailable, setOnlyAvailable] = useState(false)

  const filtered = useMemo(() => {
    let result = PROFESSIONALS

    if (query) {
      const q = query.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.categories.some((c) => c.toLowerCase().includes(q)) ||
          p.bio.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      )
    }

    if (selectedCat) {
      result = result.filter((p) => p.categories.some((c) => c === selectedCat))
    }

    if (onlyAvailable) {
      result = result.filter((p) => p.available)
    }

    result = result.filter((p) => p.rating >= minRating && p.price <= maxPrice)

    switch (sort) {
      case 'rating':
        result = [...result].sort((a, b) => b.rating - a.rating)
        break
      case 'price_asc':
        result = [...result].sort((a, b) => a.price - b.price)
        break
      case 'price_desc':
        result = [...result].sort((a, b) => b.price - a.price)
        break
      case 'reviews':
        result = [...result].sort((a, b) => b.reviews - a.reviews)
        break
    }

    // Boost: insert boosted pros at random positions near the top (equitative)
    const boosted = result.filter((p) => p.boosted)
    const normal = result.filter((p) => !p.boosted)
    if (boosted.length > 0) {
      // Shuffle boosted among themselves
      const shuffledBoosted = [...boosted].sort(() => Math.random() - 0.5)
      // Place them in the first N positions, distributed among normal results
      const combined: typeof result = []
      let bi = 0
      let ni = 0
      for (let i = 0; i < result.length; i++) {
        // Insert a boosted every ~3 positions while there are boosted left
        if (bi < shuffledBoosted.length && (ni === 0 || ni % 3 === 0)) {
          combined.push(shuffledBoosted[bi++])
        } else if (ni < normal.length) {
          combined.push(normal[ni++])
        } else if (bi < shuffledBoosted.length) {
          combined.push(shuffledBoosted[bi++])
        }
      }
      return combined
    }

    return result
  }, [query, selectedCat, sort, minRating, maxPrice, onlyAvailable])

  const clearFilters = () => {
    setQuery('')
    setSelectedCat(null)
    setSort('rating')
    setMinRating(0)
    setMaxPrice(5000)
    setOnlyAvailable(false)
  }

  const hasActiveFilters = selectedCat || minRating > 0 || maxPrice < 5000 || onlyAvailable

  return (
    <div className="min-h-screen bg-background">
      {/* Search header */}
      <div className="bg-card border-b border-border sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 flex items-center gap-3 bg-background border border-border rounded-full px-5 py-3 focus-within:ring-2 focus-within:ring-[var(--turquoise)] transition-all">
              <Search className="w-4 h-4 text-muted-foreground shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por oficio, nombre, habilidad..."
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
              />
              {query && (
                <button onClick={() => setQuery('')} className="text-muted-foreground hover:text-foreground">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-full border text-sm font-medium transition-all shrink-0 ${
                showFilters || hasActiveFilters
                  ? 'border-[var(--turquoise)] bg-[var(--turquoise)]/10 text-[var(--turquoise)]'
                  : 'border-border text-muted-foreground hover:border-foreground'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden md:inline">Filtros</span>
              {hasActiveFilters && (
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--turquoise)]" />
              )}
            </button>
          </div>

          {/* Filters panel */}
          {showFilters && (
            <div className="mt-4 p-4 bg-background rounded-2xl border border-border animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Rating filter */}
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-2">
                    Valoración mínima
                  </label>
                  <div className="flex gap-1.5">
                    {[0, 3, 4, 4.5].map((r) => (
                      <button
                        key={r}
                        onClick={() => setMinRating(r)}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                          minRating === r
                            ? 'border-[var(--amber-brand)] bg-[var(--amber-brand)]/10 text-[var(--amber-brand)]'
                            : 'border-border text-muted-foreground'
                        }`}
                      >
                        {r === 0 ? (
                          'Todos'
                        ) : (
                          <>
                            <Star className="w-3 h-3" fill="currentColor" /> {r}+
                          </>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price filter */}
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-2">
                    Precio máximo: ${maxPrice.toLocaleString()}/hr
                  </label>
                  <input
                    type="range"
                    min={300}
                    max={5000}
                    step={100}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-[var(--turquoise)]"
                  />
                </div>

                {/* Availability */}
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-2">
                    Disponibilidad
                  </label>
                  <button
                    onClick={() => setOnlyAvailable(!onlyAvailable)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-medium transition-all ${
                      onlyAvailable
                        ? 'border-[var(--turquoise)] bg-[var(--turquoise)]/10 text-[var(--turquoise)]'
                        : 'border-border text-muted-foreground'
                    }`}
                  >
                    <span
                      className={`w-3 h-3 rounded-full ${onlyAvailable ? 'bg-[var(--turquoise)]' : 'bg-muted-foreground/40'}`}
                    />
                    Solo disponibles ahora
                  </button>
                </div>
              </div>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="mt-3 text-xs text-[var(--coral)] font-medium hover:underline"
                >
                  Limpiar filtros
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6">
        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          <button
            onClick={() => setSelectedCat(null)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
              !selectedCat
                ? 'bg-[var(--turquoise)] border-[var(--turquoise)] text-white'
                : 'border-border text-muted-foreground hover:border-foreground'
            }`}
          >
            Todos
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCat(selectedCat === cat.name ? null : cat.name)}
              className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                selectedCat === cat.name
                  ? 'border-transparent text-white'
                  : 'border-border text-muted-foreground hover:border-foreground'
              }`}
              style={
                selectedCat === cat.name
                  ? { background: cat.color, borderColor: cat.color }
                  : undefined
              }
            >
              <span>{cat.icon}</span> {cat.name}
            </button>
          ))}
        </div>

        {/* Results header */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{filtered.length}</span>{' '}
            profesionales encontrados
          </p>
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 rounded-xl border border-border bg-card text-sm text-foreground outline-none focus:ring-2 focus:ring-[var(--turquoise)] cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.val} value={opt.val}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((pro) => (
              <ProCard key={pro.id} pro={pro} onClick={() => onSelectPro(pro.id)} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <Search className="w-7 h-7 text-muted-foreground" />
            </div>
            <h3 className="font-heading font-600 text-lg text-foreground mb-2">
              Sin resultados
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              No encontramos profesionales con esos criterios.
            </p>
            <button
              onClick={clearFilters}
              className="text-sm font-semibold text-[var(--turquoise)]"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
