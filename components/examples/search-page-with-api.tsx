/**
 * Example: Integrating API calls into SearchPage
 * This file demonstrates how to replace mock data with real API calls
 */

'use client'

import { useState, useEffect } from 'react'
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react'
import ProCard from '@/components/pro-card'
import { useProfessionals } from '@/lib/hooks/use-professionals'
import type { Professional } from '@/lib/mock-data'

type Props = {
  initialQuery?: string
  onSelectPro: (id: string) => void
}

const SORT_OPTIONS = [
  { val: 'rating', label: 'Mejor valorados' },
  { val: 'price', label: 'Precio: menor a mayor' },
  { val: 'recent', label: 'Más recientes' },
]

/**
 * SearchPageWithAPI - Example of integrating real API calls
 * 
 * This component shows how to:
 * 1. Use the useProfessionals hook to fetch data
 * 2. Handle loading and error states
 * 3. Switch between mock data and real API with env var
 * 4. Apply filters and sorting on the backend
 */
export function SearchPageWithAPI({ initialQuery = '', onSelectPro }: Props) {
  const [query, setQuery] = useState(initialQuery)
  const [selectedCat, setSelectedCat] = useState<string | null>(null)
  const [sort, setSortBy] = useState<'rating' | 'price' | 'recent'>('rating')
  const [showFilters, setShowFilters] = useState(false)
  const [minRating, setMinRating] = useState(0)
  const [maxPrice, setMaxPrice] = useState(5000)

  // Use mock data in development, real API in production
  const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA !== 'false'

  // Fetch professionals with current filters
  const { data: professionals, loading, error, refetch } = useProfessionals(
    {
      search: query,
      categories: selectedCat ? [selectedCat] : undefined,
      max_price: maxPrice,
      sort,
    },
    { useMockData }
  )

  const handleClearFilters = () => {
    setQuery('')
    setSelectedCat(null)
    setSortBy('rating')
    setMinRating(0)
    setMaxPrice(5000)
  }

  const hasActiveFilters = selectedCat || minRating > 0 || maxPrice < 5000

  return (
    <div className="min-h-screen bg-background">
      {/* Search header */}
      <div className="bg-card border-b border-border sticky top-16 z-30">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center gap-3">
            {/* Search input */}
            <div className="flex-1 flex items-center gap-3 bg-background border border-border rounded-full px-5 py-3 focus-within:ring-2 focus-within:ring-[var(--turquoise)]">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar profesionales..."
                className="flex-1 bg-transparent outline-none text-sm"
              />
              {query && (
                <button onClick={() => setQuery('')} className="text-muted-foreground">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filters button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-full border text-sm font-medium transition-all ${
                hasActiveFilters
                  ? 'border-[var(--turquoise)] bg-[var(--turquoise)]/10 text-[var(--turquoise)]'
                  : 'border-border text-muted-foreground'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filtros
            </button>
          </div>

          {/* Filters panel */}
          {showFilters && (
            <div className="mt-4 p-4 bg-background border border-border rounded-2xl">
              <div className="flex items-center gap-4">
                <div>
                  <label className="text-xs font-semibold mb-2 block">Precio máximo</label>
                  <input
                    type="range"
                    min={300}
                    max={5000}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-40 accent-[var(--turquoise)]"
                  />
                  <p className="text-xs text-muted-foreground mt-1">${maxPrice}</p>
                </div>

                {hasActiveFilters && (
                  <button
                    onClick={handleClearFilters}
                    className="text-xs text-[var(--coral)] font-medium"
                  >
                    Limpiar
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6">
        {/* Results header */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">
            {loading ? 'Cargando...' : `${professionals.length} resultados`}
          </p>

          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="appearance-none pl-3 pr-8 py-2 rounded-lg border border-border bg-card text-sm"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.val} value={opt.val}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-2 border-border border-t-[var(--turquoise)] rounded-full animate-spin" />
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="p-4 bg-[var(--coral)]/10 border border-[var(--coral)] rounded-lg text-[var(--coral)] text-sm">
            {error}
            <button onClick={refetch} className="ml-3 underline font-medium">
              Reintentar
            </button>
          </div>
        )}

        {/* Grid */}
        {!loading && !error && professionals.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {professionals.map((pro) => (
              <ProCard key={pro.id} pro={pro} onClick={() => onSelectPro(pro.id)} />
            ))}
          </div>
        ) : !loading && !error ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">Sin resultados</p>
            <button onClick={handleClearFilters} className="text-sm font-semibold text-[var(--turquoise)]">
              Limpiar filtros
            </button>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default SearchPageWithAPI
