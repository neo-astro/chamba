'use client'

import { ArrowRight } from 'lucide-react'
import ProCard from '@/components/pro-card'
import { PROFESSIONALS } from '@/lib/mock-data'

type Props = {
  onNavigate: (page: string) => void
  onSelectPro: (id: string) => void
}

export default function FeaturedPros({ onNavigate, onSelectPro }: Props) {
  const featured = PROFESSIONALS.slice(0, 3)

  return (
    <section className="py-20 bg-card">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="font-heading font-700 text-3xl md:text-4xl text-foreground text-balance mb-2">
              Profesionales destacados
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Los mejor valorados por nuestra comunidad
            </p>
          </div>
          <button
            onClick={() => onNavigate('search')}
            className="hidden md:flex items-center gap-2 text-sm font-semibold text-[var(--turquoise)] hover:gap-3 transition-all"
          >
            Ver todos <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {featured.map((pro) => (
            <ProCard key={pro.id} pro={pro} onClick={() => onSelectPro(pro.id)} />
          ))}
        </div>

        <div className="flex justify-center mt-8 md:hidden">
          <button
            onClick={() => onNavigate('search')}
            className="flex items-center gap-2 text-sm font-semibold text-[var(--turquoise)]"
          >
            Ver todos los profesionales <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  )
}
