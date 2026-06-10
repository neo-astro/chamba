import { Star, Quote } from 'lucide-react'
import { REVIEWS } from '@/lib/mock-data'

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="font-heading font-700 text-3xl md:text-4xl text-foreground text-balance mb-3">
            Lo que dicen nuestros usuarios
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Miles de personas ya conectaron con el profesional ideal.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {REVIEWS.map((review, i) => (
            <div
              key={review.id}
              className="bg-card border border-border rounded-3xl p-6 flex flex-col gap-4 hover:shadow-md transition-all"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star
                      key={j}
                      className="w-4 h-4"
                      style={{ color: 'var(--amber-brand)' }}
                      fill={j < review.rating ? 'var(--amber-brand)' : 'none'}
                    />
                  ))}
                </div>
                <Quote className="w-5 h-5 text-[var(--turquoise)] opacity-50" />
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed italic">
                &quot;{review.comment}&quot;
              </p>
              <div className="flex items-center gap-3 mt-auto pt-3 border-t border-border">
                <img
                  src={review.avatar}
                  alt={review.author}
                  className="w-9 h-9 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-semibold text-foreground">{review.author}</p>
                  <p className="text-xs text-muted-foreground">
                    {review.service} · {review.date}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
