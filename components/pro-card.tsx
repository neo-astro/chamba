'use client'

import { Star, MapPin, CheckCircle, Rocket } from 'lucide-react'
import type { Professional } from '@/lib/mock-data'

type Props = {
  pro: Professional
  onClick: () => void
}

export default function ProCard({ pro, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={`group w-full text-left bg-card border rounded-3xl overflow-hidden card-hover transition-all ${
        pro.boosted ? 'border-[var(--amber-brand)]/40 ring-1 ring-[var(--amber-brand)]/20' : 'border-border'
      }`}
    >
      {/* Boost badge */}
      {pro.boosted && (
        <div className="flex items-center gap-1.5 px-5 pt-3 pb-0">
          <div className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[var(--amber-brand)]/15 text-[var(--amber-brand)]">
            <Rocket className="w-3 h-3" /> Destacado
          </div>
        </div>
      )}
      {/* Header */}
      <div className={`p-5 ${pro.boosted ? 'pt-3' : 'pb-0'}`}>
        <div className="flex items-start gap-4">
          <div className="relative shrink-0">
            <img
              src={pro.avatar}
              alt={pro.name}
              className="w-14 h-14 rounded-2xl object-cover"
            />
            {pro.available && (
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[var(--turquoise)] border-2 border-card" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="font-heading font-600 text-base text-foreground truncate">{pro.name}</h3>
              {pro.verified && (
                <CheckCircle className="w-4 h-4 text-[var(--turquoise)] shrink-0" fill="#2DD4BF" />
              )}
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <Star className="w-3.5 h-3.5 text-[var(--amber-brand)]" fill="var(--amber-brand)" />
              <span className="text-sm font-semibold text-foreground">{pro.rating}</span>
              <span className="text-xs text-muted-foreground">({pro.reviews} reseñas)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-1.5 px-5 mt-3">
        {pro.categories.map((cat) => (
          <span
            key={cat}
            className="text-xs font-medium px-2.5 py-1 rounded-full bg-[var(--turquoise)]/10 text-[var(--turquoise)]"
          >
            {cat}
          </span>
        ))}
      </div>

      {/* Bio snippet */}
      <p className="px-5 mt-3 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
        {pro.bio}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between px-5 py-4 mt-3 border-t border-border">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="w-3.5 h-3.5" />
          <span className="truncate max-w-[120px]">{pro.location.split(',')[0]}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="font-heading font-700 text-base text-foreground">
            ${pro.price.toLocaleString()}
          </span>
          <span className="text-xs text-muted-foreground">/{pro.priceUnit}</span>
        </div>
      </div>
    </button>
  )
}
