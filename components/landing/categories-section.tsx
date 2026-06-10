'use client'

import { CATEGORIES } from '@/lib/mock-data'

type Props = { onNavigate: (page: string) => void }

export default function CategoriesSection({ onNavigate }: Props) {
  return (
    <section className="py-20 bg-card">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="font-heading font-700 text-3xl md:text-4xl text-foreground text-balance mb-3">
            Explora por categoría
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Desde cuidado del hogar hasta educación y arte. Encuentra exactamente lo que necesitas.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {CATEGORIES.map((cat, i) => (
            <button
              key={cat.id}
              onClick={() => onNavigate('search')}
              className="group flex flex-col items-center gap-3 p-4 rounded-2xl border border-border bg-background hover:border-transparent hover:shadow-md card-hover text-center transition-all"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl transition-transform group-hover:scale-110"
                style={{ background: cat.bg }}
              >
                {cat.icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground leading-tight">{cat.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{cat.count} pros</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
